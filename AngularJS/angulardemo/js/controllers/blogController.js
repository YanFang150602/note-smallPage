define([], function(){
    var blogCtrl = ['$scope', '$state', function(scope, state){
        scope.blogMsg = 'this is blog page!';
        scope.goBack = function() {
            state.go('home');
        }
    }];
    
    // return blogCtrl;
    
    var module = angular.module('cmn');
    module.controller('blogCtrl', blogCtrl);
    // return module;
});
