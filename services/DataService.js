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
            instances: {},
            refs: {}
        };

        this.defineMapTile();
        this.defineFixture();
    }

    load() {
        const promise = new Promise((resolve, reject) => {
            Promise.all([
                this.loadMapTiles(),
                this.loadFixtures()

            ]).then((values) => {
                Object.assign(this.data, { mapTiles: values[0]})
                Object.assign(this.data, { fixtures: values[1]})
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
}


module.exports = DataService;