
class Fase1 extends Phaser.Scene{
    preload ()
    {
        this.load.spritesheet('player_sp', 'assets/spritesheets/player.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('knaiffs_sp', 'assets/spritesheets/knaiffs.png', {frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('meilin', 'assets/spritesheets/meilin.png', {frameWidth: 64, frameHeight: 64})
        this.load.image('tiles', 'assets/maps/tilesheet.png');
        this.load.tilemapTiledJSON('themap', 'assets/maps/map2.json');
        this.load.audio('warning', 'assets/ost/warning.wav')
        this.load.audio('boss', 'assets/ost/boss_ost.mp3')
        this.load.audio('dash', 'assets/ost/dash.wav')
    }

// função para criação dos elementos
    create ()
    {   
        this.boss_bgm = this.sound.add('boss', {loop: true})//.setVolume(0.025)
        this.warning = this.sound.add('warning')//.setVolume(0.05)
        this.dash = this.sound.add('dash')//.setVolume(0.05)
        this.soundPlayed = false


         this.storm = false, this.impulse = false,  this.stunned = false, this.boss = false


        const messer_pos = {x: 500, y: 50}
        const player_pos = {x: 35, y: 50}

        // criação do mapa e ligação com a imagem (tilesheet)
        this.map = this.make.tilemap({ key: 'themap', tileWidth: 16, tileHeight: 16 });
        this.tileset = this.map.addTilesetImage('Minifantasy_ForgottenPlainsTiles', 'tiles');

        // criação das camadas
        this.groundLayer = this.map.createDynamicLayer('Chao', this.tileset, 0, 0);
        this.wallsLayer = this.map.createDynamicLayer('Parede', this.tileset, 0, 0);
        
        
        // criação do rei
        this.player = this.physics.add.sprite(messer_pos.x, messer_pos.y, 'player_sp', 0);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2);

        this.player.body.width = 30;

        // criação da Meilin 

        this.meilin = this.physics.add.sprite(122, 80, 'meilin', 0)
        this.meilin.setScale(0.5)
        this.meilin.setFrame(27)
        this.physics.add.collider(this.player, this.meilin, (player, meilin)=> {
            meilin.body.setImmovable(true)
            meilin.setVelocity(0)
        })

        // criação do boss messer

        this.messer = this.physics.add.sprite(messer_pos.x, messer_pos.y, 'knaiffs_sp', 0);
        this.messer.setScale(0.5);
        this.messer.body.setSize(50, 80);
        this.messer.setFrame(27)

        //bossfight attributes for messer
        this.messer.cast = false
        this.messer.lastSpell = 'Impulse'
        this.messer.isStunned = false
        this.messer.isAnimating = false


        // criação da colisão com camadas
        this.wallsLayer.setCollisionBetween(65, 750, true);
        this.physics.add.collider(this.player, this.wallsLayer);
        this.physics.add.collider(this.messer, this.wallsLayer)
        
        // ligação das teclas de movimento
        this.keyA = this.input.keyboard.addKey('A');
        this.keyD = this.input.keyboard.addKey('D');
        this.keyW = this.input.keyboard.addKey('W');
        this.keyS = this.input.keyboard.addKey('S');
        this.keyE = this.input.keyboard.addKey('E');
        this.keySPACE = this.input.keyboard.addKey('SPACE');

        //criacao das zonas
        this.zone_dlg = this.add.zone(98, 55).setSize(50, 50);
        this.physics.world.enable(this.zone_dlg);
        this.physics.add.overlap(this.player, this.zone_dlg);

        this.zone_boss = this.add.zone(messer_pos.x -20, messer_pos.y - 20).setSize(50, 50)
        this.physics.world.enable(this.zone_boss)
        this.physics.add.overlap(this.player, this.zone_boss)


        /*
        this.zone_ques = this.add.zone(200,80).setSize(100,70);
        this.physics.world.enable(this.zone_ques);
        this.physics.add.overlap(this.player, this.zone_ques);
*/
        // criação da mensagem "pressione E para interagir"
        var px = this.cameras.main.width*0.35;  // pos horizontal
        var py = 2*this.cameras.main.height/3;  // pos vertical
        console.log('pp', px, py)
        this.interact_txt = this.add.text(px, py, "Pressione E para interagir", {
            font: "15px Arial",
            fill: "#A0A0A0",
            align: "center", 
            stroke: '#000000',
            strokeThickness: 4,
        });


        this.interact_txt.setScrollFactor(0);  // deixa em posição relativa à camera (e não ao mapa)
        this.interact_txt.setVisible(false);   // deixa invisível

        // criação de lista de textos (diálogs) e do objeto dialogs
        var textos = ["Olá, jogador. Temo lhe dizer que o encontro em apuros.", "A saída é logo a frente, mas uma força - uma energia descomunal - a bloqueia.", "Tenho algo que pode lhe ser útil, mas primeiramente me responda:"];
        this.txtLst_0 = textos.map(text => `Meilin:\n${text}`)

        var facas = [""]

        this.quest_0 = ["Para produzir bolos, uma fábrica utiliza 5 bandejas de ovos por dia. Sabendo que em uma bandeja tem 30 ovos, quantos ovos serão necessários para produção de bolos no período de 15 dias?",
        1, "◯ 75", "◯ 150",  "◯ 450",  "◯ 2250"]
        
        
        this.dialogs = new dialogs(this);   

        // flag para responder uma única vez à tecla pressionada
        this.spacePressed = false;


        //animação de corrida do player
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player_sp', {frames: [24, 25, 26, 27]}),
            frameRate: 10,
            repeat: 0
            });

        this.anims.create({
            key: 'meilin_talk',
                frames: this.anims.generateFrameNumbers('meilin', {frames: [91, 92, 93, 94, 95, 91]}),
                frameRate: 10,
                repeat: 0
                });
        
        //animação de interação com Meilin
        this.anims.create({
            key: 'meilin_stand',
            frames: this.anims.generateFrameNumbers('meilin', {frames: [91]}),
            frameRate: 10,
            repeat: 1
        })

        this.anims.create({
            key: 'knives_cast',
            frames: this.anims.generateFrameNumbers('knaiffs_sp', {frames: [28, 29, 30]}),
            frameRate: 5,
            repeat: 0
        })

        this.anims.create({
            key: 'knives_storm',
            frames: this.anims.generateFrameNumbers('knaiffs_sp', {frames: [31, 5, 18, 44]}),
            frameRate: 10,
            repeat: 1
        })


        this.anims.create({
            key: 'knives_falls',
            frames: this.anims.generateFrameNumbers('knaiffs_sp', {frames: [261, 262, 263, 264]}),
            frameRate: 5,
            repeat: 0
        })

        this.anims.create({
            key: 'knives_stands',
            frames: this.anims.generateFrameNumbers('knaiffs_sp', {frames: [264, 263, 262, 261]}),
            frameRate: 5,
            repeat: 0
        })

        }




