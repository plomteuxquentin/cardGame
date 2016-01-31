(function () {
  'use strict';

  angular
    .module('app.members.edit')
    .controller('MembersEditController', MembersEditController);

  MembersEditController.$inject = [
      'membersFactory', '$state','$scope','$timeout', 'Upload', '$mdDialog', '$mdMedia'
    ];
  /* @ngInject */
  function MembersEditController(Members, stateService, $scope, $timeout, uploadService,
                                 dialogService, mediaService) {
    var self = this;
    var vm = this;
    var handleFileSelect;
    var dialogOptions;

    var IMAGE_WIDTH = 150;
    var IMAGE_HEIGHT = 150;

    vm.member = {};
    vm.croppedPicture = null;
    vm.originalPicture = null;
    self.picFile = null;

    self.dialogPicture = dialogPicture;
    vm.save = save;

    activate();

    function activate () {

      // Call dialogPicture if a picture is selected
      $scope.$watch(function() {return self.picFile;}, function(newValue, oldValue) {
        if (newValue) {
          dialogPicture(newValue);
        }
      });
    }

    function save() {
      Members.save(vm.member).$promise.then(handleSaveSuccess, handleSaveFail);

      function handleSaveSuccess(response) {
        stateService.go('members.details',{id:response._id});
      }

      function handleSaveFail(reason) {
        console.debug('save failed : ' + reason);
      }
    }

    $scope.upload = function (dataUrl) {
      uploadService.upload({
        url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
        data: {
          file: uploadService.dataUrltoBlob(dataUrl)
        }
      }).then(function (response) {
        $timeout(function () {
          $scope.result = response.data;
        });
      }, function (response) {
        if (response.status > 0) {
          $scope.errorMsg = response.status + ': ' + response.data;
        }
      }, function (evt) {
        $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
      });
    };

    $scope.myImage = '';
    $scope.myCroppedImage = null;

    handleFileSelect = function(evt) {
      var file = evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope) {
          $scope.myImage = evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

    function dialogPicture (picture) {
      var useFullScreen;

      if (!picture && !self.originalPicture) {
        return;
      }

      picture = (picture) ? picture : self.originalPicture;

      $scope.$watch(function() {
        return mediaService('xs') || mediaService('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });

      useFullScreen = (mediaService('sm') || mediaService('xs')) && $scope.customFullscreen;

      dialogOptions = {
        controller: 'MembersPictureDialogController',
        controllerAs: 'pictureDialogCtrl',
        templateUrl: '..//edit/pictureDialog/pictureDialog.html',
        parent: angular.element(document.body),
        openFrom: 'pictureButton',
        closeFrom: 'pictureButton',
        clickOutsideToClose:true,
        fullscreen: useFullScreen,
        locals: {
          picture: picture
        }
      };

      dialogService.show(dialogOptions).then(dialogAccept,dialogRefuse);

      function dialogAccept (answer) {
        vm.croppedPicture = answer.croppedPicture;
        vm.originalPicture = answer.originalPicture;
      }

      function dialogRefuse () {}
    }

    // upload on file select or drop
    function photoUpload () {
      var load;
      var IMAGE_POST_URL = '/api/members/image';

      if (vm.form.photo && vm.form.photo.$valid) {
        load = {
          url: IMAGE_POST_URL,
          data: {file: uploadService.rename(vm.croppedPicture, Date.now())}
        };

        uploadService(load).then(
          handleUploadSuccess,
          handleUploadFailure,
          handleUploadProgres
        );
      }

      function handleUploadSuccess (response) {
        console.log('Success ' + response.config.data.file.name + 'uploaded. Response: ' +
          response.data);
      }

      function handleUploadFailure (response) {
        console.log('Error status: ' + response.status);
      }

      function handleUploadProgres (event) {
        var progressPercentage = parseInt(100.0 * event.loaded / event.total);
        console.log('progress: ' + progressPercentage + '% ' + event.config.data.file.name);
      }
    }
  }
})();
