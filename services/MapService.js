const fs = require('fs');
const C = require('../constants');
const map = require('../data/map.js');
const dataService = require('./DataService');

class MapService {
    constructor() {
        
    }

    getTile(index) {
        if(index <= 0) return 1;
        return dataService.data.mapTiles.instances[map[index]].ascii;
    }

    blocksWalk(index) {
        return dataService.data.mapTiles.instances[index].blocksWalk;
    }

    tileAt(x, y) {
        return map[y * C.MAP_HEIGHT + x];
    }

    extractBackground(input) {
        if(input.indexOf('-bg') > -1) return input.substr(input, input.indexOf('-bg')).replace('{','');
        return false;
    }

    getFixture(x, y, bg) {
        for(let i in dataService.data.fixtures.instances) {
            if(dataService.data.fixtures.instances[i].x === x & dataService.data.fixtures.instances[i].y === y) {
                return dataService.data.fixtures.refs[dataService.data.fixtures.instances[i].ref].ascii;
            }
        }
        return false;
    }

    getPlayer(x, y, bg) {
        for(let i in dataService.data.players.instances) {
            if(dataService.data.players.instances[i].x === x & dataService.data.players.instances[i].y === y) {
                // todo: dont render local player
                return `{${bg}-bg}${dataService.data.players.refs[dataService.data.players.instances[i].ref].ascii}{/${bg}-bg}`;
            }
        }
        return false;
    }

    getItem(x, y, bg) {
        for(let i in dataService.data.items.instances) {
            if(dataService.data.items.instances[i].x === x & dataService.data.items.instances[i].y === y) {
                return `{${bg}-bg}` + dataService.data.items.refs[dataService.data.items.instances[i].ref].ascii + `{/${bg}-bg}`
            }
        }
        return false;
    }

    getMarkup(client) {
        let cameraX = client.player.x - Math.floor((C.CAMERA_WIDTH) / 2);
        let cameraY = client.player.y - Math.floor((C.CAMERA_HEIGHT) / 2);

        let out = '';
        for (let y = 0; y < C.CAMERA_HEIGHT; y++) {
            for (let x = 0; x < C.CAMERA_WIDTH; x++) {
                let workingY = cameraY + y;
                let workingX = cameraX + x;

                let tile = this.getTile(workingY * C.MAP_HEIGHT + workingX);
                let bg = this.extractBackground(tile); 

                // find everything at this tile;
                let fixture = this.getFixture(workingX, workingY, bg);
                let item = this.getItem(workingX, workingY, bg);
                let player = this.getPlayer(workingX, workingY, bg);
                
                // what to render? - last one wins
                let obj = tile;
                if(fixture) obj = fixture;
                if(item) obj = item;
                if(player) obj = player;
                if(x === ~~(C.CAMERA_WIDTH / 2) && y === (C.CAMERA_HEIGHT / 2)) { obj = `{${bg}-bg}` + dataService.data.players.refs[1].ascii + `{/${bg}-bg}`; }

                out += obj;
            }
            out+='\n';
        }
        return out;
    }
}

module.exports = new MapService();