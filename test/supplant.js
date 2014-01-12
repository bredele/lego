var supplant = require('maple/lib/supplant'),
    assert = require('assert');

describe("Supplant", function() {
  describe('string interpolation', function(){

    it('should support initialization', function(){
      var str = "This is an {test} interpolation";
      var result = supplant(str, {
        test : 'awesome'
      });
      assert.equal('This is an awesome interpolation', result);
    });

    it('should return an empty string if the interpolation doesn\'t exist', function(){
      var str = "This is an {something} interpolation";
      var result = supplant(str, {
        test : 'awesome'
      });
      assert.equal('This is an  interpolation', result);
    });

    it('should ignore whitespace', function(){
      var str = "This is an { test   } interpolation";
      var result = supplant(str, {
        test : 'awesome'
      });
      assert.equal('This is an awesome interpolation', result);
    });

    it('should support mutiple interpolation', function(){
      var str = "This is an {test} interpolation made by {name}";
      var result = supplant(str, {
        test : 'awesome',
        name: 'Bredele'
      });
      assert.equal('This is an awesome interpolation made by Bredele', result);
    });
  });


  describe('interpolation attrs utils', function(){

    it('should return an array of the store attributes', function(){

      var str = "{welcome} My name is {firstname} {lastname} and I love {country}";
      var props = supplant.attrs(str,{
        firstname : 'olivier',
        lastname:'wietrich',
        country: 'France',
        github:'bredele'
      });
      assert.equal('["welcome","firstname","lastname","country"]', JSON.stringify(props));
    });

    it('should return a uniq array', function(){
      var str = "My github is {github} {github} and I love {country}";
      var props = supplant.attrs(str, {
        firstname : 'olivier',
        lastname:'wietrich',
        country: 'France',
        github:'bredele'
      });
      assert.equal('["github","country"]', JSON.stringify(props));
    });

  });
});
