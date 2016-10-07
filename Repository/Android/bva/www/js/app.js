var app = angular.module('bva', ['ionic', 'ngCordova']);

app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {


	$stateProvider.state('login', {
		cache: false,
		url: '/login',
		templateUrl: 'templates/login.html'
	});



	// http://loring-dodge.azurewebsites.net/ionic-item-expand/

	$stateProvider.state('temp', {
		cache: false,
		url: '/temp',
		templateUrl: 'templates/temp.html'
	});


	$stateProvider.state('pinCode', {

		cache: false,
		url: '/pinCode',
		templateUrl: 'templates/pin-code.html'
	});
	$stateProvider.state('campusAndClasses', {
		cache: false,
		url: '/campusAndClasses',
		templateUrl: 'templates/select-no-tab.html'
	});

	$ionicConfigProvider.views.swipeBackEnabled(false);
	$urlRouterProvider.otherwise('/temp');
}); // end of config

app.controller('TempCtrl', function ($scope, $cordovaNetwork, $rootScope, $state, $location, $ionicNavBarDelegate) {
	
	$('#loading-image').show();

	localStorage.setItem("fromLogin", "false");
	localStorage.setItem("fromTempToAlert", "true");
	var path = $location.path();
	console.log(path);
	if (path.indexOf('temp') != -1)
		$ionicNavBarDelegate.showBackButton(true);
	else
		$ionicNavBarDelegate.showBackButton(false);

	if (localStorage.getItem("cancel_registration") !== null) {
		var url = "main_app.html#/exit";
		$(location).attr("href", url);
	} else if (localStorage.getItem("reg_completed") == "yes") {
		$('#loading-image').show();
		if (localStorage.getItem("cancel_registration") !== null)
		{
			var url = "main_app.html#/exit";
			$(location).attr("href", url);
		}
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
				else

				{
					localStorage.setItem("main_app_module_page", "main_app.html#/feeds");
					//localStorage.setItem("check_value", "true");
					console.log('in reg completed block');
					var url = "main_app.html#/feeds";
					$('#loading-image').hide();
					$(location).attr("href", url);
				}
			},
			error: function (result) {
				console.log('reg checking error block');
			}
		});
		////////// end of reg check
	} else if ((localStorage.getItem("login_module_page") === null) || (localStorage.getItem("login_module_page") == "null")) {
		localStorage.setItem("login_module_page", "index.html#/login");
		console.log('in null block');
		var url = "index.html#/login";
		$(location).attr("href", url);
	} else if (localStorage.getItem("login_module_page") === "index.html#/pinCode") {
		localStorage.setItem("login_module_page", "index.html#/login");
		console.log('in pincode block');
		var url = "index.html#/login";
		$(location).attr("href", url);

	} else {

		var url = localStorage.getItem("login_module_page");
		console.log('in else block');
		$(location).attr("href", url);
	}


});

