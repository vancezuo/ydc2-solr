(function ($) {

  AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
    start: 0,

    init: function () {
    },

    beforeRequest: function () {
      $(this.target).html($('<img>').attr('src', 'images/ajax-loader.gif'));
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
        self.manager.store.addByValue('fq', facet_field + ':' + AjaxSolr.Parameter.escapeValue(facet_value));
        self.doRequest();
        return false;
      };
    },

    afterRequest: function () {
      $(this.target).empty();
      var docs = this.manager.response.response.docs;
      for (var i = 0, l = docs.length; i < l; i++) {
        $(this.target).append(this.template(docs[i]));

        var items = [];
        items = items.concat(this.facetLinks('institution_facet', docs[i].institution_facet));
        items = items.concat(this.facetLinks('collection_facet', docs[i].collection_facet));
        items = items.concat(this.facetLinks('auth_author_facet', docs[i].auth_author_facet));
        items = items.concat(this.facetLinks('resource_facet', docs[i].resource_facet));

        var $links = $('#links_' + docs[i].id);
        $links.empty();
        for (var j = 0, m = items.length; j < m; j++) {
          $links.append($('<li></li>').append(items[j]));
        }
      }
    },

    template: function (doc) {
      var output = '';
      output += '<div>'
      output += '<h2>' + doc.title + '</h2>';
      output += '<p>By ' + doc.author + '</p>';      
      output += '</p>'
      output += '</div>';
      return output;
    },


  });

})(jQuery);