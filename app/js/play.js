/* global game, Phaser */

var app = app || {};

app.playState = {
    create: function() {
        this.GRAVITY = 2600;
        this.JUMP_SPEED = -700;
        this.canDoubleJump = true;
        this.canVariableJump = true;

        this.cursor = this.game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT
        ]);

        // player
        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        // this.player.body.gravity.y = 500;
        this.player.body.gravity.y = this.GRAVITY;
        // game.physics.arcade.gravity.y = this.GRAVITY;
        this.player.animations.add('right', [1, 2], 8, true);
        this.player.animations.add('left', [3, 4], 8, true);
        this.emitter = game.add.emitter(0, 0, 15);
        this.emitter.makeParticles('pixel');
        this.emitter.setYSpeed(-150, 150);
        this.emitter.setXSpeed(-150, 150);
        this.emitter.gravity = 0;

        // world
        this.createWorld();

        // enemies
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');
    },

    update: function() {
        game.physics.arcade.collide(this.player, this.walls);

        this.movePlayer();

        if(!this.player.inWorld) {
            this.playerDie();
        }

        game.physics.arcade.collide(this.enemies, this.walls);
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

        // add enemies
        // add enemies
        var start = 4000;
        var end = 1000;
        var score = 100;
        var delay;

        if(this.nextEnemy < game.time.now) {
            delay = Math.max(start - (start - end) * game.global.score/score, end);
            this.addEnemy();
            this.nextEnemy = game.time.now + delay;
        }
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
    },

    movePlayer: function() {
        var onGround = this.player.body.touching.down;
        if(onGround) {
            this.canDoubleJump = true;
        }

        if(this.cursor.left.isDown) {
            this.player.body.velocity.x = -200;
            this.player.animations.play('left');
        } else if(this.cursor.right.isDown) {
            this.player.body.velocity.x = 200;
            this.player.animations.play('right');
        } else {
            this.player.body.velocity.x = 0;
            this.player.animations.stop();
            this.player.frame = 0;
        }

        if(this.upInput(5)) {
            if(this.canDoubleJump) {
                this.canVariableJump = true;
            }

            if(this.canDoubleJump || onGround) {
                // jump when player on ground or can double jump
                this.player.body.velocity.y = this.JUMP_SPEED;

                if(!onGround) {
                    this.canDoubleJump = false;
                }
            }
        }

        // keep y velocity constant for up to 150ms
        if(this.canVariableJump && this.upInput(150)) {
            this.player.body.velocity.y = this.JUMP_SPEED;
        }

        if(!this.upInput()) {
            this.canVariableJump = false;
        }
    },

    // check whether up input has been held down
    upInput: function(duration) {
        var active = false;

        active = this.input.keyboard.justPressed(Phaser.Keyboard.UP, duration);

        return active;
    },

    playerDie: function() {
        if(!this.player.alive) {
            return;
        }

        this.player.kill();
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        // 15 particles which live for 600ms
        this.emitter.start(true, 600, null, 15);

        game.time.events.add(1000, this.startMenu, this);
    },

    startMenu: function() {
        game.state.start('menu');
    },

    addEnemy: function() {
        var enemy = this.enemies.getFirstDead();
        if(!enemy) {
            return;
        }

        enemy.anchor.setTo(0.5, 1);
        enemy.reset(game.world.centerX, 0);
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 100 * Phaser.Math.randomSign();

        // rebound when hitting a wall
        enemy.body.bounce.x = 1;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
    }
};
