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
        this.scene.bg = blessed.box({
            parent: this.client.screen,
            width: '100%',
            height: '100%',
            top:0,
            left:0,
            style: {
                bg: 'black'
            }
        });

        this.scene.canvas = blessed.box({
            parent: this.scene.bg,
            tags: true,
            width: 72,
            height: C.CAMERA_HEIGHT,
            left: 2,
            top: 1,
            keys:true,
            style: {
                bg:'grey',
                border:{
                    bg:'black',
                },
            }            
        });

        this.scene.character = blessed.box({
            parent: this.scene.bg,
            tags: true,
            width: 45,
            height: 12,
            left:76,
            top: 1,
            border:'bg',
            style:{
                bg:'black',
                border:{
                    bg: 'grey',
                    ch:' '
                }
            },
            padding:1,
            content: [
                '{center}Jeezle - Level 12 Warrior{/center}',
                '',
                'HP {red-bg}          {/red-bg}             002500 / 005000',
                'XP {green-bg}     {/green-bg}                    1250 /   5000',
                '',
                'Strength:     100      Dexterity:     100',
                'Intelligence:  100     Constitution:  100',
                'Armor:  100{/white-fg}'
            ].join('\n')
        });

        this.scene.target = blessed.box({
            parent: this.scene.bg,
            tags: true,
            width: 45,
            height: 13,
            left:76,
            top: 12,
            border:'bg',
            style:{
                bg:'black',
                border:{
                    bg: 'grey',
                    ch:' '
                }
            },
            padding:1,
            content: [
                '{center}Target: Skeleton - Level 10 Undead{/center}',
                '',
                'HP {red-bg}          {/red-bg}             002500 / 005000',
                '',
                '{red-fg}Skeleton: 12{/red-fg}',
                '{green-fg}Skeleton: 12{/green-fg}',
                '{green-fg}Skeleton: 12{/green-fg}',
                '{red-fg}Bat: 2{/red-fg}',
                '{red-fg}Bat: 2{/red-fg}'
            ].join('\n')
        });

        // this.scene.inventory = blessed.box({
        //     parent: this.scene.bg,
        //     tags: true,
        //     width: 18,
        //     height: 11,
        //     right:3,
        //     top: 15,
        //     label:'Inventory',            
        //     border:'bg',
        //     style:{
        //         bg:'black',
        //         border:{
        //             bg:'black',
        //             ch: ' ',
        //         }
        //     }
        // });

        this.scene.console = blessed.box({
            parent: this.scene.bg,
            tags: true,
            height: 11,
            width: 117,
            left:2,
            padding: 1,
            bottom:1,
            style:{
                bg:237,
                border:{
                    bg:'black',
                    ch: ' ',
                }
            }
        });

        this.scene.commandPrompt = blessed.textbox({
            parent: this.scene.bg,
            inputOnFocus: true,
            border: 'line',
            height: 3,
            width: 115,
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