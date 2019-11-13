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
		};

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
			return true;
		} else {
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
	username: '',
	throughProperRoute: false,
	prevRecords: []
};

function updateHistory() {
	if (localStorage.getItem('luck-store') !== null) {
		global.prevRecords = localStorage.getItem('luck-store').split(';');
	}
} updateHistory();


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
		.when('/previous', {
			templateUrl: './components/prev-scores.html',
			controller: 'history-controller',
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

app.controller('history-controller', function($scope) {
	updateHistory();
	$scope.previousScores = global.prevRecords;
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
	$scope.disableNextButton = false;
	$scope.showResult = false;
	$scope.startGame = false;
	$scope.disableFinish = true;
	$scope.leftCount = 10;

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
		$scope.leftCount = engineInstance.questionLimit - engineInstance.getCount();

		if ($scope.limit === $scope.totalQuestionsDone) {
			$scope.disableFinish = false;
			$scope.disableNextButton = true;
		}
	};
	updateEngineProperties();

	$scope.beginGame = () => {
		$scope.startGame = true;
	};

	let tmp;
	$scope.handleSubmit = id => {
		document.getElementById('instance-' + id.toString()).style.backgroundColor = '#CFD8DC';
		let value = document.getElementById('answer-' + id);
		let result = engineInstance.submit(value.innerText);
		tmp = 'instance-' + id.toString();

		$scope.showResultMessage = true;
		if (result) {
			$scope.showResultAsCorrect = true;
		}
		$scope.showAnswers = true;
		updateEngineProperties();
	};

	$scope.handleNext = () => {
		$scope.showResult = false;
		$scope.showAnswers = false;
		$scope.showResultMessage = false;
		$scope.showResultAsCorrect = false;

		document.getElementById(tmp).style.backgroundColor = '#F5F5F5';
		if (!engineInstance.isCompleted()) {
			engineInstance.generate();
			updateEngineProperties();
		} else {
			$scope.disableNextButton = true;
		}
	};

	$scope.handleFinish = () => {
		let score = engineInstance.result.correct / engineInstance.result.count;
		let statement = 'user: ' + $mainService.getUsername() + ' score: ' + score + ' luck: ';
		if (score >= 0.7) {
			$scope.conclusion = 'extremely good luck';
			statement += 'extremely good';
		} else if (score > 0.3 && score < 0.7) {
			$scope.conclusion = 'a good luck';
			statement += 'good';
		} else if (score <= 0.3) {
			$scope.conclusion = 'bad luck';
			statement += 'bad';
		}

		$scope.showResult = true;
		statement += ' time: ' + new Date().getTime();
		global.prevRecords.push(statement);

		localStorage.setItem('luck-store', global.prevRecords.join(';'));
		updateHistory();
	};

	$scope.roundToTwoDecimal = num => {
		return Math.round(num * 100) / 100;
	};

});
