var express = require('express');
var router = express.Router();

var hero_controller = require('../controllers/heroController');

// GET char home page.
router.get('/', hero_controller.index); 

// GET request for list of all chars.
router.get('/list', hero_controller.hero_list);

// GET request for creating char. NOTE This must come before route for id (i.e. display char).
router.get('/create', hero_controller.hero_create_get);

// POST request for creating char.
router.post('/create', hero_controller.hero_create_post);

// GET request to delete char.
router.get('/:id/delete', hero_controller.hero_delete_get);

// POST request to delete char.
router.post('/:id/delete', hero_controller.hero_delete_post);

// GET request for one char.
router.get('/:id', hero_controller.hero_detail);


module.exports = router;