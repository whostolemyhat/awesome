/* global game */

var app = app || {};

app.playState = {
    create: function() {
        this.cursor = this.game.input.keyboard.createCursorKeys();

        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500;

        this.createWorld();
    },

    update: function() {
        game.physics.arcade.collide(this.player, this.walls);
    },

    createWorld: function() {
        this.walls = game.add.group();
        this.walls.enableBody = true;

        game.add.sprite(0, 0, 'wallV', 0, this.walls);
        game.add.sprite(480, 0, 'wallV', 0, this.walls);

        game.add.sprite(0, 0, 'wallH', 0, this.walls); // top left
        game.add.sprite(300, 0, 'wallH', 0, this.walls); // top right
        game.add.sprite(0, 320, 'wallH', 0, this.walls); // bottom left
        game.add.sprite(300, 320, 'wallH', 0, this.walls); // bottom right

        game.add.sprite(-100, 160, 'wallH', 0, this.walls); // bottom right
        game.add.sprite(400, 160, 'wallH', 0, this.walls); // bottom right

        game.add.sprite(100, 80, 'wallH', 0, this.walls).scale.setTo(1.5, 1);
        game.add.sprite(100, 240, 'wallH', 0, this.walls).scale.setTo(1.5, 1);

        this.walls.setAll('body.immovable', true);
    }
};
