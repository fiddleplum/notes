function markdownToHtml (text) {
	var lines = text.split('\n');
	var html = "";
	for (var lineNum = 0; lineNum < lines.length; lineNum++) {
		var line = lines[lineNum].trim();

		// Line/Block markdown.
		var newLine1 = "";
		if (line.length == 0) {
			continue;
		}
		else if (line.startsWith("# ")) {
			newLine1 = "<h1>" + line.substr(2) + "</h1>";
		}
		else if (line.startsWith("## ")) {
			newLine1 = "<h2>" + line.substr(3) + "</h2>";
		}
		else if (line.startsWith("### ")) {
			newLine1 = "<h3>" + line.substr(4) + "</h3>";
		}
		else if (line.startsWith("#### ")) {
			newLine1 = "<h4>" + line.substr(5) + "</h4>";
		}
		else if (line.startsWith("##### ")) {
			newLine1 = "<h5>" + line.substr(6) + "</h5>";
		}
		else if (line.startsWith("###### ")) {
			newLine1 = "<h6>" + line.substr(7) + "</h6>";
		}
		else {
			newLine1 = "<p>" + line + "</p>";
		}

		// Inline markdown.
		var bold = false;
		var italics = false;
		var newLine2 = "";
		for (var charNum = 0; charNum < newLine1.length; charNum++) {
			var char = newLine1[charNum];
			var nextChar = (charNum + 1 < newLine1.length) ? newLine1[charNum + 1] : "";
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
	return html;
}