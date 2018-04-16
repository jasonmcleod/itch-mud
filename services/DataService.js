const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');
const tableToObject = require('../lib/tableToObject');

const dbPath = path.resolve(__dirname, '../data/database.db');
const sequelize = new Sequelize(null, null, null, { dialect: 'sqlite', storage: dbPath});

class DataService {

    constructor() {
        this.models = {};
        this.data = {
            mapTiles: { instances: {} },
            fixtures: { instances: {}, refs: {} },
            players:  { instances: {}, refs: {} },
            items:    { instances: {}, refs: {} }
        };

        this.defineMapTile();
        this.defineFixture();
        this.definePlayer();
        this.defineAccount();
        this.definePlayer();
        this.defineItem();
    }

    load() {
        const promise = new Promise((resolve, reject) => {
            Promise.all([
                this.loadMapTiles(),
                this.loadFixtures(),
                this.loadPlayers(),
                this.loadItems()
            ]).then((values) => {
                Object.assign(this.data.mapTiles, values[0])
                Object.assign(this.data.fixtures, values[1])
                Object.assign(this.data.players, values[2])
                Object.assign(this.data.items, values[3])
                resolve();                
            });
        });
        return promise;
    }

    defineMapTile() {
        this.models.mapTile = sequelize.define('mapTile', {
            id: {type: Sequelize.INTEGER, primaryKey: true},
            blocksView: Sequelize.INTEGER,
            blocksWalk: Sequelize.INTEGER,
            ascii: Sequelize.STRING,
            name: Sequelize.STRING
        });
    }

    defineFixture() {
        this.models.fixture = sequelize.define('fixture', {
            id: {type: Sequelize.INTEGER, primaryKey: true},
            ref: Sequelize.INTEGER,
            map: Sequelize.STRING,
            x: Sequelize.INTEGER,
            y: Sequelize.INTEGER
        });

        this.models.fixtureRef = sequelize.define('fixtureRef', {
            id: {type: Sequelize.INTEGER, primaryKey: true},
            ascii: Sequelize.STRING
        });
    }

    definePlayer() {
        this.models.player = sequelize.define('player', {
            id: {type: Sequelize.INTEGER, primaryKey: true},
            account: Sequelize.INTEGER,
            ref: Sequelize.STRING,
            name: Sequelize.INTEGER,
            map: Sequelize.STRING,
            x: Sequelize.INTEGER,
            y: Sequelize.INTEGER,
            hp: Sequelize.INTEGER,
            hpMax: Sequelize.INTEGER        
        });

        this.models.playerRef = sequelize.define('playerRef', {
            id: {type: Sequelize.INTEGER, primaryKey: true},
            ascii: Sequelize.STRING
        });
    }

    defineAccount() {
        this.models.account = sequelize.define('account', {
            id: {type: Sequelize.INTEGER, primaryKey: true},
            email: Sequelize.STRING,
            name: Sequelize.STRING,
            password: Sequelize.STRING
        });
    }

    defineItem() {
        this.models.item = sequelize.define('item', {
            id: {type: Sequelize.INTEGER, primaryKey: true},
            ref: Sequelize.INTEGER,
            slot: Sequelize.INTEGER,
            container: Sequelize.INTEGER,
            map: Sequelize.STRING,
            x: Sequelize.INTEGER,
            y: Sequelize.INTEGER
        });

        this.models.itemRef = sequelize.define('itemRef', {
            id: {type: Sequelize.INTEGER, primaryKey: true},
            ascii: Sequelize.STRING
        });

    }

    loadMapTiles() {
        const promise = new Promise((resolve, reject) => {
            tableToObject(this.models.mapTile, (data) => {
                resolve({instances: data});
            });
        });

        return promise;
    }

    loadFixtures() {
        const promise = new Promise((resolve, reject) => {
            tableToObject(this.models.fixture, (instances) => {
                tableToObject(this.models.fixtureRef, (refs) => {
                    resolve({instances, refs});
                });
            });
        });

        return promise;
    }

    loadPlayers() {
        const promise = new Promise((resolve, reject) => {
            tableToObject(this.models.playerRef, (data) => {
                resolve({refs: data});
            });
        });

        return promise;
    }

    loadItems() {
        const promise = new Promise((resolve, reject) => {
            tableToObject(this.models.item, (instances) => {
                tableToObject(this.models.itemRef, (refs) => {
                    resolve({instances, refs});
                });
            });
        });
            
        return promise;
    }
}


module.exports = new DataService();