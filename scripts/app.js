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

	//Declare a empty variable, set to true if found is empty or false if it is not
	list.empty = true;

	//Declare a searchterm variable, it is two-way bound to the search TextBox
	list.searchTerm = '';
	

	 /** 
	  * Method getItems()
	  * Invoked on 'Narrow It Down for Me' button click
	  * Return : Sets the 'found' variable with the list of found items from MenuSearchService
	 **/

	list.getItems = function(){
	    //If the search Item is empty
	    if(list.searchTerm==''){
		//Set the found array in the list with a empty array
		list.found = [];
		
		//Check if found list is empty or not
		list.checkIsFoundEmpty();

		return false;
	    }
	    

	    //Search for searchItem and return a promise foundItems
	    var foundItems = MenuSearchService.getMatchedMenuItems(list.searchTerm);

	    foundItems.then(function(founditems){
		//Set the found array in the list with the returned items
		list.found = founditems;

		//reset the searchTerm to blank
		list.searchTerm = '';

		//Check if found list is empty or not
		list.checkIsFoundEmpty();
		
	    }).catch(function(error){
		console.log(error);
	    });
	}

	/** Function to check if the found variable(Array) is empty or not **/
	/** Return true/false if it is empty/not empty                     **/

	list.checkIsFoundEmpty = function(){
	    if(list.found.length > 0)
		list.empty = false;
	    else
		list.empty = true;
	}


	/** Function to remove an item based on the index **/
	list.removeItem = function(index){
	    console.log("removing ");
	    list.found.splice(index,1);
	    list.checkIsFoundEmpty();
	    
	}
	    
    }


    /** foundItemDirective **/
    function foundItemsDirective(){
	var ddo = {
	    restrict: 'E',
	    templateUrl:'foundItems.html',
	    scope      :{
		items: '<',
		onRemove : '&',
	    },
	    link: foundItemsLink,
	};
	return ddo;
    }


    /** Link function to foundItem Directive **/
    function foundItemsLink(scope,element){
	console.log(scope);
	console.log(element);







    }



    
    
	
})()
