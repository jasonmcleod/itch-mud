const dataService = require('./DataService');
class InventoryService {
    constructor() {

    }

    fetch(client) {
        let items = [];
        for(let i in dataService.data.items.instances) {
            let instance = dataService.data.items.instances[i];
            let ref = dataService.data.items.refs[instance.ref];
            // todo: only render whats in this users inventory
            items.push({trackBy: instance, markup: ` ${ref.ascii} ${ref.name}` + (instance.value > 1 ? ` ( ${instance.value} )` :'')});
        }

        client.cache.inventory = items;
        // return items;
    }

    setItems(client) {
        client.scene.inventory.setItems(client.cache.inventory.map(i => i.markup));        
    }

    focus(client) {
        client.scene.inventory.style.selected.bg = 'cyan';
        client.scene.inventory.style.selected.fg = 'black';
        client.scene.inventory.focus();
    }

    select(client, index) {
        const ref = dataService.data.items.refs[client.cache.inventory[index].trackBy.ref];
        client.console.add(`You selected ${ref.name}`);
    }

    blur(client) {
        client.scene.inventory.style.selected.bg = 'black';
        client.scene.inventory.style.selected.fg = 'white';
    }
}

module.exports = new InventoryService();