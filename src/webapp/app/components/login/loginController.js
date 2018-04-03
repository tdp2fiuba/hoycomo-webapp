app.controller('LoginCtrl', function($scope, loginService) {
    var self = this;
    self.isSubmitted = false;
    self.user = null;
    self.password = null;
    self.loginError = false;

    self.handleSubmit = function () {
        self.isSubmitted = true;
        self.loginError = false;
        self.backendErrors = [];
        loginService.login({ user: self.user, password: self.password })
                    .then(function (account) {
                        self.isSubmitted = false;
                        //alert("Success " + account);
                    })
                    .catch(function (err) {
                        self.isSubmitted = false;
                        self.loginError = true;
                        self.backendErrors.push(err.data.message);
                    })
    }
})