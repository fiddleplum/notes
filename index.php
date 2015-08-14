<?php

require('shared.php');

$password = check_password();
$note = get_note();

print_header("Notes 2");

$notes = array();
$dh = opendir("data");
if($dh)
{
	while(($file = readdir($dh)) !== false)
	{
		if($file == "." or $file == "..")
		{
			continue;
		}
		$notes[] = $file;
	}
	closedir($dh);
}
sort($notes);

print("
	<div id='list'>
	<div class='new_item'>
	<form action='save.php' method='get'>
	<input type='hidden' name='ps' value='$password' />
	<input type='text' name='n' />
	<input type='submit' value='New' style='float: right; display: inline;' />
	</form>
	</div>
	");
foreach($notes as $note)
{
	$escaped_note = substr(str_replace("'", "&#39;", $note), 0, -5);
	print("
		<div class='item'>
		<form class='view_button' action='view.php' method='get'>
		<input type='hidden' name='ps' value='$password' />
		<input type='hidden' name='n' value='$escaped_note' />
		<input type='submit' value='$escaped_note' />
		</form>
		<form class='delete_button' action='delete.php' method='get'>
		<input type='hidden' name='ps' value='$password' />
		<input type='hidden' name='n' value='$escaped_note' />
		<input type='image' src='delete24.png' onclick='return confirm(\"Are you sure you want to delete $escaped_note?\");' />
		</form>
		<form class='edit_button' action='edit.php' method='get'>
		<input type='hidden' name='ps' value='$password' />
		<input type='hidden' name='n' value='$escaped_note' />
		<input type='image' src='edit24.png' />
		</form>
		</div>
		");
}
print("
	</div>
	");

print_footer();

?>