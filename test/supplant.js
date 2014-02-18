var supplant = require('../lib/supplant'),
    assert = require('assert');

describe("Supplant", function() {

  describe('variabe substitution', function(){

    it('supports simple substitution', function(){
      var str = "This is an {{test}} interpolation";
      var result = supplant(str, {
        test : 'awesome'
      });
      assert.equal('This is an awesome interpolation', result);
    });

    it("returns an empty string if variable not found", function(){
      var str = "This is an {{something}} interpolation";
      var result = supplant(str, {
        test : 'awesome'
      });
      assert.equal('This is an  interpolation', result);
    });

    it('trim whitespace', function(){
      var str = "This is an {{        test   }} interpolation";
      var result = supplant(str, {
        test : 'awesome'
      });
      assert.equal('This is an awesome interpolation', result);
    });

    it('supports mutiple interpolation', function(){
      var str = "This is an {{test}} interpolation made by {{name}}";
      var result = supplant(str, {
        test : 'awesome',
        name: 'Bredele'
      });
      assert.equal('This is an awesome interpolation made by Bredele', result);
    });
  });


  describe('substitution attributes', function(){

    it('returns an array', function(){

      var str = "{{welcome}} My name is {{firstname}} {{lastname}} and I love {{country}}";
      var props = supplant.attrs(str,{
        firstname : 'olivier',
        lastname:'wietrich',
        country: 'France',
        github:'bredele'
      });
      debugger
      assert.equal('["welcome","firstname","lastname","country"]', JSON.stringify(props));
    });

    it('returns a uniq array', function(){
      var str = "My github is {{github}} {{github}} and I love {{country}}";
      var props = supplant.attrs(str, {
        firstname : 'olivier',
        lastname:'wietrich',
        country: 'France',
        github:'bredele'
      });
      assert.equal('["github","country"]', JSON.stringify(props));
    });

  });

  describe("Advanced expressions", function() {
    it("should compile complex expressions", function() {
      var str = "{{a + b - c}}";
      var result = supplant(str, {
        a: 1,
        b: 3,
        c:2
      });
      assert.equal("2", result);
    });
    
  });
  
});
