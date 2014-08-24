/* global Phaser */

var app = app || {};

var game = new Phaser.Game(500, 340, Phaser.AUTO, 'game');

game.global = {
    score: 0
};

// add all the states here
// all states should be in the app namespace
game.state.add('boot', app.bootState);
game.state.add('load', app.loadState);
game.state.add('menu', app.menuState);
game.state.add('play', app.playState);


// start everything!
game.state.start('boot');