///////////////////////////////////////////////////////////////////////////
app.controller('LoginCtrl', function ($scope, $cordovaNetwork, $rootScope, $state, $location, $ionicNavBarDelegate, $ionicPopup) {



	localStorage.setItem("login_module_page", "index.html#/login");
	localStorage.setItem("fromLogin", "true");


	localStorage.setItem("login_module_page", "index.html#/login");
	var path = $location.path();
	console.log(path);
	if (path.indexOf('login') != -1)
		$ionicNavBarDelegate.showBackButton(false);
	else
		$ionicNavBarDelegate.showBackButton(true);

	document.addEventListener("deviceready", function () {

		$scope.isOnline = $cordovaNetwork.isOnline();

		if (!$scope.isOnline) {
			//alert('Please Connect your Wifi');
			var alertPopup = $ionicPopup.alert({
				title: 'Alert!',
				template: 'Please Connect your Wifi'
			});

			localStorage.setItem("wifiState", "false");
		} else {
			localStorage.setItem("wifiState", "true");
		}
		$scope.$apply();


		$rootScope.$on('$cordovaNetwork:online', function (event, networkState) {

			$scope.isOnline = true;
			//	alert('Wifi Connected');
			localStorage.setItem("wifiState", "true");
			console.log(localStorage.getItem("wifiState") + "in online function");
			$scope.$apply();

		})


		$rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {

			$scope.isOnline = false;
			localStorage.setItem("wifiState", "false");
			console.log(localStorage.getItem("wifiState") + "in offline mode");
			$scope.$apply();
		})

	}, false);



	var response;


	if (localStorage.getItem("reg_completed") == "yes") {
		localStorage.setItem("main_app_module_page", "main_app.html#/feeds");
		var url = "main_app.html#/feeds";
		$(location).attr("href", url);
	}



	if (localStorage.getItem("login_module_page") != "index.html#/login") {

		var url = localStorage.getItem("login_module_page");
		$(location).attr("href", url);
	} // end of if for checking local storage




	$scope.phoneNumber = "";
	$scope.init = function () {

		localStorage.setItem("login_module_page", "index.html#/login");
		$('#phoneNumber').bind("cut copy paste", function (e) {
			e.preventDefault();
		});

		$('#email').bind("cut copy paste", function (e) {
			e.preventDefault();
		});





		//////////////////////////////////////////////////////////


		$('#phoneNumber').keydown(function (event) {

			/*var length_phoneNumber = $(this).val().length;

			if (length_phoneNumber == 4)
				$(this).val($(this).val() + '-');
			if(length_phoneNumber > 4){
				length_phoneNumber = 0 ;
			}*/
			//allowing  backspace, tab, ctrl+A, escape, carriage return, right, left. ctrl+C
			if (event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || (event.keyCode == 65 && event.ctrlKey === true) || (event.keyCode == 67 && event.ctrlKey === true))
				return;
			if ((event.keyCode < 48 || (event.keyCode > 57 && event.keyCode < 96) || event.keyCode > 105) || event.keyCode == 20 || event.shiftKey === true)
				event.preventDefault();

			var length_phoneNumber = $(this).val().length;

			if (length_phoneNumber == 4)
				$(this).val($(this).val() + '-');

		});


		jQuery.validator.addMethod("pkPhoneFormat", function (value, element) {
			return this.optional(element) || /^\d{4}\-\d{1,11}$/.test(value);
		}, "Number Format : XXXX-XXXXXXX");


		$.validator.addMethod("emailFormat", function (value, element) {
			return this.optional(element) || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i.test(value);
			//return /^([a-zA-Z0-9_.\-+])+\@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/.test(value);
		}, "Please enter a valid email address.");
		/*http://jsbin.com/talaz/1/edit?html,output*/
		$("#myForm1").validate({

			rules: {
				phoneNumber: {
					required: true,
					pkPhoneFormat: true,
					minlength: 12
				},
				email: {
					required: true,
					email: true,
					emailFormat: true
				}
			},

			messages: {
				phoneNumber: {
					required: "please enter mobile number",
					minlength: "Enter Complete Phone Number"
				},
				email: {
					required: "Please enter email address",
					email: "Please enter a valid email address"
				}
			},

			submitHandler: function (form) {


				$('#loading-image').show();
				$('input[type="submit"]').prop('disabled', true);
				if (localStorage.getItem("wifiState") == "false") {
					$('input[type="submit"]').prop('disabled', false);
					//alert("Wifi not Connected");
					var alertPopup = $ionicPopup.alert({
						title: 'Alert!',
						template: 'Wifi not Connected'
					});

					$('#loading-image').hide();
					return;
				}




				$.ajax({
					url: form.action,
					type: form.method,
					data: $(form).serialize(),

					success: function (result) {
						$('#loading-image').hide();

						localStorage.setItem("phoneNumber", $('#phoneNumber').val());
						if (result.match(/no_error/g)) {
							localStorage.setItem("login_module_page", "index.html#/pinCode");
							$state.go('pinCode');
							console.log("ok");
						}
						if (result.match(/yes_error/g)) {
							$('input[type="submit"]').prop('disabled', false);
							$("#resultDiv").fadeIn();
							$('#resultDiv').html("<b> This number is not registered with BVA </b>");
							$("#resultDiv").fadeOut(7000);

							console.log("not ok");
						}
						if (result.match(/yes_register/g)) {

							var confirmPopup = $ionicPopup.confirm({
								title: 'Confirm',
								template: 'Already Registered. Previous registation will be lost.'
							});
							confirmPopup.then(function (res) {
								if (res) {
									$('#loading-image').show();
									$.ajax({

										url: "http://110.93.225.42/wp-content/mobile-app/responsemail.php",
										type: "post",
										data: {
											phoneNumber: localStorage.getItem("phoneNumber")
										},
										success: function (response) {
											console.log(response);
											localStorage.setItem("login_module_page", "index.html#/pinCode");
											//	alert('comes in success');
											$('#loading-image').hide();
											$state.go('pinCode');
										},

										error: function (result) {
											localStorage.setItem("login_module_page", "index.html#/login");
											//alert('check your internet connection');
											var alertPopup = $ionicPopup.alert({
												title: 'Alert!',
												template: 'check your internet connection'
											});

											$('input[type="submit"]').prop('disabled', false);
											$('#loading-image').hide();
											$state.go('login');
										}
									}); //end of ajax post request call
									//localStorage.setItem("login_module_page", "index.html#/pinCode");
									//$('#loading-image').hide();
									//$state.go('pinCode');

								} // end of if block to check reg
								else {
									console.log('in else block');
									localStorage.setItem("login_module_page", "index.html#/login");
									$('input[type="submit"]').prop('disabled', false);
									$state.go('login');

								} // end of else block to check reg
								/*if (res) {
									console.log('You are sure');
								} else {
									console.log('You are not sure');
								}*/
							});
							//var r = confirm("");
							//if (r === true) {

						} // end of of yes_reg

					},

					error: function (result) {
						$('#loading-image').hide();
						$('input[type="submit"]').prop('disabled', false);

						var alertPopup = $ionicPopup.alert({
							title: 'Alert!',
							template: 'Internet Connection is too slow'
						});

						$state.go('login');
					}
				});


				console.log($("#phoneNumber").val());

			}


		});

		/*$(".phone").mask("9999-9999999");*/


	}









}); // end of LoginCtrl controller

