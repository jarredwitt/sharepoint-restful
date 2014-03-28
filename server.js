var express = require('express');
var app = express();

var SharePoint = require('./lib/sharepoint');
var config = require('./config');

///This builds our sharepoint config object from a config file. There are many different ways to go
///about doing this, using a config file was easiest for this example.
var buildSharePoint = function(){
    var sp = new SharePoint({
        site: config.site,
        user: config.user,
        pass: config.password
    });

    return sp;
}

//server setup
app.use('/', express.static(__dirname + '/example'));

//example routes

/*
    Gets all the lists from the sharepoint site.
 */
app.get('/getAllLists', function(req, res){
    var sp = buildSharePoint();

    sp.getAllLists(['Title', 'ItemCount', 'Id']).then(function(result){
        res.send(result);
    }, function(err){
        res.send(500, err);
    });
});

/*
    Gets all the list info for the given list name. req.query.list is the list name in this case.
 */
app.get('/getListInfo', function(req, res){
    var list = req.query.list;

    var sp = buildSharePoint();

    sp.getListInfo(list).then(function(result){
        res.send(result);
    }, function(err){
        res.send(500, err);
    });
});

/*
 Gets all the list info for the given list name. req.query.list is the list name in this case.
 */
app.get('/getListItems', function(req, res){
    var list = req.query.list;

    var sp = buildSharePoint();

    sp.getListItems(list, ['Title']).then(function(result){
        res.send(result);
    }, function(err){
        res.send(500, err);
    });
});

app.get('/getListContentTypes', function(req, res){
    var list = req.query.list;
    var sp = buildSharePoint();

    sp.getContentTypes(list, ['Name', 'StringId']).then(function(result){
        res.send(result);
    }, function(err){
        res.send(500, err);
    });
});

app.listen(3000);
console.log('Server listering at port 3000');