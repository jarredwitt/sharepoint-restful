var rsvp = require('rsvp');
var request = require('request');
var buffer = require('buffer');

/*
Creates new instance. Sharepoint must be configured for basic auth. 
site - sharepoint site eq: http://site.domain.com
user - user with sufficient privs 
pass - password for user
*/
var SharePoint = function(config){
    this.site = config.site;
    this.user = config.user;
    this.pass = config.pass;
    
    this.api = "/_api/web/";
    this.root = this.site + this.api;
    this.contextUrl = this.site + "/_api/contextinfo";
    
    this.headers = {
        "Accept": "application/json;odata=verbose",
        "content-type": "application/json;odata=verbose"
    };
    
    return this;
};

//***** list operations *****//

/*
Gets all list from the sharepoint site. Takes a props array arg to return selected list properties, if no array is passed only the titles are returned.
*/
SharePoint.prototype.getAllLists = function(props){
    if(!props){
        props = ['Title'];
    };
    
    var url = this.root + 'lists';
    
    var promise = new rsvp.Promise(function(resolve, reject){
        httpGet(url, this).then(function(result){
            var data = [];
            var propsLength = props.length;
            
            result.results.forEach(function(r){
                var d = new Object();
                for(var i = 0; i < propsLength; i++){
                    d[props[i]] = r[props[i]];
                };
                
                data.push(d);
            });
            
            resolve(data);
        }, function(err){
            reject(err);
        });
    }.bind(this));
    
    return promise
};

/*
Gets list information by title. Takes a props array arg to return selected list properties, if no array is passed only the Id, Title, and ItemCount is returned.
*/
SharePoint.prototype.getListInfoByTitle = function(list, props){
    if(!props){
        props = ['Id', 'Title', 'ItemCount'];
    };
    
    var url = this.root + "lists/getbytitle('" + list + "')";
    
    var promise = new rsvp.Promise(function(resolve, reject){
        httpGet(url, this).then(function(result){
            var data = [];
            var propsLength = props.length;
            
            var d = new Object();
            for(var i = 0; i < propsLength; i++){
                d[props[i]] = result[props[i]];
            };
            
            data.push(d);
            
            resolve(data);
        }, function(err){
            reject(err);
        });
    }.bind(this));
    
    return promise
};

/*
Gets all items in the named list. Takes a props array argument. It no props are supplied only the title of the items will be returned. This will grab all the items in the list. If you want to limit the amount of items supply a value for the item count.
Paging is still a work in progress.
*/
SharePoint.prototype.getListItems = function(title, props, itemCount){
    if(!props){
        props = ['Title'];
    };
    
    var url = this.root + "lists/getbytitle('" + title + "')/items";
    if(itemCount){
        url+= "?$top=" + itemCount;
    }
    
    var promise = new rsvp.Promise(function(resolve, reject){
        httpGet(url, this).then(function(result){
            var data = [];
            var propsLength = props.length;
            
            result.results.forEach(function(r){
                var d = new Object();
                for(var i = 0; i < propsLength; i++){
                    d[props[i]] = r[props[i]];
                };
                
                data.push(d);
            });
            
            resolve(data);
        }, function(err){
            reject(err);
        });
    }.bind(this));
    
    return promise
};

/*
Creates a new list item the named list.
*/
SharePoint.prototype.createListItem = function(title, item){
    var url = this.root + "lists/getbytitle('" + title + "')/items";
    return httpPost(url, this, item);
};

/*end of list operatons*/

/***** content type operatons *****/

/*
Gets all content types from the named list
*/
SharePoint.prototype.getContentTypes = function(list, props){
    if(!props){
        props = ['Name'];
    };
    
    var url = this.root + "lists/getbytitle('" + list + "')/contenttypes";
    
    var promise = new rsvp.Promise(function(resolve, reject){
        httpGet(url, this).then(function(result){
            var data = [];
            var propsLength = props.length;
            
            result.results.forEach(function(r){
                var d = new Object();
                for(var i = 0; i < propsLength; i++){
                    d[props[i]] = r[props[i]];
                };
                
                data.push(d);
            });
            
            resolve(data);
        }, function(err){
            reject(err);
        });
    }.bind(this));
    
    return promise
};

