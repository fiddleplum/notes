/*

Blocks (at beginning of a line):
"# ", "## ", "### " are headers
"* ", "  * ", "    * " are unordered lists
"1 ", "  1 ", "    1 " are ordered lists
"---" is a horizontal break line
"> " is a quote
"! " is code
everything else is paragraph

Inline:
"**bolded**" is bolded text
"*italics*" is italics text
"[link text|link url]" is link
"$math$" is inline math

*/

var lineParsed = false;

function mdeToHtml (text, cursor) {
	var lines = text.split('\n');
	lines.push("");
	var html = "";
	var numCharsProcessed = 0;
	for (var lineNum = 0; lineNum < lines.length; lineNum++) {
		var line = lines[lineNum];
		
		if (cursor != undefined && numCharsProcessed <= cursor && cursor <= numCharsProcessed + line.length) {
			html += '<span id="cursor"></span>';
		}
		numCharsProcessed += line.length + 1;

		lineParsed = false;
		parseInline = true;

		var newLine = "";

		line = line.replace("<", "&lt;");

		getListTypeAndLevel(line);

		html += closeLists(line);

		html += closeQuoteAndCode(line);

		html += openLists(line);

		newLine += parseHeadings(line);

		newLine += parseQuoteAndCode(line);

		newLine += parseListItem(line);

		newLine += parseMathItem(line);

		if (line == '---') {
			html += '<hr/>\n';
			continue;
		}

		// No line was parsed, so it's just a paragraph.
		if (!lineParsed && line.length > 0) {
			newLine += "<p>" + line + "</p>\n";
		}

		if (!parseInline) { // it's like a pre, so don't inline process.
			html += newLine;
			continue;
		}

		// Inline markdown.
		var bold = false;
		var italics = false;
		var newLine2 = "";
		for (var charNum = 0; charNum < newLine.length; charNum++) {
			var char = newLine[charNum];
			var nextChar = (charNum + 1 < newLine.length) ? newLine[charNum + 1] : "";
			if (char == "*" && nextChar == "*") {
				if (!bold) {
					newLine2 += "<b>";
				}
				else {
					newLine2 += "</b>";
				}
				bold = !bold;
				charNum++;
			}
			else if (char == "*") {
				if (!italics) {
					newLine2 += "<i>";
				}
				else {
					newLine2 += "</i>";
				}
				italics = !italics;
			}
			else if (char == "$") {
				var charNum2 = newLine.indexOf("$", charNum + 1);
				if (charNum2 != -1) {
					newLine2 += "<span class='math'>" + parseMathContent(newLine.substr(charNum + 1, charNum2 - (charNum + 1))) + "</span>";
					charNum = charNum2;
				}
				else {
					newLine2 += char;
				}
			}
			else if (char == "[") {
				var charNum2 = newLine.indexOf("|", charNum);
				if (charNum2 != -1) {
					var linkText = newLine.substr(charNum + 1, charNum2 - (charNum + 1));
					var charNum3 = newLine.indexOf("]", charNum2);
					if (charNum3 != -1) {
						var linkUrl = newLine.substr(charNum2 + 1, charNum3 - (charNum2 + 1));
						newLine2 += "<a href=\"" + linkUrl + "\">" + linkText + "</a>";
						charNum = charNum3;
					}
					else {
						newLine2 += char;
					}
				}
				else {
					newLine2 += char;
				}
			}
			else {
				newLine2 += char;
			}
		}

		html += newLine2;
	}
	return html;
}

// HEADINGS

function parseHeadings (line) {
	if (line.startsWith("# ")) {
		lineParsed = true;
		return "<h3>" + line.substr(2) + "</h3>\n";
	}
	else if (line.startsWith("## ")) {
		lineParsed = true;
		return "<h2>" + line.substr(3) + "</h2>\n";
	}
	else if (line.startsWith("### ")) {
		lineParsed = true;
		return "<h1>" + line.substr(4) + "</h1>\n";
	}
	else {
		return "";
	}
}