////////////////////////////////////////////////////////////////////////////////////////////////////////

app.controller('PinCodeCtrl', function ($scope, $cordovaNetwork, $rootScope, $state, $location, $ionicNavBarDelegate, $ionicPopup) {




	console.log('in pincode file');



	if (localStorage.getItem("fromLogin") == "true") {
		$ionicNavBarDelegate.showBackButton(true);
	} else {
		$ionicNavBarDelegate.showBackButton(false);
	}



	if (localStorage.getItem("reg_completed") == "yes") {
		localStorage.setItem("main_app_module_page", "main_app.html#/feeds");
		var url = "main_app.html#/feeds";
		$(location).attr("href", url);
	}



	if (localStorage.getItem("login_module_page") != "index.html#/pinCode") {

		var url = localStorage.getItem("login_module_page");
		$(location).attr("href", url);
	} // end of if for checking local storage


	$scope.code = "";

	$scope.init = function () {


		$('#code').bind("cut copy paste", function (e) {
			e.preventDefault();
		});





		//////////////////////////////
		$("#myForm").validate({

			rules: {
				code: {
					required: true,
					number: true

				}
			},

			messages: {
				code: {
					required: "please enter pin code",
					number: "enter numbers only"

				}
			},

			submitHandler: function (form) {
				$('#loading-image').show();
				$('input[type="submit"]').prop('disabled', true);
				$("#resultDiv").hide();
				if (localStorage.getItem("wifiState") == "false") {
					$('input[type="submit"]').prop('disabled', false);
					//alert("Wifi not Connected");
					var alertPopup = $ionicPopup.alert({
						title: 'Alert!',
						template: 'Wifi not Connected'
					});

					$('#loading-image').hide();
					return;
				}
				var code = $(form).serialize();
				var code = code.substring(5, 9);

				console.log(code);


				$.ajax({
					url: form.action,
					type: form.method,
					data: {
						code: code,
						phoneNumber: localStorage.getItem("phoneNumber")
							//tag: checked_class_name
					},
					success: function (result) {
						$('#loading-image').hide();

						localStorage.setItem("code", $('#code').val());
						if (result.match(/no_error/g)) {
							localStorage.setItem("login_module_page", "index.html#/campusAndClasses");
							$state.go('campusAndClasses');
							console.log("ok");
						}
						if (result.match(/yes_error/g)) {
							$("#resultDiv").show();
							$("#resultDiv").fadeIn();
							$('#resultDiv').html("<b> You have provided Invalid Code </b>");
							$("#resultDiv").fadeOut(7000);
							$('input[type="submit"]').prop('disabled', false);
							console.log("not ok");
						}

					},

					error: function (result) {
						$('#loading-image').hide();
						$('input[type="submit"]').prop('disabled', false);
						//alert("Internet Connection is too slow");
						var alertPopup = $ionicPopup.alert({
							title: 'Alert!',
							template: 'Internet Connection is too slow'
						});


					}
				});


				console.log($("#code").val().length);
			}


		});
	};


	document.addEventListener("deviceready", function () {

		$scope.isOnline = $cordovaNetwork.isOnline();

		if (!$scope.isOnline) {
			//alert('Please Connect your Wifi');
			var alertPopup = $ionicPopup.alert({
				title: 'Alert!',
				template: 'Please Connect your Wifi'
			});

			localStorage.setItem("wifiState", "false");
		} else {
			localStorage.setItem("wifiState", "true");
		}
		$scope.$apply();


		$rootScope.$on('$cordovaNetwork:online', function (event, networkState) {

			$scope.isOnline = true;
			//	alert('Wifi Connected');
			localStorage.setItem("wifiState", "true");
			console.log(localStorage.getItem("wifiState") + "in online function");
			$scope.$apply();

		})


		$rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {

			$scope.isOnline = false;
			localStorage.setItem("wifiState", "false");
			console.log(localStorage.getItem("wifiState") + "in offline mode");
			$scope.$apply();
		})

	}, false);



}); // end of PinCodeCtrl controller

