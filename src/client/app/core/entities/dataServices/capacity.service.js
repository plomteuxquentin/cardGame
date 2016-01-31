(function () {
  'use strict';

  angular
    .module('app.core.entities')
    .factory('CapacitiesFactory', CapacitiesFactory);

  CapacitiesFactory.$inject = ['$resource'];
  /* @ngInject */
  function CapacitiesFactory(resourceService) {
    var URL = '/api/capacities/:id';
    var ID = '@_id';

    var service = resourceService(URL, {
      id: ID
    }, {
      update: {method: 'PUT'}
    });

    return service;
  }
})();
