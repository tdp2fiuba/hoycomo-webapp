(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.currentDashboard')
      .controller('MainCtrl', MainCtrl);
  
    /** @ngInject */
    function MainCtrl($scope, credentialsService, $window) {
        if (!credentialsService.isLoggedIn) {
            $window.location.href = $window.location.origin + "/auth.html";
        }
    }
})();  