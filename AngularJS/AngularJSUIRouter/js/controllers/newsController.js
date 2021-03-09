define([], function(){
    var newsCtrl = ['$scope', '$state', function(scope, state){
        scope.newsMsg = 'this is news page!';
        scope.goBack = function() {
            state.go('home');
        }
    }];
    
    var module = angular.module('cmn');
    module.controller('newsCtrl', newsCtrl);
});
