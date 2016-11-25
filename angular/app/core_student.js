angular.module('MainApp', [])

function studentController($scope, $http) {
    $scope.newStudent = {};
    $scope.students = {};
    $scope.selected = false;

    // Obtenemos todos los datos de la base de datos
    $http.get('/api/student').success(function (data) {
            $scope.students = data;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    // Función para registrar a un estudiante
    $scope.registrarStudent = function (res) {

        if (confirm("Ets " + $scope.newStudent.nombre + "?"))
        {
            $http.post('/api/student', $scope.newStudent)
                .success(function (data) {
                    if(data==false) {
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

    // Función para editar los datos de un estudiante
    $scope.modificarStudent = function (newStudent) {
        $http.put('/api/student/' + $scope.newStudent._id, $scope.newStudent)
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
        $http.delete('/api/student/' + $scope.newStudent._id)
            .success(function (data) {
                $scope.cleanall();
                $scope.students = data;
                $scope.selected = false;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    // Función para coger el objeto seleccionado en la tabla
    $scope.selectStudent = function (student) {
        $scope.newStudent = student;
        $scope.selected = true;
        console.log($scope.newStudent, $scope.selected);
    };

    $scope.cleanall = function () {
        $scope.newStudent = {};
    };

}