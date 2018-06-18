'use strict';

angular.module('BlurAdmin', [
  'ng',
  'ngAnimate',
  'ui.bootstrap',
  'ui.sortable',
  'ui.router',
  'ngTouch',
  'ngMessages',
  'toastr',
  'smart-table',
  "xeditable",
  'ui.slimscroll',
  'ngJsTree',
  'angular-progress-button-styles',
  'BlurAdmin.theme',
  'BlurAdmin.pages',
  'ngCookies',
  'sharedServices',
  'angularjs-dropdown-multiselect'
])

    .factory('Server', function () {
        var SERVER_URI = "https://hoycomo-server.herokuapp.com";
        //var SERVER_URI = "http://localhost:8080";

        function getLeadTime(start,end,callback) {
            var response = {};

            if (!start || !end){
                response.success = false;
                response.error = "Debe ingresar una fecha de inicio";
                return response;
            }
            if (!end){
                response.success = false;
                response.error = "Debe ingresar una fecha de fín";
                return response;
            }
            $.get(SERVER_URI + "/api/stats/fee",{start_date:start,end_date:end})
                .done(function (dataResponse) {
                    response.success = true;
                    response.fee = dataResponse;
                    callback(response);
                })
                .fail(function ( jqXHR, textStatus) {
                    response.success = false;
                    response.error = jqXHR.responseJSON.message || "intente nuevamente más tarde";
                    callback(response);
                });
        }

        return {
            getLeadTime          : getLeadTime
        }
    });

