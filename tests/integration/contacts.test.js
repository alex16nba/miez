'use strict';

/**
 * Important! Set the environment to test
 */
process.env.NODE_ENV = 'test';

const http = require('http');
const request = require('request');
const chai = require('chai');
const userFixture = require('../fixtures/user');
const contactFixture = require('../fixtures/contacts');
const should = chai.should();

describe('Authentication', function() {
  let mongoose;
  let app;
  let appServer;
  let config;
  let baseUrl;
  let User;
  let Contact;
  before(function(done) {
    app = require('../../server');
    config = app.get('config');
    baseUrl = config.baseUrl;
    appServer = http.createServer(app);
    appServer.on('listening', function() {
      mongoose = app.get('mongoose');
      User = mongoose.model('User');
      Contact = mongoose.model('Contact');
    	done();
    });

    appServer.listen(config.port);
  });

  after(function(done) {
    appServer.on('close', function() {
      setTimeout(function() { done(); }, 1000);
    });

    Contact.remove({}).exec(function(err) {
      if (err) throw err;
      User.remove({}).exec(function(err) {
      	if (err) throw err;

	      mongoose.connection.close(function() {
	        appServer.close();
	      });
      })
    });
  });

  describe('ADD CONTACT', function() {
  	before(function(done) {
			User.create(userFixture, (err, result) => {

				request({
					method: 'POST',
					url : baseUrl + '/auth/signin',
					form: {
						email: userFixture.email,
						password: 'user_password'
					},
					jar: true,
					json: true
				}, function(err, resultAuth) {
					done();
				});
			});
  	});
  	after(function(done) {
  		Contact.remove({}).exec(function(err) {
  			if (err) throw err;
  			User.remove({}).exec(function(err) {
					done();
				});
  			
  		})
  	});
		it('should create a new contact', function(done) {
			let contactObject;

	    request({
	      method: 'POST',
	      url: baseUrl + '/api/contacts',
	      form: contactFixture,
				jar: true,
	      json:true
	    }, function(err, res, body) {
	      if (err) throw err;
	      res.statusCode.should.equal(201);
	      body.email.should.equal(contactFixture.email);
	      body.city.should.equal(contactFixture.city);
	      body.phone.should.equal(contactFixture.phone);
	      body.phone.should.equal(contactFixture.phone);
	      body.company.should.equal(contactFixture.company);
	      body.user.should.equal(contactFixture.user);
	      
	      done();
	    });
		});
  })

  describe('EDIT CONTACT', function() {
  	before(function(done) {
      Contact.create(contactFixture, function(err, user) {
      	if (err) throw err;
      	done();
      })
  	});

  	after(function(done) {
  		Contact.remove({}).exec(function(err) {
  			if (err) throw err;
  			done();
  		})
  	})

		it('should update an existing contact', function(done) {
			let contactObject = Object.assign({}, contactFixture);
			contactObject.city = 'Cluj';

		  request({
		    method: 'PUT',
		    url: baseUrl + '/api/contacts/5731eb718dc033bc69d9660a',
		    form: contactObject,
		    json:true
		  }, function(err, res, body) {
		    if (err) throw err;
		    res.statusCode.should.equal(200);
		    body.email.should.equal(contactFixture.email);
		    body.city.should.equal('Cluj');
		    body.phone.should.equal(contactFixture.phone);
		    body.phone.should.equal(contactFixture.phone);
		    body.company.should.equal(contactFixture.company);
		    body.user.should.equal(contactFixture.user);
		    
		    done();
		  });
		});
  })

  describe('GET CONTACTS', function() {
  	before(function(done) {
      Contact.create(contactFixture, function(err, user) {
      	if (err) throw err;
      	done();
      })
  	});

  	after(function(done) {
  		Contact.remove({}).exec(function(err) {
  			if (err) throw err;
  			done();
  		});
  	})

		it('should get all contacts', function(done) {
		  request({
		    method: 'GET',
		    url: baseUrl + '/api/contacts',
		    json:true
		  }, function(err, res, body) {
		    if (err) throw err;
		    res.statusCode.should.equal(200);
		    let contact = body[0];
		    body.should.be.an('array');
		    contact.email.should.equal(contactFixture.email);
		    contact.city.should.equal(contactFixture.city);
		    contact.phone.should.equal(contactFixture.phone);
		    contact.company.should.equal(contactFixture.company);
		    contact.user.should.equal(contactFixture.user);
		    
		    done();
		  });
		});

		it('should get one contact', function(done) {
		  request({
		    method: 'GET',
		    url: baseUrl + '/api/contacts/5731eb718dc033bc69d9660a',
		    json:true
		  }, function(err, res, body) {
		    if (err) throw err;
		    res.statusCode.should.equal(200);
		    body.should.be.a('object');
		    body.email.should.equal(contactFixture.email);
		    body.city.should.equal(contactFixture.city);
		    body.phone.should.equal(contactFixture.phone);
		    body.company.should.equal(contactFixture.company);
		    body.user.should.equal(contactFixture.user);
		    
		    done();
		  });
		});
  })

describe('REMOVE CONTACT', function() {
	before(function(done) {
    Contact.create(contactFixture, function(err, user) {
    	if (err) throw err;
    	done();
    })
	})

	after(function(done) {
		Contact.remove({}).exec(function(err) {
			if (err) throw err;
			done();
		});
	});

	it('should delete the contact with a specific id', function(done) {
		request({
			method: 'DELETE',
			url: baseUrl + '/api/contacts/5731eb718dc033bc69d9660a',
	    json:true
		}, function(err, res, body) {
			res.statusCode.should.equal(200);
			body.should.be.a('object');
	    body.email.should.equal(contactFixture.email);
	    body.city.should.equal(contactFixture.city);
	    body.phone.should.equal(contactFixture.phone);
	    body.company.should.equal(contactFixture.company);
	    body.user.should.equal(contactFixture.user);
			done();
		})
	});
})
});
