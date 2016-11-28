var API = 'http://localhost:3000';

var MainApp = angular.module('MainApp');

MainApp.controller('core_subject',function($scope, $http) {

    $scope.newSubject = {};
    $scope.subjects = {};
    $scope.selected = false;


    $scope.cleanall = function () {
        $scope.newSubject = {};
    };

    /*** OK ***/

    $http.get(API + '/api/subjects').success(function (data) {
        $scope.subjects = data;
    })
        .error(function (data) {
            console.log('Error: ' + data);
        });


    // Función para filtrar por alumno

    $scope.filterSubject = function (res) {

        $http.get(API + '/api/subjects/' + $scope.newSubject.students)
            .success(function (data) {
                if (data == false) {
                    alert("L'alumne no té cap assignatura");
                }
                else {
                    $scope.subjects = data;
                    $scope.cleanall(); // Borramos los datos del formulario
                }
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

    };

    /*** OK ***/

    // Función para filtrar por nombre de asignatura

    $scope.filterSubject = function (res) {

        $http.get(API + '/api/subjects/name/' + $scope.newSubject.name)
            .success(function (data) {
                if (data == false) {
                    alert("No hi ha cap assignatura amb aquest nom");
                }
                else {
                    $scope.subjects = data;
                    $scope.cleanall(); // Borramos los datos del formulario
                }
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

    };

    /*** OK ***/

    // Función para filtrar por periodo

    $scope.filterSubjectbyPeriod = function (res) {

        $http.get(API + '/api/subjects/period/' + $scope.newSubject.periode)
            .success(function (data) {
                if (data == false) {
                    alert("No hi ha cap assignatura en aquest període");
                }
                else {
                    $scope.subjects = data;
                    $scope.cleanall(); // Borramos los datos del formulario
                }
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

    };

    // Función para filtrar alfabéticamente

    $scope.filterSubjectbyName = function (res) {

        $http.post('/api/subjectsbyname', $scope.newSubject)
            .success(function (data) {
                if (data == false) {
                    alert("No hi ha assignatures");
                }
                else {
                    $scope.subjects = data;
                    $scope.cleanall(); // Borramos los datos del formulario
                }
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

    };

    // Función para filtrar per nombre d'alumnes
    $scope.filterSubjectbyNumber = function (res) {

        $http.get('/api/subjects', $scope.newSubject)
            .success(function (data) {
                if (data == false) {
                    alert("No hi ha assignatures");
                }
                else {
                    $scope.subjects = data;
                    $scope.cleanall(); // Borramos los datos del formulario
                }
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

    };

    /*** OK ***/

    $scope.addStudentToSubject = function (id) {
        $scope.newStudent = {
            student_id: id
        };
        $http.post(API + '/api/subjects/' + $scope.newSubject._id + '/student/' , $scope.newStudent)
            .success(function(data){
                $scope.subject = data;
            })
            .error(function(data){
                console.log('Error:' + data);
            });
    };

    /*** OK ***/

    $scope.borrarStudentFromSubject = function (id) {
        $http.delete(API + '/api/subjects/' + $scope.newSubject._id + '/student/' + id)
            .success(function(data){
                $scope.subject = data;
            })
            .error(function(data){
                console.log('Error:' + data);
            });
    };

    /*** OK ***/

    // Función para registrar una asignatura

    $scope.registrarSubject = function (res) {

        $http.post(API + '/api/subjects', $scope.newSubject)
            .success(function (data) {
                    $scope.cleanall(); // Borramos los datos del formulario
                    $scope.subjects = data;
            })
            .error(function (data) {
                $scope.cleanall(); // Borramos los datos del formulario
                alert(data);
                console.log('Error: ' + data);
            });

    };

    /*** OK ***/

    // Función para editar los datos de una asignatura

    $scope.modificarSubject = function (newSubject) {
        $http.put(API + '/api/subjects/' + $scope.newSubject._id, $scope.newSubject)
            .success(function (data) {
                $scope.cleanall(); // Borramos los datos del formulario
                $scope.subjects = data;
                $scope.selected = false;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    /*** OK ***/

    // Función que borra un objeto asignatura conocido su id
    $scope.borrarSubject = function (newSubject) {
        $http.delete(API + '/api/subjects/' + $scope.newSubject._id)
            .success(function (data) {
                $scope.cleanall();
                $scope.subjects = data;
                $scope.selected = false;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    // Función para coger el objeto asignatura seleccionado en la tabla
    $scope.selectSubject = function (subject) {
        $scope.newSubject = subject;
        $scope.selected = true;
        console.log($scope.newSubject, $scope.selected);
    };

    $scope.selectStudent = function (student) {
        $scope.newStudent = student;
        $scope.selected = true;
        console.log($scope.newStudent, $scope.selected);
    };
});