 


fbUser = {
	status: 'not_connected',
	loggedIn: 0,

	switchToUserLayout:function(user){
		spoticka.currentUser = user;

		$('.notLoggedInNav').hide();
		$('.loggedInNav').show();
		console.log('switched to user layout');
	},
	switchToGuestLayout:function(){
		$('.loggedInNav').hide();
		$('.notLoggedInNav').show();
	},

	checkLoginStatus:function(response) {
		console.log(response);
		if (response.status === 'connected') {
			fbUser.testAPI();
		}
		else if (response.status === 'not_authorized') {
			console.log(response);
			fbUser.switchToGuestLayout();
		}
		else {
			console.log(response);
			fbUser.switchToGuestLayout();
		}
	},


	testAPI: function() {
		console.log('Welcome!  Fetching your information.... ');
		FB.api('/me',
			{fields: 'id,name,email,bio,birthday,location,username,cover,first_name,gender,sports,about,picture',
			//access_token: '12345|fakeToken'
		},
		function(response) {
			if (!response || response.error) {
				console.log("ERROR: ", response);
				fbUser.switchToGuestLayout();
			}
			else {
				console.log(response);
				var user = response;
				$.ajax({
					url: 'http://spoticka.orbit.al:5050/users',
					type:'post',
					data: user,
					success: function(result){
						console.log(result);
						if(result){
							fbUser.loggedIn = 1;
							fbUser.user = user;
							spoticka.initializeUser(user);
							console.log('loggedIn Sucess');
							fbUser.switchToUserLayout(user);
						}
					}
				});
			}
		});
	},

	fbLogin:function(){
		FB.login(function(response) {
			console.log("Login Response");
			if (response.authResponse) {
				var uid = response.authResponse.userID;
				var accessToken = response.authResponse.accessToken;
				console.log(response);
					/*FB.api('/me', {fields: 'id,name,email,bio,birthday,location,username,cover,first_name,last_name,gender,sports,about,picture'}, function(result) {
						console.log(result);
						console.log(accessToken);
						if(result){
							fbUser.loggedIn = 1;
							fbUser.switchToUserLayout();
						}
					});*/
			} else {
				alert('We\'re sorry we were not able to log you in.');
				fbUser.switchToGuestLayout();
			}
		}, {scope: 'id,name,email,bio,birthday,location,username,cover,first_name,last_name,gender,sports,about,picture'});
	}
};



