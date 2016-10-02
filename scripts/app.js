(function(){
    'use strict';

    /** Define the App/Module name as NarrowItDownApp**/
    var app = angular.module('NarrowItDownApp',[]);

    /** Define the controllers **/
    app.controller('NarrowItDownController',NarrowItDownController);
    
    /** Define the Services    **/
    app.service('MenuSearchService',MenuSearchService);
    
    /** Define the Directives  **/
    app.directive('foundItems',foundItemsDirective);

    /** Define constants **/
    app.constant('ApiBaseUrl','https://davids-restaurant.herokuapp.com/menu_items.json');

    
    /** Injection declaration  **/
    NarrowItDownController.$inject = ['MenuSearchService'];
    MenuSearchService.$inject = ['$http','ApiBaseUrl'];


    /** MenuSearchService **/
    function MenuSearchService($http,ApiBaseUrl){
	var service = this;

	service.getMatchedMenuItems = function(searchTerm){
	    var response = $http({
		method: "GET",
		url : (ApiBaseUrl),
	    });

	    
	    return response.then(function(response){
		
		//Retrieve all the items from the response of the server
		var allitems = response.data.menu_items;

		//Initialise the array to store the matched items
		var founditems = [];

		//Iterate through all the items retrieved
		for(var item in allitems){
		    var eachitem = allitems[item];

		    //If the searchterm is found in the item description, push it to founditems
		    if(eachitem.description.search(searchTerm)!==-1){
			founditems.push(eachitem);
		    }
		}
		
		return founditems;
	    })
	    //If there is an Error
		.catch(function(error){
		    return new Error(error);
	    });

	    
	};
    }

    /** NarrowItDownController **/
    function NarrowItDownController(MenuSearchService){
	var list = this;

	//Declare the found variable, which will store all the items matched against search term
	list.found = [];

	//Declare a empty variable, set to true if search textbox is empty or false if it is not
	list.empty = true;

	//Declare a searchterm variable
	list.searchTerm = '';
	

	 /** 
	  * Method getItems()
	  * Invoked on 'Narrow It Down for Me' button click
	  * Return : Sets the found variable with the list of found items from MenuSearchService
	 **/

	list.getItems = function(){
	    //console.log("getting items");

	    //Returns a promise foundItems
	    var foundItems = MenuSearchService.getMatchedMenuItems('chicken');

	    //console.log(foundItems);
	    
	    foundItems.then(function(founditems){
		console.log(founditems);
		list.found = founditems;
	    }).catch(function(error){
		console.log(error);
	    });


	}
	    
    }


    /** foundItemDirective **/
    function foundItemsDirective(){
	var ddo = {
	    restrict: 'E',
	    templateUrl:'foundItems.html',
	    scope      :{
		items: '<'
	    }
	};
	return ddo;
    }


    
	
})()
