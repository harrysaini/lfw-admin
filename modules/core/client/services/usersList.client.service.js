'use strict';



angular.module('core').factory('usersListService', ['$resource',
	function($resource) {

		var List =  $resource('/api/admin/usersList', {}, {

			getTenants: {
				method: 'GET',
				url: '/api/admin/usersList/tenants'
			},
			getBrokers: { 
				method: 'GET', 
				url: '/api/admin/usersList/brokers'
			},
			getLandlords: { 
				method: 'GET', 
				url: '/api/admin/usersList/landlords'
			},
		});

		angular.extend(List , {
			getTenantsList : function(searchObj){
				return this.getTenants(searchObj).$promise;
			},
			getBrokersList : function(searchObj){
				return this.getBrokers(searchObj).$promise;
			},
			getLandlordsList : function(searchObj){
				return this.getLandlords(searchObj).$promise;
			},

		});

		return List;




	}
	]);
