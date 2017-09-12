(function () {
    'use strict';

    angular
    .module('core')
    .factory('OverridesService', OverridesService);

    OverridesService.$inject = [];


    function OverridesService() {

        Array.prototype.removeFromArray = function(val){
            var index = this.indexOf(val);
            if(index!==-1){
                this.splice(index,1);
            }
        };

        return null;

    }

}());
