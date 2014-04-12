

//LOGIN
$(document).ready(function(){

	$('#navLogin').click(function(){
		$('.loginBox').fadeToggle('fast');
	});


	$('.loginBtn').submit(function(e){
		e.preventDefault();
		var url = "functions.php";
		var username = $('#username').val();
		var password = $('#password').val();

		if(username && password){
			$('.loginForm').submit();
		}

		/*$.post(url, {"newLogin":true, "username":username, "password":password}, function(result){
			var response = result;
			console.log(response);
			if(response.indexOf("Success") !== -1){
				console.log('redirect');
				window.location = "dashboard.php";
			}
		});*/
	});

});
			

//events
			