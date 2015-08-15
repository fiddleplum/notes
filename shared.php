<?php

function print_header($title)
{
	print("<!doctype html><meta charset='UTF-8'>
<html>
	<head>
		<title>$title</title>
		<meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=0'>
		<link rel='stylesheet' type='text/css' href='style.css'>
		<!--<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js'></script>-->
		<script src='jquery.js'></script>
	</head>
	<body>
");
}

function print_footer()
{
	print("	</body>
</html>");
}

function check_password()
{
	// Get password from GET
	if(isset($_GET['ps']))
	{
		$password = $_GET['ps'];
	}
	else
	{
		$password = "";
	}

	// Check for password
	if($password != "rt")
	{
		print_header("Password");
		print("
			<div style='text-align: center;'>
				<h1>Please enter your password</h1>
				<div>
					<form action='.' method='get'>
						<input id='focus' type='password' name='ps' value='' />
					</form>
				</div>
			</div>
			<script type='text/javascript'>
				document.getElementById('focus').focus();
			</script>
			");
		print_footer();
		exit();
	}
	
	return $password;
}

function get_note()
{
	if(isset($_GET['n'])) // Note
	{
		$note = $_GET['n'];
	}
	else
	{
		$note = "";
	}
	return $note;
}

?>