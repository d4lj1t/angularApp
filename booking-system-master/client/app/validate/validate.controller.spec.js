'use strict';

describe('Controller: ValidateCtrl', function () {

  // load the controller's module
  beforeEach(module('bookingSystemApp'));

  var ValidateCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ValidateCtrl = $controller('ValidateCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
