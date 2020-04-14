const express = require('express');
const router = express.Router();
const multer = require('multer');
const itemController = require('../../controllers/itemsController');
const fileController = require('../../controllers/fileController');

const ItemService = itemController.ItemService;
const upload = multer({
    storage: fileController.storage,
    fileFilter: fileController.imageFilter
});

// route path: /api/items

// this applies to all routes
router.use((req, res, next)=>{
    res.set({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    next();
});

// items - list
router.get('/', (req, res, next) => {
    ItemService.list()
        .then(items => {
            console.log('API: found images');
            res.status(200);
            res.send(JSON.stringify(items));
        }).catch(err => {
            console.log('nothing found');
            console.log(err);
        });
});

// items/:itemid GET - find
router.get('/:itemid', (req, res, next) => {
    ItemService.read(req.params.itemid)
        .then(item => {
            console.log(`found your item id: ${req.params.itemid}`);
            res.status(200);
            res.send(JSON.stringify(item));
        }).catch(err => {
            console.log(`could not find item id ${req.params.itemid}`);
            console.log(err);
        });
})
// items/:itemid POST - create
router.post('/', upload.single('attachmentUrl'), (req, res, next) => {
    // content-type is multipart/form-data
    // req.file is provided by multer
    let itemObj = {
        item: req.body.item,
        description: req.body.description,
        status: req.body.status,
        goalDate: req.body.goalDate,
        attachmentUrl: '/public/images/' + req.file.filename
    };

    ItemService.create(itemObj)
        .then(item => {
            console.log(`saved new item: ${item}`);
            res.status(201);
            res.send(JSON.stringify(item));
        }).catch(err => {
            console.log(`could not saved new item: ${item}`);
            console.log(err);
        });
});

// items/:itemid PUT - update
router.put('/:itemid', (req, res, next) => {
    const itemid = req.params.itemid;

    ItemService.update(itemid, req.body)
        .then(item => {
            console.log(`updated item: ${item}`);
            res.status(200);
            res.send(JSON.stringify(item));
        }).catch(err => {
            console.log(`could not update item: ${itemid}`);
            console.log(err);
        });
});

// items/:itemid DELETE - delete
router.delete('/:itemid', (req, res, next) => {
    const itemid = req.params.itemid;
    ItemService.delete(itemid)
        .then(itemObj => {
            console.log(`deleted this item: ${itemObj}`);
            res.status(200);
            res.send(JSON.stringify(itemObj));
        }).catch(err => {
            console.log(`could not delete item: ${itemObj}`);
            console.log(err);
        });
});

// items/ DELETE - delete many
router.delete('/', (req, res, next) => {
    ItemService.deleteMany(req.body.key, req.body.value)
        .then(itemObj => {
            console.log(`deleted this items successfully`);
            res.status(200);
            res.send(JSON.stringify(itemObj));
        }).catch(err => {
            console.log(`could not delete item: ${itemObj}`);
            console.log(err);
        });
});

module.exports = router;