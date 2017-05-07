<?php

require('shared.php');

$password = check_password();
$note = get_note();

print_header("Notes");

$note_files = array();
$dh = opendir("data");
if($dh)
{
	while(($file = readdir($dh)) !== false)
	{
		if($file == "." or $file == "..")
		{
			continue;
		}
		$note_files[] = $file;
	}
	closedir($dh);
}
sort($note_files);

print("
	<div id='header'>
		<form action='save.php' method='get'>
			<input type='hidden' name='ps' value='$password' />
			<input type='hidden' name='r' />
			<input class='left' type='text' name='n' />
			<input class='right' type='submit' value='New' />
		</form>
	</div>
	<div id='content'>
	");
foreach($note_files as $note_file)
{
	$note = substr($note_file, 0, -5);
	$escaped_note = str_replace("'", "&#39;", $note);
	print("
		<div class='item'>
			<button class='left' onclick='window.location.href = \"view.php?ps=$password&n=$escaped_note\";'>$note</button>
			<button class='img right' onclick='window.location.href = \"edit.php?ps=$password&n=$escaped_note\";'><img src='edit24.png' /></button>
			<button class='img right' onclick='if(confirm(\"Are you sure you want to delete $escaped_note?\")) window.location.href = \"delete.php?ps=$password&n=$escaped_note\";'><img src='delete24.png' /></button>
		</div>
		");
}

print("
	</div>
	");

print_footer();

?>