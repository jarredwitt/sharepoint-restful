var SharePoint = require('./lib/SharePoint');
var fs = require('fs');
var uuid = require('node-uuid');

/*
The following example shows how to upload a file to a sharepoint document library with metadata attached. 

The process must be done backwards by uploading the file first then retrieving it's item properties and
merging the new item metadata with the current item. 

***Gotchas***
You must first get the ListItemEntityTypeFullName and add it to your new items __metadata type field. This tells 
SharePoint what content type to use. 

When creating the item metadata include what fields you want to modify outside of the __metadata property. 

All fields with a space in the name need to be reformatted to use _x0020_ for the space. Eq 'Some Column' = Some_x0020_Column
*/
var addItemWithFile = function () {
    //our sharepoint config
    var sp = new SharePoint({
        site: 'site',
        user: 'user',
        pass: 'password'
    });
    
    //file to upload
    var file = 'path to your file';
    
    //list title
    var list = 'my list title';

    //We start by reading our file stream
    fs.readFile(file, function (err, data) {
        //We get the ListItemEntityTypeFullName for the list - All methods return a promise
        sp.getListInfoByTitle(list).then(function (result) {
            var entityType = result.ListItemEntityTypeFullName;
            
            //create our new item metadata
            var item = {
                __metadata: {
                    type: entityType
                },//add column information below
            };
            
            //pass the file stream into the uploadDocumentAttach method
            //uploadDocumentAttach(list, fileName, stream, overwrite, newItem) - If you want to rename the file, enter the new name for the fileName arg
            sp.uploadDocumentAttach(list, file, data, true, item).then(function (result) {
                //do something with the results
                console.log(result);
            }, function (err) {
                //do something with the err
                console.log(err);
            });
        }, function (err) {
            //do something with the err
            console.log(err);
        });
    });   
        
};

addItemWithFile();