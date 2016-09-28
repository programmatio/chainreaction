import device;
import ui.StackView as StackView;
// user imports
import src.ui.TitleScreen as TitleScreen;
import src.game.GameScreen as GameScreen;

exports = Class(GC.Application, function () {

  this.initUI = function () {

    var titleScreen= new TitleScreen();
    var gameScreen = new GameScreen();

    this.view.style.backgroundColor = '#008a42';

    var rootView = new StackView({
      superview: this,
      x: 0,
      y: 0,
      width: 576,
      height: 1024,
      clip: true,
      scale: device.width / 576
    });

    rootView.push(titleScreen);

    titleScreen.on('titleScreen:start', function () {
      rootView.push(gameScreen);
      gameScreen.emit('app:start');
    });

    gameScreen.on('gameScreen:end', function () {
      rootView.pop();
    });

  };

  this.launchUI = function () {

  };

});
