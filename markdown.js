/*

Blocks (at beginning of a line):
"# ", "## ", "### " are headers
"* ", "  * ", "    * " are unordered lists
"1 ", "  1 ", "    1 " are ordered lists
"` " is a quote
"! " is code
everything else is paragraph

Inline:
"**bolded**" is bolded text
"*italics*" is italics text
"[link text|link url]" is link

*/

var lineParsed = false;

function textToHtml (text) {
	var lines = text.split('\n');
	lines.push("");
	var html = "";
	for (var lineNum = 0; lineNum < lines.length; lineNum++) {
		var line = lines[lineNum];

		lineParsed = false;

		var newLine = "";

		line = line.replace("<", "&lt;").replace(">", "&gt;");

		getListTypeAndLevel(line);

		html += closeLists(line);

		html += closeQuoteAndCode(line);

		html += openLists(line);

		newLine += parseHeadings(line);

		newLine += parseQuoteAndCode(line);

		newLine += parseListItem(line);

		// No line was parsed, so it's just a paragraph.
		if (!lineParsed && line.length > 0) {
			newLine += "<p>" + line + "</p>\n";
		}

		if (code) { // it's like a pre, so don't inline process.
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
			else if (char == "[") {
				var charNum2 = newLine.indexOf("|", charNum);
				var linkText = newLine.substr(charNum + 1, charNum2 - (charNum + 1));
				var charNum3 = newLine.indexOf("]", charNum2);
				var linkUrl = newLine.substr(charNum2 + 1, charNum3 - (charNum2 + 1));
				newLine2 += "<a href=\"" + linkUrl + "\">" + linkText + "</a>";
				charNum = charNum3;
			}
			else {
				newLine2 += char;
			}
		}

		html += newLine2;
	}
	console.log(html);
	return html;
}

// HEADINGS

function parseHeadings (line) {
	if (line.startsWith("# ")) {
		lineParsed = true;
		return "<h1>" + line.substr(2) + "</h1>\n";
	}
	else if (line.startsWith("## ")) {
		lineParsed = true;
		return "<h2>" + line.substr(3) + "</h2>\n";
	}
	else if (line.startsWith("### ")) {
		lineParsed = true;
		return "<h3>" + line.substr(4) + "</h3>\n";
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

// QUOTES

var quote = false;
var code = false;
function closeQuoteAndCode (line) {
	var inCode = line.startsWith("! ");
	var inQuote = line.startsWith("` ");
	if (code && !inCode) {
		code = false;
		return "</code>\n";
	}
	if (quote && !inQuote) {
		quote = false;
		return "\n</quote>\n";
	}
	return "";
}

function parseQuoteAndCode (line) {
	var inCode = line.startsWith("! ");
	var inQuote = line.startsWith("` ");
	var newLine = "";
	if (inCode) {
		lineParsed = true;
		if (!code) {
			newLine += "<code>";
			code = true;
		}
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