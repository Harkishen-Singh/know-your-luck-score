// eslint-disable-next-line no-undef
var app = angular.module('luck-score-application', ['ngRoute']);

class Engine {
	// ID as string, 3 IDs as array of strings as answer elements
	constructor(questionElementID, optionsElementID) {
		this.questionElement = document.getElementById(questionElementID);
		this.answers = [];
		this.question = '';
		this.questionLimit = 10;
		this.result = {
			correct: 0,
			count: 0
		}

		for (const inst of optionsElementID) {
			this.answers.push(document.getElementById(inst));
		}
	}

	getRandomNumber() {
		return Math.floor(Math.random() * 100);
	}

	setQuestion() {
		this.question = this.getRandomNumber();
		this.questionElement.innerHTML = this.question;
		return parseInt(this.question);
	}

	setAnswerOptions(correctAnswer) {
		let randomCorrectAnswerPosition = Math.floor(Math.random() * 3);
		for (let inst in this.answers) {
			this.answers[inst].innerHTML = inst != randomCorrectAnswerPosition ? this.getRandomNumber() : correctAnswer;
		}
	}

	generate() {
		this.setAnswerOptions(this.setQuestion());
		return true; // confirm success
	}

	// accepts the answer as param and returns the result as a boolean
	verify(answer) {
		return answer === this.question;
	}

	submit(answer) {
		this.result.count++;
		if (this.verify(parseInt(answer))) {
			this.result.correct++;
			console.log("the answer is correct")
			return true;
		} else {
			console.log("the answer is wrong")
			return false;
		}
	}

	getCount() {
		return this.result.count;
	}

	isCompleted() {
		return this.result.count === this.questionLimit;
	}

	getLuckyness() {
		return (this.result.correct / this.result.count);
	}
}

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
		.when('/luck', {
			templateUrl: './components/lucky.html',
			controller: 'general-controller',
			title: 'Know your luckyness',
		})
		.when('/contact', {
			templateUrl: './components/contact.html',
			title: 'Contact Info',
		});
});

app.factory('$mainService', function() {
	var username;
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

app.controller('front-desk-controller', function($scope, $mainService, $location) {
	$scope.name = '';
	$scope.updateUsername = () => {
		$mainService.updateUsername($scope.name);
		global.throughProperRoute = true;
		$location.path('/luck');
	};
});

app.controller('general-controller', function($scope,$mainService) {
	$scope.username = $mainService.getUsername();
	$scope.properRoute = global.throughProperRoute;
	$scope.showAnswers = false;
	$scope.showResultMessage = false;
	$scope.showResultAsCorrect = false;
	const engineInstance = new Engine(
		'question',
		[
			'answer-1',
			'answer-2',
			'answer-3'
		]
	);
	engineInstance.generate();
	let updateEngineProperties = () => {
		$scope.correctAnswer = engineInstance.result.correct;
		$scope.totalQuestionsDone = engineInstance.result.count;
		$scope.limit = engineInstance.questionLimit;
	};
	updateEngineProperties();

	$scope.handleSubmit = (id) => {
		document.getElementById('instance-' + id.toString()).style.backgroundColor = '#CFD8DC';
		let value = document.getElementById('answer-' + id);
		let result = engineInstance.submit(value.innerText)
		$scope.showResultMessage = true;
		if (result) {
			$scope.showResultAsCorrect = true;
		}
		$scope.showAnswers = true;
		updateEngineProperties();
	};

});