// update é chamada a cada novo quadro
    update (){
        const messerImpulse = () => {
                console.log("Messer impulse")
                /*
                if(!this.soundPlayed){
                    this.dash.play()
                    this.soundPlayed = true
                }
                */

                this.time.delayedCall(3000, ()=>{
                    this.messer.lastSpell = 'Impulse'
                    this.messer.cast = false
                }, [], this);  
        }

        const messerKnives = () => {
            console.log('Messer storm of knives!!!')
            
            if(!this.messer.isAnimating){
                this.messer.anims.play('knives_storm', true)
                this.messer.isAnimating = true
            }

            this.time.delayedCall(5000, ()=>{
                this.messer.lastSpell = 'Storm'
                this.messer.cast = false
                this.messer.isAnimating = false
            }, [], this);    
        }

        const messerCasts = () => {
            console.log("Messer is casting.")
            
            if(!this.soundPlayed){
                this.warning.play()
                this.soundPlayed = true
            }

            if(!this.messer.isAnimating){
                this.messer.anims.play('knives_cast', true)
                this.messer.isAnimating = true
            } 

            this.time.delayedCall(3000, ()=>{
                this.messer.cast = true
                this.soundPlayed = false
                this.messer.isAnimating = false
            }, [], this);  
        }

        if(this.boss){
            if(!this.messer.isStunned){
                if(this.messer.cast){
                    if(this.messer.lastSpell === 'Impulse'){
                        messerKnives()
                    }else if(this.messer.lastSpell === 'Storm'){
                        messerImpulse()
                    }
                }else{
                    messerCasts()
                }
            }else{
                console.log("Messer fell!!")
                setTimeout(()=>{
                    console.log("Messer is up again.")
                    this.messer.isStunned = false
                }, 3000)
            }
            /*if(this.storm){
                messerImpulse()
            }*/
        }


     // verifica e trata se jogador em zona ativa
        this.checkActiveZone();


        if(this.dialogs.isActive){
            this.meilin.anims.play('meilin_stand', true);
        }
        // verifica se precisa avançar no diálogo
        if (this.dialogs.isActive && !this.spacePressed && this.keySPACE.isDown){
            this.dialogs.nextDlg();
            this.spacePressed = true;   // seta flag para false para esperar a tecla espaço ser levantada
        }
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

    // trata zona ativa
    checkActiveZone(){
        // se jogador dentro de zona e o diálogo não está ativo
        if (this.player.body.embedded && !this.dialogs.isActive){
            this.interact_txt.setVisible(true);
            if (this.keyE.isDown){
                this.startDialogsOrQuestion();
            } 
        }
        // se diálogo ativo ou fora da zona, esconde a msg
        else{
            this.interact_txt.setVisible(false);
        }
    }

    startDialogsOrQuestion(){
        if (this.physics.overlap(this.player, this.zone_dlg)){
                this.dialogs.updateDlgBox(this.txtLst_0);
        }
        if(this.physics.overlap(this.player, this.zone_boss)){ 
            this.boss_bgm.play()
            this.zone_boss.destroy()
            this.boss = true
        }
    }
}
