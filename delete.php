<?php

require('shared.php');

$password = check_password();
$note = get_note();

if($note == "")
{
	print_header("Notes");
	print("<p>There is no note specified.</p>");
	print_footer();
	exit(0);
}

if(file_exists("data/$note.html"))
{
	unlink("data/$note.html");
}

header("Location: index.php?ps=$password");

?>