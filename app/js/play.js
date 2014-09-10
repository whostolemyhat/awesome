/* global game, Phaser */

var app = app || {};


app.playState = {
    create: function() {
        this.GRAVITY = 2100;

        // jumping
        this.JUMP_SPEED = -500;
        this.maxJumpTime = 150;
        this.onGround = true;
        // currently jumping flag
        this.jumping = false;
        this.jumpTime = 0;
        this.jumpStart = 0;

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
        this.player.body.gravity.y = this.GRAVITY;
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
        this.nextEnemy = 1000;
    },

    update: function() {
        game.physics.arcade.collide(this.player, this.layer);
        this.onGround = this.player.body.onFloor();
        this.movePlayer();

        if(!this.player.inWorld) {
            this.playerDie();
        }

        game.physics.arcade.collide(this.enemies, this.layer);
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

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
        this.map = game.add.tilemap('map');
        this.map.addTilesetImage('tileset');

        this.layer = this.map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();

        this.map.setCollision(1);
    },

    movePlayer: function() {

        if(this.cursor.left.isDown) {
            this.player.body.velocity.x = -200;
            this.player.animations.play('left');
        } else if(this.cursor.right.isDown) {
            this.player.body.velocity.x = 200;
            this.player.animations.play('right');
        } else {
            this.player.body.velocity.x = 0;
            this.player.animations.stop();
            this.player.frame = 4;
        }

        // jump
        if(this.onGround && !this.jumping && this.cursor.up.isDown) {
            // jumping from ground
            this.jumpTime = 0;
            this.onGround = false;
            this.jumping = true;
            this.jumpStart = game.time.now;

            this.player.body.velocity.y = this.JUMP_SPEED;

        } else if(!this.onGround && this.cursor.up.isDown && this.jumpTime < this.maxJumpTime && this.jumping) {
            // carry on jumping
            this.jumpTime = game.time.elapsedSince(this.jumpStart);

            this.player.body.velocity.y = this.JUMP_SPEED;

        } else if(!this.onGround && (!this.cursor.up.isDown || this.jumpTime >= this.maxJumpTime)) {
            // falling
            this.jumping = false;

        }
        if(!this.cursor.up.isDown && this.onGround) {
            this.jumping = false;
            this.jumpTime = 0;
        }

        if(!this.onGround) {
            this.player.frame = 6;
        }


        // if(this.cursor.up.isDown && onGround) {
        //     this.player.body.velocity.y = this.JUMP_SPEED;
        // } else if(this.cursor.up.isDown && game.input.keyboard.justPressed(this.cursor.up, 200)) {
        //     this.player.body.velocity.y = this.JUMP_SPEED;
        // }
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
