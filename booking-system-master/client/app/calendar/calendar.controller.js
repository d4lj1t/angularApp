'use strict';

angular.module('bookingSystemApp')
  .controller('CalendarCtrl', function ($scope, Bookings, Devices, $firebaseArray, User, Auth) {
    $scope.isAdmin = Auth.isAdmin;
    /*       var deviceId = $stateParams.deviceId || $scope.device.$id;
     $scope.bookings = $firebaseArray(Bookings.findByDeviceId(deviceId));*/


    var bookings = [];
    var deviceBookingsRepo = null;
    var users = null;
    var devices = null;

    var colors = ['#2F6690', '#3A7CA5', '#D9DCD6', '#EBF2FA', '#81C3D7'];

    function getRandomColor() {
      var colorId = Math.floor(Math.random() * 5);
      return colors[colorId];
    }

    $scope.alertOnEventClick = function (booking) {
      booking._start = new Date(booking._start);
      booking._end = new Date(booking._end);

      $scope.booking = booking;
    };


    $firebaseArray(Bookings.all).$loaded(function (bookingsArray) {
      deviceBookingsRepo = bookingsArray;
      $firebaseArray(Devices).$loaded(function (devicesArray) {
        devices = devicesArray;
        User.query().$promise.then(function (usersArray) {
          users = usersArray;
          createCalBookings();
        });
      });
    });

    var createCalBookings = function () {
      for (var i = 0; i < deviceBookingsRepo.length; i++) {
        var device = deviceBookingsRepo[i];


        for (var bookingId in device) {
          var booking = device[bookingId];

          if (typeof booking === 'object' && booking !== null) {
            var user = findUser(booking.user);
            var dev = findDevice(device.$id);
            if (user) {
              booking.title = dev.brand + ' ' + dev.name + ' - ' + user.email;
            } else {
              booking.title = dev.brand + ' ' + dev.name;
            }

            booking.start = new moment(booking.start);
            booking.end = new moment(booking.end);
            booking.stick = true;


            booking.color = getRandomColor();
            booking.textColor = '#20172C';
            bookings.push(booking);
          }
        }
      }
    };


    $scope.uiConfig = {
      calendar: {
        firstDay: 1,
        weekends: false,
        height: 600,
        editable: true,
        header: {
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick
      }
    };

    $scope.eventSources = [bookings];

    $scope.removeBooking = function (booking) {
      $scope.bookings.$remove(booking);
    };


    var findDevice = function (deviceId) {
      for (var i = 0; i < devices.length; i++) {
        var device = devices[i];

        if (device.$id === deviceId) {
          return device;
        }
      }
    };

    var findUser = function (userId) {
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if (user._id === userId) {
          return user;
        }
      }
    };
  });


angular.module('bookingSystemApp').controller('CalendarModalCtrl', function ($scope, $modalInstance, booking) {

  $scope.booking = booking;

  $scope.ok = function () {
    $modalInstance.close();
  };
});
