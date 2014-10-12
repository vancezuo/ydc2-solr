YDC2 Solr Demo
====

This is a simple javascript demo of accessing Yale Digital Collections Center metadata Solr database, using the AJAX Solr library. It includes three applications--a search engine (based on the Ajax Solr tutorial), and two JQuery image sliders. See below in the [Link to Header](#Usage) section for brief tips on using AJAX Solr for other YDC2 apps. 

Dependencies
----

The necessary files from the two libraries used to create these demos, AJAX Solr and the Jssor JQuery slider, are included in this repo for convenience. Details brlow.

* AJAX Solr (https://github.com/evolvingweb/ajax-solr) 
  * In folder named "ajax-solr".
  * Released under Apache License (ASL) v2.0.
* Jssor JQuery slider (https://github.com/jssor/jquery-slider)
  * In folder named "jssor".
  * Release under MIT License.
  
Usage
----
To see the demos, simply download the repo and open one of the html files. The apps get their data from the YDC2 Solr database can be manually queried through http://hackathonlb-1601934162.us-east-1.elb.amazonaws.com/solr. Below are some notes for integrating this data in an own app.


### Nuts and Bolts
In AJAX Solr, the object that interfaces with a Solr database is the Manager object (`AjaxSolr.Manager`), which can be instantiated for the YDC2 database via:

```javascript
var Manager;
Manager = new AjaxSolr.Manager({
  solrUrl: 'http://hackathonlb-1601934162.us-east-1.elb.amazonaws.com/solr/biblio/'
});
Manager.init();
```

Of course, we need to query the database before doing anything. The Manager stores query parameters in a default Parameter Store object. Add Solr parameters like so:

```javascript
var params = {
  'q' : '*:*', // queries everything; searching specific fields = e.g. 'FIELD1:"STRING1" AND FIELD2:"STRING2" AND ...'
  'rows' : 20, // number of results to grab
  // etc...
};
for (var e in params)
  Manager.store.addByValue(e, params[e]);
```

Finer details about what parameters exist and how to constuct queries can be gleaned from the [https://wiki.apache.org/solr/SolrQuerySyntax](Apache Solr docs).

And to execute a request:

```javascript
Manager.doRequest();
```
The metadata result can be accessed via `Manager.response.response.docs`, which returns an array of docs that contain metadata field:value pairs. Because the YDC2 database is heterogeneous, i.e. docs can contain different metadata fields, it would be useful to look at the docs of the sorts of queries that would be used in a browser developer console or similar. For a list of all fields that occur in the database, refer to it's [http://hackathonlb-1601934162.us-east-1.elb.amazonaws.com/solr/biblio/admin/file/?file=schema.xml](schema XML).

### Modifying the DOM
To this Manager, we can add Widgets objects (extend `AjaxSolr.AbstractWidget`), which can dynamically modify the DOM when the Manager makes a request. Custom widgets can be used by overriding the Abstract widget and adding it to the Manager:

'''javascript
AjaxSolr.CustomWidgetName = AjaxSolr.AbstractWidget.extend({
  init: function () {
    // Constructor code...
  },
  
  beforeRequest: function () {
    // Code executed before Solr request responds...
  },
  
  afterRequest: function () {
    // Code executed after request responds...
  }
  
  // etc.
});

Manager.addWidget(new AjaxSolr.CustomWidgetName({ 
  id: 'UNIQUE_ID_FOR_WIDGET', // replace with custom name
  target: '#CSS_SELECTOR', // replace with custom selector if desired
  // ...
}));

// Alternatively, can directly add anonymous AjaxSolr.AbstractWidget instance)
```

Custom widgets will most likely have their own `afterReqest` implementation, and probably own `beforeRequest` and `init`. Widgets can access the Manager with `this.manager` to read query responses (from the array `this.manager.response.response.docs`), execute their own requests (by calling this.manager.store.* and this.manager.doRequest()), etc. The YDC2 Solr library provides several ready-made widgets.

### Accessing Images
The metadata results should be easy enough to use from `Manager.response.response.docs`. Finding and using images is more complicated, again due to the database's heterogenous nature (not all entries link to images, and some who do provide invalid/dead links). There are two methods to checking and using images that the database references: checking the resource-related fields, or checking cds_* fields. The first covers more potential images, but has more false positives, i.e. not all that have resources will actually have images for use; while the second is more reliable at finding images that can be accessed and manipulated, but has more false negatives, i.e. some images in the database will be missed. On balance the latter is probably easier to work with, but both are described below.

#### Using CDS Fields
Probably the most reliable to check for images is by constructing links to the YDC2 content delivery service (http://deliver.odai.yale.edu) using various metadata values. The syntax for a link is:

```
http://deliver.odai.yale.edu/info/CDS_REPOSITORY_CODE/object/CDS_OBJECT_ID/type/NUMBER
```

where CDS_REPOSITORY_CODE = the `cds_repository_code` field value, CDS_OBJECT_ID = the `cds_object_id` field value, and NUMBER is 1, 2, 3, or 4 (check all of them; nonexistant images will return `{}`). This link will return JSON-formatted array, with each element containing the field `contentId`. This long hash string can then be used to grab images from the YDC2 servers via:

```
http://scale.ydc2.yale.edu/iiif/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/full/full/0/native.jpg
```

where XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX is the `contentId` value of the element found from the CDS link. These images can be manipualated, i.e. resized, rotated, etc., by changing the parameters at the end of the string (here the "full/full/0/native.jpg" part). See http://iiif.io/api/image/1.1/ for details. For example, getting an image cropping the top 33%, then scaled 50%, and then rotated 270 degrees would be accomplished by the link:

```
http://scale.ydc2.yale.edu/iiif/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/pct:0,33,100,100/pct:50/270/native.jpg
```

With the right checks (i.e. making sure the `cds_repository_code` and `cds_object_id` exist), this method finds manipulatable images reliably. However, it will miss entries in the database that lack thsese fields but otherwise have valid image resources.

#### Using Resource Fields
Generally, database entries that have corresponding images will have a `resource` field with value "Resource available online" value. This should be checked for, or the string `resource:"Resource available online"` should be added to the query. Another field that may be of interest is the `thumbnail` field (which will be a url of small image if it exists).

Of these entries that have "Resource available online", some of them can have their images accessed by simply copying the `resourceURL[0]` value of the response docs array. Although this is simple, it is not always a valid link, so could be verified via AJAX requests (_caution_: this can yield false negatives, as the YDC2 server will sometimes refuse HEAD requests):

```javascript
var docs = this.manager.response.response.docs;
           
// Image Validation
promises = [];
validImages = [];
var addImage = function (docs, i) {
  var request = $.ajax({
    url: docs[i].resourceURL[0],
    type: 'HEAD',
    complete: function (req) {
      if (req.status != 404) 
        validImages.push(docs[i]);
    }
  });
  promises.push( request.then(function (x) {
    return {result: x, resolved: true};
  }, function (x) {
    return (new $.Deferred).resolve({result:x,resolved:false});
  })
  );
}
for(var i = 0; i < docs.length; i++){    
  addImage(docs, i);
}

$.when.apply(null, promises).done(function () {
  // Do whatever on validImages...
});
// 
```

On the other hand, verifying images this way is slow. This method is probably best used only if the queries that are being worked on are known to yield valid images.
