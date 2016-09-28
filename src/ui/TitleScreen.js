
import device;
import ui.View;
import ui.ImageView;
import ui.resource.Image as Image;

var playImg = new Image({url: "resources/images/ui/play.png"});

exports = Class(ui.View, function (supr) {

  this.init = function (opts) {

    opts = merge(opts, {
      x:0,
      y:0
    });

    supr(this, 'init', [opts]);
    this.build();
  };

    this.build = function(){

      var background = new ui.ImageView({
        superview: this,
        x:0,
        y:0,
        width: 576,
        height: 1024,
        image: "resources/images/ui/intro.png"
      });

      var start = new ui.ImageView({
        superview: this,
        canHandleEvents: true,
        x: 576 / 2 - 200 / 2,
        y: 1024 / 2 - 50 / 2,
        width: 200,
        height:100,
        image: playImg
      });

      start.on('InputSelect', bind(this, function(){
        this.emit('titleScreen:start')
      }));
    };


});

