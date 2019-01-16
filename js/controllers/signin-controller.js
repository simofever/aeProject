/*global angular*/
/*global swal*/
/*global SERVER*/


'use strict'
const ctrl1 = angular.module('signinController', ['ngRoute'])


 ctrl1.service('getSetName', function(){
  var name=""
  
  return{
    getName: function(){
      return name
    },
    setName: function(value){
      name = value
    }
  }
})

 
ctrl1.controller('signinController', ['$scope', '$http', '$location', 'getSetName', function($scope, $http, $location, getSetName){
  
   $scope.showItems = function(path, username, password){
    $http.get(SERVER + '/users/' + username).success(function(response){
      $scope.user=response
      
      getSetName.setName(username)
      
    if(username!=null && password!=null){
      if(username==$scope.user.name && password==$scope.user.password){
        $location.path(path)
      }
      else {
        swal({
          title: 'Error!', 
          text: "Wrong username or password!"
        })
      }
    }
   })
  }

  $scope.signup = function(path){
    $location.path(path);
  }
}])