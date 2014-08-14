/* global game */

/**
* load all the assets
*/
var app = app || {};

app.loadState = {
    preload: function() {
        var loadingLabel = game.add.text(game.world.centerX, game.world.centerY - 40, 'loading...', { font: '30px Arial', fill: '#fff' });
        loadingLabel.anchor.setTo(0.5, 0.5);

        // progress bar
        var progressBar = game.add.sprite(game.world.centerX, game.world.centerY, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);

        // load all assets
        game.load.spritesheet('player', '/img/player/player2.png', 20, 20);
    },

    create: function() {
        game.state.start('menu');
    }
};