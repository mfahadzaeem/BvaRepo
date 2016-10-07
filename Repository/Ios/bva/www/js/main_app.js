var app = angular.module('bva_module', ['ionic', 'ngCordova']);

app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {


	$stateProvider.state('calendar', {
		cache: false,
		url: '/calendar',
		templateUrl: 'templates/calendar.html'
	});


	$stateProvider.state('settings', {
		cache: false,
		url: '/settings',
		templateUrl: 'templates/settings.html'
	});


	$stateProvider.state('contact', {
		cache: false,
		url: '/contact',
		templateUrl: 'templates/contact.html'
	});

	$stateProvider.state('exit', {
		cache: false,
		url: '/exit',
		templateUrl: 'templates/exit.html'
	});

	$stateProvider.state('tempAlert', {
		cache: false,
		url: '/tempAlert',
		templateUrl: 'templates/tempAlert.html'
	});

	$stateProvider.state('feeds', {
		cache: false,
		url: '/feeds',
		templateUrl: 'templates/feeds.html'
	});

	$stateProvider.state('wifi', {
		cache: false,
		url: '/wifi',
		templateUrl: 'templates/wifi.html'
	});

	$stateProvider.state('alerts', {
		cache: false,
		url: '/alerts',
		templateUrl: 'templates/alerts.html'
	});

	$ionicConfigProvider.views.swipeBackEnabled(false);
	/*$urlRouterProvider.otherwise('/alerts');*/
}); // end of config



app.controller('AlertTempCtrl', function ($scope) {
	var url = "main_app.html#/alerts";
	$(location).attr("href", url);
}); // end of AlertTempCtrl controller

app.controller('ExitCtrl', function ($scope, $ionicNavBarDelegate, $ionicPopup) {
	localStorage.setItem("exitApp", "yes");
	localStorage.setItem("main_app_module_page", "main_app.html#/exit");

	$ionicNavBarDelegate.showBackButton(false);
}); // end of ExitCtrl controller

app.controller('ContactCtrl', function ($scope, $cordovaNetwork, $rootScope, $state, $http, $interval, $ionicPopup) {
	//localStorage.setItem("old_alerts_length", localStorage.getItem("new_alerts_length1"));

	localStorage.setItem("main_app_module_page", "main_app.html#/contact");

	$scope.goAlerts = function () {
		localStorage.setItem("old_alerts_length", localStorage.getItem("new_alerts_length"));
		var url = "main_app.html#/alerts";
		$(location).attr("href", url);
	};


	if (
		(localStorage.getItem("cancel_registration") !== null) &&
		(localStorage.getItem("main_app_module_page") == "main_app.html#/contact")

	) {
		var url = "main_app.html#/exit";
		$(location).attr("href", url);
		/*var alertPopup = $ionicPopup.alert({
			title: 'Alert!',
			template: 'You have REGISTERED on new device. Kindly uninstall this application'
		});
		alertPopup.then(function (res) {
			ionic.Platform.exitApp();
		});*/

		/*alert("You have REGISTERED on new device. Kindly uninstall this application");
		ionic.Platform.exitApp();*/
	}


	////////// start of reg check
	$.ajax({
		url: "http://110.93.225.42/wp-content/mobile-app/check_reg.php",
		type: "post",
		data: {
			phoneNumber: localStorage.getItem("phoneNumber"),
			token: localStorage.getItem("token")
		},
		success: function (result) {
			console.log('reg checking success  block');
			if (result.match(/not_found/g)) {
				localStorage.setItem("cancel_registration", "cancel_done");

				var url = "main_app.html#/exit";
				$(location).attr("href", url);
				/*var alertPopup = $ionicPopup.alert({
					title: 'Alert!',
					template: 'You have REGISTERED on new device. Kindly uninstall this application'
				});
				alertPopup.then(function (res) {
					ionic.Platform.exitApp();
				});*/

				/*alert("You have REGISTERED on new device. Kindly uninstall this application");
				ionic.Platform.exitApp();*/
			} // end of if				
		},
		error: function (result) {
			console.log('reg checking error block');
		}
	});
	////////// end of reg check



	document.addEventListener("deviceready", function () {

		$scope.isOnline = $cordovaNetwork.isOnline();

		if (!$scope.isOnline) {
			//	alert('Please Connect your Wifi to proceed further');
			$('.cant-load').show();
			localStorage.setItem("wifiState", "false");
		} else {
			$('.cant-load').hide();
			localStorage.setItem("wifiState", "true");
		}
		$scope.$apply();


		$rootScope.$on('$cordovaNetwork:online', function (event, networkState) {

			$scope.isOnline = true;
			$('.cant-load').hide();
			localStorage.setItem("wifiState", "true");
			console.log(localStorage.getItem("wifiState") + "in online function");
			$scope.$apply();

		});


		$rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {

			$scope.isOnline = false;
			$('.cant-load').show();
			localStorage.setItem("wifiState", "false");
			console.log(localStorage.getItem("wifiState") + "in offline mode");
			$scope.$apply();
		});

	}, false);


	$scope.init = function () {
		localStorage.setItem("main_app_module_page", "main_app.html#/contact");
		localStorage.setItem("rcv_feeds", "no");
	}; // end of init function

	var old_alerts_length = null;
	var parse_old_alerts_length = null;

	var new_alerts_length = null;
	var parse_new_alerts_length = null;

	var promise;

	$scope.start = function () {
		console.log('function timer to check alerts');
		$scope.stop();
		if (localStorage.getItem("wifiState") == "true") {
			promise = $interval(getAlertsLength, 10000);
		}
	};


	$scope.stop = function () {
		$interval.cancel(promise);
	};

	$scope.$on('$destroy', function () {
		$scope.stop();
	});



	function getAlertsLength() {
		$.ajax({

			url: "http://110.93.225.42/wp-content/mobile-app/notifications-length.php",
			type: "post",
			data: {
				phoneNumber: localStorage.getItem("phoneNumber")
			},
			success: function (response) {
				console.log(response);
				localStorage.setItem("new_alerts_length", response);
			},

			error: function (result) {
				//	alert("Ohps Something went Wrong");
				console.log('in contact page of getting alerts length');
			}
		}); // end of ajax call

		old_alerts_length = localStorage.getItem('old_alerts_length');
		parse_old_alerts_length = parseInt(old_alerts_length);

		new_alerts_length = localStorage.getItem('new_alerts_length');
		parse_new_alerts_length = parseInt(new_alerts_length);

		if (parse_new_alerts_length > parse_old_alerts_length) {
			$scope.alertsPopUp = parse_new_alerts_length - parse_old_alerts_length;
			$scope.toggle_alerts = true;
			console.log(parse_new_alerts_length - parse_old_alerts_length);
		} // end of if block
		else {
			$scope.alertsPopUp = null;
			$scope.toggle_alerts = false;
			console.log('alerts not updated.. else block');

		} // end of else block



	} // end of get alerts length function

	$scope.start();

}); // end of ContactCtrl controller


