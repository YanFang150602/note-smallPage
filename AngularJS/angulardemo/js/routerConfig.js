define(function(){
    var module = angular.module('cmn', ['ui.router']);
    module.config(function($stateProvider){
        $stateProvider.state({
            name: 'home',
            url: '/home',
            templateUrl: 'views/home.html',
            controller: 'homeCtrl',
            // controllerUrl: 'controllers/homeController.js'
        }).state({
            name: 'blog',
            url: '/blog',
            templateUrl: 'views/blog.html',
            controller: 'blogCtrl'
            // controllerUrl: 'controllers/blogController.js'
        });
    });
    
    return module;
});
