/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',
    'BlurAdmin.pages.menu',
    'BlurAdmin.pages.profile',
    'BlurAdmin.pages.misDatos',
    'BlurAdmin.pages.pedidos',
    'ngAnimate',
    'ngMessages'
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/misDatos');
  }

})();
