// AJAX-Solr demo grid slider

var Manager;
var jssor_slider1;

// Add these includes
// <script src="jssor/js/jquery-1.9.1.min.js"></script>
// <script src="jssor/js/jssor.core.js"></script>
// <script src="jssor/js/jssor.utils.js"></script>
// <script src="jssor/js/jssor.slider.js"></script>
// <script src="ajax-solr/core/Core.js"></script>
// <script src="ajax-solr/core/AbstractManager.js"></script>
// <script src="ajax-solr/managers/Manager.jquery.js"></script>
// <script src="ajax-solr/core/Parameter.js"></script>
// <script src="ajax-solr/core/ParameterStore.js"></script>    
// <script src="ajax-solr/core/AbstractWidget.js"></script>

/******************************************************************************
 * Demo jssor grid slider
 ******************************************************************************/
var initSlider = function() {
  var nestedSliders = [];

  $.each(["sliderh1_container", "sliderh2_container", "sliderh3_container", "sliderh4_container"], function (index, value) {

    var sliderhOptions = {
      $PauseOnHover: 1,                               //[Optional] Whether to pause when mouse over if a slider is auto playing, 0 no pause, 1 pause for desktop, 2 pause for touch device, 3 pause for desktop and touch device, 4 freeze for desktop, 8 freeze for touch device, 12 freeze for desktop and touch device, default value is 1
      $AutoPlaySteps: 4,                                  //[Optional] Steps to go for each navigation request (this options applys only when slideshow disabled), the default value is 1
      $SlideDuration: 300,                                //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 500
      $MinDragOffsetToSlide: 20,                          //[Optional] Minimum drag offset to trigger slide , default value is 20
      $SlideWidth: 200,                                   //[Optional] Width of every slide in pixels, default value is width of 'slides' container
      //$SlideHeight: 150,                                //[Optional] Height of every slide in pixels, default value is height of 'slides' container
      $SlideSpacing: 3,                                   //[Optional] Space between each slide in pixels, default value is 0
      $DisplayPieces: 4,                                  //[Optional] Number of pieces to display (the slideshow would be disabled if the value is set to greater than 1), the default value is 1
      $ParkingPosition: 0,                              //[Optional] The offset position to park slide (this options applys only when slideshow disabled), default value is 0.
      $UISearchMode: 0,                                   //[Optional] The way (0 parellel, 1 recursive, default value is 1) to search UI components (slides container, loading screen, navigator container, arrow navigator container, thumbnail navigator container etc).

      $BulletNavigatorOptions: {                                //[Optional] Options to specify and enable navigator or not
          $Class: $JssorBulletNavigator$,                       //[Required] Class to create navigator instance
          $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
          $AutoCenter: 0,                                 //[Optional] Auto center navigator in parent container, 0 None, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
          $Steps: 1,                                      //[Optional] Steps to go for each navigation request, default value is 1
          $Lanes: 1,                                      //[Optional] Specify lanes to arrange items, default value is 1
          $SpacingX: 0,                                   //[Optional] Horizontal space between each item in pixel, default value is 0
          $SpacingY: 0,                                   //[Optional] Vertical space between each item in pixel, default value is 0
          $Orientation: 1                                 //[Optional] The orientation of the navigator, 1 horizontal, 2 vertical, default value is 1
        }
      };
      var jssor_sliderh = new $JssorSlider$(value, sliderhOptions);

      nestedSliders.push(jssor_sliderh);
});   

var options = {
  $AutoPlay: true,                                    //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
  $AutoPlaySteps: 1,                                  //[Optional] Steps to go for each navigation request (this options applys only when slideshow disabled), the default value is 1
  $AutoPlayInterval: 4000,                            //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000
  $PauseOnHover: 1,                               //[Optional] Whether to pause when mouse over if a slider is auto playing, 0 no pause, 1 pause for desktop, 2 pause for touch device, 3 pause for desktop and touch device, 4 freeze for desktop, 8 freeze for touch device, 12 freeze for desktop and touch device, default value is 1

  $ArrowKeyNavigation: true,                          //[Optional] Allows keyboard (arrow key) navigation or not, default value is false
  $SlideDuration: 300,                                //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 500
  $MinDragOffsetToSlide: 80,                          //[Optional] Minimum drag offset to trigger slide , default value is 20
  //$SlideWidth: 600,                                 //[Optional] Width of every slide in pixels, default value is width of 'slides' container
  $SlideHeight: 150,                                //[Optional] Height of every slide in pixels, default value is height of 'slides' container
  $SlideSpacing: 3,                                   //[Optional] Space between each slide in pixels, default value is 0
  $DisplayPieces: 3,                                  //[Optional] Number of pieces to display (the slideshow would be disabled if the value is set to greater than 1), the default value is 1
  $ParkingPosition: 0,                                //[Optional] The offset position to park slide (this options applys only when slideshow disabled), default value is 0.
  $UISearchMode: 0,                                   //[Optional] The way (0 parellel, 1 recursive, default value is 1) to search UI components (slides container, loading screen, navigator container, arrow navigator container, thumbnail navigator container etc).
  $PlayOrientation: 2,                                //[Optional] Orientation to play slide (for auto play, navigation), 1 horizental, 2 vertical, 5 horizental reverse, 6 vertical reverse, default value is 1
  $DragOrientation: 2,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0),

  $BulletNavigatorOptions: {                                //[Optional] Options to specify and enable navigator or not
      $Class: $JssorBulletNavigator$,                       //[Required] Class to create navigator instance
      $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
      $AutoCenter: 2,                                 //[Optional] Auto center navigator in parent container, 0 None, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
      $SpacingY: 5,                                   //[Optional] Vertical space between each item in pixel, default value is 0
      $Orientation: 2                                 //[Optional] The orientation of the navigator, 1 horizontal, 2 vertical, default value is 1
    }
  };
  var jssor_slider1 = new $JssorSlider$("slider1_container", options);

