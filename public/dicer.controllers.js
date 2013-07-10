Controllers = angular.module("dicer.controllers", []);

//function DicerCtrl($scope) {
Controllers.controller("DicerCtrl", function($scope){
	$scope.appName = 'Dicer';

	$scope.selectCharacter = function(character){
		$scope.selectedCharacter = character
	}

	$scope.rollHistory = [];
});

Controllers.controller("CharactersListCtrl", function($scope){
//function CharactersListCtrl($scope) {
	console.log('der character scope thing');
	$scope.characters = dustbin.query('dicer.character');

	$scope.createCharacter = function(){
		var newCharacter = {
			'name':$scope.newName
		};
		var newCharacterKey = dustbin.store('dicer.character', newCharacter);
		newCharacter = dustbin.get('dicer.character', newCharacterKey);
		$scope.characters.push(newCharacter);
		$scope.newName = '';
	}

	$scope.loadCharacter = function(character){
		console.log('load', character);
	}
});

Controllers.controller("StatsListCtrl", function($scope){
//function StatsListCtrl($scope) {
	$scope.$watch('selectedCharacter', function(dahDude){
			if(dahDude){
				$scope.stats = dustbin.query('dicer.stat').filter(function(stat){
					return stat.character_key == dahDude.$metadata.key;
				});
			} else {
				$scope.stats = [];
			}
	});

	$scope.createStat = function(){
		if(! $scope.selectedCharacter){
			console.log('quicky stat create abort');
			return;
		}
		var newStat = {
			'name':$scope.newStatName,
			'character_key':$scope.selectedCharacter.$metadata.key,
			'value':10
		};
		var newStatKey = dustbin.store('dicer.stat', newStat);
		newStat = dustbin.get('dicer.stat', newStatKey);
		$scope.stats.push(newStat);
		$scope.newStatName = '';
	}

	$scope.updateStat = function(statObj){
		var storable = dustbin.store(statObj);
	}
});

Controllers.controller("RollsListCtrl", function($scope){
//function RollsListCtrl($scope) {
	$scope.$watch('selectedCharacter', function(dahDude){
		if(dahDude){
			$scope.rolls = dustbin.query('dicer.roll').filter(function(roll){
				return roll.character_key == dahDude.$metadata.key;
			});
		} else {
			$scope.rolls = [];
		}
	});

	$scope.createRoll = function(){
		if(! $scope.selectedCharacter){
			return;
		}
		var newRoll = {
			'name':$scope.newRollName,
			'character_key': $scope.selectedCharacter.$metadata.key,
			'string': '1d20'
		};
		var newRollKey = dustbin.store('dicer.roll', newRoll);
		newRoll = dustbin.get('dicer.roll', newRollKey);
		$scope.rolls.push(newRoll);
		$scope.newRollName = '';
	}

	$scope.storeRoll = function(rollObj){
		console.log('der roll obj', arguments);
		dustbin.store(rollObj);
	}

	$scope.rollDice = function(roll){
		var statObjs = dustbin.query('dicer.stat').filter(function(st){
			return st.character_key == $scope.selectedCharacter.$metadata.key;
		});
		var rollScope = statObjs.reduce(function(acc, st){
			acc[st.name] = st.value;
			return acc;
		}, {});
		console.log('I should likely roll this:', roll.string, rollScope);
		var parsed = dice.parse.parse(roll.string);
		var evaled = dice.eval.eval(parsed, rollScope);
		$scope.rollHistory.unshift(evaled);
		console.log("I got", evaled);
	}
});

