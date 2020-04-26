const express = require('express');
const router = express.Router();
const multer = require('multer');
const itemController = require('../../controllers/itemsController');
const fileController = require('../../controllers/fileController');
const fs = require('fs');
const ItemService = itemController.ItemService;
const upload = multer({
    storage: fileController.storage,
    fileFilter: fileController.imageFilter
});

// route path: /api/items

// this applies to all routes
router.use((req, res, next) => {
    res.set({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
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
        subject: req.body.subject,
        description: req.body.description,
        status: req.body.status,
        goalDate: req.body.goalDate,
        filename: req.file.filename,
        attachmentUrl: '/images/' + req.file.filename
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
    // delete img from storage
    ItemService.read(itemid)
        .then(item => {
            let attachmentUrl = item.attachmentUrl;
            console.log(attachmentUrl);
            fs.unlink('public' + item.attachmentUrl, err => {
                if (err) {
                    console.log(`error: could not delete ${item.filename} from storage or it does not exist`);
                    console.log(err);
                }
                console.log(`delete: ${item.filename} was deleted from storage`);
            });

            // then delete from database
            ItemService.delete(itemid)
                .then(itemObj => {
                    console.log(`delete: ${itemid} was deleted from db`);
                    res.status(200);
                    res.send(JSON.stringify(itemObj));
                }).catch(err => {
                    console.log(`could not delete item: ${itemObj}`);
                    console.log(err);
                });
        }).catch(err => {
            console.log(`delete: could not find item id ${req.params.itemid}`);
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