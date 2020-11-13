define([], function(){
    var blogCtrl = ['$scope', '$state', function(scope, state){
        scope.blogMsg = 'this is blog page!';
        scope.goBack = function() {
            state.go('home');
        }
    }];
    
    var module = angular.module('cmn');
    module.controller('blogCtrl', blogCtrl);
});