spoticka = {
	/*"events":[
		{
			"bounty_id":1,
			"name":"Event 1",
			"badge":"Fire",
			"badgeImage":"fire",
			"eventImage":"event",
			"offerer":"gisheri",
			"description":"This is going to be awesome!",
			"coordinates":"37.764317,-113.051213",
			"date": "4/122014"

		},
		{
			"bounty_id":2,
			"name":"Event 2",
			"badge":"Water",
			"badgeImage":"water",
			"eventImage":"event",
			"offerer":"gisheri",
			"description":"This is going to be awesome!",
			"coordinates":"37.746738,-113.055030",
			"timeLeft":5
		},
		{
			"bounty_id":3,
			"name":"Startup Weekend",
			"badge":"Topher",
			"badgeImage":"topher",
			"eventImage":"event",
			"offerer":"gisheri",
			"description":"This is going to be awesome!",
			"coordinates":"37.711399,-113.05811630000001",
			"timeLeft":5
		},
	],*/

	isLoggedIn:function(){

	},

	"getUser":function(username){
		$.get('http://spoticka.orbit.al:5050/users/'+username, function(result){
			spoticka.currentUser = result;
			if(!spoticka.currentUser.badges){
				spoticka.currentUser.badges = [];
			}
		})
	},

	"initializeUser":function(user){
			spoticka.currentUser = user;
			if(!spoticka.currentUser.badges){
				spoticka.currentUser.badges = [];
			}
	},


	getAllBadges:function(){
		$.get('http://spoticka.orbit.al:5050/badges', function(result){
			spoticka.badges = result;
			$.each(spoticka.badges, function(i,badge){
				var badgeHtml = $("<div class='badgeBox' data-badge='"+badge.name+"'><img src='images/badges/"+badge.image+".png'/></div>");
				$('.myBadgesList').append(badgeHtml);
				//
				var profileBadgeHtml = $("<div class='badgeBoxVertical' data-badge='"+badge.name+"'><img src='images/badges/"+badge.image+".png'/><div class='badgeName'><h3>"+badge.name+"</h3></div><br class='clear'/>");
				$('.myBadgesListVertical').append(profileBadgeHtml);
			});
		});
	},

	getAllEvents:function(){
		$.get("http://spoticka.orbit.al:5050/events", function(result){
			spoticka.events = result;
			spoticka.showAllEvents();
		});
	},

	showAllEvents:function(){
		console.log('setting markers');
		spoticka.setMarkers();
	},

	setMarkers:function() {
		$.each(spoticka.events, function(i, bounty){
			setTimeout(function() {
				spoticka.addMarker(i);
			}, (i+1) * 50);
		});
	},

	addListeners:function(){
		$.each(spoticka.markers, function(k,marker){
			google.maps.even.addListener(marker, 'click', function(){
				spoticka.showPopup(marker);
			});
		});
	},

	addMarker:function(i) {
		console.log('adding marker');
		var bounty = spoticka.events[i];
		var coordinates = bounty.coordinates.split(",");
		var lat = parseFloat(coordinates[0]);
		var lng = parseFloat(coordinates[1]);
		var coords = new google.maps.LatLng(lat,lng);



		var marker = new google.maps.Marker({
			position: coords,
			map: spoticka.map,
			draggable: false,
			shapeinfo: bounty,
			title: bounty.name,
			animation: google.maps.Animation.DROP,
			icon: {
				url: 'images/badges/'+bounty.badgeImage+'.png',
			}
		});


		//add event listeners
		google.maps.event.addListener(marker, 'click', function(){
			spoticka.showPopup(i);
		});

		spoticka.events[i].marker = marker;
		spoticka.events[i].position = {lat:lat, lng:lng}
	},

	showPopup:function(which, currentlyAt){

		var bounty = spoticka.events[which];
		var marker = spoticka.events[which].marker
		var latLng = marker.position;
		spoticka.map.panTo(latLng);
		if(currentlyAt){
			$('.claimBadgeBtn').show();
			$('.commitToEventBtn').hide();
		}
		else {
			$('.claimBadgeBtn').hide();
			$('.commitToEventBtn').show();
		}

		console.log(bounty);
		var box = $('.mapBountyDetails');
		box.hide();
		box.attr("data-bounty", which);
		box.css({'left':($(window).width()/2)-box.width()/2})
		box.find('.mapBountyName').text(bounty.name);
		box.find('.mapBountyBadgeImage').find('img').attr("src", 'images/badges/'+bounty.badgeImage+'.png');
		box.find('.mapBountyBadgeName').text(bounty.badge);
		box.show();

		function fromLatLngToPoint(latLng, map) {
			var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
			var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
			var scale = Math.pow(2, map.getZoom());
			var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
			return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
		}
	},


	addBadgeToUser:function(badge){
		spoticka.currentUser.badges.push(badge);
		spoticka.updateUser();
	},

	updateUser:function(){
		var url = "http://spoticka.orbit.al:5050/users/"+spoticka.currentUser.username
		console.log(url);
		$.ajax({
			url : url,
			type : "put",
			data : spoticka.currentUser,
			success: function(result){
				console.log(result);
			}
		});
	},


	submitEvent:function(){

		//var badge = $.grep(spoticka.currentUser.badges, function(badge){return badge.name == $('#bountyRegisterBadgeName')});
		
		var bountyInfo = {
			name: $('.bountyRegisterName').val(),
			description:$('.bountyRegisterDescription').val(),
			badge: $('#bountyRegisterBadgeName').val(),
			badgeImage: $('#bountyRegisterBadgeName').val().replace(" ", "_"),
			date: $('#bountyRegisterDate').val(),
			coordinates: $('#bountyRegisterCoordinates').val(),
			host: spoticka.currentUser.username
		}

		$.post("http://spoticka.orbit.al:5050/events", bountyInfo, function(result){
			console.log(result);
			if(result.id){
				location.reload();
			}
		});

	},

	initializeMap:function(){
		console.log('initializing map');
		var dark1 = [
		{
			"featureType": "all",
			"elementType": "all",
			"stylers": [{"invert_lightness": true},
			{"saturation": 10},
			{ "lightness": 30},
			{"gamma": 0.5},
			{ "hue": "#435158"}
			]
		}
		];

		spoticka.map = new google.maps.Map($('#map')[0], {
			zoom: 10,
			center: new google.maps.LatLng(37.703292, -113.131591),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
			zoomControl: true,
			styles: dark1
		});
	},
	initializeBountyMap:function(){
		map = new google.maps.Map($('#chooseBountyMap')[0], {
				zoom: 10,
				center: new google.maps.LatLng(37.703292, -113.131591),
				mapTypeId: google.maps.MapTypeId.HYBRID,
				disableDefaultUI: true,
				zoomControl: true,
				styles: [
							{
								"featureType": "all",
								"elementType": "all",
								"stylers":
									[{"invert_lightness": true},
									{"saturation": 10},
									{ "lightness": 30},
									{"gamma": 0.5},
									{ "hue": "#435158"}
									]
							}
						]
		});
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(37.703292, -113.131591),
			map: map,
			animation: google.maps.Animation.DROP,
			draggable: true,
			icon: {
				url: 'images/pins/fire.png',
			}
		});
		google.maps.event.addListener( marker, 'dragend', function( e ) {
			var pos = marker.getPosition();
			var coords = pos.lat()+","+pos.lng();
			$('.bountyCoordinates').text(coords);
			$('#bountyRegisterCoordinates').val(coords);
		});


	},
}


