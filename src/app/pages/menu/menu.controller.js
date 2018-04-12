angular.module('BlurAdmin.pages.menu')
    .controller('NewMenuItemController', function ($scope, $window, toastr, toastrConfig) {
        var self = this;
        self.isSubmitted = false;
        self.user = null;
        self.password = null;
        self.toastOptions = {
            autoDismiss: false,
            positionClass: 'toast-top-left',
            type: 'error',
            timeOut: '2000',
            extendedTimeOut: '2000',
            allowHtml: false,
            closeButton: false,
            tapToDismiss: true,
            progressBar: false,
            newestOnTop: true,
            maxOpened: 0,
            preventDuplicates: false,
            preventOpenDuplicates: false,
            title: "Error en la carga del nuevo ítem para el menú"
          };
        self.submit = function () {
            self.toastOptions.msg = null;
            self.isSubmitted = true;
        }
    });