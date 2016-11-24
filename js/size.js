var viz = d3.select('.viz'),
    width = viz.node().getBoundingClientRect().width,
    height = 500,
    drugsSmallMultiple;

// viz.style('height',height+'px');

d3.tsv(dataFile, parseTsv,function(data){
  var groups = d3.nest()
    .key(function(d){ return d.page})
    .sortValues(function(a,b){return d3.ascending(a.dateParsed,b.dateParsed)})
    .entries(data)

  groups = groups.map(function(d){
    return{
      key: d.key,
      values: d.values.map(function(e){return {x:e.dateParsed,y:e.size, vandalism: e.vandalism}}).sort(function(a,b){ return d3.ascending(a.x,b.x) })
    }
  })

  var drugsSmallMultiple = chemicalwiki.smallMultiplePoint()
                    .width(width)
                    .height(height)


  viz.datum(groups)
    .call(drugsSmallMultiple)

  /* buttons */
  var btn = ['relative','absolute']
  var btnGroup = viz.append('div')
    .attr('class', 'btn-group')
    .attr('role', 'group')

  var btns = btnGroup.selectAll('.btn')
    .data(btn)
    .enter()
    .append('button')
    .attr('class', function(d,i){
      if(i){
        return 'btn btn-default'
      }else{
        return 'btn btn-default active'
      }
    })
    .attr('type', 'button')
    .text(function(d){
      return d
    })
    .on('click', function(d){
      btns.attr('class', function(e){
        if(e != d){
          return 'btn btn-default'
        }else{
          return 'btn btn-default active'
        }
      })

      drugsSmallMultiple.scale(d)
      viz.datum(groups)
        .call(drugsSmallMultiple)
    })

    var checkDiv = viz.append('div')

    checkDiv.append('input')
      .attr('type', 'checkbox')
      .property("checked", true)
      .on('change', function(){
        var checked = d3.select(this).property("checked");

        drugsSmallMultiple.vandalism(checked)
        viz.datum(groups)
          .call(drugsSmallMultiple)
      })

    checkDiv.append('span').text(' with vandalism')

});

function parseTsv(data){
  var date = data.date + ' ' + data.time;
  var parseTime = d3.timeParse("%d/%m/%Y %H:%M");
  var size = parseInt(data.size);
  var vandalism = data.vandalism==='true'?true:false;

  return{
    page: data.page,
    dateParsed: parseTime(date),
    date: data.date,
    time: data.time,
    size: size,
    vandalism: vandalism
  }
}
