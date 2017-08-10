var knownWords = {
	"text" : ["<span style='font-style: normal;'>&0</span>", 1],

	// algebra, calc, geom
	"neg" : ["-", 0],
	"pow" : ["<sup>%0</sup>", 1],
	"sub" : ["<sub>%0</sub>", 1],
	"div" : ["/", 0],
	"dot" : ["&sdot;", 0],
	"cross" : ["&times;", 0],
	"perp" : ["&perp;", 0],
	"norm" : ["|%0|", 1],
	"parallel" : ["&#x2225;", 0],
	"vec" : ["&0&#8407;", 1],
	"hat" : ["&0̂", 1], // there is an invisible character in here to make the combining mark
	"der" : ["d", 0],
	"frac" : ["<table style='display: inline-block; margin-left: .1em; margin-right: .1em; vertical-align: middle;' cellspacing=0 cellpadding=0><tr><td style='text-align: center; border-bottom: 1px solid; padding: 0;'>%0</td></tr><tr><td style='text-align: center; pading: 0;'>%1</td></tr></table>", 2],
	"eq" : ["<span style='float: right;'>%0</span>", 1],
	"sqrt" : ["<span style='font-size: 1.25em;'>√</span><span style='text-decoration:overline; '>%0</span>", 1],
	"myinf" : ["¤", 0],
	"indexed" : ["<table style='display: inline-block; vertical-align: middle;' cellspacing=0 cellpadding=0><tr><td style='font-size: .75em; text-align: center; line-height: .5em;'>%2</td></tr><tr><td style='font-size: 1.5em; text-align: center; vertical-align: middle; line-height: .5em;'>%0</td></tr><tr><td style='font-size: .75em; text-align: center; line-height: .5em;'>%1</td></tr></table>", 3],
	"paren2" : ["<span style='display: inline-block; transform: scale(1, 3);'>(</span>%0<span style='display: inline-block; transform: scale(1, 3);'>)</span>", 1],
	"bracket2" : ["<span style='display: inline-block; transform: scale(1, 3);'>[</span>%0<span style='display: inline-block; transform: scale(1, 3);'>]</span>", 1],
	"half" : ["½", 0],

	// functions
	"sin" : ["sin(%0)", 1],
	"sin2" : ["sin<sup>2</sup>(%0)", 1],
	"cos" : ["cos(%0)", 1],
	"cos2" : ["cos<sup>2</sup>(%0)", 1],
	"tan" : ["tan(%0)", 1],
	"tan2" : ["tan<sup>2</sup>(%0)", 1],
	"real" : ["real(%0)", 1],
	"im" : ["im(%0)", 1],

	// matrices
	"mat31" : ["<table style='display: inline-block; vertical-align: middle; border-left: 1px solid black; border-right: 1px solid black;'><tr><td>%0</td></tr><tr><td>%1</td></tr><tr><td>%2</td></tr></table>", 3],

	// comparisons
	"ge" : ["≥", 0],
	"le" : ["≤", 0],
	"ne" : ["≠", 0],
	"prop" : ["∝", 0],
	"abouteq" : ["≈", 0],

	// logic/sets
	"implies" : ["→", 0],
	"and" : ["∧", 0],
	"or" : ["∨", 0],
	"not" : ["¬", 0],
	"union" : ["∪", 0],
	"intersection" : ["∩", 0],
	"empty" : ["∅", 0],
	"entails" : ["⊦", 0],
	"forall" : ["∀", 0],
	"exists" : ["∃", 0],
	"naturals" : ["ℕ", 0],
	"reals" : ["ℜ", 0],
	"complexes" : ["ℂ", 0],
	"subset" : ["⊂", 0],
	"superset" : ["⊃", 0],
	"isin" : ["∈", 0],

	// calculus
	"part" : ["∂", 0],
	"nabla" : ["∇", 0],
	"wedge" : ["∧", 0],
	"int" : ["∫ %0 d%1", 2],
	"int1" : ["∫<sub>%0</sub> %1 d%2", 3],
	"int2" : ["∫<sup>%1</sup><sub>%0</sub> %2 d%3", 4],

	// quantum
	"hbar" : ["<i>ħ</i>", 0],
	"bra" : ["⟨%0|", 1],
	"ket" : ["|%0⟩", 1],
	"braket" : ["⟨%0 | %1⟩", 2],

	// greek symbols
	"alpha" : ["<i>&alpha;</i>", 0],
	"beta" : ["<i>&beta;</i>", 0],
	"gamma" : ["<i>&gamma;</i>", 0],
	"delta" : ["<i>&delta;</i>", 0],
	"epsilon" : ["<i>&epsilon;</i>", 0],
	"zeta" : ["<i>&zeta;</i>", 0],
	"eta" : ["<i>&eta;</i>", 0],
	"theta" : ["<i>&theta;</i>", 0],
	"iota" : ["<i>&iota;</i>", 0],
	"kappa" : ["<i>&kappa;</i>", 0],
	"lambda" : ["<i>&lambda;</i>", 0],
	"mu" : ["<i>&mu;</i>", 0],
	"nu" : ["<i>&nu;</i>", 0],
	"xi" : ["<i>&xi;</i>", 0],
	"omicron" : ["<i>&omicron;</i>", 0],
	"pi" : ["<i>&pi;</i>", 0],
	"rho" : ["<i>&rho;</i>", 0],
	"sigma" : ["<i>&sigma;</i>", 0],
	"tau" : ["<i>&tau;</i>", 0],
	"upsilon" : ["<i>&upsilon;</i>", 0],
	"phi" : ["<i>&phi;</i>", 0],
	"chi" : ["<i>&chi;</i>", 0],
	"psi" : ["<i>&psi;</i>", 0],
	"omega" : ["<i>&omega;</i>", 0],
	"Alpha" : ["<i>&Alpha;</i>", 0],
	"Beta" : ["<i>&Beta;</i>", 0],
	"Gamma" : ["<i>&Gamma;</i>", 0],
	"Delta" : ["<i>&Delta;</i>", 0],
	"Epsilon" : ["<i>&Epsilon;</i>", 0],
	"Zeta" : ["<i>&Zeta;</i>", 0],
	"Eta" : ["<i>&Eta;</i>", 0],
	"Theta" : ["<i>&Theta;</i>", 0],
	"Iota" : ["<i>&Iota;</i>", 0],
	"Kappa" : ["<i>&Kappa;</i>", 0],
	"Lambda" : ["<i>&Lambda;</i>", 0],
	"Mu" : ["<i>&Mu;</i>", 0],
	"Nu" : ["<i>&Nu;</i>", 0],
	"Xi" : ["<i>&Xi;</i>", 0],
	"Omicron" : ["<i>&Omicron;</i>", 0],
	"Pi" : ["<i>&Pi;</i>", 0],
	"Rho" : ["<i>&Rho;</i>", 0],
	"Sigma" : ["<i>&Sigma;</i>", 0],
	"Tau" : ["<i>&Tau;</i>", 0],
	"Upsilon" : ["<i>&Upsilon;</i>", 0],
	"Phi" : ["<i>&Phi;</i>", 0],
	"Chi" : ["<i>&Chi;</i>", 0],
	"Psi" : ["<i>&Psi;</i>", 0],
	"Omega" : ["<i>&Omega;</i>", 0]
}

