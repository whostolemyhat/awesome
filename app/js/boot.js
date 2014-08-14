/* global game, Phaser */
/**
* Basic set up, show progress bar
*/
var app = app || {};

app.bootState = {
    preload: function() {
        game.load.image('progressBar', '/img/menu/progress.png');
    },

    create: function() {
        game.stage.backgroundColor = '#3498db';
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // trigger the loading screen
        game.state.start('load');
    }
};