//functions
var myresize = function(){
	var mapHeight = $(window).height();

	$('.innerMapWrap').css({"height":mapHeight});
	$('body').css({'width':'100%', 'height':'100%'});
	//$('.nav').css({'top':$(window).height()-$('.nav').height()})
}

var initiate_geolocation = function() {
	navigator.geolocation.getCurrentPosition(handle_geolocation_query);
}

var handle_geolocation_query = function(position){
	alert('Lat: ' + position.coords.latitude + ' ' +
		'Lon: ' + position.coords.longitude);
}

var showLoginPage = function(){
	$('.loginPageWrap').slideDown().addClass("currentPage");
}

var showRegisterPage = function(){
	$('.registerPageWrap').slideDown().addClass("currentPage");
}

var showEventDetailsPage = function(){
	console.log('hello');
	$('.eventDetailsPageWrap').slideDown().addClass("currentPage");
}

var showCreateBountyPage = function(){
	$('.createBountyPageWrap').slideDown(function(){
		spoticka.initializeBountyMap();
	}).addClass("currentPage");
}

var showMyBadgesPage = function(){
	$('.myBadgesPageWrap').slideDown().addClass("currentPage");
}

var showHome = function(){
	$('.currentPage').slideUp().removeClass('currentPage');
}

var getLocation = function(){
	navigator.geolocation.getCurrentPosition(showLocation);
}

var showLocation = function(position){
	//console.log(position);
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;

	$.each(spoticka.events, function(i, bounty){
		if(Math.abs(lat - bounty.position.lat) < .01 && Math.abs(lng - bounty.position.lng) < .01){
			//console.log("Youre at "+bounty.name);
			//console.log(bounty.coordinates);
			bounty.marker.setAnimation(google.maps.Animation.BOUNCE);
			spoticka.atCurrentBounty = spoticka.events[i];
			spoticka.showPopup(i, true);
		}
		else {
			bounty.marker.setAnimation(null);
		}
	})

	//console.log('Lat: ' + position.coords.latitude + ' ' +'Lon: ' + position.coords.longitude);
}

var geocheck = setInterval(getLocation, 3000);





$(document).ready(function(){
	//***   EVENTS   ***//

	$(window).resize(function(){
		myresize();
		var box = $('.mapBountyDetails');
		box.hide();
		box.css({'left':($(window).width()/2)-box.width()/2});
	});

	// on infowindow open
	$('body').on('load', '.bounty_content', function(){
		console.log('hello');
		$(this).css({"background-color":"#444"});
		$(this).parent().css({"background-color":"#444"});
	});

	$('.getCoordinates').click(function(){
		initiate_geolocation();
	});

	$('.mapOverlay').click(function(){
		$(this).hide();
		$('.mapBountyDetails').hide();
	});

	$('.loginBtn').click(function(){
		showLoginPage();
	});

	$('.registerBtn').click(function(){
		showRegisterPage();
	});

	$('.createBountyBtn').click(function(){
		console.log('hello?');
		showCreateBountyPage();
	});

	$('.myBadgesBtn').click(function(){
		console.log('show my badges');
		showMyBadgesPage();
	});

	$('.showEventDetailsBtn').click(function(){
		showEventDetailsPage();
	});

	$('.closeBtn').click(function(){
		showHome();
	});

	$('.fbLogin').click(function(){
		fbUser.fbLogin();
	})

	$('.loginWithoutFb').click(function(){
		$(this).hide();
		$('.noFbLogin').slideDown();
	});

	$('#submitEvent').click(function(){
		spoticka.submitEvent();
	});

	$('.claimBadgeBtn').click(function(){
		var claimedBadge = $(this).closest(".mapBountyDetails").attr("data-bounty");
		var claimedBadge = spoticka.badges[claimedBadge];
		spoticka.addBadgeToUser(claimedBadge);
	})

	$('body').on('click','.badgeBox', function(){
		$(this).siblings().removeClass("current");
		$(this).addClass("current");
		$('#bountyRegisterBadgeName').val($(this).attr("data-badge"));
	});

	/*$('#datetimepicker1').datetimepicker({
  		language: 'pt-BR'
  	});*/




	//start up
	myresize();
	$('#map').css({"width": "100%", "height": "100%"});
	$('#chooseBountyMap').css({width: '100%', 'height':200});
	spoticka.initializeMap();
	spoticka.getAllBadges();
	spoticka.getAllEvents();






});
