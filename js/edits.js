var viz = d3.select('.viz'),
    width = viz.node().getBoundingClientRect().width,
    height = 500,
    drugsSmallMultiple;

    /* annotations */

var annotations = [
   {
    "xVal": new Date(2014,11,1),
    "yVal": 100,
    "path": "M -64,81 A 78.228 78.228 0 0 0 -1,56",
    "text": "A lot of edits",
    "textOffset": [
      -150,
      87
    ]
   }
  ]


d3.tsv(dataFile, parseTsv,function(data){

  var mainColor = chemicalwiki.colors().main('medical')

  /* buttons */
  var btn = ['relative','absolute']
  var btnGroup = viz.append('div')
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
      viz.datum(groups)
        .call(drugsSmallMultiple)
    })

  /* visualization */

  var groups = d3.nest()
    .key(function(d){ return d.page})
    .key(function(d){ return d3.timeMonth(d.dateParsed)})
    .rollup(function(leaf){
      return {
        y: leaf.length,
        x: d3.timeMonth(leaf[0].dateParsed),
      }
    })
    .entries(data)

  groups = groups.map(function(d){
    return{
      key: d.key,
      values: d.values.map(function(e){return e.value}).sort(function(a,b){ return d3.ascending(a.x,b.x) })
    }
  })

  drugsSmallMultiple = chemicalwiki.smallMultipleArea()
                    .width(width)
                    .height(height)
                    .color(mainColor[0])
                    //.annotations(annotations)

  viz.datum(groups)
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

  return{
    page: data.page,
    dateParsed: parseTime(date),
    date: data.date,
    time: data.time
  }
}
