'use strict';

module.exports = ['AuthService', 'TutorApiService', 'toastr', "$q", 'FileUploader', function(AuthService, TutorApiService, toastr, $q, FileUploader) {
    return {
        restrict: 'E',
        scope: {
            tutorImageUrl: '@',
            token: '&'
        },
        templateUrl: "directives/user/uploadPhoto/index.html",
        link: function (scope) {
            scope.originImage = null;
            scope.croppedImage = '';

            var uploader = scope.uploader = new FileUploader({
                queueLimit: 1
            });

            uploader.filters.push({
                name: 'imageFilter',
                fn: function(item) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            });

            uploader.onAfterAddingFile = function(item) {
                scope.originImage = window.URL.createObjectURL(item._file);
            };

            uploader.onBeforeUploadItem = function(item) {
                item.file.name = "image.png";
                item.file.type = "image/png";
                item._file = scope.croppedImage;
            };

            var deferred;
            uploader.onErrorItem = function(item, resp) {
                toastr.error('Upload failed. Please try again');
                deferred.reject(resp);
            };

            uploader.onSuccessItem = function(item, resp) {
                uploader.clearQueue();
                scope.originImage = null;
                scope.tutorImageUrl = "http://www.gotute.com" + resp;
                toastr.success('Image uploaded');
                deferred.resolve(resp);
            };

            scope.onImageLoaded = function() {
                window.URL.revokeObjectURL(scope.originImage);
            }

            scope.onCropped = function() {
                // TODO: this is just for the initial load of the image. Need to release for every single update.
                window.URL.revokeObjectURL(scope.croppedImageUri);
            }

            scope.upload = function () {
                uploader.url = 'https://api.gotute.com/users/me/tutor/image?token=' + scope.token();
                deferred = $q.defer()
                uploader.uploadItem(0);
                return deferred.promise;
            };

            scope.cancel = function () {
                uploader.clearQueue();
                scope.originImage = null;
            };
        }
    };
}];
