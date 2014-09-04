/* global game, Phaser */

/**
* load all the assets
*/
var app = app || {};

app.loadState = {
    preload: function() {
        var loadingLabel = game.add.text(
            game.world.centerX,
            game.world.centerY - 40,
            'loading...',
            {
                font: '30px Arial',
                fill: '#fff'
            }
        );
        loadingLabel.anchor.setTo(0.5, 0.5);

        // progress bar
        var progressBar = game.add.sprite(game.world.centerX, game.world.centerY, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);

        // load all assets
        game.load.spritesheet('mute', '/img/menu/muteButton.png', 28, 22);

        // game.load.spritesheet('player', '/img/player/player2.png', 20, 20);
        game.load.spritesheet('player', '/img/player/caveman.png', 16, 31);
        game.load.image('pixel', 'img/player/pixel.png');

        game.load.image('enemy', 'img/enemy/enemy.png');

        //tilemap
        game.load.image('tileset', 'img/world/tileset.png');
        game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    },

    create: function() {
        game.state.start('menu');
    }
};
