/**
 * @author Adam Gibson
 */
var quicksearch=require('../lib/quicksearch.js');

var tester=function(){};

tester.prototype.testLoad=function() {
	var search = new quicksearch.QuickSearch();
	search.load('/home/agibsonccc/workspace/quicksearch/model.json');
};

var tester2 = new tester();
tester2.testLoad();