function passWhiteSpace(content, i) {
	while(i < content.length) {
		var c = content[i];
		if(c != " " && c != "\t" && c != "\n" && c != "\r") {
			break;
		}
		i++;
	}
	return [i];
}

function getWord(content, i) {
	var word = "";
	while(i < content.length) {
		var code = content[i].charCodeAt(0);
		if(97 <= code && code <= 122) {} // a-z
		else if(65 <= code && code <= 90) {} // A-Z
		else if(48 <= code && code <= 57) {} // 0-9
		else {
			break;
		}
		word += content[i];
		i++;
	}
	return [word, i];
}

function getParam(content, i) {
	var nesting = 0;
	var param = "";
	if(content[i] != "{") {
		return ["", i];
	}
	while(i < content.length) {
		var c = content[i];
		if(c == "{") {
			nesting++;
		}
		else if(c == "}") {
			nesting--;
			if(nesting == 0) {
				i++;
				break;
			}
		}
		if((c != "{") || (c == "{" && nesting > 1)) {
			param += c;
		}
		i++;
	}
	return [param, i];
}

function parseParams(content, i, replacement, numParams) {
	for(var j = 0; j < numParams; j++) {
		var param = "";
		if(numParams == 1 && content[i] != "{") {
			[param, i] = getWord(content, i);
		}
		else {
			[param, i] = getParam(content, i);
		}
		var paramContent = parseMathContent(param);
		replacement = replacement.replace("%" + j, paramContent);
		replacement = replacement.replace("&" + j, param);
	}
	return [replacement, i];
}

function parseMathContent(content) {
	var i = 0;
	var word;
	var newContent = "";
	while(i < content.length) {
		var c = content[i];
		if(c == "/") {
			i++;

			// Get the word.
			[word, i] = getWord(content, i);
			if(word.length == 0) {
				newContent += c;
				continue;
			}
			if(word.length == 1) {
				i -= 1;
				continue;
			}
			else if(!(word in knownWords)) {
				newContent += "/" + word;
				i += word.length;
				continue;
			}

			// Parse the params.
			var [replacement, numParams] = knownWords[word];
			var parsedParams = "";
			[parsedParams, i] = parseParams(content, i, replacement, numParams);
			newContent += parsedParams;
		}
		else if(c == "{") {
			i++;
			while(i < content.length) {
				var c = content[i];
				if (c == "}") {
					break;
				}
				newContent += c;
				i++;
			}
		}
		else if("0123456789()[]+-*=,.|".includes(c)) {
			newContent += c;
			i++;
		}
		else if(c == "^") {
			i++;
			var parsedParams = "";
			[parsedParams, i] = parseParams(content, i, "<sup>%0</sup>", 1);
			newContent += parsedParams;
		}
		else if(c == "_") {
			i++;
			var parsedParams = "";
			[parsedParams, i] = parseParams(content, i, "<sub>%0</sub>", 1);
			newContent += parsedParams;
		}
		else if(c == " ") {
			newContent += c;
			i++;
		}
		else {
			newContent += "<i>" + c + "</i>";
			i++;
		}
	}
	return newContent;
}