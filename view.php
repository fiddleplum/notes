<?php

require('shared.php');

if(isset($_GET['n'])) // Note
{
	$note = $_GET['n'];
}
else
{
	$note = "";
}

print_header("Notes");

if($note == "")
{
	print("<p>There is no note specified.</p>");
}
else
{
	$text = @file_get_contents("data/$note.html");
	print($text);
}

print_footer();

?>