var expect = require ('chai').expect;
var supertest = require ('supertest');
host = supertest('http://localhost:8084');

describe('Login Test',function(){
  it('should return login page',function(done){
    host.get('/login').end(function(err,res){
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
  it('should login new user',function(done){
    host.post('/login').send({
          userEmail = req.body.remail,
          userName = req.body.rname,
          userPassword = req.body.rpwd,
          userPhone = req.body.rph
      })
      .end(function(err,res){
      //  expect(res.redirect).to.be.equal(register);
        expect(res.statusCode).to.equal(302);
        done();
      });
  });
});
