<?php

$password = "";
$note = "";
$op = "";
$text = "";

function getQuery ()
{
	global $password, $note, $op, $text;

	// Get the given password.
	if (isset($_GET["p"]))
	{
		$password = $_GET["p"];
	}

	// Get the current note, if any.
	if (isset($_GET["n"]))
	{
		$note = $_GET["n"];
	}
	if (strpbrk($note, "\\/:*?\"<>|") !== FALSE)
	{
		printHeader();
		print(
<<<EOT
		<div id="title">Error</div>
		<p>You cannot have any of these characters for a note name: \\ / : * ? " &lt; &gt; |</p>
EOT
			);
		printFooter();
		exit(0);
	}

	// Get the operation.
	if (isset($_GET["o"]))
	{
		$op = $_GET["o"];
	}

	// Get the text (POST).
	if (isset($_POST['t'])) // Text
	{
		$text = $_POST['t'];
	}
}

function printHeader ()
{
	print(
<<<EOT
<!doctype html><meta charset="UTF-8">
<html>
	<head>
		<title>Notes</title>
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0">
		<link href="https://fonts.googleapis.com/css?family=Lora" rel="stylesheet">
		<link href="https://fonts.googleapis.com/css?family=Oxygen+Mono" rel="stylesheet">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<style>
			:root { --dark: black; --medium: gray; --light: white; }
			* { box-sizing: border-box; }
			body { height: 100vh; background-color: var(--light); color: var(--dark); margin: 0; padding: 4px; font-size: 16px; font-family: "Lora", serif; }
			#title { font-size: 2em; line-height: 1.25em; margin-bottom: .25em; border-bottom: 1px solid var(--dark); }
			form { display: inline; margin: 0; }

			#list { width: 40em; max-width: 100%; margin: 0 auto; }
			#list .item { margin: 0 auto; clear: both; }
			#list .left { float: left; }
			#list .right { float: right; }
			#list input[type=text] { width: 30em; max-width: 75vw; }
			#list a, #list input[type=submit] { background: transparent; margin-bottom: .25em; border: 0; }
			#list a { text-decoration: none; }
			#list a:hover { text-decoration: underline; }

			// div.button_title { display: inline; }
			// div.button_title input[type=submit] { display: block; color: #666155; background-color: #f8f2e1; font-size: .75em; }
			// div.button_title input[type=image] { display: block; color: #666155; background-color: #f8f2e1; border-radius: 3px; }
			// div.button_title img { display: block; background-color: #f8f2e1; border-radius: 3px; }
			// div#edit_key { display: none; position: fixed; right: 1em; left: auto; top: 1em; width: 15em; padding: .25em; background-color: #ece4cd; border: 3px solid #666155; border-radius: 10px; }
			// div textarea#text { width: 100%; height: 30em; font-size: 1em; border-radius: 10px; }

			// div.head { margin: .5em 0; font-size: 1.5em; }
			// div.indent { margin: 1em 0; margin-left: 2em; }
			// div.code { margin: 1em 0; margin-left: 2m; font-family: mono-spaced; }
			// div.single { margin: 0em; }
			// span.sup { font-size: .5em; position: relative; bottom: .75em; }
			// span.sub { font-size: .5em; position: relative; bottom: -.25em; }

			#html > *:first-child { margin-top: 0; }
			#html h1 { font-size: 3em; font-weight: bold; line-height: 1em; margin: 1em 0 .33em 0; }
			#html h2 { font-size: 2em; font-weight: bold; line-height: 1em; margin: 1em 0 .5em 0; }
			#html h3 { font-size: 1.5em; font-weight: bold; line-height: 1em; margin: 1em 0 .67em 0; }
			#html p { margin: 1em 0 1em 0; }
			#html ul, #html ol { list-style-position: outside; margin: 1em 0 1em 2em; padding: 0; }
			#html ul { list-style-type: disc; }
			#html ol { list-style-type: decimal; }
			#html li { margin: .25em 0 .25em 0; }
			#html li > ul, #html li > ol { margin-top: .25em; margin-bottom: .25em; }
			#html quote { display: block; margin: 1em 0 1em 2em; }
			#html code { display: block; margin: 1em 0 1em 2em; font-family: "Oxygen Mono", monospace; white-space: pre; }
			#html a { text-decoration: none; color: blue; }
			#html a:hover { text-decoration: underline; }

			@media (max-width: 980px)
			{
				body { padding: 4px; }
				#title { font-size: 1.5em; }
				input[type=submit], input[type=text], input[type=password] { font-size: 1em; }
				// div textarea#edit { font-size: 16px; }
				// div.button_title input[type=submit] { font-size: .5em; margin-top: .125em; }
			}
		</style>
	</head>
	<body>
EOT
		);
}