app.controller('SettingCtrl', function ($scope, $cordovaNetwork, $rootScope, $state, $http, $interval, $ionicPopup) {

	//localStorage.setItem("old_alerts_length", localStorage.getItem("new_alerts_length1"));

	localStorage.setItem("main_app_module_page", "main_app.html#/settings");

	$scope.goAlerts = function () {
		localStorage.setItem("old_alerts_length", localStorage.getItem("new_alerts_length"));
		var url = "main_app.html#/alerts";
		$(location).attr("href", url);
	};

	if (
		(localStorage.getItem("cancel_registration") !== null) &&
		(localStorage.getItem("main_app_module_page") == "main_app.html#/settings")

	) {
		var url = "main_app.html#/exit";
		$(location).attr("href", url);
		/*var alertPopup = $ionicPopup.alert({
			title: 'Alert!',
			template: 'You have REGISTERED on new device. Kindly uninstall this application'
		});
		alertPopup.then(function (res) {
			ionic.Platform.exitApp();
		});*/
		/*alert("You have REGISTERED on new device. Kindly uninstall this application");
		ionic.Platform.exitApp();*/
	}

	////////// start of reg check
	$.ajax({
		url: "http://110.93.225.42/wp-content/mobile-app/check_reg.php",
		type: "post",
		data: {
			phoneNumber: localStorage.getItem("phoneNumber"),
			token: localStorage.getItem("token")
		},
		success: function (result) {
			console.log('reg checking success  block');
			if (result.match(/not_found/g)) {
				localStorage.setItem("cancel_registration", "cancel_done");
				var url = "main_app.html#/exit";
				$(location).attr("href", url);
				/*var alertPopup = $ionicPopup.alert({
					title: 'Alert!',
					template: 'You have REGISTERED on new device. Kindly uninstall this application'
				});
				alertPopup.then(function (res) {
					ionic.Platform.exitApp();
				});*/
				/*alert("You have REGISTERED on new device. Kindly uninstall this application");
				ionic.Platform.exitApp();*/
			} // end of if				
		},
		error: function (result) {
			console.log('reg checking error block');
		}
	});
	////////// end of reg check

	document.addEventListener("deviceready", function () {

		$scope.isOnline = $cordovaNetwork.isOnline();

		if (!$scope.isOnline) {
			//  alert('Please Connect your Wifi to proceed further');
			$('.cant-load').show();
			localStorage.setItem("wifiState", "false");
		} else {
			$('.cant-load').hide();
			localStorage.setItem("wifiState", "true");
		}
		$scope.$apply();


		$rootScope.$on('$cordovaNetwork:online', function (event, networkState) {

			$scope.isOnline = true;
			$('.cant-load').hide();
			localStorage.setItem("wifiState", "true");
			console.log(localStorage.getItem("wifiState") + "in online function");
			$scope.$apply();

		});


		$rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {

			$scope.isOnline = false;
			$('.cant-load').show();
			localStorage.setItem("wifiState", "false");
			console.log(localStorage.getItem("wifiState") + "in offline mode");
			$scope.$apply();
		});

	}, false);

	$scope.init = function () {
		localStorage.setItem("main_app_module_page", "main_app.html#/settings");
		localStorage.setItem("reg_completed", "yes");
		//	localStorage.setItem("from_settings","yes");
		localStorage.setItem("rcv_feeds", "no");


		localStorage.setItem("edit", "no");

	}; // end of init function

	// executes only once
	if ((localStorage.getItem("toggle") == "null") ||
		(localStorage.getItem("toggle") === null)) {
		$scope.facebook = true;
		$scope.twitter = true;
		localStorage.setItem("toggle", "false");
		localStorage.setItem("facebook_class", "active");
		localStorage.setItem("twitter_class", "active");

	}
	// this upper  block of code will executes only once	

	if (localStorage.getItem("facebook_class") == "active") {
		$('#facebook').addClass('active');
		$scope.facebook = true;

	}
	if (localStorage.getItem("facebook_class") == "deactive") {
		$('#facebook').removeClass('active');
		$scope.facebook = false;
	}
	if (localStorage.getItem("twitter_class") == "active") {
		$('#twitter').addClass('active');
		$scope.twitter = true;
	}
	if (localStorage.getItem("twitter_class") == "deactive") {
		$('#twitter').removeClass('active');
		$scope.twitter = false;
	}

	$scope.facebookFeeds = {
		checked: $scope.facebook

	};
	console.log("facebook " + $scope.facebookFeeds.checked);

	$scope.twitterFeeds = {
		checked: $scope.twitter
	};
	console.log("twitter " + $scope.twitterFeeds.checked);

	$('#facebook').on('click', function () {

		if (localStorage.getItem("wifiState") == "false") {
			//alert('Please connect your Wifi');
			var alertPopup = $ionicPopup.alert({
				title: 'Alert!',
				template: 'Please connect your Wifi'
			});

			return;
		}


		//	$scope.checkedBox = $('input[id="facebook_checkbox"]:checked');
		//if ($scope.checkedBox.length > 0) {
		if (localStorage.getItem("facebook_class") == "active") {
			console.log("uncheck karo");
			localStorage.setItem("facebook_class", "deactive");
			$scope.facebook = false;
			$scope.facebookFeeds.checked = $scope.facebook;
			$('#facebook').removeClass('active');
			console.log("in click event of facebook to deactivate" + $scope.facebookFeeds.checked);
			console.log("in click event of facebook to deactivate " + $scope.twitterFeeds.checked);
			Change();
		} // end of if
		else {
			console.log("check karo");
			$scope.facebook = true;
			$scope.facebookFeeds.checked = $scope.facebook;
			$('#facebook').addClass('active');
			console.log("in click event of facebook to activate" + $scope.facebookFeeds.checked);
			console.log("in click event of facebook to activate " + $scope.twitterFeeds.checked);
			Change();
		} // end of else
	});

	$('#twitter').on('click', function () {

		if (localStorage.getItem("wifiState") == "false") {

			//alert('Please connect your Wifi');

			var alertPopup = $ionicPopup.alert({
				title: 'Alert!',
				template: 'Please connect your Wifi'
			});



			return;
		}
		//$scope.checkedBox = $('input[id="twitter_checkbox"]:checked');
		//if ($scope.checkedBox.length > 0) {
		if (localStorage.getItem("twitter_class") == "active") {
			console.log("uncheck karo");
			$scope.twitter = false;
			$scope.twitterFeeds.checked = $scope.twitter;
			$('#twitter').removeClass('active');
			console.log("in click event of twitter to deactivate" + $scope.facebookFeeds.checked);
			console.log("in click event of twitter to deactivate " + $scope.twitterFeeds.checked);
			Change();
		} // end of if
		else {
			console.log("check karo");
			$scope.twitter = true;
			$scope.twitterFeeds.checked = $scope.twitter;
			$('#twitter').addClass('active');
			console.log("in click event of twitter to activate" + $scope.facebookFeeds.checked);
			console.log("in click event of twitter to activate " + $scope.twitterFeeds.checked);
			Change();
		} // end of else

	});

	var Change = function () {

		if (($scope.facebookFeeds.checked === true) && ($scope.twitterFeeds.checked === true)) {
			localStorage.setItem("facebook_class", "active");
			localStorage.setItem("twitter_class", "active");
			postRequest("facebook_yes", "twitter_yes");

		} //end of if 


		if (($scope.facebookFeeds.checked === true) && ($scope.twitterFeeds.checked === false)) {
			localStorage.setItem("facebook_class", "active");
			localStorage.setItem("twitter_class", "deactive");
			postRequest("facebook_yes", "twitter_no");

		} //end of if 



		if (($scope.facebookFeeds.checked === false) && ($scope.twitterFeeds.checked === true)) {
			localStorage.setItem("facebook_class", "deactive");
			localStorage.setItem("twitter_class", "active");
			postRequest("facebook_no", "twitter_yes");

		} //end of if 


		if (($scope.facebookFeeds.checked === false) && ($scope.twitterFeeds.checked === false)) {
			localStorage.setItem("facebook_class", "deactive");
			localStorage.setItem("twitter_class", "deactive");
			postRequest("facebook_no", "twitter_no");

		} //end of if
	};

	var postRequest = function (feedToggleFacebook, feedToggleTwitter) {

		$.ajax({

			url: "http://110.93.225.42/wp-content/mobile-app/toggle.php",
			type: "post",
			data: {
				phoneNumber: localStorage.getItem("phoneNumber"),
				facebook: feedToggleFacebook,
				twitter: feedToggleTwitter
			},
			success: function (response) {
				if (localStorage.getItem("facebook_class") == "active") {
					$('#facebook').addClass('active');
					$scope.facebook = true;

				}
				if (localStorage.getItem("facebook_class") == "deactive") {
					$('#facebook').removeClass('active');
					$scope.facebook = false;
				}
				if (localStorage.getItem("twitter_class") == "active") {
					$('#twitter').addClass('active');
					$scope.twitter = true;
				}
				if (localStorage.getItem("twitter_class") == "deactive") {
					$('#twitter').removeClass('active');
					$scope.twitter = false;
				}
				console.log("in response of settings");
				if (localStorage.getItem("main_app_module_page") == "main_app.html#/settings") {
					$state.go('settings');
				}


			},
			error: function (result) {
				console.log("Ohps Something went Wrong in toggling function of settings page");
			}
		}); // end of ajax request
	}; // end of function

	$scope.campus = localStorage.getItem("campus_name");
	$scope.checked_classes = localStorage.getItem("checked_classes").toString().split(','); // value without campus
	$scope.classes = [];
	var length_class = localStorage.getItem("class_length");

	$scope.ids = [];
	for (var i = 0; i < length_class; i++) {
		if ($scope.checked_classes[i] !== "") {
			$scope.classes[i] = $scope.checked_classes[i];
			$scope.classes[i] = $scope.classes[i].replace("Class ", "");
			//console.log($scope.checked_classes[i]);
			$scope.ids[i] = i;
			//	console.log($scope.ids[i]);

		}

	}
	var old_alerts_length = null;
	var parse_old_alerts_length = null;

	var new_alerts_length = null;
	var parse_new_alerts_length = null;

	var promise;

	$scope.start = function () {
		$scope.stop();
		if (localStorage.getItem("wifiState") == "true") {
			promise = $interval(getAlertsLength, 10000);
		}
	};

	$scope.stop = function () {
		$interval.cancel(promise);
	};

	$scope.$on('$destroy', function () {
		$scope.stop();
	});

	function getAlertsLength() {
		$.ajax({

			url: "http://110.93.225.42/wp-content/mobile-app/notifications-length.php",
			type: "post",
			data: {
				phoneNumber: localStorage.getItem("phoneNumber")
			},
			success: function (response) {
				console.log(response);
				localStorage.setItem("new_alerts_length", response);
			},

			error: function (result) {
				$('#loading-image').hide();
				//	alert("Ohps Something went Wrong");
				console.log('in contact page of getting alerts length');
			}
		}); // end of ajax call

		old_alerts_length = localStorage.getItem('old_alerts_length');
		parse_old_alerts_length = parseInt(old_alerts_length);

		new_alerts_length = localStorage.getItem('new_alerts_length');
		parse_new_alerts_length = parseInt(new_alerts_length);

		if (parse_new_alerts_length > parse_old_alerts_length) {
			$scope.alertsPopUp = parse_new_alerts_length - parse_old_alerts_length;
			$scope.toggle_alerts = true;
			console.log(parse_new_alerts_length - parse_old_alerts_length);
		} // end of if block
		else {
			$scope.alertsPopUp = null;
			$scope.toggle_alerts = false;
			console.log('alerts not updated.. else block');

		} // end of else block
	} // end of get alerts length function
	$scope.start();


}); // end of SettingCtrl controller


