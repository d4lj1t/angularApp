'use strict';

angular.module('bookingSystemApp')
    .controller('BookingsCtrl', function ($scope, Bookings, Devices, User, $firebaseObject, $firebaseArray, $stateParams, growl, $resource, socketFactory, Auth,$filter) {
        var deviceId = $stateParams.deviceId || $scope.device.$id;
        $scope.user = null;
        $scope.step = 1;

        // socket.io now auto-configures its connection when we ommit a connection url
        var ioSocket = io('', {
            // Send auth token on connection, you will need to DI the Auth service above
            // 'query': 'token=' + Auth.getToken()
            path: '/socket.io-client'
        });

        var socket = socketFactory({
            ioSocket: ioSocket
        });

        socket.on('user:save', function (item) {
            if ($scope.user) {
                if (item._id === $scope.user._id) {
                    $scope.user = item;
                    $scope.checkTest();
                }
            } else {
                if ($scope.step === 2 && item.email === $scope.email) {
                    $scope.user = item;
                    $scope.step = 3;
                }
            }
        });

        $scope.dateToday = new Date();

        var date = $scope.dateToday;
        $filter('date')(date, 'hh:mm a, EEE dd-MMM-yy');

        $scope.device = {brand: 'Loading', name: 'Please Wait'};
        $scope.event = {
            user: '',
            start: date.setHours(date.getHours() + 1),
            end: date.setHours(date.getHours() + 1)

            /* start: new Date(),
             end: new Date()*/
        };

        $scope.users = User.query();
        $scope.bookings = $firebaseArray(Bookings.findByDeviceId(deviceId));


        var isDateBefore = function () {
            var bookingStart = moment(new Date($scope.event.start));

            return bookingStart.isBefore(new Date().setHours(new Date().getHours() + 1));
        };

        var isEndBeforeStart = function () {
            var bookingStart = moment(new Date($scope.event.start));

            return bookingStart.isAfter(new Date(event.end));
        };

        var isDateAvailable = function () {
            var isValid = true;


            for (var i = 0; i < $scope.bookings.length; i++) {

                var booking = $scope.bookings[i];
                var bookingStart = moment(new Date(booking.start));
                var bookingEnd = moment(new Date(booking.end));

                var newEventStart = moment(new Date($scope.event.start));
                var newEventEnd = moment(new Date($scope.event.end));


                if (newEventStart.isBetween(bookingStart, bookingEnd) || newEventEnd.isBetween(bookingStart, bookingEnd) && bookingStart.isBetween(newEventStart, newEventEnd) || bookingEnd.isBetween(newEventStart, newEventEnd) || newEventEnd.isSame(bookingEnd) || newEventStart.isSame(bookingStart)) {
                    isValid = false;
                    break;
                }

            }

            return isValid;

            //var date = moment();
            //var startDate = $scope.event.start;
            //var endDate = $scope.event.end;
            //
            //date.isBetween(startDate, endDate); //false in this case
            //console.log(date.isBetween(startDate, endDate))
        };

        $firebaseObject(Devices).$loaded().then(function (data) {
            $scope.devices = data;
            $scope.device = $scope.devices[deviceId];
        });

        $scope.addCalItem = function () {
            $scope.step = 1;
            if (isUserValid()) {
                if (isDateBefore()) {
                    $scope.error = 'Date should be atleast an hour from now';
                    growl.warning('Date should be atleast an hour from now');
                } else if (isEndBeforeStart()) {
                    $scope.error = 'Device Unavailable';

                    growl.warning('Device Unavailable');
                } else if (isDateAvailable()) {
                    $scope.step = 4;
                    $scope.booking = $scope.event;
                    $scope.event.device = deviceId;
                    $scope.event.start = $scope.event.start.toString();
                    $scope.event.end = $scope.event.end.toString();
                    $scope.event.user = $scope.user._id;

                    $scope.bookings.$add($scope.event);
                    growl.success('Confirm Booking Via Link In Email');
                    return true;
                }
                else {
                    $scope.error = 'Device Unavailable';
                    growl.warning('Device Unavailable');
                    return false;
                }
            } else {
                $scope.step = 2;
            }
        };

        $scope.resCalItem = function () {
            $scope.userName = {};
            $scope.event = {
                user: '',
                start: moment().format('dddd, Do:MMMM:YYYY, h:mm A'),
                end: moment().format('dddd, Do:MMMM:YYYY, h:mm A')
            };
            //var index = $scope.bookings.indexOf(item);
            //$scope.calEvents2.splice(index, 1);
            //$scope.eventToShow = null;
        };

        $scope.addEmail = function (email) {
            $scope.emailUrl = email.replace(/.*@/, 'https://');
            if($scope.emailUrl === 'hof.co.uk' || $scope.emailUrl === 'houseoffraser.co.uk') {
                $scope.emailUrl = 'https://hofwebmail.co.uk/exchange/';
            }

            Auth.createUser({
                name: ' ',
                email: email,
                password: 'tesla'
            });
        };


        var isUserValid = function () {
            var UserApi = $resource('/api/users/:email/find', {email: '@email'});

            if (!$scope.user) {
                if (typeof $scope.email === 'object') {
                    $scope.user = $scope.email;
                    return true;
                }
                else {
                    var user = UserApi.get({email: $scope.email});

                    user.$promise.then(function (successData) {
                        $scope.user = successData;
                        return true;
                    }, function () {
                        return false;
                    });
                }
            } else {
                return true;
            }
        };


        $scope.checkTest = function () {
            $scope.step = 1;
            if (isUserValid()) {
                if (isDateBefore()) {
                    $scope.error = 'Date should be after today';
                    growl.warning('Date should be after today');
                } else if (isEndBeforeStart()) {
                    $scope.error = 'Device Unavailable';

                    growl.warning('Device Unavailable');
                } else if (isDateAvailable()) {
                    $scope.step = 4;
                    $scope.booking = $scope.event;
                    growl.success('Confirm Booking Via Link In Email');
                    return true;
                }
                else {
                    $scope.error = 'Device c';
                    growl.warning('Device Unavailable');
                    return false;
                }
            } else {
                $scope.step = 2;
            }
        };

    });
