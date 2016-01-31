(function () {
  'use strict';

  angular
    .module('app.core.entities')
    .factory('CardsFactory', CardsFactory);

  CardsFactory.$inject = ['$resource'];
  /* @ngInject */
  function CardsFactory(resourceService) {
    var URL = '/api/cards/:id';
    var ID = '@_id';

    var service = resourceService(URL, {
      id: ID
    }, {
      update: {method: 'PUT'}
    });

    return service;
  }
})();
