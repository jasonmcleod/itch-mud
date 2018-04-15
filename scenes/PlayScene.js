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

        this.scene.chatLog = blessed.box({
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

        this.scene.commandPrompt = blessed.textbox({
            inputOnFocus: true,
            parent: this.client.screen,
            border: 'line',
            height: 3,
            width: 117,
            top: 29,
            left: 3,
            label: ' {white-fg}Enter command{/white-fg} ',
            border:'bg',
            tags: true,
            keys: true,
            hidden: true
        });

        this.scene.canvas.key('left', () => { this.client.player.tryMove(this.client, -1, 0); });
        this.scene.canvas.key('up', () => { this.client.player.tryMove(this.client, 0, -1); });  
        this.scene.canvas.key('right', () => { this.client.player.tryMove(this.client, 1, 0); });
        this.scene.canvas.key('down', () => { this.client.player.tryMove(this.client, 0, 1); });

        this.client.screen.key('space', () => {
            this.scene.commandPrompt.show();
            this.scene.commandPrompt.focus();
        });     

        this.scene.commandPrompt.on('submit', (value) => {
            console.log('parse!');
            this.client.game.commandService.parse(this.client, value);
            this.scene.commandPrompt.hide();
            this.scene.commandPrompt.clearValue();
        });

        this.scene.canvas.focus();
    }    

}
module.exports = PlayScene;