//responsive code begin
//you can remove responsive code if you don't want the slider scales while window resizes
function ScaleSlider() {
  var parentWidth = jssor_slider1.$Elmt.parentNode.clientWidth;
  if (parentWidth) {
    var sliderWidth = parentWidth;

      //keep the slider width no more than 809
      sliderWidth = Math.min(sliderWidth, 809);

      jssor_slider1.$SetScaleWidth(sliderWidth);
    }
    else
      window.setTimeout(ScaleSlider, 30);
  }

  ScaleSlider();

  if (!navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|IEMobile)/)) {
    $(window).bind('resize', ScaleSlider);
  }


//if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
//    $(window).bind("orientationchange", ScaleSlider);
//}
//responsive code end
}

/******************************************************************************
 * AJAX-Solr code
 ******************************************************************************/
jQuery(document).ready(function ($) {

  AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
    afterRequest: function () {
      var docs = this.manager.response.response.docs;

      promises = [];
      validImages = [];
      var addImage = function (docs, i) {
        var request = $.ajax({
          url: docs[i].resourceURL[0],
          type: 'HEAD',
          //async: false,
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
      var validNum = validImages.length; // docs.length; // 
      var chars = 'abcd';
      for (var c in chars.split('')) {
        for (var i = 0; i <= 5; i++) {
          var rand = Math.round(Math.random() * validNum);
              var url = validImages[rand].resourceURL[0]; // docs[rand].resourceURL[0]; // 
              console.log(this.target+chars[c] + " " + '#'+chars[c]+i);
              $(this.target+''+chars[c]).html($('#'+chars[c]+i).attr('src', url));
            }                    
          }
          initSlider();
        });
    }
  });

Manager = new AjaxSolr.Manager({
  solrUrl: 'http://hackathonlb-1601934162.us-east-1.elb.amazonaws.com/solr/biblio/'
});

Manager.setStore(new AjaxSolr.ParameterStore());


Manager.addWidget(new AjaxSolr.ResultWidget({
  id: 'slider',
  target: '#slide',              
}));

Manager.init();

var params = {
  'q' : 'resource:"Resource available online" AND institution:"Yale Center for British Art" AND author:"Henry Thomas Alken"',
  'rows' : 400
};
for (var e in params) {
  Manager.store.addByValue(e, params[e]);
}

Manager.doRequest();
});