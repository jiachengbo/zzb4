(function () {
  'use strict';

  // https://gist.github.com/rhutchison/c8c14946e88a1c8f9216

  angular
    .module('core')
    .factory('Timer', Timer);

  Timer.$inject = [];

  function Timer() {
    var time = {};
    time.format = function (time, typ) {
      var t;
      var type = typ || 'second';
      if (type === 'day') {
        t = time.slice(0, -8);
      } else if (type === 'min') {
        t = time.replace('T', ' ');
        t = t.slice(0, -8);
      } else {
        t = time.replace('T', ' ');
        t = t.slice(0, -5);
      }
      return t;
    };
    return time;
  }
}());
