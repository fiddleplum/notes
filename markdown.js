function markdownToHtml (text) {
	var lines = text.split('\n');
	lines.push(".");
	var html = "";
	for (var lineNum = 0; lineNum < lines.length; lineNum++) {
		var line = lines[lineNum];

		var newLine = "";

		// Skip blank line.
		if (line.length == 0) {
			continue;
		}

		// List tracking.
		getListTypeAndLevel(line);
		html += closeLists(line);
		html += openLists(line);

		newLine += parseHeadings(line);
		newLine += parseListItem(line);

		// No line was parsed, so it's just a paragraph.
		if (newLine == "") {
			newLine += "<p>" + line + "</p>\n";
		}

		// Inline markdown.
		var bold = false;
		var italics = false;
		var newLine2 = "";
		for (var charNum = 0; charNum < newLine.length; charNum++) {
			var char = newLine[charNum];
			var nextChar = (charNum + 1 < newLine.length) ? newLine[charNum + 1] : "";
			if ((char == "*" && nextChar == "*") || (char == "_" && nextChar == "_")) {
				if (!bold) {
					newLine2 += "<b>";
				}
				else {
					newLine2 += "</b>";
				}
				bold = !bold;
				charNum++;
			}
			else if(char == "*" || char == "_") {
				if (!italics) {
					newLine2 += "<i>";
				}
				else {
					newLine2 += "</i>";
				}
				italics = !italics;
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
		return "<h1>" + line.substr(2) + "</h1>\n";
	}
	else if (line.startsWith("## ")) {
		return "<h2>" + line.substr(3) + "</h2>\n";
	}
	else if (line.startsWith("### ")) {
		return "<h3>" + line.substr(4) + "</h3>\n";
	}
	else if (line.startsWith("#### ")) {
		return "<h4>" + line.substr(5) + "</h4>\n";
	}
	else if (line.startsWith("##### ")) {
		return "<h5>" + line.substr(6) + "</h5>\n";
	}
	else if (line.startsWith("###### ")) {
		return "<h6>" + line.substr(7) + "</h6>\n";
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
}

function closeLists (line) {
	var newLine = "";
	while (listStack.length > nextListLevel) {
		var top = listStack.pop();
		if (listStack.length > 0) {
			newLine += "</li>\n";
		}
		newLine += Array(listStack.length + 1).join("  ");
		if (top == "*") {
			newLine += "</ul>";
		} else if (top == "1") {
			newLine += "</ol>";
		}
		if (listStack.length == 0) {
			newLine += "\n";
		}
	}
	if (listStack.length > 0 && listStack.length == nextListLevel) {
		if (listStack[listStack.length - 1] != nextListType) {
			newLine += "</li>\n";
			newLine += Array(listStack.length).join("  ");
			if (listStack[listStack.length - 1] == "*") {
				newLine += "</ul>";
			} else if (listStack[listStack.length - 1] == "1") {
				newLine += "</ol>";
			}
			listStack.pop();
			if (listStack.length == 0) {
				newLine += "\n";
			}
		}
		else {
			newLine += "</li>\n";
		}
	}
	return newLine;
}

function openLists (line) {
	var newLine = "";
	while (listStack.length < nextListLevel) {
		if (listStack.length > 0) {
			newLine += "\n";
		}
		newLine += Array(listStack.length + 1).join("  ");
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
		return Array(listStack.length + 1).join("  ") + "<li>" + line.substr(nextListLevel * 2);
	}
	return "";
}