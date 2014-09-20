/**
 * @namespace Namespace for YDC2 classes.
 */
var YDC2 = YDC2 || {};

(function ($) {
    YDC2.Doc = function (doc) {
        this.doc = doc;
    };

    YDC2.Doc.FIELDS = ['institution', 'collection', 'language', 'type', 
            'format', 'author', 'title', 'title_full', 'physical', 
            'publisher', 'publishDate', 'edition', 'description', 
            'contents', 'credit_line', 'rights', 'rights_resource', 
            'resource', 'access', 'url', 'thumbnail', 'resourceURL', 
            'title_alt', 'kingdom', 'phylum', 'class', 'order',
            'family', 'genus', 'taxon_hierarchy', 'earliestDate', 
            'latestDate', 'topic', 'genre', 'genre_name', 'object_name', 
            'geographic', 'geographic_culture', 'era' ];
}