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

print_header("Notes 2");

print("
	<script src='edit.js'></script>
	<script>
		var password = '$password';
		var note = '" . str_replace("'", "\'", $note) . "';
	</script>
	<div id='edit'>
	<div id='buttons'>
	<button onclick='save()'>Save</button>
	<button onclick='setBlockTypeAtCursor(\"h1\")'>h1</button>
	<button onclick='setBlockTypeAtCursor(\"h2\")'>h2</button>
	<button onclick='setBlockTypeAtCursor(\"h3\")'>h3</button>
	<button onclick='setBlockTypeAtCursor(\"p\")'>p</button>
	<button onclick='setBlockTypeAtCursor(\"p\", [\"quote\"])'>Quote</button>
	<button onclick='setBlockTypeAtCursor(\"p\", [\"code\"])'>Code</button>
	</div>
	<div id='content' contenteditable='true'>
$text
	</div>
	</div>
	");

print_footer();

?>