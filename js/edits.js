var viz = d3.select('.viz'),
    width = viz.node().getBoundingClientRect().width,
    height = 500;

viz.style('height',height+'px');

d3.tsv(dataFile, parseTsv,function(data){

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

  var drugsSmallMultiple = chemicalwiki.smallMultipleArea()
                    .width(width)
                    .height(height)

  viz.datum(groups)
    .call(drugsSmallMultiple)

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