/*
Gets the columns of a content type using the content types id and list name
*/
SharePoint.prototype.getContentTypeColumns = function(list, id, props){
    if(!props){
        props = ['Title', 'InternalName'];
    };
    
    var url = this.root + "lists/getbytitle('" + list + "')/contenttypes/getbyid('" + id + "')/fields";
    
    var promise = new rsvp.Promise(function(resolve, reject){
        httpGet(url, this).then(function(result){
            var data = [];
            var propsLength = props.length;
            
            result.results.forEach(function(r){
                var d = new Object();
                for(var i = 0; i < propsLength; i++){
                    d[props[i]] = r[props[i]];
                };
                
                data.push(d);
            });
            
            resolve(data);
        }, function(err){
            reject(err);
        });
    }.bind(this));
    
    return promise
};

/*
Uploads a document to the named list. Does not attach the document to a list item. This method is useful if you need to upload a document
and only care about the title of the document, no other metadata. 
*/
SharePoint.prototype.uploadDocument = function(list, name, stream, overwrite){
    var url = this.root + "lists/getbytitle('" + list + "')/RootFolder/Files/Add(url='" + name + "', overwrite=" + overwrite + ")";
    return httpPost(url, this, stream, true);
}

/*
Uploads a document to the named list and attached the document to a list item. The document is uploaded first then the item is created. Once the
item is created the document is attached. 
*/
SharePoint.prototype.uploadDocumentAttach = function(list, name, stream, overwrite, item){
    var config = this;
    var url = this.root + "lists/getbytitle('" + list + "')/RootFolder/Files/Add(url='" + name + "', overwrite=" + overwrite + ")";
    
    var promise = new rsvp.Promise(function(resolve, reject){
        httpPost(url, config, stream, true).then(function(result){
            var uri = result.d.ListItemAllFields.__deferred.uri;
            
            httpGet(uri, config).then(function(result){

                var url = config.root + "lists/getbytitle('" + list + "')/items(" + result.Id + ")";
                config.headers['X-Http-Method'] = "MERGE";
                config.headers['IF-MATCH'] = result.__metadata.etag;
                
                httpPost(url, config, item, false).then(function(result){
                    resolve(result);
                }, function(err){
                    reject(err);
                });
                
            }, function(err){
                reject(err);
            });
            
        }, function(err){
            reject(err);
        });
    });
    
    return promise;
}

//***** end of list operations *****//

//***** http methods *****//

/*
HTTPGet method for all get operations. 
*/
function httpGet(url, config){  
    var options = {
        url: url,
        headers: config.headers
    };

    var promise = new rsvp.Promise(function(resolve, reject){
        request.get(options, function(err, res, body){
            if(err){
                reject(err);
            }

            var json = JSON.parse(body);
            resolve(json.d);
        }).auth(config.user, config.pass, true);
    });
    
    return promise;
};

/*
HTTPPost method for all post operations.
*/
function httpPost(url, config, item, isFile){
    var contextOptions = {
        url: config.contextUrl,
        headers: config.headers
    };
    
    var options = {
        url: url,
        headers: config.headers
    };
    
    var promise = new rsvp.Promise(function(resolve, reject){
        getContext(contextOptions, config.user, config.pass).then(function(res){
            if(res){
                options.headers['X-RequestDigest'] = res;
                if(isFile){
                    options.body = item;
                    options['content-length'] = item.length;
                }
                else{
                    options.body = JSON.stringify(item);
                }
                
                request.post(options, function(err, res, body){
                    if(err){
                        reject(err);
                    }
                    if(body){
                        resolve(JSON.parse(body));
                    }
                }).auth(config.user, config.pass, true);
            } 
            else{
                reject('No Context Header Provided');
            }
        }, function(err){
            console.log(err);
        });
    });
    
    return promise;
};

/*
Get's the site context for POST operations. All post operations must have the site context in the X-RequestDigest header. This is done 
automatically for you in the httpPost method. 
*/
function getContext(options, user, pass){
    var promise = new rsvp.Promise(function(resolve, reject){
        options.body = '';//emtpy out the body to get the context
        options.url = options.site + '/_api/contextinfo'
        request.post(options, function(err, res, body){
            if(err){
                reject(err);
            }
            var json = JSON.parse(res.body);
            resolve(json.d.GetContextWebInformation.FormDigestValue);
        }).auth(user, pass, true);
    });
    
    return promise;
}

//***** end of http methods *****//

module.exports = SharePoint;