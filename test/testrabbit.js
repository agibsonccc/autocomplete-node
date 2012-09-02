/**
 * @author Adam Gibson
 */
	
var rabbitClient=require('../lib/RabbitMQMessageClient.js');


var tester=function(){
	this.client = new rabbitClient.AMQPClient();
	
};

tester.prototype.testSend=function() {
	var exchange=this.client.createExchange('testexchange','fanout');
	//this.client.send('testing','test');
	
	
	
};
var tester2 = new tester();
tester2.testSend();
