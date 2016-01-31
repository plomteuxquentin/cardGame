(function () {
  'use strict';

  angular
    .module('app.members.details')
    .controller('MembersDetailsController', MembersDetailsController);

  MembersDetailsController.$inject = ['$stateParams', 'membersFactory', 'eventsFactory'];
  /* @ngInject */
  function MembersDetailsController(params, Members, Events) {
    var vm = this;
    vm.member = {
      event: []
    };

    vm.filter = {
      session: {category: 'SESSION'},
      buy: {category: 'BUY'}
    };

    activate(params.id);

    function activate(id) {
      loadMembers(id)
        .then(loadEvents(id));
    }

    function loadMembers(id) {
      return Members.get({id: id}, onQuerySuccess, onQueryFail).$promise;

      function onQuerySuccess(response) {
        vm.member = response;
        vm.member.event = [];
        return id;
      }

      function onQueryFail(reason) {
        console.error('Unable to load member: ' + reason);
      }
    }

    function loadEvents(id) {
      return Events.queryMember({member: id}, handleQuerySuccess, handleQueryFail).$promise;

      function handleQuerySuccess(response) {
        vm.member.events = response;
      }

      function handleQueryFail(reason) {
        console.error('unable to load events : ' + reason);

      }
    }
  }
})();
