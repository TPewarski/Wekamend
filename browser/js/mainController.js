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
		// console.log("controller preMovies pre REC", $scope.preMovies)
		$scope.recMovies = $scope.preMovies.slice(6)
		// console.log("controller preMovies post REC", $scope.preMovies)

		$scope.arffJson = movies.data
		// console.log("arff.json", $scope.arffJson)
		// console.log("controller data", movies)
	})

	$scope.setLike = function(){
		this.movie["liked"] = 1;
		// console.log("postMovies", $scope.preMovies)
	}

	$scope.setDislike = function(){
		this.movie["liked"] = 0;
		// console.log("postMovies", $scope.preMovies)
	}

	$scope.sendData = function(){
		$scope.preMovies.forEach(function(item){
			if(item.lead == "Gerard Butler") item.lead = 0
			else item.lead = 1
		})
		MainFactory.sendData($scope.trainingMovies).then(function(response){
			console.log("response", response)
			// console.log("Movies data pre sendData switch", $scope.preMovies)
			// console.log("Movies post sendDAta switch", $scope.preMovies)
			$scope.showRecommendations = true;
			var key = response.attribute
			var zeroVal = parseInt(response.val1[0])
			var oneVal = parseInt(response.val2[0])
			// console.log("zeroVal", zeroVal)
			// console.log("oneVal", oneVal)
			// console.log("key", key)
			var prefFilter = function(item){
				if(item[key] == 0 && zeroVal == 1) return true
				else if(item[key] == 1 && oneVal == 1) return true
				else return false	
			}
			// $scope.recMovies.forEach(function(item){
				
			// 	// console.log("item[key]", item[key])
			// 	if(item[key] == 0) {
			// 		item.liked = zeroVal
			// 		console.log("liked")
			// 	}
			// 	else {
			// 		item.liked = oneVal
			// 		console.log("disliked")
			// 	} 
			// 	// console.log("item", item)
			// })
		// function(item){
		// 		if(item.liked == 1)return true
		// 		return false
		// 	}
			$scope.recMovies = $scope.recMovies.filter(function(item){
				return prefFilter(item)
			})
			$scope.preMovies.forEach(function(movie){
				//console.log("movie", movie)
				if(movie.lead == 0) movie.lead = "Gerard Butler"
				else movie.lead = "Bill Murray"

			})
		})
	}



})