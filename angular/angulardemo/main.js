require(['js/cmn'],function(module){
    require([
        'js/controllers/homeController',
        'js/controllers/blogController'
    ], function(){
        console.log('load controllers');
        angular.element(document).ready(function(){
            console.log('angular bootstrap:' + module.name);
            angular.bootstrap(document, [module.name]);
        });
    });
});
