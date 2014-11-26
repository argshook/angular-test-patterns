describe('PersonServiceService', function() {
  var PersonService, visitor, $httpBackend;
  beforeEach(module('myApp'));

  beforeEach(module(function($provide) {
    visitor = {};
    $provide.value('visitor', visitor);
  }));

  beforeEach(inject(function(_PersonService_, _$httpBackend_) {
    PersonService = _PersonService_;
    $httpBackend = _$httpBackend_;
  }));

  describe('Constructor', function() {
    it('should assign a name', function () {
      expect(new PersonService('Ben').name).toBe('Ben');
    });

    it('should greet UK visitors formally', function() {
      visitor.country = 'UK';
      expect(new PersonService('Nigel').greet()).toBe('Good day to you, Nigel.');
    });

    it('should greet other visitors informally', function() {
      expect(new PersonService('Michael Jackson').greet()).toBe('Hey, Michael Jackson!');
    });
  });

  it('create() should create the person on the server', function() {
    $httpBackend
      .expectPOST('/people', {
        name: 'Ben'
      })
      .respond(200);
    var succeeded;
    new PersonService('Ben').create()
      .then(function() {
        succeeded = true;
      });

    $httpBackend.flush();
    expect(succeeded).toBe(true);
  });

  it('remove() should remove the person from the server', function() {
    $httpBackend
      .expectPOST('/people/delete/1')
      .respond(200);
    var succeeded;
    new PersonService('Ben').remove(1)
      .then(function() {
        succeeded = true;
      });
    $httpBackend.flush();
    expect(succeeded).toBe(true);
  });

});

describe('Person Controller', function() {
  var PersonService, controller, scope;

  beforeEach(module('myApp'));
  beforeEach(module(function($provide) {
    $provide.value('visitor', {});
  }));
  beforeEach(inject(function(_PersonService_, $controller, $rootScope) {
    PersonService = _PersonService_;
    scope = $rootScope.$new();
    controller = $controller('PersonController', {
      $scope: scope
    });
  }));

  it('should assign a person to the controller', function() {
    expect(controller.person instanceof PersonService).toBe(true);
  });

  it('should assign a person to the scope', function() {
    expect(scope.person instanceof PersonService).toBe(true);
  });
});

describe('Welcome Directive', function() {
  var element, scope;

  beforeEach(module('myApp'));
  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope.$new();
    element = $compile('<welcome person="person"></welcome>')(scope);
  }));

  it('should welcome the person', function() {
    scope.person = {
      greet: function() {
        return 'Hello!';
      }
    };
    scope.$digest();
    expect(element.find('span').text()).toBe('Hello! Welcome to the app!');
  });

  it('should display the persons favorite color on hover', function() {
    scope.person = {
      greet: function() {
        return 'Hello!';
      },
      favoriteColor: 'blue'
    };
    scope.$digest();
    element.triggerHandler('mouseenter');
    expect(element.css('color')).toBe('blue');
    element.triggerHandler('mouseleave');
    expect(element.css('color').length).toBe(0);
  });

  it('should change text on click', function() {
    element.triggerHandler('click');
    expect(element.text()).toBe('I was Clicked!');
  });
});
