// AJAX-Solr demo search engine

var Manager;

// Add these includes:
// <script src="ajax-solr/core/Core.js"></script>
// <script src="ajax-solr/core/AbstractManager.js"></script>
// <script src="ajax-solr/managers/Manager.jquery.js"></script>
// <script src="ajax-solr/core/Parameter.js"></script>
// <script src="ajax-solr/core/ParameterStore.js"></script>
// <script src="ajax-solr/core/AbstractWidget.js"></script>
// <script src="ajax-solr/widgets/jquery/PagerWidget.js"></script>
// <script src="ajax-solr/core/AbstractFacetWidget.js"></script>
// <script src="ajax-solr/core/AbstractTextWidget.js"></script>

(function ($) {
  $(function () {

    /**************************************************************************
     * Result Widget class
     * For displaying search engine-like results
     **************************************************************************/
    AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
      start: 0,

      init: function () {
      },

      beforeRequest: function () {
        $(this.target).html($('<img>').attr('src', 'images/ajax-loader.gif'));
      },

      afterRequest: function () {
        $(this.target).empty();
        var docs = this.manager.response.response.docs;
        for (var i = 0, l = docs.length; i < l; i++) {
          $(this.target).append(this.template(docs[i]));
        }
      },

      facetLinks: function (facet_field, facet_values) {
        var links = [];
        if (facet_values) {
          for (var i = 0, l = facet_values.length; i < l; i++) {
            links.push(
              $('<a href="#"></a>')
                  .text(facet_values[i])
                  .click(this.facetHandler(facet_field, facet_values[i]))
            );
          }
        }
        return links;
      },

      facetHandler: function (facet_field, facet_value) {
        var self = this;
        return function () {
          self.manager.store.remove('fq');
          self.manager.store.addByValue('fq', facet_field + ':' 
              + AjaxSolr.Parameter.escapeValue(facet_value));
          self.doRequest();
          return false;
        };
      },


      template: function (doc) {
        var output = '';
        output += '<div>'
        output += '<h2>' + doc.title + '</h2>';
        output += '<p>By ' + doc.author + '.</p>';      
        output += '<p>' + this.makeResource(doc) + '</p>';
        output += '<p>From '+ doc.collection +' collection at the '+ doc.institution +'.</p>';
        output += '<p>See more at ' + this.makeURL(doc, doc.url) + '.</p>';
        output += '</p>'
        output += '</div>';
        return output;
      },

      makeURL: function (doc, display) {
        return '<a href="' + doc.url + '">'+ display + '</a>';
      },

      makeResource: function(doc) {
        if (doc.resource !== "Resource available online")
          return '';
        var output = '';
        for (var i = 0; i < doc.resourceURL.length; i++) {
          output += '<img src="' + doc.resourceURL[i] + '">';
        }
        return output;
      }
    });

    /**************************************************************************
     * Tag Cloud Widget class
     * For displaying common facets
     **************************************************************************/
    AjaxSolr.TagcloudWidget = AjaxSolr.AbstractFacetWidget.extend({
      afterRequest: function () {
        if (this.manager.response.facet_counts.facet_fields[this.field] === undefined) {
          $(this.target).html('no items found in current selection');
          return;
        }

        var maxCount = 0;
        var objectedItems = [];
        for (var facet in this.manager.response.facet_counts.facet_fields[this.field]) {
          var count = parseInt(this.manager.response.facet_counts.facet_fields[this.field][facet]);
          if (count > maxCount) {
            maxCount = count;
          }
          objectedItems.push({ facet: facet, count: count });
        }
        objectedItems.sort(function (a, b) {
          return a.facet < b.facet ? -1 : 1;
        });

        $(this.target).empty();
        for (var i = 0, l = objectedItems.length; i < l; i++) {
          var facet = objectedItems[i].facet;
          $(this.target).append(
            $('<a href="#" class="tagcloud_item"></a>')
            .text(facet)
            .addClass('tagcloud_size_' + parseInt(objectedItems[i].count / maxCount * 10))
            .click(this.clickHandler(facet))
          );
        }
      }
    });

    /**************************************************************************
     * Search Widget class
     * For executing queries other than the default "*:*"
     **************************************************************************/  
    AjaxSolr.CurrentSearchWidget = AjaxSolr.AbstractWidget.extend({
      start: 0,

      afterRequest: function () {
        var self = this;
        var links = [];

        var q = this.manager.store.get('q').val();
        if (q != '*:*') {
          links.push($('<a href="#"></a>').text('(x) ' + q).click(function () {
            self.manager.store.get('q').val('*:*');
            self.doRequest();
            return false;
          }));
        }

        var fq = this.manager.store.values('fq');
        for (var i = 0, l = fq.length; i < l; i++) {
          links.push($('<a href="#"></a>').text('(x) ' + fq[i]).click(self.removeFacet(fq[i])));
        }

        if (links.length > 1) {
          links.unshift($('<a href="#"></a>').text('remove all').click(function () {
            self.manager.store.get('q').val('*:*');
            self.manager.store.remove('fq');
            self.doRequest();
            return false;
          }));
        }

        if (links.length) {
          var $target = $(this.target);
          $target.empty();
          for (var i = 0, l = links.length; i < l; i++) {
            $target.append($('<li></li>').append(links[i]));
          }
        }
        else {
          $(this.target).html('<li>Viewing all documents.</li>');
        }
      },

      removeFacet: function (facet) {
        var self = this;
        return function () {
          if (self.manager.store.removeByValue('fq', facet)) {
            self.doRequest();
          }
          return false;
        };
      }
    });

    /**************************************************************************
     * Search Autocomplete Widget class
     * For executing queries other than the default "*:*"
     **************************************************************************/  
    AjaxSolr.AutocompleteWidget = AjaxSolr.AbstractTextWidget.extend({
        afterRequest: function () {
          $(this.target).find('input').unbind().removeData('events').val('');

          var self = this;

          var callback = function (response) {
            var list = [];
            for (var i = 0; i < self.fields.length; i++) {
              var field = self.fields[i];
              for (var facet in response.facet_counts.facet_fields[field]) {
                list.push({
                  field: field,
                  value: facet,
                  label: facet + ' (' + response.facet_counts.facet_fields[field][facet] + ') - ' + field
                });
              }
            }

            self.requestSent = false;
            $(self.target).find('input').autocomplete('destroy').autocomplete({
              source: list,
              select: function(event, ui) {
                if (ui.item) {
                  self.requestSent = true;
                  if (self.manager.store.addByValue('fq', ui.item.field + ':' 
                      + AjaxSolr.Parameter.escapeValue(ui.item.value))) {
                    self.doRequest();
                  }
                }
              }
            });

            // This has lower priority so that requestSent is set.
            $(self.target).find('input').bind('keydown', function(e) {
              if (self.requestSent === false && e.which == 13) {
                var value = $(this).val();
                if (value && self.set(value)) {
                  self.doRequest();
                }
              }
            });
          } // end callback

          // limit=-1
          var params = [ 'rows=0&facet=true&facet.limit=100&facet.mincount=1&json.nl=map' ];
          for (var i = 0; i < this.fields.length; i++) {
            params.push('facet.field=' + this.fields[i]);
          }
          var values = this.manager.store.values('fq');
          for (var i = 0; i < values.length; i++) {
            params.push('fq=' + encodeURIComponent(values[i]));
          }
          params.push('q=' + this.manager.store.get('q').val());
          $.getJSON(this.manager.solrUrl + 'select?' + params.join('&') + '&wt=json&json.wrf=?', {}, callback);
        }
      });

    /**************************************************************************
     * Create manager and add widgets
     * Set parameters and execute request 
     **************************************************************************/
    Manager = new AjaxSolr.Manager({
      solrUrl: 'http://hackathonlb-1601934162.us-east-1.elb.amazonaws.com/solr/biblio/'
    });

    Manager.addWidget(new AjaxSolr.ResultWidget({
      id: 'result',
      target: '#docs'
    }));

    Manager.addWidget(new AjaxSolr.PagerWidget({
      id: 'pager',
      target: '#pager',
      prevLabel: '&lt;',
      nextLabel: '&gt;',
      innerWindow: 1,
      renderHeader: function (perPage, offset, total) {
        $('#pager-header')
        .html($('<span></span>')
            .text('displaying ' + Math.min(total, offset + 1) + ' to ' 
                + Math.min(total, offset + perPage) + ' of ' + total));
      }
    }));

    var fields = ['institution_facet', 'collection_facet', 'auth_author_facet', 
        'type_facet', 'era_facet', 'resource_facet'];
    
    for (var i = 0, l = fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.TagcloudWidget({
        id: fields[i],
        target: '#' + fields[i],
        field: fields[i]
      }));
    }

    Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
      id: 'currentsearch',
      target: '#selection',
    }));

    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'text',
      target: '#search',
      fields: fields
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*'); // query everything

    var params = {
      facet: true,
      'facet.field': fields,
      'facet.limit': 20,
      'facet.mincount': 1,
      'f.topics.facet.limit': 50,
      'json.nl': 'map'
    };
    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }

    Manager.doRequest();
  });

})(jQuery);