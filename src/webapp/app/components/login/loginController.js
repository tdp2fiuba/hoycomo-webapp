app.controller('LoginCtrl', function($scope, loginService) {
    var self = this;
    self.isSubmitted = false;
    self.user = null;
    self.password = null;

    self.handleSubmit = function () {
        self.errorMessage = null;
        self.isSubmitted = true;
        loginService.login({ user: self.user, password: self.password })
                    .then(function (account) {
                        self.isSubmitted = false;
                        //alert("Success " + account);
                    })
                    .catch(function (err) {
                        self.isSubmitted = false;
                        self.errorMessage = err.data.message;
                    })
    }
})