app.controller('FeedsCtrl', function ($scope, $cordovaNetwork, $rootScope, $state, $http, $interval, $timeout, $ionicModal, $ionicPopup) {
	//localStorage.setItem("old_alerts_length", localStorage.getItem("new_alerts_length1"));
	// localStorage.setItem("check_value", "true");
	if (localStorage.getItem("exitApp") == "yes") {
		var url = "main_app.html#/exit";
		$(location).attr("href", url);
	}
	$scope.goAlerts = function () {
		localStorage.setItem("old_alerts_length", localStorage.getItem("new_alerts_length"));
		var url = "main_app.html#/alerts";
		$(location).attr("href", url);
	};
	localStorage.setItem("notiClick", "yes");

	localStorage.setItem("main_app_module_page", "main_app.html#/feeds");
	console.log('in feeds page');



	console.log('calling chaning view function');
	if (
		(localStorage.getItem("cancel_registration") !== null) &&
		(localStorage.getItem("main_app_module_page") == "main_app.html#/feeds")

	) {
		var url = "main_app.html#/exit";
		$(location).attr("href", url);

	}

	var old_alerts_length = null;
	var parse_old_alerts_length = null;

	var new_alerts_length = null;
	var parse_new_alerts_length = null;
	$scope.zoomMin = 1;
	$scope.showImages = function (imgLink) {
		localStorage.setItem("imgLink", imgLink);
		$scope.showModal('templates/gallery-zoomview.html');
	};

	$scope.showModal = function (templateUrl) {
		$ionicModal.fromTemplateUrl(templateUrl, {
			scope: $scope
		}).then(function (modal) {
			$scope.imgLink = localStorage.getItem("imgLink");
			$scope.modal = modal;
			$scope.modal.show();
		});
	};

	$scope.closeModal = function () {
		$scope.modal.hide();
		$scope.modal.remove();
	};

	function callAtTimeout() {
		console.log("Timeout occurred");
		// Configure/customize these variables.
		var showChar = 100; // How many characters are shown by default
		var ellipsestext = "...";
		var moretext = "Show more >";
		var lesstext = "Show less";


		$('.more').each(function () {
			var content = $(this).html();

			if (content.length > showChar) {

				var c = content.substr(0, showChar);
				var h = content.substr(showChar, content.length - showChar);

				var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

				$(this).html(html);
			}

		});

		$(".morelink").click(function () {
			if ($(this).hasClass("less")) {
				$(this).removeClass("less");
				$(this).html(moretext);
			} else {
				$(this).addClass("less");
				$(this).html(lesstext);
			}
			$(this).parent().prev().toggle();
			$(this).prev().toggle();
			return false;
		});
		$(".imgLiquidFill").imgLiquid();
	}
	var showChar = 100; // How many characters are shown by default
	var ellipsestext = "...";
	var moretext = "Show more >";
	var lesstext = "Show less";
	var records = angular.fromJson(window.localStorage['records'] || '[]');

	var persist = function () {
		window.localStorage['records'] = angular.toJson(records);
	};
	$scope.checked_classes = localStorage.getItem("checked_classes").toString().split(','); // value without campus
	var checked_class_name = localStorage.getItem("checked_class_name").toString().split(','); //name with campus
	var class_length = localStorage.getItem("class_length");
	var campus_name = localStorage.getItem("campus_name");

	console.log($scope.checked_classes); // value without campus
	console.log(checked_class_name); //name with campus
	console.log(class_length);
	console.log(campus_name);
	var tok = "";
	localStorage.setItem("reg_completed", "yes");



	$scope.init = function () {




		localStorage.setItem("reg_completed", "yes");

		localStorage.setItem("main_app_module_page", "main_app.html#/feeds");
		if (localStorage.getItem("wifiState") == "false") {
			$('.cant-load').show();
			callAtTimeout();
			$scope.feeds = records;
			$('#loading-image').hide();
			return;
		}
		fetching();

		if (parse_new_alerts_length > parse_old_alerts_length) {
			$scope.alertsPopUp = parse_new_alerts_length - parse_old_alerts_length;
			$scope.toggle_alerts = true;
			console.log(parse_new_alerts_length - parse_old_alerts_length);
		} // end of if block
		else {
			$scope.alertsPopUp = null;
			$scope.toggle_alerts = false;
			console.log('alerts not updated.. else block');

		} // end of else block


	}; // end of init func


	$scope.edit = function () {
		if (localStorage.getItem("wifiState") == "false") {
			//alert('');

			var alertPopup = $ionicPopup.alert({
				title: 'Alert!',
				template: 'Please Connect your Wifi'
			});

			return;
		}
		/////////////////////////
		localStorage.setItem("edit", "yes");
		if ((localStorage.getItem("rcv_feeds") == "yes")) {
			//localStorage.setItem("main_app_module_page", "main_app.html#/feeds");
			localStorage.setItem("main_app_module_page", "none");
			localStorage.setItem("from_settings", "none");
			localStorage.setItem("reg_completed", "yes");
			localStorage.setItem("edit", "no");
			//	localStorage.setItem("rcv_feeds", "no");
			//	localStorage.setItem("edit", "no");

			localStorage.setItem("from_feeds", "yes");
			localStorage.setItem("login_module_page", "index.html#/campusAndClasses");
			var url = "index.html#/campusAndClasses";
			$(location).attr("href", url);
		}
	}; // end of edit function


	// calling the if block 
	if ((localStorage.getItem('getAlertsLengthOnce') === null) ||
		(localStorage.getItem('getAlertsLengthOnce') == "null")
	) {
		localStorage.setItem('getAlertsLengthOnce', 'notNull');
		$.ajax({

			url: "http://110.93.225.42/wp-content/mobile-app/notifications-length.php",
			type: "post",
			data: {
				phoneNumber: localStorage.getItem("phoneNumber")
			},
			success: function (response) {
				console.log(response);
				localStorage.setItem("old_alerts_length", response);
			},

			error: function (result) {
				//	alert("Ohps Something went Wrong");
				console.log('in contact page of getting alerts length');
			}
		}); // end of ajax call
	} // end of if block


	var fetching = function () {
		console.log('calling fetching');
		$('#loading-image').show();




		/////// fetching calendar feeds
		$.ajax({

			url: "http://110.93.225.42/wp-content/mobile-app/calendar-fetching.php",
			type: "get",
			success: function (response) {

				if (response.length > 0) {
					var calendar_records = jQuery.parseJSON(response);
					window.localStorage['calendar_records'] = angular.toJson(calendar_records);

					/*if (localStorage.getItem("main_app_module_page") == "main_app.html#/calendar") {
						$state.go('calendar');
					}*/
					//	$('#loading-image').hide();
					console.log("in response");
				}
			},

			error: function (result) {
				//	alert("Ohps Something went Wrong");
				$('#loading-image').hide();
				console.log('in calendar fetching from feeds page');
			}
		});
		/////// end of feeds fetching

		///////////// feeds fetching

		$('#loading-image').show();
		$.ajax({

			url: "http://110.93.225.42/wp-content/mobile-app/feeds-fetching.php",
			type: "post",
			data: {
				phoneNumber: localStorage.getItem("phoneNumber")
			},
			success: function (response) {

				records = jQuery.parseJSON(response);
				persist();
				$scope.feeds = records;
				console.log(records);

				localStorage.setItem("rcv_feeds", "yes");
				if (localStorage.getItem("main_app_module_page") == "main_app.html#/feeds") {
					$state.go('feeds');
				}
				if (localStorage.getItem("edit") == "yes") {
					localStorage.setItem("edit", "no");
					localStorage.setItem("main_app_module_page", "none");
					localStorage.setItem("from_settings", "none");
					localStorage.setItem("rcv_feeds", "yes");


					localStorage.setItem("from_feeds", "yes");
					localStorage.setItem("login_module_page", "index.html#/campusAndClasses");
					var url = "index.html#/campusAndClasses";
					$(location).attr("href", url);
				}
				//	callAtTimeout();
				// http://code-tricks.com/jquery-read-more-less-example/
				$timeout(callAtTimeout, 0.1);



				$('#loading-image').hide();


			},

			error: function (result) {
				//	alert("Ohps Something went Wrong");
				$('#loading-image').hide();
				console.log('in feeds fetching from feeds page');


			}
		});

		/////////////// end of feeds fetching

		////////// start of reg check

		$.ajax({
			//url: "http://110.93.225.42/wp-content/mobile-app/check-reg.php",
			url: "http://110.93.225.42/wp-content/mobile-app/check_reg.php",
			type: "post",
			data: {
				phoneNumber: localStorage.getItem("phoneNumber"),
				token: localStorage.getItem("token")

			},
			success: function (result) {
				console.log('reg checking success  block');

				if (result.match(/not_found/g)) {
					localStorage.setItem("cancel_registration", "cancel_done");
					var url = "main_app.html#/exit";
					$(location).attr("href", url);

				} // end of if				
			},
			error: function (result) {
				console.log('reg checking error block');
			}
		});


		////////// end of reg check

	}; // end of fetching function




	document.addEventListener("deviceready", function () {


		//// start of wifi work
		$scope.isOnline = $cordovaNetwork.isOnline();

		if (!$scope.isOnline) {
			//	alert('Please Connect your Wifi to proceed further');
			$('.cant-load').show();
			localStorage.setItem("wifiState", "false");
		} else {
			$scope.feeds = records;
			$('.cant-load').hide();
			localStorage.setItem("wifiState", "true");
		}
		$scope.$apply();


		$rootScope.$on('$cordovaNetwork:online', function (event, networkState) {

			$scope.isOnline = true;
			$('.cant-load').hide();
			localStorage.setItem("wifiState", "true");
			console.log(localStorage.getItem("wifiState") + "in online function");
			$scope.$apply();
			fetching();

		})


		$rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {

			$scope.isOnline = false;
			$('.cant-load').show();
			localStorage.setItem("wifiState", "false");
			$scope.feeds = records;
			console.log(localStorage.getItem("wifiState") + "in offline mode");
			$scope.$apply();

		})



		////// end of wifi work

		/*window.plugins.PushbotsPlugin.on('notification:clicked', function (data) {
			$state.go('alerts');
		});*/
		if (localStorage.getItem("check_value") == "true") {
			window.plugins.PushbotsPlugin.initialize("571883454a9efa755a8b4567", {
				"android": {
					"sender_id": "74357977182"
				}
			});

			window.plugins.PushbotsPlugin.on("registered", function (token) {
				console.log(token + "our rcv token");
				localStorage.setItem("token", token);
				tok = token;
				$.ajax({

					url: "http://110.93.225.42/wp-content/mobile-app/tag.php",
					type: "post",
					data: {
						token: tok,
						phoneNumber: localStorage.getItem("phoneNumber")
							//tag: checked_class_name
					},
					success: function (response) {
						localStorage.setItem("check_value", "false");
						console.log("ok");
					},

					error: function (result) {
						console.log("not ok");


					}
				});

			});
		} // end of if 
		window.plugins.PushbotsPlugin.on("notification:received", function (data) {
			console.log("received");
			//     var alertPopup = $ionicPopup.alert({
			//  title: 'Alert!',
			//   template: 'rcv'
			// });
			localStorage.setItem("alertLengthGetter", "false");
			localStorage.setItem("notiClick", "yes");
		});
		window.plugins.PushbotsPlugin.on('notification:clicked', function (data) {
			//$state.go('alerts');
			//   var alertPopup = $ionicPopup.alert({
			//    title: 'Alert!',
			//   template: 'click'
			//   });
			console.log("clicked");
			localStorage.setItem("alertLengthGetter", "true");
			if (localStorage.getItem("notiClick") == "yes") {
				var url = "main_app.html#/alerts";
				$(location).attr("href", url);
			}

		});
	}, false);






	var promise;

	$scope.start = function () {
		$scope.stop();
		if (localStorage.getItem("wifiState") == "true") {
			promise = $interval(getAlertsLength, 10000);
		}
	};


	$scope.stop = function () {
		$interval.cancel(promise);
	};

	$scope.$on('$destroy', function () {
		$scope.stop();
	});



	function getAlertsLength() {
		$.ajax({

			url: "http://110.93.225.42/wp-content/mobile-app/notifications-length.php",
			type: "post",
			data: {
				phoneNumber: localStorage.getItem("phoneNumber")
			},
			success: function (response) {
				console.log(response);
				localStorage.setItem("new_alerts_length", response);
			},

			error: function (result) {
				$('#loading-image').hide();
				console.log('in contact page of getting alerts length');
			}
		}); // end of ajax call

		old_alerts_length = localStorage.getItem('old_alerts_length');
		parse_old_alerts_length = parseInt(old_alerts_length);

		new_alerts_length = localStorage.getItem('new_alerts_length');
		parse_new_alerts_length = parseInt(new_alerts_length);

		if (parse_new_alerts_length > parse_old_alerts_length) {
			$scope.alertsPopUp = parse_new_alerts_length - parse_old_alerts_length;
			$scope.toggle_alerts = true;
			console.log(parse_new_alerts_length - parse_old_alerts_length);
		} // end of if block
		else {
			$scope.alertsPopUp = null;
			$scope.toggle_alerts = false;
			console.log('alerts not updated.. else block');

		} // end of else block



	} // end of get alerts length function





	$scope.start();









}); // end of FeedsCtrl controller


