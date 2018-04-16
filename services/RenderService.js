const C = require('../constants');
const blessed = require('blessed');
const mapService = require('../services/MapService');
const dataService = require('../services/DataService');

class RenderService {
    constructor() {
        this.names = [];
    }

    renderAll(client) {
        this.canvas(client);
        this.console(client);
        this.nameTags(client);
    }

    canvas(client) {
        const canvasMarkup = mapService.getMarkup(client);
        client.scene.canvas.setContent(canvasMarkup);
    }

    console(client) {
        client.scene.console.setContent(client.console.history.join('\n'));
    }

    nameTags(client) {
        this.names.forEach((n) => {
            n.destroy();
        });
        this.names.length = 0;

        let cameraX = client.player.x - Math.floor((C.CAMERA_WIDTH) / 2);
        let cameraY = client.player.y - Math.floor((C.CAMERA_HEIGHT) / 2);

        for(let p in dataService.data.players.instances) {
            let instance = dataService.data.players.instances[p]
            if(
                (instance.x > cameraX && instance.x < cameraX + C.CAMERA_WIDTH) &&
                (instance.y > cameraY && instance.y < cameraY + C.CAMERA_HEIGHT) &&
                (instance.id !== client.player.id)
            ) {
                this.names.push(
                    blessed.box({
                        parent: client.scene.canvas,
                        width: instance.name.length + 1,
                        height:1,
                        transparent:true,
                        tags: true,
                        content: `{center}${instance.name} {/center}`,
                        top: instance.y - cameraY - 1,
                        left: (instance.x * 2) - (cameraX*2) - ~~((instance.name.length+1)/2)
                    })
                );        
            }
        }
    }
}

module.exports = new RenderService();