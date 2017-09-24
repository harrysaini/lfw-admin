'use strict';



angular.module('admin').factory('usersListService', ['$resource',
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
			get_users_CSV : {
				method : 'GET',
				url : '/api/admin/getCSV'
			}
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
			getUsersCSV : function(dataObj){
				return this.get_users_CSV(dataObj).$promise;
			}

		});

		return List;




	}
	]);
