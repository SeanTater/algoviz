angular.module("app", [])
    .controller("Main", function($scope){
        $scope.mixed_search_percent = 60;
        $scope.mixed_insert_percent = 35;
        $scope.mixed_delete_percent = 5;
    });