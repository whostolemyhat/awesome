/* global game,Phaser */

/**
* Show the menu which allows the game to start
*/
var app = app || {};

app.menuState = {
    create: function() {
        var nameLabel = game.add.text(game.world.centerX, -50, 'Awesome Jumpy\n Cave Man', { font: '40px Arial', fill: '#fff' });
        nameLabel.anchor.setTo(0.5, 0.5);
        game.add.tween(nameLabel).to({ y: game.world.centerY }, 1000).easing(Phaser.Easing.Bounce.Out).start();
    }
};