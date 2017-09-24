(function() {
  'use strict';

  angular
    .module('core')
    .factory('MyUtilityService', MyUtilityService);

  MyUtilityService.$inject = ['$location'];


  function MyUtilityService($location) {

    function getURIParameter(param) {
      return $location.$$search[param] || null;
    }

    function isValidEmail(email) {
      var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegex.test(email);
    }

    function isValidMobile(mobile) {
      var mobileRegex = /^[0-9]{10}$/;
      return mobileRegex.test(mobile);
    }

    function isMobileCodeValid(code) {
      var codeRegex = /^[+]{1}[0-9]{1,4}$/;
      return codeRegex.test(code);
    }


    function animatedScrollTo(y, duration) {
      var initial = document.body.scrollTop || document.documentElement.scrollTop;
      var initialDiff = Math.abs(y - initial);
      var scrolledCount = 0;


      var interval = setInterval(function() {
        var current = document.body.scrollTop || document.documentElement.scrollTop;

        if (duration < 0) {
          clearInterval(interval);
        }
        if (scrolledCount > initialDiff) {
          return;
        }
        duration = duration - 10;
        var difference = y - current;
        var scrollIncrement = Math.abs(difference / duration * 10);

        if (difference < 0) {
          window.scroll(0, current - scrollIncrement);
        } else {
          window.scroll(0, current + scrollIncrement);
        }
        scrolledCount = scrolledCount + scrollIncrement;

      }, 10);
    }
    var utils = {
      getURIParameter: getURIParameter,
      animatedScrollTo: animatedScrollTo,
      isValidMobile: isValidMobile,
      isValidEmail: isValidEmail,
      isMobileCodeValid: isMobileCodeValid

    };

    return utils;


  }





}());
