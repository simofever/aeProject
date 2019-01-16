/*global angular*/

var myApp = angular.module('myClosetApp', [
  'ngRoute',
  'itemsController',
  'signinController',
  'signupController'
])


myApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/signup', {
        templateUrl: 'views/signup.html',
	      controller: 'signupController'
      })
      .when('/signin', {
	      templateUrl: 'views/signin.html',
	      controller: 'signinController'
      })
      .when('/items', {
        templateUrl: 'views/items.html',
        controller: 'itemsController'
      })
      .otherwise({
	      redirectTo: '/signin'
      })
}])

myApp.directive('emailValidation', function(){
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attributes, signupController){
        signupController.$validators.emailValidation = function(value){
            if (value.contains("@") && value.contains(".")){
              return true
            }
            else{
              return false
            }
            }
        }
    }
  
})








