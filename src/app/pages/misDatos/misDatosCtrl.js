(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.misDatos')
           .controller('MisDatosCtrl', MisDatosCtrl);
  
    /** @ngInject */
    function MisDatosCtrl($scope, credentialsService, fileReader, $filter, storeService, toastr, toastrConfig) {
        
        $scope.sliderValues = [
          "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", 
          "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", 
          "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
          "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
          "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", 
          "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
          '24:00'
        ];

        var toastOptions = {
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
            preventOpenDuplicates: false
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

        var mapAvailability = function () {
            return Object.keys($scope.profile.availability).map(function (day) {
                var dayAvailability = $scope.profile.availability[day];
                var startTime = dayAvailability.start_time ? dayAvailability.start_time : "00:00:00";
                var endTime = dayAvailability.end_time ? dayAvailability.end_time : "24:00:00";
                return new DayAvailability(day, startTime, endTime);
            });
        }

        $scope.loadProfile = function () {
            $scope.showAddProfile = false;
            $scope.saving = false;
            $scope.loading = true;
            storeService.getStore(credentialsService.getUser()).then(function (data) {
                $scope.loading = false;
                $scope.profile = data.data;
                $scope.profileLoaded = $scope.profile ? !!$scope.profile.availability.monday.start_time : false;
                $scope.availability = $scope.profile.availability ? mapAvailability() : defaultAvailability.slice(0);
                $scope.logo = $scope.profile.avatar ? $scope.profile.avatar : $filter('appImage')('theme/no-photo.png');
            }).catch(function (err) {
                $scope.loading = false;
                console.log(err);
            })
        }

        $scope.loadProfile();
        
        $scope.addProfile = function () {
            $scope.showAddProfile = true;
        }

        $scope.uploadPicture = function () {
            var fileInput = document.getElementById('uploadFile');
            fileInput.click();
        };

        $scope.getFile = function () {
            var currentScope = this;
            if (currentScope.file.type.indexOf("image/") > -1) {
                $scope.logoType = currentScope.file.type.replace("image/", "");
                fileReader.readAsDataUrl(currentScope.file, $scope)
                    .then(function (result) {
                        $scope.logo = result;
                    });
            } else {
                angular.extend(toastrConfig, toastOptions);
                toastr["error"]("Tipo de archivo no permitido", "Error al subir logo");
            }
        };

        $scope.saveProfile = function () {
            if ($scope.logoType) {
                var daysAvailability = {};
                angular.forEach($scope.availability, function (day) {
                    daysAvailability[day.day] = {
                        start_time: day.startTime,
                        end_time: day.endTime
                    }
                });
                var profile = {
                    id: $scope.profile.id,
                    name: $scope.profile.name,
                    availability: daysAvailability,
                    avatar: $scope.logo,
                    avatarType: $scope.logoType
                }
                $scope.saving = true;
                storeService.saveProfile(profile).then(function (data) {
                    $scope.saving = false;
                    $scope.profile.availability = profile.availability;
                    $scope.profile.avatar = data.data.avatar;
                    $scope.profileLoaded = true;
                    $scope.showAddProfile = false;
                    $scope.loadProfile();
                }).catch(function (err) {
                    $scope.saving = false;
                    angular.extend(toastrConfig, toastOptions);
                    toastr["error"]("Hubo un error intentando guardar el perfil. Intente nuevamente", "Error guardando perfil");
                })
            } else {
              angular.extend(toastrConfig, toastOptions);
              toastr["error"]("Debe elegir una nueva imagen desde su PC", "Error guardando perfil");
            }
        }
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
                var startTimeParsed = moment(startTime, "HH:mm:ss").format('HH:mm');
                var endTimeParsed = moment(endTime, "HH:mm:ss").format('HH:mm');
                return startTimeParsed + "-" + endTimeParsed + "hs";
            }
            this.day = day;
            this.startTime = startTime;
            this.endTime = endTime;
            this.parsedDay = daysNames[day];
            this.parseAvailabilityTime = parseAvailabilityTime(startTime, endTime);
            this.handleSliderChange = function (data) {
                self.startTime = data.from_value + ":00";
                self.endTime = data.to_value + ":00";
            }
        }
    }
})();  