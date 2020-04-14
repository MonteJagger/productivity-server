var express = require('express');
var router = express.Router();
const ItemService = require('../controllers/itemsController').ItemService;

// this applies to all routes
router.use((req, res, next)=>{
    res.set({
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
    });
    next();
});


/* GET home page. */
router.get('/', (req, res, next) => {
    ItemService.list()
        .then(items => {
            console.log(items);
            res.render('index', { items: items });
        });
});

router.get('/delete/:id', (req, res, next) => {
    console.log(req.params.id);
    ItemService.delete(req.params.id);
    res.redirect('/');
})
router.post('/edit/:id', (req, res, next) => {
    console.log('req.params.id');
    console.log(req.params.id);

    ItemService.update(req.params.id, req.body)
        .then(() =>
            res.redirect('/')
        );

})

module.exports = router;