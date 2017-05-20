<?php

function print_header($title)
{
	print("
		<!doctype html><meta charset='UTF-8'>
		<html>
			<head>
				<title>$title</title>
				<meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=0'>
				<link href='https://fonts.googleapis.com/css?family=Lora' rel='stylesheet'>
				<link href='https://fonts.googleapis.com/css?family=Oxygen+Mono' rel='stylesheet'>
				<link rel='stylesheet' type='text/css' href='style.css'>
				<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js'></script>
				<script src='format.js'></script>
			</head>
			<script>
				// function getQueryParam(name) {
				// 	name = name.replace(/[\[\]]/g, '\\$&');
				// 	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
				// 	results = regex.exec(window.location.href);
				// 	if (!results) {
				// 		return null;
				// 	}
				// 	if (!results[2]) {
				// 		return '';
				// 	}
				// 	return decodeURIComponent(results[2].replace(/\+/g, ' '));
				// }

				// function getNote(name) {
				// 	$.ajax({
				// 		url: 'data/' + name + '.txt',
				// 		context: document.body,
				// 		success: function(data) {
				// 			$('#markdown textarea').html(data);
				// 			updateHtml();
				// 		},
				// 		error: function() {
				// 			showMessage('Could not load note \"' + name + '\".');
				// 		}
				// 	});
				// }

				// function showMessage(message) {
				// 	var div = $('#message');
				// 	div.html(message);
				// 	div.fadeIn(250);
				// }

				// var password = getQueryParam('ps');
				// var note = getQueryParam('n');
			</script>
			<body>
		");
}

function print_footer()
{
	print("
				<!--<div id='clear'></div>
				<div id='message'></div>-->
			</body>
		</html>
		");
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
	if($password != "rt16")
	{
		print_header("Notes");
		print("
			<div id='content' class='narrow'>
				<div style='text-align: center;'>
					<h1>Please enter your password</h1>
					<div>
						<form action='.' method='get'>
							<input id='focus' type='password' name='ps' value='' />
						</form>
					</div>
				</div>
			</div>
			<script type='text/javascript'>
				$('#focus')[0].focus();
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