'use strict';

describe('Filter: findUserById', function () {

  // load the filter's module
  beforeEach(module('bookingSystemApp'));

  // initialize a new instance of the filter before each test
  var findUserById;
  beforeEach(inject(function ($filter) {
    findUserById = $filter('findUserById');
  }));

  it('should return the input prefixed with "findUserById filter:"', function () {
    var text = 'angularjs';
    expect(findUserById(text)).toBe('findUserById filter: ' + text);
  });

});
