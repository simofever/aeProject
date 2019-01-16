/*global angular*/
/*global swal*/
/*global SERVER*/

'use strict'
const ct = angular.module('signupController', ['ngRoute'])


 
 ct.service('getSetName', function(){
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

 
ct.controller('signupController', ['$scope', '$location', '$http', function($scope, $location, $http){

  $scope.back = function(path){
    $location.path(path)
  }
  
  $scope.signup = function(path, $val){
    if ($val.name!=null && $val.password!=null && $val.email!=null){
      if($val.password.length < 6){
        swal("Password is too short! At least 6 characters.")
      }
      else{
    $http.post(SERVER + '/users', $val).success(function(request){
        $http.request = $val
      swal("Success!", "You registered successfully!", "success")
      })
    $location.path(path)
      }
    }
  }
}])

