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
	"vec" : ["<b>&0</b>", 1],
	"hat" : ["&0̂", 1], // there is an invisible character in here to make the combining mark
	"der" : ["d", 0],
	"frac" : ["<span style='display: inline-block; text-align: center; vertical-align: middle;'><span>%0</span><span style='border-top: 1px solid; display: block;'>%1</span></span>", 2],
	"eqnum" : ["<span style='float: right;'>%0</span>", 1],
	"sqrt" : ["√<span style='display: inline-block; border-top: 1px solid black; padding-top: 1px; '>%0</span>", 1],
	"inf" : ["∞", 0],
	"myinf" : ["¤", 0],
	"sum" : ["<span style='display: inline-block; position: relative; text-align: center; vertical-align: middle; line-height: 1em;'><span style='position: absolute; top: -1.15em; left:-500%; right:-500%; margin:auto; white-space: nowrap; font-size: .75em;'>%1</span><span style=' font-size: 2em; line-height: .75em;'>&Sigma;</span><span style='display: block; position: absolute; bottom: -1.05em; left:-500%; right:-500%; margin:auto; white-space: nowrap; font-size: .75em'>%0</span></span>", 2],
	"product" : ["<span style='display: inline-block; position: relative; text-align: center; vertical-align: middle; line-height: 1em;'><span style='position: absolute; top: -1.15em; left:-500%; right:-500%; margin:auto; white-space: nowrap; font-size: .75em;'>%1</span><span style=' font-size: 2em; line-height: .75em;'>&Sigma;</span><span style='display: block; position: absolute; bottom: -1.05em; left:-500%; right:-500%; margin:auto; white-space: nowrap; font-size: .75em'>%0</span></span>", 2],
	"paren" : ["<span style='display: inline-block; transform: scale(1, calc(%0)); vertical-align: middle;'>(</span>%1<span style='display: inline-block; transform: scale(1, %0); vertical-align: middle;'>)</span>", 2],
	"bracket" : ["<span style='display: inline-block; transform: scale(1, calc(%0)); vertical-align: middle;'>[</span>%1<span style='display: inline-block; transform: scale(1, %0); vertical-align: middle;'>]</span>", 2],
	"half" : ["½", 0],

	// functions
	"if" : ["if", 0],
	"else" : ["else", 0],
	"sin" : ["sin(%0)", 1],
	"sin2" : ["sin<sup>2</sup>(%0)", 1],
	"cos" : ["cos(%0)", 1],
	"cos2" : ["cos<sup>2</sup>(%0)", 1],
	"tan" : ["tan(%0)", 1],
	"tan2" : ["tan<sup>2</sup>(%0)", 1],
	"real" : ["real(%0)", 1],
	"im" : ["im(%0)", 1],

	// matrices
	"mat31" : ["<table style='display: inline-block; text-align: center; vertical-align: middle; border-left: 1px solid black; border-right: 1px solid black;'><tr><td>%0</td></tr><tr><td>%1</td></tr><tr><td>%2</td></tr></table>", 3],
	"mat41" : ["<table style='display: inline-block; text-align: center; vertical-align: middle; border-left: 1px solid black; border-right: 1px solid black;'><tr><td>%0</td></tr><tr><td>%1</td></tr><tr><td>%2</td></tr><tr><td>%3</td></tr></table>", 4],
	"mat44" : ["<table style='display: inline-block; text-align: center; vertical-align: middle; border-left: 1px solid black; border-right: 1px solid black;'><tr><td>%0</td><td>%1</td><td>%2</td><td>%3</td></tr><tr><td>%4</td><td>%5</td><td>%6</td><td>%7</td></tr><tr><td>%8</td><td>%9</td><td>%10</td><td>%11</td></tr><tr><td>%12</td><td>%13</td><td>%14</td><td>%15</td></tr></table>", 16],
	
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
	"grad" : ["<b>∇</b>", 0],
	"wedge" : ["∧", 0],
	"int" : ["∫", 0],
	"int2" : ["∬", 0],
	"int3" : ["∭", 0],
	"intclosed" : ["∮", 0],
	"int2closed" : ["∯", 0],
	"int3closed" : ["∰", 0],
	
	// quantum
	"hbar" : ["<i>ħ</i>", 0],
	"bra" : ["⟨%0|", 1],
	"ket" : ["|%0⟩", 1],
	"braket" : ["⟨%0|%1⟩", 2],
	"dagger" : ["†", 0]
}

var knownSymbols = {
	// greek symbols
	"alpha" : "&alpha;",
	"beta" : "&beta;",
	"gamma" : "&gamma;",
	"delta" : "&delta;",
	"epsilon" : "&epsilon;",
	"zeta" : "&zeta;",
	"eta" : "&eta;",
	"theta" : "&theta;",
	"iota" : "&iota;",
	"kappa" : "&kappa;",
	"lambda" : "&lambda;",
	"mu" : "&mu;",
	"nu" : "&nu;",
	"xi" : "&xi;",
	"omicron" : "&omicron;",
	"pi" : "&pi;",
	"rho" : "&rho;",
	"sigma" : "&sigma;",
	"tau" : "&tau;",
	"upsilon" : "&upsilon;",
	"phi" : "&phi;",
	"chi" : "&chi;",
	"psi" : "&psi;",
	"omega" : "&omega;",
	"Alpha" : "&Alpha;",
	"Beta" : "&Beta;",
	"Gamma" : "&Gamma;",
	"Delta" : "&Delta;",
	"Epsilon" : "&Epsilon;",
	"Zeta" : "&Zeta;",
	"Eta" : "&Eta;",
	"Theta" : "&Theta;",
	"Iota" : "&Iota;",
	"Kappa" : "&Kappa;",
	"Lambda" : "&Lambda;",
	"Mu" : "&Mu;",
	"Nu" : "&Nu;",
	"Xi" : "&Xi;",
	"Omicron" : "&Omicron;",
	"Pi" : "&Pi;",
	"Rho" : "&Rho;",
	"Sigma" : "&Sigma;",
	"Tau" : "&Tau;",
	"Upsilon" : "&Upsilon;",
	"Phi" : "&Phi;",
	"Chi" : "&Chi;",
	"Psi" : "&Psi;",
	"Omega" : "&Omega;"
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
		replacement = replacement.replace(new RegExp("%" + j, "g"), paramContent);
		if(param.startsWith("/")) {
			var word = param.substring(1);
			if(word in knownSymbols) {
				param = knownSymbols[word];
			}
		}
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
			if(word in knownSymbols) {
				var replacement = knownSymbols[word];
				newContent += "<i>" + replacement + "</i>";
				continue;
			}
			if(word in knownWords) {
				var [replacement, numParams] = knownWords[word];
				var parsedParams = "";
				[parsedParams, i] = parseParams(content, i, replacement, numParams);
				newContent += parsedParams;
				continue;
			}
			else {
				newContent += "/" + word;
				i += word.length;
				continue;
			}
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
		else if("0123456789()[]+-*=,.|><".includes(c)) {
			newContent += c;
			i++;
		}
		else if(c == "^") {
			i++;
			var parsedParams = "";
			[parsedParams, i] = parseParams(content, i, "<span style='position: relative; top: -.5em; font-size: .7em;'>%0</span>", 1);
			newContent += parsedParams;
		}
		else if(c == "_") {
			i++;
			var parsedParams = "";
			[parsedParams, i] = parseParams(content, i, "<span style='position: relative; bottom: -.25em; font-size: .7em;'>%0</span>", 1);
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