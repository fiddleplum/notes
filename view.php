<?php

require('shared.php');

$password = check_password();

$note = get_note();
if($note == "")
{
	print_header("Notes 2");
	print("<p>There is no note specified.</p>");
	print_footer();
	exit(0);
}
$text = @file_get_contents("data/$note.html");

print_header("Notes");

$escaped_note = str_replace("'", "&#39;", $note);

print("
		<div id='header'>
			<div class='left'>$note</div>
			<button class='right' onclick='window.location.href = \"index.php?ps=$password\";'><img src='list24.png' /></button>
			<button class='right' onclick='window.location.href = \"edit.php?ps=$password&n=$escaped_note\";'><img src='edit24.png' /></button>
		</div>
		<div id='content'>
");

if($note == "")
{
	print("<p>There is no note specified.</p>");
}
else
{
	print($text);
}

print("
		</div>
");

print_footer();

?>