function printFooter ()
{
	print(
<<<EOT
	</body>
</html>
EOT
	);
}

function checkPassword ()
{
	global $password;

	if ($password != "rt16")
	{
		printHeader();
		print(
<<<EOT
		<div id="title">Password</div>
		<p>Please enter your password.</p>
		<form action="." method="get">
			<input id="focus" type="password" name="p" value="" />
		</form>
		<script type="text/javascript">
			$('#focus')[0].focus();
		</script>
EOT
		);
		printFooter();
		exit(0);
	}
}

getQuery();

checkPassword();

// View note.
if ($op == "v")
{
	$text = @file_get_contents("data/$note.txt");
	printHeader();
	print(
<<<EOT
		<div id="title">$note</div>
		<script src="format.js"></script>
		<div id="html">$text</div>
		<script>
			$('#html').html(textToHtml($('#html').html()));
		</script>
EOT
		);
	printFooter();
}
// Edit note.
else if ($op == "e")
{
	printHeader();
	print(<<<EOT
			<div id="title">$note</div>
EOT
		);
	printFooter();
}
// Save note.
else if ($op == "s")
{
	if ($note == "")
	{
		printHeader();
		print(
<<<EOT
		<div id="title">Error</div>
		<p>There is no note specified.</p>
EOT
			);
		printFooter();
		exit(0);
	}
	file_put_contents("data/$note.txt", stripslashes($text));
	header("Location: ?p=$password&o=e&n=$note");
}
// Delete note.
else if ($op == "d")
{
	if (file_exists("data/$note.txt"))
	{
		unlink("data/$note.txt");
	}
	else
	{
		printHeader();
		print(
<<<EOT
		<div id="title">Error</div>
		<p>The specified note is invalid.</p>
EOT
			);
		printFooter();
		exit(0);
	}
	header("Location: ?p=$password");
}
// List notes.
else
{
	// Get list of all notes in data folder.
	$note_files = array();
	$dh = opendir("data");
	if ($dh)
	{
		while (($file = readdir($dh)) !== false)
		{
			if ($file == "." or $file == "..")
			{
				continue;
			}
			$note_files[] = $file;
		}
		closedir($dh);
	}
	sort($note_files);

	printHeader();
	print(
<<<EOT
		<div id="title">List</div>
		<div id="list">
			<div class="item">
				<form id="new" action="." method="get">
					<input type="hidden" name="p" value="$password" />
					<input type="hidden" name="o" value="e" />
					<input id="note" class="left" type="text" name="n" />
					<a href="javascript:if ($('#note')[0].value != '') $('#new').submit(); else void(0);" class="right">New</a>
					<div class="clear"></div>
				</form>
			</div>
EOT
		);

	foreach ($note_files as $note_file)
	{
		$note = substr($note_file, 0, -4);
		$js_escaped_note = str_replace("'", "\'", $note);
		$url_escaped_note = urlencode($note);
		print(
<<<EOT
			<div class="item">
				<a href="?p=$password&o=v&n=$url_escaped_note" class="left">{$note}</a>
				<a href="?p=$password&o=e&n=$url_escaped_note" class="right">&#x2710;</a>
				<a href="?p=$password&o=d&n=$url_escaped_note" class="right" onclick="return confirm('Are you sure you want to delete $js_escaped_note?');">&#x2716;</a>
			</div>
EOT
			);
	}
	print(
<<<EOT
		</div>
EOT
		);
	printFooter();
}
?>