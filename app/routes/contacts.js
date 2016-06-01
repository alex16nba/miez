'use strict';

const express = require('express');
const contactCtrl = require('../controllers/contact');
let router = express.Router();
let authMiddleware = require('../middlewares/authentication');
router.post('/contacts',authMiddleware.ensured, contactCtrl.addContact, contactCtrl.sendJson);
router.get('/contacts', contactCtrl.getContacts, contactCtrl.sendJson);
router.get('/contacts/:id', contactCtrl.getContact, contactCtrl.sendJson);
router.put('/contacts/:id', contactCtrl.getContact, contactCtrl.updateContact, contactCtrl.sendJson);
router.delete('/contacts/:id', contactCtrl.getContact, contactCtrl.deleteContact, contactCtrl.sendJson);

module.exports = router;
