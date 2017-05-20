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

if(strpbrk($note, "\\/:*?\"<>|") !== FALSE)
{
	print_header("Notes 2");
	print("<p>You cannot have any of these characters for a note name: \\/:*?\"&lt;&gt;|</p>");
	print_footer();
	exit(0);
}

if(isset($_POST['t'])) // Text
{
	$text = $_POST['t'];
}
else
{
}

if(isset($_GET['r']))
{
	$r = true;
}
else
{
	$r = false;
}

$text = trim(str_replace("  ", " ", $text));

file_put_contents("data/$note.html", stripslashes($text));

if($r)
{
	header("Location: edit.php?ps=$password&n=$note");
}

?>