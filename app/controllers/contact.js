'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');
const Contact = mongoose.model('Contact');
module.exports.addContact = addContact;
module.exports.getContacts = getContacts;
module.exports.getContact = getContact;
module.exports.updateContact = updateContact;
module.exports.deleteContact = deleteContact;
module.exports.sendJson = sendJson;

function addContact(req, res, next) {
	let contactObj = _.pick(req.body , ['user', 'email', 'phone', 'company', 'city', 'name']);
	Contact.create(contactObj,(err, result) => {
		if(err) {
			return next(err);
		}
		req.resources.contact = result;
		req.resources.status = 201;
		next();
	});
}

function getContacts(req, res, next) {
	Contact.find({},(err, result) => {
		if(err) {
			return next(err);
		}
		req.resources.contact = result;
		req.resources.status = 200;
		next();
	})
}

function getContact(req, res, next) {
	let contactId = req.params.id;
	Contact.findById(contactId, (err, result) => {
		if (err) {
			return next(err);
		}
		req.resources.contact = result;
		req.resources.status = 200;
		next();
	})
}

function updateContact(req, res, next) {
	let contact = req.resources.contact;
	Object.assign(contact, req.body);

	contact.save((err, result) => {
		if(err) {
			return next(err);
		}
		req.resources.contact = result;
		req.resources.status = 200;
		next();
	})
}

function deleteContact(req, res, next) {
	let contact = req.resources.contact;
	Contact.remove({id : contact.id}, (err, result) => {
		if (err) {
			return next(err);
		}
		req.resources.status = 200;
		next();
	});
}

function sendJson(req, res) {
	res.status(req.resources.status).json(req.resources.contact);
}