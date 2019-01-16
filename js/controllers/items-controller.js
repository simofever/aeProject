/*global angular*/
/*global swal*/

'use strict'
const ctrl = angular.module('itemsController', ['ngRoute'])

const SERVER = 'https://webtech-simofever.c9users.io'

ctrl.service('getSetName', function(){
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


ctrl.controller('itemsController', ['$scope', '$http', 'getSetName', function($scope, $http, getSetName){
 
 
  var name = getSetName.getName()
  
  
  $scope.val = {};
  
    var hasDataToUpdate = function(data) {
    return data && (data.iName || data.color || data.size);
  }
  
  
  var refresh = function(){
    $http.get('/users/' + name + '/items').success(function(response){
      $scope.items = response;
      $scope.val.iName = '';
      $scope.val.color = '';
      $scope.val.size = '';
    })
  }
  
  
  refresh();
    
    
  $scope.insertItem = function($val){
    $http.post('/users/'+name+'/items', $val).success(function(request){
      $http.request = $val;
      refresh();
    })
  }
  
  
  $scope.putItem = function(id, $val){
    if(hasDataToUpdate($val) === false ) {
      return false;    
    }
  $http.put('/users/' + name + '/items/' + id, $val).success(function(request){
    $http.request=id;
    refresh();
  })
  }
  
  
  $scope.deleteItem = function(id){
    swal({   
      title: "Do you really want to delete it?",  
      type: "warning",    
      confirmButtonColor: "#FF0000",   
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      showCancelButton: true,     
      closeOnConfirm: false,
      closeOnCancel: false}, 
      
      function(isConfirm){
        if(isConfirm){
          $http.delete('/users/'+name+'/items/' + id).success(function(request){
          $http.request = id
          refresh()
        })
        swal("Deleted!", "The item has been deleted.", "success")
        } else {
            swal("Cancelled", "The item is still there.", "error");
          }
      });
    
  }
  
}])
