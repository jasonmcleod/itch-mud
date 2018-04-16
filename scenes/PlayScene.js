const C = require('../constants');
const blessed = require('blessed');
const playerService = require('../services/PlayerService');
const commandService = require('../services/CommandService');

class PlayScene {
    constructor(client) {
        this.client = client;
        this.scene = {};        
        this.build();
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
            height: 9,
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

        this.scene.canvas.key('left', () => { playerService.tryMove(this.client, -1, 0); });
        this.scene.canvas.key('up', () => { playerService.tryMove(this.client, 0, -1); });  
        this.scene.canvas.key('right', () => { playerService.tryMove(this.client, 1, 0); });
        this.scene.canvas.key('down', () => { playerService.tryMove(this.client, 0, 1); });

        this.client.screen.key('space', () => {
            this.scene.commandPrompt.show();
            this.scene.commandPrompt.focus();
        });     

        this.scene.commandPrompt.on('submit', (value) => {
            commandService.parse(this.client, value);
            this.scene.commandPrompt.hide();
            this.scene.commandPrompt.clearValue();
        });

        this.scene.canvas.focus();
    }    

    eraseNames() {
        this.names.forEach((n) => {
            n.destroy();
        });
        this.names.length = 0;
    }

    drawNames(cameraX, cameraY) {
        for(let p in dataService.players.instances) {
            let instance = dataService.players.instances[p]
            if(
                (instance.x > cameraX && instance.x < cameraX + C.CAMERA_WIDTH) &&
                (instance.y > cameraY && instance.y < cameraY + C.CAMERA_HEIGHT)
            ) {
                // todo: don't render local player
                this.names.push(
                    blessed.box({
                        parent: this.scene.canvas,
                        width: 12,
                        height:1,
                        transparent:true,
                        tags: true,
                        content: `{center}${instance.name} {/center}`,
                        top: instance.y - cameraY + 1,
                        left: (instance.x * 2) - (cameraX*2)
                    })
                );        
            }
        }
    }

}
module.exports = PlayScene;