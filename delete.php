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

if(file_exists("data/$note"))
{
	unlink("data/$note");
}

header("Location: index.php?ps=$password");

?>