///////////////////////////////////////////////////////////////////////////////////////////////////////

app.controller('CampusAndClassCtrl', function ($scope, $state, $location, $ionicNavBarDelegate, $location, $ionicNavBarDelegate, $ionicPopup) {



	localStorage.setItem("rcv_feeds", "no");
	var path = $location.path();
	console.log(path);
	if (path.indexOf('campusAndClasses') != -1)
		$ionicNavBarDelegate.showBackButton(false);
	else
		$ionicNavBarDelegate.showBackButton(true);

	var classLengthDB = localStorage.getItem("class_length");
	if (classLengthDB !== null) {
		console.log("block to check classes");
		//var classLength = localStorage.getItem("checked_classes").split(",").length;
		$('#campus').text(localStorage.getItem("campus_name"));
		var parseClassLength = parseInt(localStorage.getItem("class_length"));
		var arrayClassValue = localStorage.getItem("checked_classes").split(",");
		for (var i = 0; i < parseClassLength; i++) {
			$("input[value='" + arrayClassValue[i] + "']").attr("checked", true);
		} // end of for loop
	} // end of if 

	$scope.registration = function () {
		var classes = function (classes, campus, campus_name) {
			/*console.log(classes[0].value);
			 console.log(classes);*/
			var checked_classes = [];
			var checked_classes_without_campus = [];
			var checked_class_name = [];
			var class_length = 0;
			classes.each(function () {
				//console.log(campus + "_" + $(this).val());
				var class_value = $(this).val();
				var class_name = $(this).attr("name");
				checked_class_name.push(campus + "_" + class_name); //name with campus
				checked_classes.push(campus + "_" + class_value); //value with campus
				checked_classes_without_campus.push(class_value); // value without campus
				console.log(checked_classes_without_campus);

				class_length++;
			});


			localStorage.setItem("class_length", class_length);

			localStorage.setItem("checked_classes", checked_classes_without_campus); // value without campus

			localStorage.setItem("checked_class_name", checked_class_name); //name with campus

			localStorage.setItem("campus_name", campus_name);

			// checked_classes = [];
			// checked_classes_without_campus = [];
			//checked_class_name = [];

			// localStorage.getItem("checked_classes").split(",").length > 0
			//	var parseClassLength = parseInt(localStorage.getItem("class_length"));
			$scope.error = "";
			$('#loading-image').show();
			$.ajax({

				url: "http://110.93.225.42/wp-content/mobile-app/user-subscription.php",
				type: "post",
				data: {
					class: checked_class_name, //name with campus
					campus: campus_name,
					phoneNumber: localStorage.getItem("phoneNumber")

				},
				success: function (response) {

					// console.log('response data is ' + response.data);
					console.log('response is ' + response);
					console.log('***************************************** ');
					localStorage.setItem("login_module_page", "index.html#/campusAndClasses");
					localStorage.setItem("main_app_module_page", "main_app.html#/feeds");
					localStorage.setItem("from_settings", "none");
					localStorage.setItem("fromTempToAlert", "false");

					/*console.log('status is' + response.status);
					console.log('status text is ' + response.statusText );*/
					var url = "main_app.html#/feeds";
					//	$('#loading-image').hide();
					$(location).attr("href", url);
				},

				error: function (result) {
					$('#loading-image').hide();
					//alert("Internet Connection is too slow");
					var alertPopup = $ionicPopup.alert({
						title: 'Alert!',
						template: 'Internet Connection is too slow'
					});

					$state.go('campusAndClasses');
				}
			}); //end of ajax post request call

			/*$state.go('campusAndClasses');*/
		};

		var campus = $('#campus').text();
		if (campus != "Select Campus") {
			console.log("comes in block");
			var checkedBox = $('input[type="checkbox"]:checked');
			if (checkedBox.length > 0) {
				//checkedBox = $('input[type="checkbox"]:checked');
				classes(checkedBox, campus.charAt(0), campus);
			} // end of classses selection IF
			else {
				console.log('error of class');
				$scope.error = "Please Select Atleast One Class of Any Section";
				$("#accordion_error").addClass("class-selection-error");
				$state.go('campusAndClasses');
			} // end of else of classes
		} // end of if case , if no campus is selected
		else {
			console.log('error of campus');
			//	$scope.error = "Please Select Campus First";
			//$("#dropdown_menu").addClass( "showMenu" );
			$(".campuses").toggleClass("showMenu");
			$(".campuses > li").click(function () {
				$(".dropdownbox > p").text($(this).text());
				$(".campuses").removeClass("showMenu");
			});
			$state.go('campusAndClasses');
		} // end of else case

	};

	//$scope.initSlider();

}); // end of CampusAndClassCtrl controller
/////////////////////////////////////////////////////////////// 
///////////////////////////////////////////////////////////////

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

	});
	$ionicPlatform.onHardwareBackButton(function () {
		ionic.Platform.exitApp();

	});
	// Disable BACK button on home
	/*$ionicPlatform.registerBackButtonAction(function (event) {
		if (true) { // your check here
			$ionicPopup.confirm({
				title: 'System warning',
				template: 'are you sure you want to exit?'
			}).then(function (res) {
				if (res) {
					ionic.Platform.exitApp();
				}
			})
		}
	}, 100);*/
});