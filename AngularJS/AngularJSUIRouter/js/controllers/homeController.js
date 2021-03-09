define([], function(){
    var homeCtrl = ['$scope', '$state', function(scope, state){
        scope.welcome = 'Welcome to the Home Page!';
    }];
    
    var module = angular.module('cmn');
    module.controller('homeCtrl', homeCtrl);
});
