'use strict';

describe('Controller: BookingsCtrl', function () {

  // load the controller's module
  beforeEach(module('bookingSystemApp'));

  var BookingsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BookingsCtrl = $controller('BookingsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
