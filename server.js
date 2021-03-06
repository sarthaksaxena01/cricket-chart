    var express  = require('express');
    var app      = express();                               
    var morgan = require('morgan');            
    var bodyParser = require('body-parser');    
    var methodOverride = require('method-override'); 

    // configuration =================
    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

    var port = process.env.PORT || 1340;

    // listen (start app with node server.js)
    app.listen(port);
    console.log("App listening on port 1340");
