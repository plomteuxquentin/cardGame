(function () {
  'use strict';

  angular
    .module('app.entities.list')
    .controller('EntitiesListController', EntitiesListController);

  EntitiesListController.$inject = [
    'SpheresFactory', 'CapacitiesFactory', 'CardsFactory',
    '$filter', '$state'];
  /* @ngInject */
  function EntitiesListController(Spheres, Capacities, Cards, filter, stateService) {
    var vm = this;
    vm.search = '';
    vm.displayActions = true;
    vm.removeOnBackspace = removeOnBackspace;
    vm.spheres = [];
    vm.capacities = [];
    vm.cards = [];

    activate();

    function activate() {
      loadSpheres()
        .then(loadCapacities)
        .then(loadCards);
    }

    function loadSpheres() {
      return Spheres.query(onQuerySuccess, onQueryFail).$promise;

      function onQuerySuccess(response) {
        vm.spheres = filter('orderBy')(response, 'name');
      }

      function onQueryFail(reason) {
        console.error('Unable to load spheres: ' + reason);
      }
    }

    function loadCapacities() {
      return Capacities.query(onQuerySuccess, onQueryFail).$promise;

      function onQuerySuccess(response) {
        vm.capacities = filter('orderBy')(response, 'name');
      }

      function onQueryFail(reason) {
        console.error('Unable to load capacities: ' + reason);
      }
    }

    function loadCards() {
      return Cards.query(onQuerySuccess, onQueryFail).$promise;

      function onQuerySuccess(response) {
        vm.cards = filter('orderBy')(response, 'name');
      }

      function onQueryFail(reason) {
        console.error('Unable to load cards: ' + reason);
      }
    }

    function removeOnBackspace (event) {
      if (event.keyCode === 8 && vm.search.length === 0) {
        vm.displayActions = true;
        event.preventDefault();
      }
    }
  }
})();
