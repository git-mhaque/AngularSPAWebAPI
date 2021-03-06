var app = angular.module("taskManagerApp", ["ngRoute", "ngResource", "ui.bootstrap", "kendo.directives"]).run(function ($rootScope, $http) {

    $rootScope.isAuthenticated = false;
	$rootScope.currentUser = "";
	$rootScope.tokenKey = "accessToken";
	sessionStorage.removeItem($rootScope.tokenKey);

	$rootScope.datePickerConfig = {
	    parseFormats: ["yyyy-MM-ddThh:mm:ss", "dd/MM/yyyy", "yyyy/MM/dd", "yyyy"]
	};

	toastr.options = {
	    "positionClass": "toast-top-center"
	};

	$rootScope.logout = function () {
    	$rootScope.isAuthenticated = false;
    	$rootScope.currentUser = "";
    	sessionStorage.removeItem($rootScope.tokenKey);
	};

});


app.factory("errorInterceptor", ["$q","$location", function ($q, $rootScope, $location) {

    return {
        request: function (config) {
            config.headers.Authorization = "Bearer " + sessionStorage.getItem("accessToken"); //TODO 
            console.log("Sending request.." + config.url);
            //console.log(config);
            return config || $q.when(config);
        },
        requestError: function (request) {
            console.log("Request error.." + request.statusText);
            //console.log(request);
            return $q.reject(request);
        },
        response: function (response) {
            console.log("Received response.." + response.statusText);
            //console.log(response);
            return response || $q.when(response);
        },
        responseError: function (response) {
            console.log("Response error.." + response.statusText);
            //console.log(response);
            if (response && response.status === 404) {
            }
            if (response && response.status === 401) {
                console.log("Unauthorised Access");
                toastr.error("Oops! You don't have permission for this operation.");
                //$location.path('/');
            }
            if (response && response.status >= 500) {
                toastr.error("An error occurred on the server! Please try again later.");
            }
            return $q.reject(response);
        }
    };

}]);


app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push("errorInterceptor");
}]);

app.config(function($routeProvider){
	$routeProvider
		.when("/", {
			templateUrl: "./public/partials/task.html",
			controller: "taskController"
		})
		.when("/login", {
		    templateUrl: "./public/partials/login.html",
			controller: "authController"
		})
		.when("/register", {
		    templateUrl: "./public/partials/register.html",
			controller: "authController"
		});
});





