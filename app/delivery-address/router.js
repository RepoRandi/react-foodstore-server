const router = require('express').Router();
const multer = require('multer');

const addressController = require('./controller');

router.post('/delivery-address', multer().none(), addressController.store);

router.put('/delivery-address/:id', multer().none(), addressController.update);

router.delete('/delivery-address/:id', addressController.destroy);

router.get('/delivery-address', addressController.index);

module.exports = router;
