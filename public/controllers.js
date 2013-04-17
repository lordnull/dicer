/*var lsKeyFind = function(){
	var args = [];
	for(var i = 0; i < arguments.length; i++){
		args.push(arguments[i]);
	}
	var keyPrefix = "^" + args.join('.');
	var lsLen = localStorage.length;
	var out = [];
	var key = '';
	var pushObj = function(akey){
		out.push(localStorage.getItem(akey));
	}
	for(i = 0; i < lsLen; i++){
		key = localStorage.key(i);
		if(key.match(keyPrefix)){
			pushObj(key);
		}
	}
	return out.map(function(v){
		return JSON.parse(v);
	});;
}

var lsGetId = function(){
	var lastId = localStorage.getItem("dicer.counter");
	if(! lastId){
		lastId = 0;
	} else {
		lastId = parseInt(lastId);
	}
	lastId++;
	localStorage.setItem("dicer.counter", lastId);
	return lastId;
}

var lsStore = function(value){
	var keyParts = [];
	for(var i = 1; i < arguments.length; i++){
		keyParts.push(arguments[i]);
	}
	if(!value._id){
		value._id = lsGetId();
	}
	keyParts.push(value._id.toString());
	var key = keyParts.join('.');
	localStorage.setItem(key, JSON.stringify(value));
	return value;
}*/

function DicerCtrl($scope) {
	$scope.appName = 'Dicer';

	$scope.selectCharacter = function(character){
		$scope.selectedCharacter = character
	}

	$scope.rollHistory = [];
}

function CharactersListCtrl($scope) {

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
}

function StatsListCtrl($scope) {
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
}

function RollsListCtrl($scope) {
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
}

