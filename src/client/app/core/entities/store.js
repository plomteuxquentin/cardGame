(function() {
  'use strict';

  angular
    .module('app.core.entities', ['ngResource', 'ngMockE2E'])
    .run(httpMock);

  httpMock.$inject = ['$httpBackend', '$filter', 'cardEntity', 'sphereEntity', 'capacityEntity'
  ];

  /* @ngInject */
  function httpMock(httpBackend, filter, Card, Sphere, Capacity) {
    var store = {
      cards: [],
      spheres: [],
      capacities: []
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

    function storeMocks() {
      var spheres = [
        {
          id: 1,
          name: 'Neutre',
          description: 'Sphére général',
          color: '#FFFFFF'
        },
        {
          id: 2,
          name: 'Blanche',
          description: 'Sphére du bien et de la vie',
          color: '#dbde93'
        },
        {
          id: 3,
          name: 'Noire',
          description: 'Sphére du mal et de la mort',
          color: '#191919'
        }
      ];

      var capacities = [
        {
          id: 4,
          name: 'Dégat distant',
          sphere : 'noir',
          description: 'La créature ciblé perdre des points de vie',
          effect: function(cardOrigine, cardCible) {
            console.log(cardOrigine.name + ' fait perdre 1 point de vie à ' + cardCible.name);
          }
        },
        {
          id: 5,
          name: 'Soin',
          shpere: 2,
          description: 'La créature ciblé gagne des points de vie',
          effect: function(cardOrigine, cardCible) {
            console.log(cardOrigine.name + ' fait gagner 1 point de vie à ' + cardCible.name);
          }
        },
        {
          id: 6,
          name: 'Gardien',
          shpere: 1,
          description: 'La créature protége une autre créature contre tout effet',
          effect:function(cardOrigine, cardCible) {
            console.log(cardOrigine.name + ' protege la créature ' + cardCible.name);
          }
        },
        {
          id: 7,
          name: 'Prêcheur',
          sphere: 1,
          description: 'La créature génere des points d\'aura à chaque tour',
          effect: function(cardOrigine, cardCible) {
            console.log(cardOrigine.name + ' génère des points d\'aura');
          }
        },
        {
          id: 8,
          name: 'Faiblesse',
          sphere: 3,
          description: 'La créature ciblé perd des points de force',
          effect: function(cardOrigine, cardCible) {
            console.log(cardOrigine.name + ' affaiblit ' + cardCible.name);
          }
        },
        {
          id: 9,
          name: 'Vigeur',
          sphere: 2,
          description: 'La créature ciblé gagne des points de force',
          effect: function(cardOrigine,cardCible) {
            console.log(cardOrigine.name + ' revigorise ' + cardCible.name);
          }
        }
      ];

      var cards = [
        {
          id: 10,
          name: 'Archer',
          description: 'Le chateau de Valéron est protégé par un mur de flèches à pointe d\'acier',
          attributs: {attaque: 0, defense: 1},
          capacities: [4],
          spheres:[3],
          isAvatar: false
        },
        {
          id: 11,
          name: 'Prêtre',
          description: 'Ton dieu ne t\'apprend qu\'à tuer. Karametra m\'apprend à défendre ce' +
          'qui m\'est cher. Pour cette raison, je triompherai.',
          attributs: {attaque: 0, defense: 1},
          capacities: [5],
          spheres:[2],
          isAvatar: false
        },
        {
          id: 12,
          name: 'Grand prêtre',
          description: 'Ton dieu ne t\'apprend qu\'à tuer. Karametra m\'apprend à défendre ce' +
          'qui m\'est cher. Pour cette raison, je triompherai.',
          attributs: {attaque: 0, defense: 1},
          capacities: [5],
          spheres:[2],
          isAvatar: false
        },
        {
          id: 13,
          name: 'Prêtre',
          description: 'Je ne demande que foi, loyauté, obéissance, confiance et dévotion absolue',
          attributs: {attaque: 0, defense: 1},
          capacities: [5, 7],
          spheres:[2],
          isAvatar: false
        },
        {
          id: 14,
          name: 'Ken le Défendeur',
          description: 'Je me bats pour les soleils, pour la surface,' +
          ' et tout ce qui se trouve entre eux',
          attributs: {attaque: 2, defense: 5},
          capacities: [6, 7],
          spheres:[2],
          isAvatar: true
        },
        {
          id: 15,
          name: 'Mouche géante',
          description: 'La durée de vie d\'une mouche se mesure très précisément : elle est courte',
          attributs: {attaque: 2, defense: 4},
          capacities: [8, 7],
          spheres:[3],
          isAvatar: true
        },
        {
          id: 16,
          name: 'Ver géant',
          description: 'Nourri de sang autochtone pour la taille et de cellules de monstruosité' +
          ' pour la vitesse, le verloque est parfait pour le nettoyage du sous-sol des jardins. ' +
          'Il se débarrasse à merveille des rats et des mendiants',
          attributs: {attaque: 2, defense: 1},
          capacities: [],
          spheres:[],
          isAvatar: false
        },
        {
          id: 17,
          name: 'Ver luissant',
          description: 'Ils brillent dans la nuit',
          attributs: {attaque: 0, defense: 1},
          capacities: [9],
          spheres:[2],
          isAvatar: false
        }
      ];

      spheres.forEach(function(sphere) {
        store.spheres.push(new Sphere(sphere.name, sphere.description, sphere.color));
      });

      capacities.forEach(function(capacity) {
        var sphere = store.spheres.find(function(sphere) {
          return capacity.sphere === sphere.id ;
        });

        store.capacities.push(new Capacity(
          capacity.name,
          sphere,
          capacity.description,
          capacity.effect
        ));
      });

      cards.forEach(function(card) {
        var spheres = store.spheres.filter(function(sphere) {
          return card.spheres.indexOf(sphere.id) !== -1;
        });

        var capacities = store.capacities.filter(function(capacity) {
          return card.capacities.indexOf(capacity.id) !== -1;
        });

        store.cards.push(new Card(
          card.name,
          card.description,
          null,
          card.attributs,
          capacities,
          spheres,
          card.isAvatar
        ));
      });
    }

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

    function generateId() {
      return Date.now() + Math.floor(Math.random() * (9999));
    }
  }
})();
