
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('platform', 'assets/games/starstruck/platform.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('platformer_tiles', 'assets/games/starstruck/platformer_tiles.png');
    game.load.spritesheet('dude', 'assets/games/starstruck/dude.png', 32, 48);
    game.load.spritesheet('droid', 'assets/games/starstruck/droid.png', 32, 32);
    game.load.image('pomme', 'assets/games/starstruck/pomme.png');
    game.load.image('background', 'assets/games/starstruck/background2.png');

}

var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var pommes;
var score = 0;
var scoreText;
var timerText;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;
    game.camera.follow(player);

    map = game.add.tilemap('platform');

    map.addTilesetImage('platformer_tiles');
    

    map.setCollisionByExclusion([ 1 ]);

    layer = map.createLayer('Tile Layer 1');

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 700;

    game.time.events.add(Phaser.Timer.SECOND * 60, finTemps, this);

    player = game.add.sprite(32, 32, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    game.camera.follow(player);
    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
    scoreText.fixedToCamera = true;

    timerText = game.add.text(200, 16, 'Temps:', { fontSize: '32px', fill: '#fff' });
    timerText.fixedToCamera = true;

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    pommes = game.add.group();

    pommes.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var pomme = pommes.create(i * 200, 0, 'pomme');

        //  Let gravity do its thing
        pomme.body.gravity.y = 700;

        //  This just gives each star a slightly random bounce value
        pomme.body.bounce.y = 0.2 + Math.random() * 0.2;
    }

}

function finTemps() {

    alert("Fin du temps :'(");

}

function Win() {

    alert("Tu as gagné !");
    location.reload() ;

}

function update() {

    timerText.text = 'Temps:' + game.time.events.duration;

    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(pommes, layer);
    game.physics.arcade.overlap(player, pommes, collectPomme, null, this);
  
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -400;
        jumpTimer = game.time.now + 750;
    }

    if (score == 20) {
        Win();
    }

}

function render () {

}
function collectPomme (player, pomme) {

    // Removes the pommes from the screen
    pomme.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;


}