// LISTS

var listStack = [];
var nextListLevel = 0;
var nextListType = "";
function getListTypeAndLevel (line) {
	if (line.startsWith("1 ")) {
		nextListLevel = 1;
		nextListType = "1";
	}
	else if (line.startsWith("* ")) {
		nextListLevel = 1;
		nextListType = "*";
	}
	else if (line.startsWith("  1 ")) {
		nextListLevel = 2;
		nextListType = "1";
	}
	else if (line.startsWith("  * ")) {
		nextListLevel = 2;
		nextListType = "*";
	}
	else if (line.startsWith("    1 ")) {
		nextListLevel = 3;
		nextListType = "1";
	}
	else if (line.startsWith("    * ")) {
		nextListLevel = 3;
		nextListType = "*";
	}
	else {
		nextListLevel = 0;
		nextListType = "";
	}
}

function closeLists (line) {
	var newLine = "";

	if (listStack.length > 0) {
		// Close any old list item.
		if (nextListLevel <= listStack.length) {
			newLine += "</li>";
		}
		newLine += "\n";

		// Close off deeper level lists.
		while (listStack.length > nextListLevel) {
			var top = listStack.pop();
			newLine += Array(listStack.length + 1).join("  ");
			if (top == "*") {
				newLine += "</ul>";
			} else if (top == "1") {
				newLine += "</ol>";
			}
			if (listStack.length > 0) {
				newLine += "</li>";
			}
			newLine += "\n";
		}

		// Close same level list of a different type.
		if (listStack.length == nextListLevel && listStack[listStack.length - 1] != nextListType) {
			var top = listStack.pop();
			newLine += Array(listStack.length + 1).join("  ");
			if (top == "*") {
				newLine += "</ul>\n";
			} else if (top == "1") {
				newLine += "</ol>\n";
			}
		}
	}

	return newLine;
}

function openLists (line) {
	var newLine = "";
	while (listStack.length < nextListLevel) {
		if (newLine == "") {
			newLine += Array(listStack.length + 1).join("  ");
		}
		if (nextListType == "*") {
			newLine += "<ul>\n";
		}
		else if (nextListType == "1") {
			newLine += "<ol>\n";
		}
		listStack.push(nextListType);
		if (listStack.length < nextListLevel) {
			newLine += Array(listStack.length + 1).join("  ");
			newLine += "<li>";
		}
	}
	return newLine;
}

function parseListItem (line) {
	if (nextListType != "") {
		lineParsed = true;
		return Array(listStack.length + 1).join("  ") + "<li>" + line.substr(nextListLevel * 2);
	}
	return "";
}

// MATH

function parseMathItem (line) {
	if (line.startsWith("$ ")) {
		lineParsed = true;
		parseInline = false;
		return "<div class='math'>" + parseMathContent(line.substr(2)) + "</div>\n";
	}
	return "";
}

// QUOTES AND CODE

var quote = false;
var code = false;
function closeQuoteAndCode (line) {
	var inCode = line.startsWith("! ");
	var inQuote = line.startsWith("> ");
	if (code && !inCode) {
		code = false;
		return "</code>\n";
	}
	else if (code && inCode) {
		return "</br>";
	}
	if (quote && !inQuote) {
		quote = false;
		return "\n</quote>\n";
	}
	else if (quote && inQuote) {
		return "</br>";
	}
	return "";
}

function parseQuoteAndCode (line) {
	var inCode = line.startsWith("! ");
	var inQuote = line.startsWith("> ");
	var newLine = "";
	if (inCode) {
		lineParsed = true;
		if (!code) {
			newLine += "<code>";
			code = true;
		}
		parseInline = false;
		newLine += line.substr(2) + "\n";
	}
	else if (inQuote) {
		lineParsed = true;
		if (!quote) {
			newLine += "<quote>\n"
			quote = true;
		}
		newLine += line.substr(2);
	}
	return newLine;
}