(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.misDatos', [])
        .config(routeConfig);
  
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
        .state('misDatos', {
          url: '/misDatos',
          templateUrl: 'app/pages/misDatos/misDatos.html',
          controller: 'MisDatosCtrl as ctrl',
          title: 'Perfil Comercio',
          sidebarMeta: {
            icon: 'ion-home',
            order: 0,
          },
        });
    }
  
  })();