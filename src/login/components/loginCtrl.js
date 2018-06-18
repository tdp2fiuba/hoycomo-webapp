angular.module('BlurAdmin.login')
    .controller('LoginCtrl', function ($scope, $window, credentialsService, toastr, toastrConfig) {
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
            title: "Error en el inicio de sesión"
          };
        self.credentialsService = credentialsService;
        self.handleSubmit = function () {
            self.toastOptions.msg = null;
            self.isSubmitted = true;
            self.credentialsService.login({ user: self.user, password: self.password })
                    .then(function (account) {
                        self.isSubmitted = false;
                        //self.credentialsService.saveProfileCookie(account.data.store_id);
                        $window.location.href = $window.location.origin + "/";
                    })
                    .catch(function (err) {
                        self.isSubmitted = false;
                        if (err.data) {
                            self.toastOptions.msg = err.data.message;
                        } else {
                            self.toastOptions.msg = "Hubo un error contactándose con el servidor. Intente nuevamente"
                        }
                        angular.extend(toastrConfig, self.toastOptions);
                        toastr["error"](self.toastOptions.msg, self.toastOptions.title);
                    })
        }

        self.logout = function () {
            alert("HERE");
        }
    })