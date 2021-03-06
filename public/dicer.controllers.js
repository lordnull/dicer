Controllers = angular.module("dicer.controllers", []);

Controllers.controller("DicerCtrl", function($scope){
	$scope.appName = 'Dicer';

	$scope.selectCharacter = function(character){
		$scope.selectedCharacter = character
	}

	$scope.rollHistory = [];
});

Controllers.controller("CharactersListCtrl", function($scope){
	macgap.window.resize({width:400,height:680});
	$scope.characters = dustbin.query('dicer.character');
	$scope.newName = '';
	$scope.createCharacter = function(){
		if($scope.newName == ''){
			macgap.app.beep();
			return;
		}
		var newCharacter = {
			'name':$scope.newName
		};
		var newCharacterKey = dustbin.store('dicer.character', newCharacter);
		newCharacter = dustbin.get('dicer.character', newCharacterKey);
		$scope.characters.push(newCharacter);
		$scope.newName = '';
	}
});

Controllers.controller("StatCtrl", function($scope){
    $scope.$watch('stat.value', function(newVal){
        dustbin.store("dicer.stat", $scope.stat);
    });
});

Controllers.controller("RollCtrl", function($scope){
    $scope.$watch('roll.string', function(newVal){
        dustbin.store("dicer.roll", $scope.roll);
    });
});

Controllers.controller("CharacterViewCtrl", function($scope, $routeParams){
	var character = dustbin.get("dicer.character")[$routeParams.characterId];
	$scope.character = character;
	macgap.window.resize({width:1024,height:680});

	$scope.stats = dustbin.query("dicer.stat").filter(function(stat){
		return stat.character_key == character.$metadata.key;
	});

	$scope.rolls = dustbin.query("dicer.roll").filter(function(roll){
		return roll.character_key == character.$metadata.key;
	});

	$scope.newStatName = '';
	$scope.createStat = function(){
		if($scope.newStatName == ''){
			macgap.app.beep();
			return;
		}
		var newStat = {
			'name':$scope.newStatName,
			'character_key':$scope.character.$metadata.key,
			'value': 10
		};
		var newStatKey = dustbin.store("dicer.stat", newStat);
		newStat = dustbin.get("dicer.stat", newStatKey);
		$scope.stats.push(newStat);
		$scope.newStatName = '';
	};

	$scope.removeStat = function(stat){
		$scope.stats = $scope.stats.filter(function(s){
			return s != stat;
		});
		dustbin.remove("dicer.stat", stat.$metadata.key);
	};

	$scope.newRollName = '';
	$scope.createRoll = function(){
		if($scope.newRollName == ''){
			macgap.app.beep();
			return;
		}
		var newRoll = {
			'name':$scope.newRollName,
			'character_key':$scope.character.$metadata.key,
			'value': '1d20'
		};
		var newRollKey = dustbin.store("dicer.roll", newRoll);
		newRoll = dustbin.get("dicer.roll", newRollKey);
		$scope.rolls.push(newRoll);
		$scope.newRollName = '';
	};

	$scope.removeRoll = function(roll){
		$scope.rolls = $scope.rolls.filter(function(r){
			return r != roll;
		});
		dustbin.remove("dicer.roll", roll.$metadata.key);
	};

	$scope.maxHistory = 100;
	$scope.rollHistory = [];
	$scope.rollError = '';
	$scope.rollDice = function(roll){
		var rollScope = $scope.stats.reduce(function(acc, st){
			acc[st.name] = st.value;
			return acc;
		}, {});
		try{
			var parsed = dice.parse.parse(roll.string);
			var evaled = dice.eval.eval(parsed, rollScope);
			$scope.rollHistory.unshift(evaled);
			if($scope.rollHistory.length > $scope.maxHistory){
				$scope.rollHistory.pop();
			}
			$scope.rollError = '';
		} catch(err){
			$scope.rollError = err.toString();
		}
	};
});

