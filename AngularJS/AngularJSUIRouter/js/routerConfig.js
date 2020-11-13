define(function(){
    var module = angular.module('cmn', ['ui.router']);
    module.config(function($stateProvider){
        $stateProvider.errorOnUnhandledRejections = false;

        $stateProvider.state({
            name: 'home',
            url: '/home',
            templateUrl: 'views/home.html',
            controller: 'homeCtrl'
        }).state({
            name: 'blog',
            url: '/blog',
            templateUrl: 'views/blog.html',
            controller: 'blogCtrl'
        });
    });
    return module;
});
