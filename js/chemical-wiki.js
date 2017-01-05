$( document ).ready(function() {

    $('.navbar-toggle.chemical-toggle').on('click', function(){
      $('#chemicalHeaderCollapse').toggleClass("open")
    })

    $('#affixContainer').affix({
      offset: {
        top: $('.homeHeader').outerHeight(true)
      }
    })

    $('#affixContainer').width($('#affixContainer').parent().width());

    var fixAffixWidth = function() {
      $('#affixContainer').width($('#affixContainer').parent().width());
    }
    fixAffixWidth();
    $(window).resize(fixAffixWidth);

});
