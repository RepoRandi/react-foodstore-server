const router = require('express').Router();

const wilayahController = require('./controller');

router.get('/wilayah/provinsi', wilayahController.getProvinsi);

router.get('/wilayah/kabupaten', wilayahController.getKabupaten);

router.get('/wilayah/kecamatan', wilayahController.getKecamatan);

router.get('/wilayah/kelurahan', wilayahController.getKelurahan);

module.exports = router;
