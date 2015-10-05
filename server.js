var express = require('express');
var app = express();
var webshot = require('webshot');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

//app.use("/css", express.static(__dirname + '/css'));
//app.use("/js", express.static(__dirname + '/js'));
app.use("/images", express.static(__dirname + '/images'));
//app.use(express.static('images'));

app.get('/grab', function (req, res) {
  var url = req.param('url');
  capture(url, 'desktop');
  capture(url, 'ipad');
  capture(url, 'mobile');
  res.send('Done');
});

function capture(url, size) {
	console.log("Capturing", url, size);
	var image = 'images/' + url + '_' + size + '.png';
	var screensize = {
		width: 1200,
		height: 800
	};
	var shotsize = {
		width: 1200,
		height: 800
	};
	var useragent = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)'
    + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g';

	switch (size) {
		case 'desktop':
			useragent = null;
			break;

		case 'ipad':
			screensize.width = 768;
			screensize.height = 1024;
			shotsize.width = 768;
			break;

		case 'mobile':
			screensize.width = 320;
			screensize.height = 480;
			shotsize.width = 320;
			break;
	}

	var options = {
		renderDelay: 2000,
		screenSize: screensize,
		shotSize: shotsize,
		userAgent: useragent
	};

	webshot(url, image, options, function(err) {
	  console.log("capture saved!", image, options, err);
	  io.emit('captured', {
	  	image: image,
	  	size: size
	  });
	});
}

http.listen(3998, function(){
  console.log('listening on *:3998');
});


io.on('connection', function(socket){
  	
  	console.log('user started the app');

  	socket.on('disconnect', function(){
    	console.log('a user disconnected :/');
  	});

});
