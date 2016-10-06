// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var uq_qa1 = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'cirpack.tma.vn.pushNotificationTest',
  verbose: true,
  push: {
    android: {
        senderId: '1042768746539',
        apiKey: 'AIzaSyDUquU_73aR151bHQSH8M61bUfDtIiLzfA'
    },
    ios:{
      //override on TMA key
      //pfx:"public/cirpack_key.p12",
      //bundleId: "tma.cirpack.uniquity",
      pfx:"public/cirpack_push_dev.p12",
      bundleId: "com.cirpack.uniquity",
      production : false
    }
  },
  masterKey: process.env.MASTER_KEY || 'master', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'https://pacific-brushlands-55337.herokuapp.com/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});


var uq_smart = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'smartuq-parse',
  verbose: true,
  push: {
    android: {
        senderId: '422866127995',
        apiKey: 'AIzaSyDUddRXbj0pR83WGXfJAv2U7t_ZjytfJ0A'
    },
    ios:{
      pfx:"public/PushNotification_smart.p12",
      bundleId: "tma.cirpack.smartuq",
      production : false
    }
  },
  masterKey: process.env.MASTER_KEY || 'master', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'https://pacific-brushlands-55337.herokuapp.com/smart',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});

// build production 

var cirpack_production = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/cirpack_pro',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'cirpackpro-parse',
  verbose: true,
  push: {
    android: {
        senderId: '422866127995',
        apiKey: 'AIzaSyDUddRXbj0pR83WGXfJAv2U7t_ZjytfJ0A'
    },
    ios:{
      pfx:"public/cirpack_push_production.p12",
      bundleId: "com.cirpack.uniquity",
      production : true
    }
  },
  masterKey: process.env.MASTER_KEY || 'master', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'https://pacific-brushlands-55337.herokuapp.com/cirpack',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});

// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();
//app.use('/uq_smart', uq_smart);
//app.use('/parse', uq_qa1);


// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// // Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';

app.use("/parse", uq_qa1);
app.use("/smart", uq_smart);
app.use("/cirpack", cirpack_production);


// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 80;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
