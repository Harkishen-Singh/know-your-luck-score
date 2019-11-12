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
		// .when('/questions', {
		// 	templateUrl: './components/article.html',
		// 	controller: 'comments-controller',
		// 	title: 'About',
		// })
		// .when('/contact', {
		// 	templateUrl: './components/contact.html',
		// 	title: 'Contact Info',
		// });
});

app.factory('$mainService', function() {
	let username;
	let updateUsername = function(name) {
		username = name;
	};
	let getUsername = function() {
		return usernamel
	};
});

app.controller('front-desk-controller', function($scope, $mainService) {
	$scope.name = '';
	$scope.updateUsername = () => {
		console.log('name is ');
		$mainService.updateUsername(name);
		global.throughProperRoute = true;
	};
});

app.controller('general-controller', function($scope,$location,$rootScope,$http) {

});