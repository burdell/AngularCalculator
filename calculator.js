angular.module('myApp',[])
	.directive('calculator', function() {
	    return {
	        restrict: 'E',
	        templateUrl: "template.html" ,
	        scope: true,
	        controller: function($scope, $parse) {
	        	$scope.$parse = $parse;
	        	$scope.fieldValues = {};
	        	$scope.calculations = [];

	        	$scope.calculate = function(calculationString, values){
	       			try {
	       				var value = $parse(calculationString)(values);
	       				return (_.isFinite(value) ? value : 0);
	       			} catch (e) {
	       				return "Invalid expression :("
	       			}
	       		};


	       		$scope.$watch("fieldValues", function(){
	       			var fieldValueNumbers = $scope.getFieldValueNumbers();
	       			_.each($scope.calculations, function(calc) {
	       				calc.value = $scope.calculate(calc.string, fieldValueNumbers);
	       			});
	       		}, true);


	       		$scope.addField = function(name, value){
	       			if (!_.isFinite(value)) {
	       				value = 0;
	       			}
	       			if (!name){
	       				name = "Field" + (_.keys($scope.fieldValues).length + 1);
	       			}
	       			var strippedSpaceName = name.replace(/\s+/g, '');
	       			$scope.fieldValues[strippedSpaceName] = value;

	       			$scope.newName = null;
	       			$scope.newValue = null;
	       		};
	       		$scope.removeField = function(name) {
	       			delete $scope.fieldValues[name]; 
	       		};
	       		$scope.addCalculation = function(calculation, values) {
	       			$scope.calculations.push({ 
	   					string: calculation, 
	   					value: $scope.calculate(calculation, values || $scope.getFieldValueNumbers()) 
	       			});
	       			$scope.newCalculation = null;
	       		};
	       	
	       		$scope.getFieldValueNumbers = function(){
	       			var fieldValueNumbers = {};
	       			_.each($scope.fieldValues, function(value, name){
	       				var numberValue = Number(value);
	       				fieldValueNumbers[name] = _.isFinite(numberValue) ? numberValue : 0;
	       			});
	       			return fieldValueNumbers;
	       		}
	        },
	        link: function(scope, element, attrs) {
	        	var startingValues = scope.$parse(attrs.values)(); 

	        	_.each(startingValues, function(value, key) {
	        		scope.addField(key, Number(value));
	        	});
	        	
	        	var calculationStrings = _.isUndefined(attrs.calculations) ? [] : attrs.calculations.split(',');
				_.each(calculationStrings, function(calculation){
					scope.addCalculation(calculation, scope.fieldValues);
				});
	        }
	    }
});