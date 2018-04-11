(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.currentDashboard', [])
        .config(routeConfig);
  
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
        .state('currentDashboard', {
          url: '/currentDashboard',
          templateUrl: 'app/pages/currentDashboard/currentDashboard.html',
          controller: 'MainCtrl',
          title: 'Dashboard Mock',
          sidebarMeta: {
            order: 800,
          },
        });
    }
  
  })();