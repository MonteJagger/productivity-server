const Item = require('../models/itemsModel');

// routing code
class ItemService {
    // items - list
    static list() {
        return Item.find({})
            .then(items => items);
    }

    // items/:itemid GET - find
    static read(itemid) {
        return Item.findById(itemid)
            .then(item => item);
    }

    // items/ POST - create
    static create(itemObj) {
        const item = new Item(itemObj);
        return item.save();
    }

    // items/:itemid PUT - update
    static update(id, data) {
        return Item.findById(id)
            .then(item => {
                item.set(data);
                return item.save();
            });
    }

    // items/:itemid DELETE - delete
    static delete(id) {
        return Item.deleteOne({ _id: id })
            .then(obj => obj);
    }

    // items/:itemid DELETE - delete
    static deleteMany(property, value) {
        return Item.deleteMany({ [property]: value })
            .then(obj => obj).catch(err => console.log(err));
    }
}

module.exports.ItemService = ItemService;