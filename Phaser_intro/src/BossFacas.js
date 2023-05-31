class BossFacas extends Phaser.Scene {
    preload ()
    {
        this.load.spritesheet('player_sp', 'assets/spritesheets/player.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('knaiffs_sp', 'assets/spritesheets/knaiffs.png', {frameWidth: 64, frameHeight: 64 });
        this.load.image('tiles', 'assets/maps/tilesheet.png');
        this.load.tilemapTiledJSON('map2', 'assets/maps/map2.json');
    }

    create ()
    {

        // criação do mapa e ligação com a imagem (tilesheet)
        this.map = this.make.tilemap({ key: 'map2', tileWidth: 16, tileHeight: 16 });
        this.tileset = this.map.addTilesetImage('Minifantasy_ForgottenPlainsTiles', 'tiles');

        // criação das camadas
        this.groundLayer = this.map.createDynamicLayer('chao', this.tileset, 0, 0);
        this.wallsLayer = this.map.createDynamicLayer('parede', this.tileset, 0, 0);
        
        
        // criação do rei
        this.player = this.physics.add.sprite(65, 750, 'player_sp', 0);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2);

        this.player.body.width = 30;

        this.naiffsNPC = this.physics.add.sprite(65, 200, 'knaiffs_sp', 0);
        //reduzindo a escala do npc(era muito grande)
        this.naiffsNPC.setScale(0.5);
        
        this.naiffsNPC.body.setSize(20, 50);

        this.naiffsNPC.setFrame(27);

        //this.wallsLayer.setCollisionBetween(65, 750, true);
        //this.physics.add.collider(this.player, this.wallsLayer);
        this.physics.add.collider(this.player, this.naiffsNPC, function(player, naiffsNPC){
            naiffsNPC.setVelocity(0);
            naiffsNPC.body.setImmovable(true);
            
        });

        this.keyA = this.input.keyboard.addKey('A');
        this.keyD = this.input.keyboard.addKey('D');
        this.keyW = this.input.keyboard.addKey('W');
        this.keyS = this.input.keyboard.addKey('S');
        this.keyE = this.input.keyboard.addKey('E');
        this.keySPACE = this.input.keyboard.addKey('SPACE');

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player_sp', {frames: [24, 25, 26, 27]}),
            frameRate: 10,
            repeat: 0
            });
        this.anims.create({
            key: 'talk_knaiffs',
                frames: this.anims.generateFrameNumbers('knaiffs_sp', {frames: [91, 92, 93, 94, 95, 91]}),
                frameRate: 10,
                repeat: 0
                });

    }

    update (){

           // verifica se precisa avançar no diálogo

           // se tecla solta, limpa a flag
           if (!this.keySPACE.isDown){
               this.spacePressed = false;
           }
           {
   
            
               if (this.keyD?.isDown) {
                   this.player.setVelocityX(210);
                   this.player.anims.play('run', true);
           }
           else if (this.keyA?.isDown) {
               this.player.setVelocityX(-210);
               this.player.anims.play('run', true);
           }
           else{
               this.player.setVelocityX(0); 
           }
   
           // velocidade vertical
           if (this.keyW.isDown) {
               this.player.setVelocityY(-210);
               this.player.anims.play('run', true);
           }
           else if (this.keyS.isDown) {
               this.player.setVelocityY(210);
               this.player.anims.play('run', true);
           }
           else{
               this.player.setVelocityY(0); 
           }
           }
           
       }
}