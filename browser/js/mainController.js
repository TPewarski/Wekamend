app.controller('MainController', function($scope, MainFactory){
	console.log("controller created")
	$scope.showRecommendations = false;

	MainFactory.getMovies().then(function(movies){
		$scope.preMovies = movies.data.data
		$scope.preMovies.forEach(function(movie){
			//console.log("movie", movie)
			if(movie.lead == 0) movie.lead = "Gerard Butler"
			else movie.lead = "Bill Murray"

		})
		$scope.trainingMovies = $scope.preMovies.slice(0,6);
		$scope.recMovies = $scope.preMovies.slice(6)
		$scope.arffJson = movies.data
		console.log("arff.json", $scope.arffJson)
		console.log("controller data", movies)
		console.log("controller preMovies", $scope.preMovies)
	})

	$scope.postMovies = [];

	$scope.setLike = function(){
		this.movie["liked"] = 1;
		console.log("postMovies", $scope.preMovies)
	}

	$scope.setDislike = function(){
		this.movie["liked"] = 0;
		console.log("postMovies", $scope.preMovies)
	}

	$scope.sendData = function(){
		$scope.arffJson.data.forEach(function(item){
			if(item.lead == "Gerard Butler") item.lead = 0
			else item.lead = 1
		})
		MainFactory.sendData($scope.arffJson).then(function(response){
			console.log("response", response)
			$scope.showRecommendations = true;

			// $scope.filter = (function(response){

			// 	return function
			// })
		})
	}



})