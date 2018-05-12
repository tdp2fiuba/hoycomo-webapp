(function () {
    'use strict';

    var sliderValues = [
        "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", 
        "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", 
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
        "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", 
        "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
        '24:00'
      ];

    function DayAvailability(day, startTime, endTime) {
        var self = this;
        var daysNames = {
            "monday": "Lunes",
            "tuesday": "Martes",
            "wednesday": "Miércoles",
            "thursday": "Jueves",
            "friday": "Viernes",
            "saturday": "Sábado",
            "sunday": "Domingo"
        };
        var parseAvailabilityTime = function (startTime, endTime) {
            if (startTime === "00:00:00" && endTime === "24:00:00") {
                return "Todo el día";
            }
            if (startTime === "00:00:00" && endTime === "00:00:00") {
                return "Cerrado";
            } 
            return self.parsedStartTime + "-" + self.parsedEndTime + "hs";
        }
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
        this.parsedStartTime = moment(this.startTime, "HH:mm:ss").format('HH:mm');
        this.parsedEndTime = moment(endTime, "HH:mm:ss").format('HH:mm');
        this.parsedDay = daysNames[day];
        this.parseAvailabilityTime = parseAvailabilityTime(startTime, endTime);
        this.handleSliderChange = function (data) {
            self.startTime = data.from_value + ":00";
            self.endTime = data.to_value + ":00";
        }
        this.getStartTime = function () {
            var startTimeParsed = moment(startTime, "HH:mm:ss").format('HH:mm');
            return sliderValues.findIndex(function (item) { return item === self.parsedStartTime });
        }
        this.getEndTime = function () {
            var i = sliderValues.findIndex(function (item) { 
                if (self.endTime === '24:00:00' && item === '24:00') {
                    return true;
                }
                if (self.endTime === '24:00:00' && item === '00:00') {
                    return false;
                }
                return item === self.parsedEndTime 
            });

            return i;
        }
    }

    angular.module('BlurAdmin.pages.misDatos')
           .controller('MisDatosCtrl', MisDatosCtrl);
  
    /** @ngInject */
    function MisDatosCtrl($scope, credentialsService, foodTypesService, storeService, fileReader, $filter, toastr, toastrConfig) {
        var self = this;
        var foodTypesDefaultClasses = 'btn btn-default';
        var foodTypesErrorClasses = 'btn btn-default btn-error';
        var logoDefaultClass = 'userpic';
        var logoErrorClass = 'userpic userpic-error'

        self.foodTypeClasses = foodTypesDefaultClasses;
        self.logoClass = logoDefaultClass;
        $scope.sliderValues = sliderValues

        self.multiselectSettings = {
            smartButtonMaxItems: 3, 
            smartButtonTextConverter: function(itemText, originalItem) { 
                return itemText; 
            },
            scrollable: true,
            scrollableHeight: '250px'
        };

        self.foodTypes = [];
        self.profile = {
            id: 0,
            name: '',
            availability: {},
            logo: '',
            logoType: '',
            storeFoodTypes: [],
            storeFoodTypesString: function () {
                return this.storeFoodTypes.map(function (item) { return item.id }).join(', ');
            }
        }

        $scope.ctrl = self;

        var toastOptions = {
            autoDismiss: false,
            positionClass: 'toast-top-right',
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
            allowHtml: true
        };

        var defaultAvailability = [
            new DayAvailability("monday", "00:00:00", '24:00:00'),
            new DayAvailability("tuesday", "00:00:00", '24:00:00'),
            new DayAvailability("wednesday", "00:00:00", '00:00:00'),
            new DayAvailability("thursday", "00:00:00", '24:00:00'),
            new DayAvailability("friday", "00:00:00", '24:00:00'),
            new DayAvailability("saturday", "00:00:00", '24:00:00'),
            new DayAvailability("sunday", "00:00:00", '24:00:00')
        ];

        var mapAvailability = function (availability) {
            return Object.keys(availability).map(function (day) {
                var dayAvailability = availability[day];
                var startTime = dayAvailability.start_time ? dayAvailability.start_time : "00:00:00";
                var endTime = dayAvailability.end_time ? dayAvailability.end_time : "24:00:00";
                return new DayAvailability(day, startTime, endTime);
            });
        }

        $scope.loadProfile = function () {
            $scope.showAddProfile = false;
            $scope.saving = false;
            $scope.loading = true;
            foodTypesService.getAll().then(function (data) {
                self.foodTypes = data.data.map(function(item) { return { id: item.description, label: item.description  }});
                storeService.getStore(credentialsService.getUser()).then(function (storeData) {
                    $scope.loading = false;
                    var profile = storeData.data;
                    self.profile.id = profile.id;
                    self.profile.name = profile.name;
                    self.profile.availability = profile.availability;

                    $scope.profileLoaded = profile ? !!profile.availability.monday.start_time : false;
                    
                    if (profile.availability) {
                        self.profile.availability = profile.availability ? mapAvailability(profile.availability) : defaultAvailability.slice(0);
                    }
                    if (profile.avatar) {
                        self.profile.logo = profile.avatar ? profile.avatar : $filter('appImage')('theme/no-photo.png');
                        var logoFileParts = self.profile.logo.split('.');
                        self.profile.logoType = logoFileParts[logoFileParts.length - 1];
                    }

                    self.profile.storeFoodTypes = profile.food_types.map(function(item) { return { id: item, label: item  }});
                })
            }).catch(function (err) {
                $scope.loading = false;
                console.log(err);
            });
        }
        
        $scope.toggleEditProfile = function () {
            $scope.showAddProfile = !$scope.showAddProfile;
        }

        $scope.uploadPicture = function () {
            var fileInput = document.getElementById('uploadFile');
            fileInput.click();
        };

        $scope.getFile = function () {
            var currentScope = this;
            if (currentScope && currentScope.file.type.indexOf("image/") > -1) {
                self.profile.logoType = currentScope.file.type.replace("image/", "");
                fileReader.readAsDataUrl(currentScope.file, $scope)
                    .then(function (result) {
                        $scope.ctrl.profile.logo = result;
                    });
            } else {
                angular.extend(toastrConfig, toastOptions);
                toastr["error"]("Tipo de archivo no permitido", "Error al subir logo");
            }
        };

        $scope.saveProfile = function () {
            if (self.profile.logoType && self.profile.storeFoodTypes.length !== 0) {
                self.logoClass = logoDefaultClass;
                self.foodTypeClasses = foodTypesDefaultClasses;
                var daysAvailability = {};
                angular.forEach(self.profile.availability, function (day) {
                    daysAvailability[day.day] = {
                        start_time: day.startTime,
                        end_time: day.endTime
                    }
                });
                var profile = {
                    id: self.profile.id,
                    name: self.profile.name,
                    availability: daysAvailability,
                    avatar: self.profile.logo,
                    avatarType: self.profile.logoType,
                    foodTypes: self.profile.storeFoodTypes
                }
                $scope.saving = true;
                storeService.saveProfile(profile).then(function (data) {
                    $scope.saving = false;
                    self.profile.availability = profile.availability;
                    self.profile.avatar = data.data.avatar;
                    $scope.profileLoaded = true;
                    $scope.showAddProfile = false;
                    $scope.loadProfile();
                }).catch(function (err) {
                    $scope.saving = false;
                    angular.extend(toastrConfig, toastOptions);
                    toastr["error"]("Hubo un error intentando guardar el perfil. Intente nuevamente", "Error guardando perfil");
                })
            } else {
                var message = ""
                if (self.profile.storeFoodTypes.length === 0) {
                    message += "Debe elegir al menos un tipo de comida<br>";
                    self.foodTypeClasses = foodTypesErrorClasses;
                }
                if (!self.profile.logoType) {
                    message += "Debe elegir una nueva imagen desde su PC";
                    self.logoClass = logoErrorClass;
                }
                angular.extend(toastrConfig, toastOptions);
                toastr["error"](message, "Error guardando perfil");
            }
        }

        $scope.$watch('ctrl.storeFoodTypes.length', function (newValue) {
           if (newValue > 0 && self.foodTypeClasses === foodTypesErrorClasses) {
               self.foodTypeClasses = foodTypesDefaultClasses;
           }
        });

        $scope.loadProfile();
    }
})();  