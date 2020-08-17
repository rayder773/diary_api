const express = require('express');
const router = express.Router();
const controller = require('../controllers');
// const ROUTES = require('../../routes')

// router.get(ROUTES.home, controller.getHome);
// router.get(ROUTES.secret, controller.getSecretList);
// router.get(ROUTES.secretRoute, controller.getSecret);
router.get('/check', controller.check);

// router.post(ROUTES.home, controller.sendOffer);
// router.post(ROUTES.secret, controller.addLinks);
// router.post(ROUTES.checkOffer, controller.checkOffer);

module.exports = router;