app.controller('AlertsCtrl', function ($scope, $cordovaNetwork, $rootScope, $state, $http, $interval, $ionicPopup) {

               
               
               
               
               // get alert length to show div bar
               function getAlertsLength2() {
               $.ajax({
                      
                      url: "http://110.93.225.42/wp-content/mobile-app/notifications-length.php",
                      type: "post",
                      data: {
                      phoneNumber: localStorage.getItem("phoneNumber")
                      },
                      success: function (response) {
                      console.log(response);
                      localStorage.setItem("new_alerts_length", response);
                      localStorage.setItem("old_alerts_length", response);
                      },
                      
                      error: function (result) {
                      
                      console.log('in alert page of getting alerts length');
                      }
                      }); // end of ajax call
               
               
               } // end of get alerts length function
               // end of get alert length to show div bar
               
               
               
               
               
	var old_alerts_length = null;
	var parse_old_alerts_length = null;

	var new_alerts_length = null;
	var parse_new_alerts_length = null;

	getAlertsLength2();
	// get alert length to show div bar
	function getAlertsLength1() {
		$.ajax({

			url: "http://110.93.225.42/wp-content/mobile-app/notifications-length.php",
			type: "post",
			data: {
				phoneNumber: localStorage.getItem("phoneNumber")
			},
			success: function (response) {
				console.log(response);
				localStorage.setItem("new_alerts_length", response);
			},

			error: function (result) {

				console.log('in alert page of getting alerts length');
			}
		}); // end of ajax call

		old_alerts_length = localStorage.getItem('old_alerts_length');
		parse_old_alerts_length = parseInt(old_alerts_length);

		new_alerts_length = localStorage.getItem('new_alerts_length');
		parse_new_alerts_length = parseInt(new_alerts_length);

		if (parse_new_alerts_length > parse_old_alerts_length) {

			$scope.toggle_alerts1 = true;
//localStorage.setItem("old_alerts_length", localStorage.getItem("new_alerts_length"));
			console.log(parse_new_alerts_length - parse_old_alerts_length);
		} // end of if block
		else {
			$scope.alertsPopUp = null;
			$scope.toggle_alerts1 = false;
			console.log('alerts not updated.. else block');

		} // end of else block



	} // end of get alerts length function
	// end of get alert length to show div bar
	/////////////////////////////////////////


	console.log('alerts page');
	$scope.goAlerts = function () {

		localStorage.setItem("old_alerts_length", localStorage.getItem("new_alerts_length"));

		var url = "main_app.html#/tempAlert";
		$(location).attr("href", url);
	};
	localStorage.setItem("main_app_module_page", "main_app.html#/alerts");
	//localStorage.setItem("old_alerts_length", localStorage.getItem("new_alerts_length"));
	localStorage.setItem("notiClick", "no");



	console.log("in alert page");
	if (
		(localStorage.getItem("cancel_registration") !== null) &&
		(localStorage.getItem("main_app_module_page") == "main_app.html#/alerts")

	) {
		var url = "main_app.html#/exit";
		$(location).attr("href", url);

	}


	////////// start of reg check
	$.ajax({
		url: "http://110.93.225.42/wp-content/mobile-app/check_reg.php",
		type: "post",
		data: {
			phoneNumber: localStorage.getItem("phoneNumber"),
			token: localStorage.getItem("token")
		},
		success: function (result) {
			console.log('reg checking success  block');
			if (result.match(/not_found/g)) {
				localStorage.setItem("cancel_registration", "cancel_done");
				var url = "main_app.html#/exit";
				$(location).attr("href", url);

			} // end of if				
		},
		error: function (result) {
			console.log('reg checking error block');
		}
	});
	////////// end of reg check
	//localStorage.setItem("old_alerts_length", localStorage.getItem("new_alerts_length"));



	var promise;

	$scope.start = function () {
		console.log('function timer to check alerts');
		$scope.stop();
		promise = $interval(alertsNotification, 4000);
	};


	$scope.stop = function () {
		$interval.cancel(promise);
	};

	$scope.$on('$destroy', function () {
		$scope.stop();
	});


	function alertsNotification() {

		getAlertsLength1();


		console.log("in fetching method to get alerts when notificaiton is rcv");
		if (localStorage.getItem("alertLengthGetter") == "false") {
			return;
		} else {
			$('#loading-image').show();

			///////////// alerts fetching
			$.ajax({

				url: "http://110.93.225.42/wp-content/mobile-app/notifications-fetching.php",
				type: "post",
				data: {
					phoneNumber: localStorage.getItem("phoneNumber")
				},
				success: function (response) {

					alerts = jQuery.parseJSON(response);
					persist();
					$scope.notifications = alerts;
					console.log(alerts);
					$('#loading-image').hide();
					if (localStorage.getItem("main_app_module_page") == "main_app.html#/alerts") {
						$state.go('alerts');
					}
					$scope.notifications = alerts;
					//localStorage.setItem("old_alerts_length", localStorage.getItem("new_alerts_length"));
					localStorage.setItem("alertLengthGetter", "false");


				},

				error: function (result) {
					$('#loading-image').hide();
					//	alert("Ohps Something went Wrong");
				}
			});
			//localStorage.setItem("old_alerts_length", localStorage.getItem("new_alerts_length"));
			localStorage.setItem("alertLengthGetter", "false");
		}
		/////////////// end of feeds fetching

	} // end of alertsNotification function



	var alerts = angular.fromJson(window.localStorage['alerts'] || '[]');
	$scope.notifications = alerts;
	var persist = function () {
		window.localStorage['alerts'] = angular.toJson(alerts);
	};

	$scope.init = function () {
		console.log("in alert page init method");
		localStorage.setItem("main_app_module_page", "main_app.html#/alerts");
		localStorage.setItem("rcv_feeds", "no");
		localStorage.setItem("reg_completed", "yes");
		localStorage.setItem("old_alerts_length", localStorage.getItem("new_alerts_length"));

		if (localStorage.getItem("wifiState") == "false") {
			$scope.notifications = alerts;
			return;
		}


		fetching();
		$scope.notifications = alerts;

	};



	var fetching = function () {

		console.log("in fetching method to get alerts");

		$('#loading-image').show();
		///////////// alerts fetching
		$.ajax({

			url: "http://110.93.225.42/wp-content/mobile-app/notifications-fetching.php",
			type: "post",
			data: {
				phoneNumber: localStorage.getItem("phoneNumber")
			},
			success: function (response) {

				alerts = jQuery.parseJSON(response);
				persist();
				$scope.notifications = alerts;
				console.log(alerts);
				$('#loading-image').hide();
				if (localStorage.getItem("main_app_module_page") == "main_app.html#/alerts") {
					$state.go('alerts');
				}
				$scope.notifications = alerts;


			},

			error: function (result) {
				$('#loading-image').hide();

			}
		});

		/////////////// end of alerts fetching
               
               
               
               getAlertsLength2();
               
               

	}; // end of alerts fetching function




	document.addEventListener("deviceready", function () {


		//// start of wifi work
		$scope.isOnline = $cordovaNetwork.isOnline();

		if (!$scope.isOnline) {

			$('.cant-load').show();
			localStorage.setItem("wifiState", "false");
		} else {
			$scope.notifications = alerts;
			$('.cant-load').hide();
			localStorage.setItem("wifiState", "true");
		}
		$scope.$apply();


		$rootScope.$on('$cordovaNetwork:online', function (event, networkState) {

			$scope.isOnline = true;
			$('.cant-load').hide();
			localStorage.setItem("wifiState", "true");
			console.log(localStorage.getItem("wifiState") + "in online function");
			$scope.$apply();
			fetching();

		});


		$rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {

			$scope.isOnline = false;
			$('.cant-load').show();
			localStorage.setItem("wifiState", "false");
			$scope.notifications = alerts;
			console.log(localStorage.getItem("wifiState") + "in offline mode");
			$scope.$apply();

		});

		////// end of wifi work

	}, false);
	$scope.start();

}); // end of AlertsCtrl controller

