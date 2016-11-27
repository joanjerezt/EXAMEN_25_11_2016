var API = 'http://localhost:3000';

var MainApp = angular.module('MainApp', []);

MainApp.controller('core_student',function($scope, $http){


    $scope.newStudent = {};
    $scope.students = {};
    $scope.selected = false;


    /** OK **/

    $http.get(API + '/api/students').success(function (data) {
        $scope.students = data;
    })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    /** TEST **/

    $scope.registrarPhone = function (res) {
        $http.post(API+ '/api/students/' + $scope.newStudent._id)
            .success(function (data) {
                if (data == false) {
                    alert("El número de telèfon no es vàlid");
                }
                else {
                    $scope.cleanall(); // Borramos los datos del formulario
                    $scope.students = data;
                }
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

    }

    /** TEST ***/

    $scope.borrarPhone = function (newStudent) {
        $http.delete(API + '/api/students/' + $scope.newStudent._id)
            .success(function (data) {
                $scope.cleanall();
                $scope.students = data;
                $scope.selected = false;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    /** OK **/

    $scope.registrarStudent = function (res) {

        if (confirm("Ets " + $scope.newStudent.name + "?")) {
            $http.post(API + '/api/students', $scope.newStudent)
                .success(function (data) {
                    if (data == false) {
                        alert("El número de telèfon no es vàlid");
                    }
                    else {
                        $scope.cleanall(); // Borramos los datos del formulario
                        $scope.students = data;
                    }
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        }

    };

    /** OK? **/

    $scope.modificarStudent = function (newStudent) {
        $http.put(API + '/api/students/' + $scope.newStudent._id, $scope.newStudent)
            .success(function (data) {
                $scope.cleanall(); // Borramos los datos del formulario
                $scope.students = data;
                $scope.selected = false;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    // Función que borra un objeto student conocido su id
    $scope.borrarStudent = function (newStudent) {
        $http.delete(API + '/api/students/' + $scope.newStudent._id)
            .success(function (data) {
                $scope.cleanall();
                $scope.students = data;
                $scope.selected = false;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    /** OK **/

    $scope.selectStudent = function (student) {
        $scope.newStudent = student;
        $scope.selected = true;
        console.log($scope.newStudent, $scope.selected);
    };

    $scope.cleanall = function () {
        $scope.newStudent = {};
    };

});