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

print("
	<script src='edit.js'></script>
	<div id='header'>
	<button class='left' onclick='save()'>Save</button>
	<button class='left' onclick='setBlockTypeAtCursor(\"h1\")'>h1</button>
	<button class='left' onclick='setBlockTypeAtCursor(\"h2\")'>h2</button>
	<button class='left' onclick='setBlockTypeAtCursor(\"h3\")'>h3</button>
	<button class='left' onclick='setBlockTypeAtCursor(\"p\")'>p</button>
	<button class='left' onclick='setBlockTypeAtCursor(\"p\", [\"quote\"])'>&ldquo;</button>
	<button class='left' onclick='setBlockTypeAtCursor(\"p\", [\"code\"])'>code</button>
	<button class='right' onclick='window.location.href = \"index.php?ps=\" + password;'><img src='list24.png' /></button>
	<button class='right' onclick='window.location.href = \"view.php?ps=\" + password + \"&n=\" + note;'><img src='view24.png' /></button>
	</div>
	<div id='content' contenteditable='true'>
$text
	</div>
	");

print_footer();

?>