//////////////////////////////////////////////////////////////////////////////


app.controller('CalendarCtrl', function ($scope, $cordovaNetwork, $rootScope, $state, $http, $interval, $ionicPopup) {
	//localStorage.setItem("old_alerts_length", localStorage.getItem("new_alerts_length1"));
	$scope.goAlerts = function () {
		localStorage.setItem("old_alerts_length", localStorage.getItem("new_alerts_length"));
		var url = "main_app.html#/alerts";
		$(location).attr("href", url);
	};
	localStorage.setItem("main_app_module_page", "main_app.html#/calendar");

	if (
		(localStorage.getItem("cancel_registration") !== null) &&
		(localStorage.getItem("main_app_module_page") == "main_app.html#/calendar")

	) {
		var url = "main_app.html#/exit";
		$(location).attr("href", url);
		/*var alertPopup = $ionicPopup.alert({
			title: 'Alert!',
			template: 'You have REGISTERED on new device. Kindly uninstall this application'
		});
		alertPopup.then(function (res) {
			ionic.Platform.exitApp();
		});*/
		/*alert("You have REGISTERED on new device. Kindly uninstall this application");
		ionic.Platform.exitApp();*/
	}
	////////// start of reg check
	$.ajax({
		url: "http://110.93.225.42/wp-content/mobile-app/check_reg.php",
		type: "post",
		data: {
			phoneNumber: localStorage.getItem("phoneNumber"),
			token: localStorage.getItem("token")
		},
		success: function (result) {
			console.log('reg checking success  block');
			if (result.match(/not_found/g)) {
				localStorage.setItem("cancel_registration", "cancel_done");
				/*alert("You have REGISTERED on new device. Kindly uninstall this application");
				ionic.Platform.exitApp();*/
				var url = "main_app.html#/exit";
				$(location).attr("href", url);
				/*var alertPopup = $ionicPopup.alert({
									title: 'Alert!',
									template: 'You have REGISTERED on new device. Kindly uninstall this application'
								});
								alertPopup.then(function (res) {
									ionic.Platform.exitApp();
								});*/
			} // end of if				
		},
		error: function (result) {
			console.log('reg checking error block');
		}
	});
	////////// end of reg check
	document.addEventListener("deviceready", function () {

		$scope.isOnline = $cordovaNetwork.isOnline();

		if (!$scope.isOnline) {
			//alert('Please Connect your Wifi to proceed further');
			$('.cant-load').show();
			localStorage.setItem("wifiState", "false");
		} else {
			$('.cant-load').hide();
			localStorage.setItem("wifiState", "true");
		}
		$scope.$apply();


		$rootScope.$on('$cordovaNetwork:online', function (event, networkState) {

			$scope.isOnline = true;
			$('.cant-load').hide();
			localStorage.setItem("wifiState", "true");
			console.log(localStorage.getItem("wifiState") + "in online function");
			$scope.$apply();

		})


		$rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {

			$scope.isOnline = false;
			$('.cant-load').show();
			localStorage.setItem("wifiState", "false");
			console.log(localStorage.getItem("wifiState") + "in offline mode");
			$scope.$apply();
		})

	}, false);
	//localStorage.setItem("main_app_module_page", "main_app.html#/calendar");

	var j;
	$scope.init = function () {
			localStorage.setItem("main_app_module_page", "main_app.html#/calendar");
			localStorage.setItem("rcv_feeds", "no");
			localStorage.setItem("reg_completed", "yes");

			var d = new Date();

			var month = d.getMonth() + 1;
			var day = d.getDate();

			var current_date = d.getFullYear() + '-' +
				(('' + month).length < 2 ? '0' : '') + month + '-' +
				(('' + day).length < 2 ? '0' : '') + day;


			var calendar_records = angular.fromJson(window.localStorage['calendar_records'] || '[]');

			var persist = function () {
				window.localStorage['calendar_records'] = angular.toJson(calendar_records);
			};

			if (localStorage.getItem("wifiState") == "true") {
				$.ajax({

					url: "http://110.93.225.42/wp-content/mobile-app/calendar-fetching.php",
					type: "get",
					success: function (response) {

						if (response.length > 0) {
							calendar_records = jQuery.parseJSON(response);
							persist();
							if (localStorage.getItem("main_app_module_page") == "main_app.html#/calendar") {
								$state.go('calendar');
							}
							j = true;
							console.log("in response");

						}
					},

					error: function (result) {
						//	alert("Ohps Something went Wrong");
						console.log('in calendar fetching from calendar page');
					}
				});

			} // end of wifi state for true check






			$('#calendar').fullCalendar({
				header: {
					left: 'prev,next',
					center: 'title ',
					right: 'today'
				}, //defaultDate: '2016-04-04',
				defaultDate: current_date,
				editable: true,
				eventLimit: true, // allow "more" link when too many events
				/*events: [
					{
						title: 'Death Anniversary of Zulfiqar Ali Bhutto',
						start: '2016-04-04'
					},
					{
						title: 'Pakistan Day',
						start: '2016-03-23'
					},
					{
						title: 'Pakistan Day',
						start: '2016-01-01'
					}
					

				], */

				events: calendar_records,
				eventClick: function (event) {
					/*console.log(event.start);*/
					$("#dialog").dialog({
						title: JSON.stringify(event.start)
					}).dialog('open');


					$("#paragraph").html(event.title);

				}
			});
			jQuery("#dialog").dialog({
				autoOpen: false,
				modal: true,
				open: function () {
					jQuery('.ui-widget-overlay').bind('click', function () {
						jQuery('#dialog').dialog('close');
					})
				}
			});
			//$state.go('calendar');
			if (j === true) {
				j = false;
				var url = "main_app.html#/calendar";
				$(location).attr("href", url);
			}

		}
		/*if (localStorage.getItem("main_app_module_page") == "main_app.html#/calendar") {
						$state.go('calendar');
						}*/
	if (j === true) {
		j = false;
		$state.go('calendar');
	}

	var old_alerts_length = null;
	var parse_old_alerts_length = null;

	var new_alerts_length = null;
	var parse_new_alerts_length = null;


	var promise;

	$scope.start = function () {
		$scope.stop();
		if (localStorage.getItem("wifiState") == "true") {
			promise = $interval(getAlertsLength, 10000);
		}
	};


	$scope.stop = function () {
		$interval.cancel(promise);
	};

	$scope.$on('$destroy', function () {
		$scope.stop();
	});



	function getAlertsLength() {
		$.ajax({

			url: "http://110.93.225.42/wp-content/mobile-app/notifications-length.php",
			type: "post",
			data: {
				phoneNumber: localStorage.getItem("phoneNumber")
			},
			success: function (response) {
				console.log(response);
				localStorage.setItem("new_alerts_length", response);
			},

			error: function (result) {
				//	alert("Ohps Something went Wrong");
				$('#loading-image').hide();
				console.log('in contact page of getting alerts length');
			}
		}); // end of ajax call

		old_alerts_length = localStorage.getItem('old_alerts_length');
		parse_old_alerts_length = parseInt(old_alerts_length);

		new_alerts_length = localStorage.getItem('new_alerts_length');
		parse_new_alerts_length = parseInt(new_alerts_length);

		if (parse_new_alerts_length > parse_old_alerts_length) {
			$scope.alertsPopUp = parse_new_alerts_length - parse_old_alerts_length;
			$scope.toggle_alerts = true;
			console.log(parse_new_alerts_length - parse_old_alerts_length);
		} // end of if block
		else {
			$scope.alertsPopUp = null;
			$scope.toggle_alerts = false;
			console.log('alerts not updated.. else block');

		} // end of else block



	} // end of get alerts length function

	$scope.start();






}); // end of LoginCtrl controller


////////////////////////////////////////////////////////////////////////////////

app.run(function ($ionicPlatform, $ionicPopup) {
	$ionicPlatform.ready(function () {
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
		localStorage.setItem("check_value", "true");
		localStorage.setItem("check_value_alerts", "true");
		//localStorage.setItem("toggle", "true");

	});


	$ionicPlatform.onHardwareBackButton(function () {
		ionic.Platform.exitApp();
	});
});