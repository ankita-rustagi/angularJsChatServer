var expect = require ('chai').expect;
var supertest = require ('supertest');
host = supertest('http://localhost:8084');

describe('Page Test',function(){
  it('should return login page',function(done){
    host.get('/login').end(function(err,res){
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
  it('should return 200 error',function(done){
    host.get('/signUp').end(function(err,res){
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
  // Return 401 because no request header is passed.
  it('should return 401 error',function(done){
    host.get('/chat').end(function(err,res){
      expect(res.statusCode).to.equal(401);
      done();
    });
  });

  it('should return 200 error',function(done){
    host.get('/users').end(function(err,res){
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
  //Return 404 because /user does not exist
  it('should return 404 error',function(done){
    host.get('/user').end(function(err,res){
      expect(res.statusCode).to.equal(404);
      done();
    });
  });
});
