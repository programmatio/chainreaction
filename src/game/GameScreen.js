import animate;
import ui.View;
import ui.ImageView;
import ui.TextView;
import ui.resource.Image as Image;

import src.game.actors.Gem as Gem;

var headerImg = new Image({url: "resources/images/ui/header.png"});

exports = Class(ui.View, function(supr) {
    this.init = function(opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            width: 576,
            height: 1024
        });
        supr(this, 'init', [opts]);
        this.build();
    };
    this.build = function() {
        var background = new ui.ImageView({
            superview: this,
            x: 0,
            y: 0,
            width: 576,
            height: 1024,
            image: "resources/images/ui/background.png"
        });
        // Setup header
        var header = new ui.ImageView({
            superview: this,
            canHandleEvents: true,
            x: 576 / 2 - 249 / 2,
            y: 0,
            width: 249,
            height: 166,
            image: headerImg
        });
        this.countdown = new ui.TextView({
            superview: this,
            visible: true,
            x: 576 / 2 - 249 / 2,
            y: 70,
            width: 249,
            height: 80,
            size: 32,
            color: '#FFFFFF',
            opacity: 0.7,
            verticalAlign: 'middle',
            textAlign: 'center',
            multiline: false
        });
        this.countdown.setText('0');
        // Put the gems to view
        var xOffset = 22;
        var yOffset = 314;
        var xPadding = 1;
        var yPadding = 1;
        this.layout = [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ];
        this.gemsOnScreen = [];
        this.inactive = true;
        this.clusters = [];
        for (var row = 0, len = this.layout.length; row < len; row++) {
            var gemRow = [];
            for (var col = 0; col < len; col++) {
                if (this.layout[row][col] !== 0) {
                    var gem = new Gem();
                    gem.style.x = xOffset + col * (gem.style.width + xPadding);
                    gem.style.y = yOffset + row * (gem.style.height + yPadding);
                    this.addSubview(gem);
                    gemRow.push(gem);
                } else {
                    gemRow.push(null);
                }
            }
            this.gemsOnScreen.push(gemRow)
        }
    };
});

function findClusters() {

    clusters = this.clusters;

    for (var row = 0; row < this.gemsOnScreen.length; row++) {
        var matchLength = 1;
        var matchHeight = 1;
        for (var col = 0; col < this.gemsOnScreen[row].length; col++) {
            var checkLength = false;
            var checkHeight = false;
            if (this.layout[row][col] !== 0 && row <= this.gemsOnScreen[row].length - 1 && this.gemsOnScreen[row][col + 1] && this.gemsOnScreen[row][col].gemType == this.gemsOnScreen[row][col + 1].gemType) {
                matchLength += 1;
            } else {
                checkLength = true;
            }
            if (checkLength) {
                if (matchLength >= 3) {
                    clusters.push({
                        row: row,
                        column: col - (matchLength - 1),
                        length: matchLength,
                        horizontal: true
                    });
                }
                matchLength = 1;
            }
        }
    }

    for (var col = 0; col < this.gemsOnScreen.length; col++) {
        var matchLength = 1;
        var matchHeight = 1;
        for (var row = 0; row < this.gemsOnScreen[col].length; row++) {
            var checkLength = false;
            var checkHeight = false;
            console.log(row, col)
            if (this.layout[row][col] !== 0 && //follow the level layout
                row <= this.gemsOnScreen.length - 1 && this.gemsOnScreen[row + 1] && this.gemsOnScreen[row][col].gemType == this.gemsOnScreen[row + 1][col].gemType) {
                matchHeight += 1;
            } else {
                checkHeight = true;
            }
            if (checkHeight) {
                if (matchHeight >= 3) {
                    clusters.push({
                        row: row - (matchHeight - 1),
                        column: col,
                        length: matchHeight,
                        horizontal: false
                    });
                }
                matchHeight = 1;
            }
        }
    }
}