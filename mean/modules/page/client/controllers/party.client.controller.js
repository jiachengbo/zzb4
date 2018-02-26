(function () {
  'use strict';

  angular
    .module('global')
    .controller('PartyController', PartyController);

  PartyController.$inject = ['$state', '$scope', 'menuService', 'appService', '$window'];
  function PartyController($state, $scope, menuService, appService, $window) {
    var vm = this;
    vm.imgName = $state.$current.data.pageTitle;
    console.log($window);
    if (appService.user) {
      menuService.leftMenusCollapsed = true;
    }
    if (appService.user2) {
      menuService.leftMenusCollapsed = false;
    }
    vm.imgdata = [{
      id: 1,
      image: 'http://img15.3lian.com/2016/h1/11/126.jpg',
      text: 'nihao'
    }, {
      id: 2,
      image: 'http://img15.3lian.com/2016/h1/11/126.jpg',
      text: 'nihao'
    }];
    // for (vm.i = 0; vm.i < data.length; vm.i++) {
    //   var obj = {};
    //   obj.id = vm.i;
    //   obj.image = data[vm.i].photos;
    //   obj.text = data[vm.i].title;
    //   vm.imgdata.push(obj);
    // }
    vm.myslides = vm.imgdata;
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;

    var slides = $scope.slides = [];
    var currIndex = 0;

    // vm.myslides = [
    //   {id: 0, image: '/modules/core/client/img/image/images/index/banner_01.jpg'},
    //   {id: 1, image: '/modules/core/client/img/image/images/index/banner_02.jpg'},
    //   {id: 2, image: '/modules/core/client/img/image/images/index/banner_03.jpg'}
    // ];
    $scope.addSlide = function (i) {
      slides.push({
        image: vm.myslides[i].image,
        text: vm.myslides[i].text,
        id: currIndex++
      });
    };
    $scope.randomize = function () {
      var indexes = generateIndexesArray();
      assignNewIndexesToSlides(indexes);
    };

    for (var i = 0; i < vm.myslides.length; i++) {
      $scope.addSlide(i);
    }

    // Randomize logic below

    function assignNewIndexesToSlides(indexes) {
      for (var i = 0, l = slides.length; i < l; i++) {
        slides[i].id = indexes.pop();
      }
    }

    function generateIndexesArray() {
      var indexes = [];
      for (var i = 0; i < currIndex; ++i) {
        indexes[i] = i;
      }
      return shuffle(indexes);
    }

    // http://stackoverflow.com/questions/962802#962890
    function shuffle(array) {
      var tmp = array.length;
      var current = array.length;
      var top = array.length;
      if (top) {
        while (--top) {
          current = Math.floor(Math.random() * (top + 1));
          tmp = array[current];
          array[current] = array[top];
          array[top] = tmp;
        }
      }
      return array;
    }
    // vm.tiaozhuan = function (num) {
    //   var src = `/modules/global/client/img/home/活动${num}.png`;
    //   $('.first>img').attr('src', src);
    // };
  }
}());
