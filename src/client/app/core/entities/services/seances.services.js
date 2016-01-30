(function () {
  'use strict';

  angular
    .module('app.core.entities')
    .factory('seancesFactory', seancesFactory);

  seancesFactory.$inject = ['$resource'];
  /* @ngInject */
  function seancesFactory(resourceService) {
    var URL = '/api/seances';
    var ID = '@_id';

    var service = resourceService(URL, {
      id: ID
    }, {
      addTicket: {
        method: 'POST',
        url: URL + '/ticket',
        isArray: false
      },
      addSeasonPass: {
        method: 'POST',
        url: URL + '/season-pass',
        isArray: false
      }
    });

    return service;
  }
})();
