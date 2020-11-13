require(['js/cmn'],function(module){
    require([
        'js/controllers/homeController',
        'js/controllers/blogController'
    ], function(){
        angular.element(document).ready(function() {
          angular.bootstrap(document, [module.name]);   
        });
    });
});
