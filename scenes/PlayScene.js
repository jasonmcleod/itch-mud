const C = require('../constants');
const blessed = require('blessed');
const playerService = require('../services/PlayerService');
const commandService = require('../services/CommandService');
const inventoryService = require('../services/InventoryService');

/*
    Name
    HP
    Level
    XP
    XP Pool
    Str
    Dex
    Int
    Con
    Stamina
    Armor
    Weight

    Helmet
    Weapon
    Chest
    Legs
    Shield
    Hands

    Day / Night cycle
    Inventory
    Map - nope
    Game viewport
    Combat log

*/

function progressBarContent(bar, text, max, value) {
    let meterContent = '';
    meterContent = `${text} ${value}/${max}`;
    let pad = ~~((bar.width / 2) - (meterContent.length / 2));
    bar.setContent(new Array(pad + 1).join(' ') + meterContent);
    bar.setProgress(value / max * 100);
}

class PlayScene {
    constructor(client) {
        this.client = client;
        this.scene = {};        
        this.build();
        this.createBindings();
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

        this.scene.playerHealth = blessed.progressbar({
            parent: this.scene.bg,
            width: 34,
            height: 1,
            left: 2,
            top: 1,
            keys:true,
            style: {
                bar:{
                    bg:'red'
                },
                bg:'grey',
                border:{
                    bg:'black',
                }
            },
            filled:50,
            content: '        Jeezle 25000 / 50000'
        });

        this.scene.targetHealth = blessed.progressbar({
            parent: this.scene.bg,
            width: 34,
            height: 1,
            left: 38,
            top: 1,
            keys:true,
            style: {
                bar:{
                    bg:'red'
                },
                bg:'grey',
                border:{
                    bg:'black',
                }
            },
            filled:50,
            content: '  Tgt: Skeleton 25000 / 50000'
        });

        // let hpMax = 1000;
        // let hp = hpMax;
        // setInterval(() => {
        //     hp-=10;
        //     progressBarContent(this.scene.playerHealth, 'Jeezle', hpMax, hp);
        //     progressBarContent(this.scene.targetHealth, 'Target: Skeleton', hpMax, hp);
        //     progressBarContent(this.scene.xpMeter, 'XP', hpMax, hp);
        //     this.client.screen.render();
        // }, 200);

        this.scene.canvas = blessed.box({
            parent: this.scene.bg,
            tags: true,
            width: 70,
            height: C.CAMERA_HEIGHT,
            left: 2,
            top: 3,
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
            height: 9,
            left:74,
            top: 1,
            border:'bg',
            style:{
                bg:'grey',
                border:{
                    bg: 'grey',
                    ch:' '
                }
            },
            // padding:1,
            content: [
                '{center}Jeezle - Level 12 Warrior{/center}',
                '',
                '---XP Meter---',
                '',
                '{black-bg} STR: 100 {/black-bg} {black-bg} DEX: 100 {/black-bg} {black-bg} INT: 100 {/black-bg} {black-bg} CON: 100 {/black-bg}',
                '',                
                '{black-bg} Armor:          100 {/black-bg} {black-bg} Attr Points:      2 {/black-bg}',
                // '',                
                
            ].join('\n')
        });

        this.scene.xpMeter = blessed.progressbar({
            parent: this.scene.bg,
            width: 43,
            height: 1,
            left: 75,
            top: 4,
            keys:true,
            style: {
                bar:{
                    bg:'cyan'
                },
                bg:'black',
                border:{
                    bg:'black',
                }
            },
            filled:50,
            content: ' XP: 25000 / 50000'
        });

        this.scene.combatLog = blessed.box({
            parent: this.scene.bg,
            tags: true,
            width: 45,
            height: 7,
            left:74,
            top: 11,
            border:'bg',
            style:{
                bg:'black',
                border:{
                    bg: 'grey',
                    ch:' '
                }
            },
            content: [
                ' {bold}{160-fg}Skeleton: 12{/160-fg}',
                ' {green-fg}Skeleton: 12{/green-fg}',
                ' {green-fg}Skeleton: 12{/green-fg}',
                ' {160-fg}Bat: 2{/160-fg}',
                ' {160-fg}Bat: 2{/160-fg}{/bold}'
            ].join('\n')
        });

        this.scene.inventory = blessed.list({
            inputOnFocus:true,
            parent: this.scene.bg,
            keys:true,
            interactive:true,
            top: 19,
            left:74,
            width: 45,
            height: 10,            
            border:'bg',
            selectedBg: 'green',
            selectedFg: 'blue',
            scrollable:true,
            scrollbar: {
                style:{
                    bg:7,
                    ch:' '
                },
                track: {
                    bg:8,
                    ch: ' '
                }
            },
            style:{
                bg:'black',
                border:{
                    bg: 'grey',
                    ch:' '
                }
            },
            tags: true,
            items: [
                ' {7-fg}/ {/7-fg}  Sword',
                ' {yellow-fg}$ {/yellow-fg}  Gold ( 100 )',
                ' {yellow-fg}ll{/yellow-fg}  Leather Pants',
                ' {11-fg}^ {/11-fg}  Gold Helmet',
                ' {yellow-fg}[]{/yellow-fg}  Wooden Shield',
                ' {yellow-fg}o {/yellow-fg}  Golden Ring',
                ' {7-fg}/ {/7-fg}  Sword',
                ' {yellow-fg}$ {/yellow-fg}  Gold ( 100 )',
                ' {yellow-fg}ll{/yellow-fg}  Leather Pants',
                ' {11-fg}^ {/11-fg}  Gold Helmet',
                ' {yellow-fg}[]{/yellow-fg}  Wooden Shield',
                ' {yellow-fg}o {/yellow-fg}  Golden Ring'
            ]
        });

        setTimeout(() =>{
            inventoryService.setItems(this.client);
        },0);        

        this.scene.console = blessed.box({
            parent: this.scene.bg,
            tags: true,
            height: 9,
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

        this.scene.canvas.focus();
        
    }    

    createBindings() {
        this.scene.canvas.key('left', () => { playerService.tryMove(this.client, -1, 0); });
        this.scene.canvas.key('up', () => { playerService.tryMove(this.client, 0, -1); });  
        this.scene.canvas.key('right', () => { playerService.tryMove(this.client, 1, 0); });
        this.scene.canvas.key('down', () => { playerService.tryMove(this.client, 0, 1); });

        this.scene.canvas.key('i', () => {
            inventoryService.focus(this.client);
        });

        this.scene.inventory.key('escape', () => {
            inventoryService.blur(this.client);
            this.scene.canvas.focus();
        });

        this.scene.inventory.on('select', () => {
            inventoryService.select(this.client, this.scene.inventory.selected);
        })

        this.client.screen.key('space', () => {
            this.scene.commandPrompt.show();
            this.scene.commandPrompt.focus();
        });     

        this.scene.commandPrompt.on('submit', (value) => {
            commandService.parse(this.client, value);
            this.scene.commandPrompt.hide();
            this.scene.commandPrompt.clearValue();
        });
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