<?php

// Does new, edit, and delete operations on notes and the note list.
// If there is text, it will save the note and update the note list if it was new.
// If there is no text, it will delete the note and update the note list.

// Get password from GET
if (isset($_GET['p']))
{
	$password = trim($_GET['p']);
}
else
{
	$password = '';
}
if ($password != 'r4t5')
{
	print('FAIL - Wrong password');
	exit(0);
}

// Get note from GET
if (isset($_GET['n']))
{
	$note = trim($_GET['n']);
}
else
{
	$note = '';
}
if ($note == '')
{
	print('FAIL - Empty note name');
	exit(0);
}
if (strpbrk($note, '\\/:*?\'<>|') !== FALSE)
{
	print('FAIL - You cannot have any of these characters for a note name: \\/:*?\'&lt;&gt;|');
	exit(0);
}

// Get the extension (mde or html).
if (isset($_GET['e']))
{
	$ext = trim($_GET['e']);
}
else
{
	print('FAIL - Missing extension');
	exit(0);
}
if ($ext != 'mde' && $ext != 'html')
{
	print('FAIL - Wrong extension');
	exit(0);
}

if (isset($_POST['t'])) // Text
{
	$text = trim($_POST['t']);
}
else
{
	$text = '';
}

// See if the note is already in the list..
$noteList = @file_get_contents("data/__list.txt");
$noteList = explode("\n", $noteList);
$noteIndex = -1;
for ($i = 0; $i < count($noteList); $i++)
{
	if (trim($noteList[$i]) == $note)
	{
		$noteIndex = $i;
	}
}

if ($text != '')
{
	// Add the new note to the note list if it isn't already there.
	if ($noteIndex == -1)
	{
		array_push($noteList, trim($note));
		$noteList = implode("\n", $noteList);
		file_put_contents('data/__list.txt', $noteList);
	}

	file_put_contents("data/$note.$ext", stripslashes($text));
}
else // No text, so delete.
{
	if ($noteIndex != -1)
	{
		array_splice($noteList, $noteIndex, 1);
		$noteList = implode("\n", $noteList);
		file_put_contents('data/__list.txt', $noteList);
		unlink("data/$note.$ext");
	}
}

print('SUCCESS');

?>