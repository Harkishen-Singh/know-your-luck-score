// eslint-disable-next-line no-undef
var app = angular.module('cmt-application', ['ngRoute']);

var global = {
	// URL for backend service listening at :9090
	url: 'http://127.0.0.1:9090',
	username: '',
	throughProperRoute: false,
};

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: './components/name-desk.html',
			controller: 'front-desk-controller',
			title: 'Know your luckyness',
		})
		.when('/contact', {
			templateUrl: './components/contact.html',
			title: 'Contact Info',
		});
});

app.factory('$mainService', function() {
	let username;
	let updateUsername = function(name) {
		username = name;
	};
	let getUsername = function() {
		return username;
	};

	return {
		updateUsername,
		getUsername
	};
});

app.controller('front-desk-controller', function($scope, $mainService) {
	$scope.name = '';
	$scope.updateUsername = () => {
		$mainService.updateUsername(name);
		global.throughProperRoute = true;
	};
});

app.controller('general-controller', function($scope,$mainService) {
	$scope.username = $mainService.getUsername();
	console.warn('gen controller username is ', $scope.username)
});