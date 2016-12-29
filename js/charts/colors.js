(function(){

  var chemicalwiki = window.chemicalwiki || (window.chemicalwiki = {});

  chemicalwiki.colors = function(){

  var main = {
    medical:['#810f7c'],
    designer:['#174a80']
  }

  var sequential = {
    medical:['#edf8fb','#b3cde3','#8c96c6','#8856a7','#810f7c'],
    designer:['#f1eef6','#d0d1e6','#a6bddb','#2f8cbe','#174a80']
  }

  var diverging = {
    medical:['#7f3b08','#b35806','#e08213','#f9b863','#fce0b6','#d8daeb','#b2abd2','#8073ac','#542788','#2d004b'],
    designer:['#84304b','#b84250','#d57e6b','#fcdfce','#f6f6f6','#cce2f5','#89c6ed','#38a0dc','#2c80c6','#174a80']
  }

  var qualitative = {
    medical:['#7f3b08','#b2abd2','#e08213','#542788'],
    designer:['#b84250','#246d9d','#898989','#ababab','#9fcaed','#595959','#f67d2e','#f9ba80','#174a80','#cfcfcf']
  }

  function colors(){}

  colors.main = function(x){
    if (!arguments.length){
      return []
    }else{
      return main[x];
    }
  }

  colors.sequential = function(x){
    if (!arguments.length){
      return []
    }else{
      return sequential[x];
    }
  }

  colors.diverging = function(x){
    if (!arguments.length){
      return []
    }else{
      return diverging[x];
    }
  }

  colors.qualitative = function(x){
    if (!arguments.length){
      return []
    }else{
      return qualitative[x];
    }
  }

  return colors;
}

})();
