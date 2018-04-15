const C = require('../constants');
const blessed = require('blessed');

class PlayScene {
    constructor(client) {
        this.client = client;
        this.scene = {};        
        this.build();

        return this.scene;
    }

    build() {
        this.scene.canvas = blessed.box({
            parent: this.client.screen,
            tags: true,
            width: 72,
            height: C.CAMERA_HEIGHT,
            left: 3,
            top: 2,
            keys:true,
            style: {
                bg:'grey',
                border:{
                    bg:'black',
                },
            }            
        });

        this.scene.inventory = blessed.box({
            parent: this.client.screen,
            tags: true,
            width: (C.INVENTORY_WIDTH * 3) + 1,
            height: 9,
            right:3,
            top:2,
            label:'Inventory',            
            border:'bg',
            style:{
                bg:'black',
                border:{
                    bg:'black',
                    ch: ' ',
                }
            }
        });

        this.scene.equipment = blessed.box({
            parent: this.client.screen,
            tags: true,
            width: 18,
            height: 9,
            right:30,
            top:2,
            label:'Equipment',
            border:'bg',
            style:{
                bg:'black',
                border:{
                    bg:'black',
                    ch: ' ',
                }
            }
        });

        this.scene.chatlog = blessed.box({
            parent: this.client.screen,
            tags: true,
            height: 6,
            width: 117,
            left:3,
            bottom:2,
            style:{
                bg:237,
                border:{
                    bg:'black',
                    ch: ' ',
                }
            },
            content: 'Welcome to Braiv Mud!'
        });

        this.scene.canvas.key('left', () => { Object.assign(this.client.player, this.client.game.mapService.tryMove(this.client, -1, 0)); });
        this.scene.canvas.key('up', () => { Object.assign(this.client.player, this.client.game.mapService.tryMove(this.client, 0, -1)); });        
        this.scene.canvas.key('right', () => { Object.assign(this.client.player, this.client.game.mapService.tryMove(this.client, 1, 0)); });
        this.scene.canvas.key('down', () => { Object.assign(this.client.player, this.client.game.mapService.tryMove(this.client, 0, 1)); });  

        this.client.screen.key('space', () => {
            this.scene.command.show();
            this.scene.command.focus();
            this.scene.command.input('Question?', '', (err, value) => {
                this.client.commandHandler.handle(value);
                this.scene.command.hide();
            });
        });     

        this.client.gametick = setInterval(() => {
            let cameraX = this.client.player.x - Math.floor((C.CAMERA_WIDTH) / 2);
            let cameraY = this.client.player.y - Math.floor((C.CAMERA_HEIGHT) / 2);
            const canvasMarkup = this.client.game.mapService.build(cameraX, cameraY)
            this.scene.canvas.setContent(canvasMarkup);
            this.client.screen.render();
        }, C.TICK_RATE);

        this.scene.canvas.focus();
    }    

}
module.exports = PlayScene;