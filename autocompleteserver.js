var 
http=require('http'),
fs=require('fs'),
httpProxy=require('http-proxy'),
path = require('path'),  
routes = require('./routes'),restler=require('restler'),
express = require('express'),app = express();


var main=function(){
  app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});


};


main.prototype.start=function() {
	//this.startProxy();
	this.startRender();
	console.log('Listening on 3000');
	app.listen(3000);
}; 


main.prototype.startRender=function() {
	app.get('/autocompleter', routes.index);
    
    app.get('/autocomplete/nextchar',function(req,res){
    	 restler.get('http://localhost:8080/autocompleter/autocomplete/nextchar?q=' + req.query['q'], {

        }).on('complete', function (data) {
                console.log(data);
               res.json(data);
            });

    });
};
var main2 = new main();
main2.start();
