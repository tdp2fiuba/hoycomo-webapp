(function () {
    'use strict';
  
    angular.module('BlurAdmin.theme')
        .filter('maxLength', maxLength);
  
    /** @ngInject */
    function maxLength() {
        return function(text, limit) {
            if (text) {
                if (text.length <= limit) {
                    return text;
                }
                return text.substring(0, limit - 3) + "...";
            }
            return text;
        };
    }
  
  })();