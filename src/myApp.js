var app = angular.module('myApp', []);

app.factory('PersonService', function(visitor, $http) {
  return function Person(name) {
    this.name = name;
    this.greet = function() {
      if(visitor.country === 'UK') {
        return 'Good day to you, ' + this.name + '.';
      } else {
        return 'Hey, ' + this.name + '!';
      }
    };

    this.create = function() {
      return $http.post('/people', this);
    };

    this.remove = function(id) {
      return $http.post('/people/delete/' + id, this);
    };
  };
});

app.controller('PersonController', function($scope, PersonService) {
  this.person = $scope.person = new PersonService('Ben');
});

app.directive('welcome', function() {
  return {
    restrict: 'E',
    scope: {
      person: '='
    },
    template: '<span>{{person.greet()}} Welcome to the app!</span>',
    link: function(scope, element) {
      var original = element.css('color');

      element.on('mouseenter', function() {
        element.css('color', scope.person.favoriteColor);
      });

      element.on('mouseleave', function() {
        element.css('color', original);
      });

      element.on('click', function() {
        element.text('I was Clicked!');
      });
    }
  };
});