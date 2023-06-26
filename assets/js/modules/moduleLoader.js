(function($, window, undefined) {

	/*var SiteRenewal = {
		// September 26th is the date to renew.
		expiryDate: new Date(2021, 9, 31),
		isRenewalRequired: function(){
			if( SiteRenewal.expiryDate < new Date() ){
				return true;
			} else {
				return false;
			}
		}
	};*/

	// All Cached DOM Selectors
	var DOM = {
		$window: $(window),
		$body: $("body"),
		mainNav: document.getElementById("mainNav"),
		heroCarousel: document.getElementById("heroCarousel"),
		$mainContent: $("#mainContent"),
		$mainContentContainer: $("#mainContentContainer"),
		$badgeContainer: $("#badgeContainer"),
		$disclaimer: $("#disclaimer"),
		apiKey: "AIzaSyB5QBtnSLwJJxgALoMHx9N2rRQUN4dxuxM",
		mapContainer: document.getElementById("mapContainer"),
		$disclaimerHeight: 0,
		$floorPlanContainer: null,
		$flrPlanModal: null,
		disclaimerInitialHeight: 62,
		RegExpr: {
			name: new RegExp(/^[\w\s*]{3,25}$/),
			email: new RegExp(/^\S+@\S+\.\S+/),
			mobile: new RegExp(/^\d{7,10}$/),
			subject: new RegExp(/^[\w\s0-9_\.]{3,150}$/)
		},
		loaderTemplate: '<div id="loader"><div class="inner well well-lg">Wait! Content is Loading...</div></div>'
	};

	// site utilities functions
	var site = {
		generateHeroCarousel: function (){
			$(DOM.heroCarousel).owlCarousel({
				slideSpeed: 300,
				autoPlay: true,
				pagination: false,
				singleItem: true,
				lazyLoad: true,
				rewindNav: true,
				autoHeight: true
			});
		},
		initProjectGoogleMaps: function(address){
			var url = "https://www.google.com/maps/embed/v1/place?key="+ DOM.apiKey +"&q=" + address;
			var $mapContainer = $(DOM.mapContainer);
			var template = '<iframe id="map" width="100%" height="625" frameborder="0" style="border:0" src="' + url + '" allowfullscreen></iframe>';
			$mapContainer.html(template);
			// DOM.$mapFrame.attr("src", url);
		},
		initGenericGoogleMaps: function(){
			console.log("Google Maps");
			var map,
				bounds = new google.maps.LatLngBounds(),
				mapOptions = { mapTypeId: "roadmap" },
				mapContainer = DOM.mapContainer;

			// display map on page
			map = new google.maps.Map( mapContainer, mapOptions );

			// set height of the container
			mapContainer.style.height = "500px";

			// multiple markers
			var markers = [
				['Corporate Office, Hi-tech Ultra Homes', 19.0332142, 73.0665171],
				['The Gold Crest, Navade', 19.0528467, 73.1002016],
				['Springfields, Roadpali', 19.0393255, 73.0939534],
				['Springdale, Roadpali', 19.0433952, 73.0960496],
				['The Blue Crest, Kharghar', 19.0706585,73.0752691],
				['Luxus Tower, Kharghar', 19.0460038,73.0783671],
				['The Silver Crest, Taloje', 19.080989, 73.089466]
			];

			// info window content
			var infoWindowContent = [
		        ['<div class="info_content">' +
		        '<h3>Hi-tech Ultra Homes,</h3>' +
		        '<p>Corporate Office,<br>1102, The Landmark, Sector-7, Kharghar, Navi Mumbai, Maharashtra 410210</p>' + '</div>'],
		        ['<div class="info_content">' +
		        '<h3>The Gold Crest</h3>' +
		        '<p>MIDC Rd, Navade, Taloja, Navi Mumbai, Maharashtra 410208</p>' + '</div>'],
		        ['<div class="info_content">' +
		        '<h3>Springfields</h3>' +
		        '<p>Kalamboli Link Rd, Sector 20, Kalamboli, Panvel, Navi Mumbai, Maharashtra 410218</p>' + '</div>'],
		        ['<div class="info_content">' +
		        '<h3>Springdale</h3>' +
		        '<p>Roadpali,, Sector 14, Kalamboli, Panvel, Navi Mumbai, Maharashtra 410218</p>' + '</div>'],
		        ['<div class="info_content">' +
		        '<h3>The Blue Crest</h3>' +
		        '<p>Plot No. 71, Sector - 35-E, Kharghar, Sector 35E, Kharghar, Navi Mumbai, Maharashtra 410210</p>' + '</div>'],
		        ['<div class="info_content">' +
		        '<h3>Luxus Tower</h3>' +
		        '<p>Sector 18, Plot No. 9, Kharghar, Sector 18, Kharghar, Navi Mumbai, Maharashtra 410210</p>' + '</div>'],
		        ['<div class="info_content">' +
		        '<h3>The Silver Crest</h3>' +
		        '<p>Plot No. 27 &amp; 28, Sector 2, Taloje Panchanand, Navi Mumbai</p>' + '</div>']
		    ];

		    // Display multiple markers on a map
		    var infoWindow = new google.maps.InfoWindow(),
		    	marker,
		    	i;
		    
		    // Loop through our array of markers & place each one on the map  
		    for( i = 0; i < markers.length; i++ ) {
		        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
		        bounds.extend(position);
		        marker = new google.maps.Marker({
		            position: position,
		            map: map,
		            title: markers[i][0]
		        });
        
		        // Allow each marker to have an info window    
		        google.maps.event.addListener(marker, 'click', (function(marker, i) {
		            return function() {
		                infoWindow.setContent(infoWindowContent[i][0]);
		                infoWindow.open(map, marker);
		            }
		        })(marker, i));

		        // Automatically center the map fitting all markers on the screen
		        map.fitBounds(bounds);
		    }

		    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
		    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
		        this.setZoom(14);
		        google.maps.event.removeListener(boundsListener);
		    });
		},
		validateInputField: function(inputElement, inputText, inputRegExp){
			var $enquiryForm = $("#enquiryForm");

			if( inputText === "" || !inputRegExp.test(inputText) ){
				inputElement.next().show();
				$enquiryForm.addClass("invalid");
			} else {
				inputElement.next().hide();
				$enquiryForm.removeClass("invalid");
			}
		},
		initEquiryFormValidation: function(){

			$(document).on("blur", "#enquiryForm input", function(e){

				var $this = $(this);

				switch($(this).attr("name")) {
					case "name" :
						site.validateInputField( $this, $this.val(), DOM.RegExpr["name"] );
						break;
					case "email" :
						site.validateInputField( $this, $this.val(), DOM.RegExpr["email"] );
						break;
					case "mobile" :
						site.validateInputField( $this, $this.val(), DOM.RegExpr["mobile"] );
						break;
					case "subject" :
						site.validateInputField( $this, $this.val(), DOM.RegExpr["subject"] );
						break;
				}
			});

			$(document).on("submit", "#enquiryForm", function(e){
				e.preventDefault();

				var $this = $(this),
					$nameInput = $this.find("#name"),
					$emailInput = $this.find("#email"),
					$mobileInput = $this.find("#mobile"),
					$subjectInput = $this.find("#subject");

				site.validateInputField( $nameInput, $nameInput.val(), DOM.RegExpr["name"] );
				site.validateInputField( $emailInput, $emailInput.val(), DOM.RegExpr["email"] );
				site.validateInputField( $mobileInput, $mobileInput.val(), DOM.RegExpr["mobile"] );
				site.validateInputField( $subjectInput, $subjectInput.val(), DOM.RegExpr["subject"] );

				if( $this.hasClass("invalid") ){
					return;
				} else {
					var enquiryFormData = $this.serialize();
					console.log(enquiryFormData);
					// to load the data throught PHP file from server based on the query parameters using POST method
					$.post("templates/send_mail.php", { data: enquiryFormData }, function(responseHTML){
						DOM.$mainContent.html(responseHTML);
						DOM.$mainContent.fadeIn("fast");
					});
				}
			});
		},
		loadMainContent: function(hashArr){
			var hashStr = hashArr.join("/");
			var pageURL = "templates/" + ( (hashStr === "") ? "home" : hashStr ) + "-content.html";
			console.log(pageURL);
			site.getMainContent(pageURL);
		},
		getMainContent: function(pageURL){
			$.get(pageURL, null, function(responseHTML){
				
				// console.log(responseHTML);
				DOM.$mainContent.html(responseHTML);
				// DOM.$mainContent.slideDown("slow");
				DOM.$mainContent.fadeIn("fast");

			}).fail(function(jqXHR){
				
				DOM.$mainContent.html("An Error Occurred " + jqXHR.status).append(jqXHR.responseText);

			});
		},
		onNavClick: function(hash){
			// early exit
			if(hash === "") {return;} 

			var hashArr = hash.split("/");
			var $navLis = $(DOM.mainNav).find('li');

			$navLis.removeClass("active");
			
			if(hashArr.length === 2){
				$($navLis.children("[href='" + hashArr[0] + "']")).parent("li").addClass("active").find("li").children("[href='" + hash + "']").parent("li").addClass("active");
			} else {
				$($navLis.children("[href='" + hash + "']")).parent("li").addClass("active");
			}
		},
		onHashChange: {
			"home": function(){
				console.log("Home page loaded");
				DOM.$body.removeClass().addClass("home-page");
				DOM.$badgeContainer.find("img").attr("src", "img/badges/badge-landing-page.png");
				if(window.initGenericGoogleMaps === undefined){
					window.initGenericGoogleMaps = site.initGenericGoogleMaps;
				}
				window.initGenericGoogleMaps();
			},
			"aboutus": function(){
				console.log("about us page loaded");
				DOM.$body.removeClass().addClass("about-us-page");
				DOM.$badgeContainer.find("img").attr("src", "img/badges/badge-luxus-tower.png");
				if(window.initGenericGoogleMaps === undefined){
					window.initGenericGoogleMaps = site.initGenericGoogleMaps;
				}
				window.initGenericGoogleMaps();
			},
			"projects": {
				"gold-crest": function(){
					console.log("projects/gold-crest page loaded");
					DOM.$body.removeClass().addClass("gold-crest-page");
					DOM.$badgeContainer.find("img").attr("src", "img/projects/gold-crest/badge-gold-crest.png");
					site.initProjectGoogleMaps("The+Gold+Crest,+Navade");
				},
				"springfields": function(){
					console.log("projects/springfields page loaded");
					DOM.$body.removeClass().addClass("springfields-page");
					DOM.$badgeContainer.find("img").attr("src", "img/projects/springfields/badge-springfields.png");
					site.initProjectGoogleMaps("Springfields,+Roadpali");
				},
				"springdale": function(){
					console.log("projects/springdale page loaded");
					DOM.$body.removeClass().addClass("springdale-page");
					DOM.$badgeContainer.find("img").attr("src", "img/projects/springdale/badge-springdale.png");
					site.initProjectGoogleMaps("Springdale,+Roadpali");
				},
				"blue-crest": function(){
					console.log("projects/blue-crest page loaded");
					DOM.$body.removeClass().addClass("blue-crest-page");
					DOM.$badgeContainer.find("img").attr("src", "img/projects/blue-crest/badge-blue-crest.png");
					site.initProjectGoogleMaps("The+Blue+Crest,+Kharghar");

					var pageURL = "templates/projects/blue-crest-floor-plan.html";
					
					$.get(pageURL, null, function(responseHTML){
						$(responseHTML).insertAfter(DOM.$mainContentContainer);
						$(document).ready(function(){
							site.initModalEventListeners();
						});
					});

				},
				"luxus-tower": function(){
					console.log("projects/luxus-tower page loaded");
					DOM.$body.removeClass().addClass("luxus-tower-page");
					DOM.$badgeContainer.find("img").attr("src", "img/projects/luxus-tower/badge-luxus-tower.png");
					site.initProjectGoogleMaps("Luxus+Tower,+Kharghar");
				},
				"silver-crest": function(){
					console.log("projects/silver-crest page loaded");
					DOM.$body.removeClass().addClass("silver-crest-page");
					DOM.$badgeContainer.find("img").attr("src", "img/projects/silver-crest/badge-silver-crest.png");
					site.initProjectGoogleMaps("Silver+Crest,+Taloja");
				}
			},
			"enquiry": function(){
					console.log("Enquiry page loaded");
					DOM.$body.removeClass().addClass("enquiry-page");
					site.initEquiryFormValidation();
					if(window.initGenericGoogleMaps === undefined){
						window.initGenericGoogleMaps = site.initGenericGoogleMaps;
					}
					window.initGenericGoogleMaps();
				},
			"info-center": function(){
					console.log("Info Center page loaded");
					DOM.$body.removeClass().addClass("info-center-page");
					if(window.initGenericGoogleMaps === undefined){
						window.initGenericGoogleMaps = site.initGenericGoogleMaps;
					}
					window.initGenericGoogleMaps();
				}
		},
		hashChangeDispatcher: function(hash){
			var hashArr = hash.split("/");

			try {
				if(hashArr.length === 2){
					site.onHashChange[hashArr[0]][hashArr[1]]();
				} else {
					site.onHashChange[hashArr[0]]();
				}
			} catch(error){
				console.log("There is no matching URL, redirecting to Home");
				// console.log(hashArr);
				site.onHashChange["home"]();
			}

			site.loadMainContent(hashArr);
		},
		setDisclaimer: function(){
			DOM.$disclaimerHeight = DOM.$disclaimer.height();
			console.log(DOM.$disclaimerHeight);
			DOM.$disclaimer.height(DOM.disclaimerInitialHeight);
		},
		initEventListeners: function(){
			DOM.$window.on("hashchange", function(event){
				// console.log(event);
				site.onNavClick(location.hash);
				var hash = (location.hash).toLowerCase().replace("#", "");
				console.log(hash);
				site.hashChangeDispatcher(hash);
			});

			DOM.$disclaimer.on("click", "a", function(e){
				e.preventDefault();

				var $link = $(e.target);
				
				if($link.text() === "Read More"){
					DOM.$disclaimer.animate({"height": DOM.$disclaimerHeight}, 500, function(){
						$link.text("Read Less");
						window.scrollTo(0, $(document).height())
					});
				} else {
					DOM.$disclaimer.animate({"height": DOM.disclaimerInitialHeight}, 500, function(){
						$link.text("Read More");
					});
				}
				
			});

			DOM.$loader = $(DOM.loaderTemplate).insertBefore(DOM.$mainContent);

			$(document).ajaxStart(function(){
				DOM.$mainContent.fadeOut("fast");
				DOM.$loader.show();
			}).ajaxStop(function(){
				DOM.$loader.hide();
			});

		},
		initModalEventListeners: function(){
			// console.log("Hi");
			DOM.$floorPlanContainer = $(document).find("#floorPlanContainer");
			DOM.$flrPlanModal = $(document).find("#flrPlanModal");

			DOM.$flrPlanModal.on("show.bs.modal", function(e){
				var modal = $(this),
					data = {
						src: $(e.relatedTarget).attr("src"),
						title: $(e.relatedTarget).attr("alt")
					};

				// console.log(data);
				modal.find(".modal-title").text(data.title);
				modal.find(".modal-body img").attr("src", data.src).attr("alt", data.title);
			});
		},

		init: function(){
			// NOTE: load the GMap Script first and then bootstrap the application.
			var url = "//maps.googleapis.com/maps/api/js?key=" + DOM.apiKey;
			
			$.getScript(url, function(){
				// init to be triggered post google maps js loads.
				site.generateHeroCarousel();
				site.initEventListeners();
				DOM.$loader.hide();
				DOM.$window.trigger("hashchange");
				site.setDisclaimer();
			});
		}
	};

	// initialize Application
	$(function () {
		site.init();
		/*if( SiteRenewal.isRenewalRequired() ){
			DOM.$body.addClass("site-renewal").html("");
			console.warn("Hosting renewal is required!\nYour Website Hosting plan was only for the period of Oct-2018 to Oct-2020.\nPlease contact \"ganeshkondalkar@gmail.com\" - your host provider for re-activation!");
		} else {
			site.init();
		}*/
	});

	// To compile the JS templates
	// Handlebars -m templates/> js/templates/templates.js

})(jQuery, window, undefined);