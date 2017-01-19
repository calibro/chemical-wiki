var viz = d3.select('.viz'),
    width = viz.node().getBoundingClientRect().width,
    height = 500,
    drugsSmallMultiple;

// viz.style('height',height+'px');

d3.tsv(dataFile, parseTsv,function(data){

  /* buttons */
  var legendContainer = viz.append('div').attr('class','legend'),
      vizContainer = viz.append('div').style('position','relative');

  var btn = ['relative','absolute']
  var btnGroup = legendContainer.append('div')
    .attr('class', 'btn-group pull-right')
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
      vizContainer.datum(groups)
        .call(drugsSmallMultiple)
    })

    //var checkDiv = legendContainer.append('div')

    legendContainer.append('input')
      .attr('class', 'vandalism-check')
      .attr('type', 'checkbox')
      .property("checked", true)
      .on('change', function(){
        var checked = d3.select(this).property("checked");

        drugsSmallMultiple.vandalism(checked)
        vizContainer.datum(groups)
          .call(drugsSmallMultiple)
      })

    legendContainer.append('span').attr('class','vandalism-text').text(' with vandalism')
    legendContainer.append('div').style('clear','both')

  var mainColor = chemicalwiki.colors().main('medical')

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
                    .color(mainColor[0])


  vizContainer.datum(groups)
    .call(drugsSmallMultiple)

  d3.select('.loaderContainer')
    .transition()
    .on('end', function(d){
      d3.select(this).style('display', 'none')
    })
    .duration(1000)
    .style('opacity', '0')


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
