app.factory('MainFactory', function($http){
	return {
		getMovies: function(){
			console.log("calling getMovies")
			return $http.get('movies')
				.success(function(data, status, headers, config){
					//console.log("suc data", data)
					return data
				})
				.error(function(data, status, headers, config){
					return data
				})
		},

		sendData: function(arffJson){
			return $http.post('movies', arffJson).then(function(response){
				return response.data
			})
		}
	}
})