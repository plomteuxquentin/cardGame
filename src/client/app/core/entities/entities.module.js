(function() {
  'use strict';

  angular
    .module('app.core.entities', ['ngResource', 'ngMockE2E'])
    .run(httpMock);

  httpMock.$inject = ['$httpBackend', '$filter'];

  /* @ngInject */
  function httpMock(httpBackend, filter) {
    var store = {
      members: [],
      sessions: [],
      events: []
    };

    var pathWithId = new RegExp('\\/api\\/[a-zA-Z0-9_-]+\\/[0-9]+[\?a-zA-Z0-9_-]?');
    var path = new RegExp('\\/api\\/[a-zA-Z0-9_-]+[\?a-zA-Z0-9_-]?');
    var pathPostImage = '/api/members/image';

    storeMocks();

    httpBackend.whenGET(pathWithId).respond(handleGet);
    httpBackend.whenGET(path).respond(handleQuery);

    httpBackend.whenGET(/\.html/).passThrough();
    httpBackend.whenGET(/\.svg/).passThrough();

    httpBackend.whenPOST(pathPostImage).respond(handlePostImage);
    httpBackend.whenPOST(path).respond(handlePost);

    httpBackend.whenPUT(pathWithId).respond(handlePut);

    function handlePostImage(method, url, data) {
      console.log(data);

      return [201,null];
    }

    function handlePost(method, url, data, headers, params) {
      var newEntity = angular.fromJson(data);
      var regexp = new RegExp('\\/api\\/([a-zA-Z0-9_-]+)\\/?([0-9]?)');
      var entityType = url.match(regexp)[1];

      if (!store.hasOwnProperty(entityType)) {
        return [404, new Error('unknown API')];
      }

      if (entityType === 'members') {
        newEntity = createMember(newEntity);

        console.log('create member : ');
        console.log(newEntity);
      }

      store[entityType].push(newEntity);

      return [201, newEntity];
    }

    function handleQuery(method, url, data, headers, params) {
      var regexp = new RegExp('\\/api\\/([a-zA-Z0-9_-]+)');
      var entityType = url.match(regexp)[1];
      var response = [200];
      var entitiesFiltered = [];

      if (!store.hasOwnProperty(entityType)) {
        return [404, new Error('unknown API')];
      }

      if (entityType === 'events' && params.member) {
        // If a member is given filter event for that member
        entitiesFiltered = store.events.filter(function(event) {
          return event.entities.indexOf(parseInt(params.member)) !== -1;
        });

        response.push(entitiesFiltered);
      }
      else if (entityType === 'members') {
        response.push(filter('orderBy')(store[entityType], 'name'));
      }
      else {
        response.push(store[entityType]);
      }

      console.log('request ' + entityType + ' : ');
      console.log(response);

      return response;
    }

    function handleGet(method, url, data, headers, params) {
      var regexp = new RegExp('\\/api\\/([a-zA-Z0-9_-]+)\\/([0-9]+)');
      var entityType = url.match(regexp)[1];
      var id = url.match(regexp)[2];
      var entity;
      var response;

      if (!store.hasOwnProperty(entityType)) {
        return [404, new Error('unknown API')];
      }

      entity = store[entityType].find(function(_entity) {
        return _entity._id === parseInt(id);
      });

      if (!entity) {
        console.error('request ' + entityType + '/' + id + ' :  not found');
        return [404, 'entity ' + entityType + ' ' + id + 'does not exist'];
      }

      response = [200, entity];

      console.log('request ' + entityType + '/' + id + ' : ');
      console.log(entity);

      return response;
    }

    function handlePut(method, url, data, headers, params) {}

    function logEvent(type, eventEntities, date) {
      var EVENTS = {
        CREATE_MEMBER: {
          category: 'ADMIN',
          title: 'Member creation'
        },
        UPDATE_MEMBER: {
          category: 'ADMIN',
          title: 'Member updated'
        }
      };

      var event = angular.copy(EVENTS[type]);
      event.date = date || new Date();
      event._id = Date.now();
      event.entities = eventEntities.map(function (entity) { return entity._id;});
      event.type = type;

      store.events.push(event);
    }

    function createMember(newMember) {
      newMember._id = generateId();
      newMember.name = newMember.firstName + ' ' + newMember.lastName;
      newMember.seanceLeft = 0;

      logEvent('CREATE_MEMBER', [newMember]);
      return newMember;
    }

    function storeMocks() {
      // 6 members
      var members = [
        {
          firstName: 'Tyrion',
          lastName: 'Lannister',
          picture:'./assets/members/1.png',
          seanceLeft: 0,
          address: '13 avenue de broqueville 1200 Bruxelles',
          email: 'tlannister@got.com',
          phone: '+32 0474 55 63 30'
        },
        {
          firstName: 'John',
          lastName: 'Snow',
          picture:'./assets/members/2.png',
          seanceLeft: 0,
          address: '13 avenue de broqueville 1200 Bruxelles',
          email: 'jsnow@got.com',
          phone: '+32 0474 55 63 30'
        },
        {
          firstName: 'Sansa',
          lastName: 'Stark',
          picture:'./assets/members/3.png',
          seanceLeft: 0,
          address: '13 avenue de broqueville 1200 Bruxelles',
          email: 'sStrak@got.com',
          phone: '+32 0474 55 63 30'
        },
        {
          firstName: 'Joffrey',
          lastName: 'Baratheon',
          picture:'./assets/members/4.png',
          seanceLeft: 0,
          address: '13 avenue de broqueville 1200 Bruxelles',
          email: 'jbaratheon@got.com',
          phone: '+32 0474 55 63 30'
        },
        {
          firstName: 'Margaery',
          lastName: 'Tyrell',
          picture:'./assets/members/5.png',
          seanceLeft: 0,
          address: '13 avenue de broqueville 1200 Bruxelles',
          email: 'mtyrell@got.com',
          phone: '+32 0474 55 63 30'
        },
        {
          firstName: 'Khal',
          lastName: 'Drogo',
          picture:'./assets/members/6.png',
          seanceLeft: 0,
          address: '13 avenue de broqueville 1200 Bruxelles',
          email: 'kdrogo@got.com',
          phone: '+32 0474 55 63 30'
        }
      ];

      var card

      var member;

      // Create members & add seances
      members.forEach(function(_member) {
        member = createMember(_member);
        store.members.push(member);
      });
    }

    function generateId() {
      return Date.now() + Math.floor(Math.random() * (9999));
    }
  }
})();
