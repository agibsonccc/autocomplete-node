/**
 * @author Adam Gibson
 */
var assert=require('assert'),counter=require('../lib/countermap.js');
//assert.ok(true);
//console.log(counter);
console.log(counter);

var tester =function() {};
tester.prototype.counter2 = new counter.Counter();
tester.prototype.countermap = new counter.CounterMap();
tester.prototype.testEmpty=function() {
console.log('Testing whether counter is empty...');
assert.ok(this.counter2.isEmpty());
console.log('Ensure counter keys length is 0');	
assert.ok(this.counter2.keySet().length==0);
console.log('Testing whether argmax is null...');
assert.ok(this.counter2.argMax()==null);

};
tester.prototype.testCounts=function() {
	this.counter2.incrementCount('hello',1);
	console.log('Testing counter size...');
	assert.ok(this.counter2.size()==1);
	console.log('Testing counter key insertion and count...');
	assert.ok(this.counter2.getCount('hello')==1);
	console.log('Testing total count...');
	assert.ok(this.counter2.totalCount()==1);
};

tester.prototype.testArgMax=function() {
	console.log('Testing arg max...');
	assert.ok(this.counter2.argMax()['key']=='hello');
	this.counter2.incrementCount('hello2',2);
	console.log('Testing updated arg max');
	assert.ok(this.counter2.argMax()['key']=='hello2');
};
tester.prototype.testKeys=function() {
	console.log('Testing key set...');
	var keys=this.counter2.keySet();
	assert.ok(keys.length==2);
};
tester.prototype.runCounterTests=function() {
	this.testEmpty();
	console.log('Passed!');
	this.testCounts();
	console.log('Passed!');
	this.testArgMax();
	console.log('Passed!');
	this.testKeys();
	console.log('Passed!');
};

tester.prototype.testCounterMapEmpty=function() {
	console.log('Ensuring counter map is empty..');
	assert.ok(this.countermap.isEmpty());
	console.log('Testing counter map size..');
	assert.ok(this.countermap.totalSize()==0);
	
};
tester.prototype.testTotalCount=function() {
	console.log('Testing total counter map count');
	assert.ok(this.countermap.totalCount()==0);
	this.countermap.incrementCount('map1','hello',1);
	console.log('Testing get count on map1,hello...');
	assert.ok(this.countermap.getCountFor('map1','hello')==1);
	console.log('Inserting map2 hello3');
	this.countermap.incrementCount('map2','hello3',1);
	console.log('Incrementing count for map 1 hello5');
	this.countermap.incrementCount('map1','hello5',2);
	//console.log('Ensuring count for map2 hello is 1');
	assert.ok(this.countermap.getCountFor('map2','hello3')==1);
	console.log('Ensuring total size = 3');
	assert.ok(this.countermap.totalSize()==3);
	
   assert.ok(this.countermap.totalCount()==4);
};


var tester2 = new tester();
tester2.runCounterTests();
tester2.testCounterMapEmpty();
tester2.testTotalCount();
