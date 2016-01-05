'use strict';

angular.module('bookingSystemApp')
  .controller('DevicesCtrl', function ($scope, Devices, $firebaseArray, $timeout, growl) {
    $scope.devices = $firebaseArray(Devices);
    $scope.newDevice = null;



    function clearForm(newDevice) {
      newDevice.brand = '';
      newDevice.name = '';
      newDevice.softwareVersion = '';
      newDevice.imgUrl = '';
      newDevice.dummy1 = '';
    }


    $scope.test = function () {

    };

    $scope.addDevice = function (newDevice) {
      $scope.devices.$add(newDevice);
      clearForm(newDevice);
      growl.success('Device Added');

    };

    $scope.updateDevice = function (device) {
      $scope.devices.$save(device);
      device.isHidden = true;
      device.isReadonly = true;
      growl.success('Updated');
    };

    $scope.editDevice = function (device) {
      device.isReadonly = false;
      device.isHidden = false;
      device.focusItem = false;
    };


    $scope.removeDevice = function (device) {
      var result = confirm('Are you sure you want to remove?');
      if (result) {
        $scope.devices.$remove(device);
      }
    };

    $scope.buttonText = 'Add Device';


  });




