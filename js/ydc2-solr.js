var manager;

(function ($) {

  $(function () {
    manager = new AjaxSolr.Manager({
      solrUrl: 'http://hackathonlb-1601934162.us-east-1.elb.amazonaws.com/solr/biblio/'
    });

    manager.addWidget(new AjaxSolr.ResultWidget({
      id: 'result',
      target: '#docs'
    }))

    manager.addWidget(new AjaxSolr.PagerWidget({
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

    manager.addWidget(new AjaxSolr.CurrentSearchWidget({
      id: 'currentsearch',
      target: '#selection',
    }));

    manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'text',
      target: '#search',
      fields: ['institution_facet', 'collection_facet', 'auth_author_facet', 'resource_facet']
    }));

    var fields = ['institution_facet', 'collection_facet', 'auth_author_facet', 'resource_facet'];
    for (var i = 0, l = fields.length; i < l; i++) {
      manager.addWidget(new AjaxSolr.TagcloudWidget({
        id: fields[i],
        target: '#' + fields[i],
        field: fields[i]
      }));
    }

    manager.init();
    manager.store.addByValue('q', '*:*');

    var params = {
      facet: true,
      'facet.field': ['institution_facet', 'collection_facet', 'auth_author_facet', 'resource_facet'],
      'facet.limit': 20,
      'facet.mincount': 1,
      'f.topics.facet.limit': 50,
      'json.nl': 'map'
    };
    for (var name in params) {
      manager.store.addByValue(name, params[name]);
    }

    manager.doRequest();
  });

})(jQuery);