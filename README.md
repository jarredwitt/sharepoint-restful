sharepoint-restful
==================

Provides an easy way to work with the SharePoint REST API from node. Only works with on-premise SharePoint environments with sites that are configured to allow basic authentication. 

Every operation returns a promise. The list operations can have a properties array passed in to only return those properties needed. Please refer to the link below for a list of valid properties:

http://msdn.microsoft.com/en-us/library/office/dn531433(v=office.15).aspx

These properties are CaSe SeNsItIvE. 

### Examples

I am currently rewriting the examples piece to show a more robust usage, but for now there are 3 examples, getAllLists, getListInfo, and getListItems. To run the examples:

1. Clone or download the zip
2. Extract
3. Run npm install
4. Run node server
5. Browse to http://localhost:3000

There are some more examples in the examples.js, but they are not really polished as of right now. 

More to come. Please file an issue if you have any questions.




