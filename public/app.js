angular.module("dicer", ["dicer.controllers"])
	.config(["$locationProvider", function($locationProvider){
		$locationProvider.html5Mode(true);
	}])
	.config(["$routeProvider", function($routeProvider){
		$routeProvider
			.when("/", {
				templateUrl: macgap.path.resource + "/public/partials/list_characters.html",
				controller: "CharactersListCtrl"
			})
			.when("/characters/:characterId", {
				templateUrl: macgap.path.resource + "/public/partials/view_character.html",
				controller: "CharacterViewCtrl"
			})
			.otherwise({redirectTo: "/"});
	}]);
