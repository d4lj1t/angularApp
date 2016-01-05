'use strict';
angular.module('bookingSystemApp')
    .controller('MainCtrl', function ($scope, Devices, $firebaseArray, $location, Auth, socketFactory, $modal, $timeout) {
        $scope.devices = $firebaseArray(Devices);
        $scope.templateUrl = 'components/bookings/bookingsModal.html';
        $scope.device = {};

        $scope.user = Auth.getCurrentUser();

        $scope.go = function (path) {
            $location.path(path);
        };

        $scope.gotoBooking = function (deviceId) {
            $scope.go('/bookings/' + deviceId);
        };

        var deviceDelay = 800;

        function hideDevice(deviceToRead) {
            deviceToRead.css = {'width': '0px', 'opacity': '0', 'margin': '0', 'padding': '0'};

            //var deviceDiv =  $('#' + deviceToRead.$id).parent().css('opacity', 0);
            //$timeout(function() {
            //    deviceDiv.css('display', 'none');
            //},deviceDelay);
        }

        function showDevice(deviceToRead) {
            deviceToRead.css = {};
            deviceToRead.class = '';

            //var deviceDiv =  $('#' + deviceToRead.$id).parent().css('opacity', 1);
            //$timeout(function() {
            //    deviceDiv.css('display', '');
            //},deviceDelay);
        }

        function newDeviceLocation(deviceId) {
            var currentPos = $('#'+ deviceId).offset();

            console.log(currentPos);

            var loc = {
                left: 0,
                top: -40
            };

            // var setPos = {
            //     left: (loc.left - currentPos.left),
            //     top: (loc.top - currentPos.top)
            // };

            return { transform :'translate('+ loc.left+'px ,'+ loc.top +'px)'};
        }

        var showBookingForm = function (device) {
            for (var i = 0; i < $scope.devices.length; i++) {
                var deviceToRead = $scope.devices[i];
                if (device.$id !== deviceToRead.$id) {
                    hideDevice(deviceToRead);
                }
            }

            $timeout(function() {
            device.css = newDeviceLocation(device.$id);
            $scope.device = device;
            },deviceDelay);
        };

        var showAllPhones = function () {
            for (var i = 0; i < $scope.devices.length; i++) {
                var deviceToRead = $scope.devices[i];
                showDevice(deviceToRead);
            }
        };


        $scope.open = function (device) {

            if(device.show){
                device.class = '';
                showAllPhones();
            }else {
                            device.class = 'clicked';
                showBookingForm(device);
            }
             device.show = !device.show;

            //
            //
            //console.log(device);
            //for (var i = 0; i < $scope.devices.length; i++) {
            //    var deviceToRead = $scope.devices[i];
            //    if (device.$id !== deviceToRead.$id) {
            //        if (!device.show) {
            //            hideDevice(deviceToRead);
            //        }
            //        else {
            //            showDevice(deviceToRead);
            //        }
            //    } else {
            //
            //    }
            //}
            //
            //if (device.show) {
            //    device.show = !device.show;
            //    $scope.device = device;
            //} else
            //    $timeout(function () {
            //        device.show = !device.show;
            //        $scope.device = device;
            //    }, 300);
            //$modal.open({
            //    animation: $scope.animationsEnabled,
            //    templateUrl: 'components/bookings/bookingsModal.html',
            //    controller: 'BookingsCtrl',
            //    resolve: {
            //        device: function () {
            //            return device;
            //        }
            //    }
            //});
        };

    });
