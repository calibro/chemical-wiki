var viz = d3.select('.viz'),
    width = viz.node().getBoundingClientRect().width,
    height = 700;

viz.style('height',height+'px');

d3.tsv(dataFile, parseTsv,function(data){

  var colors = chemicalwiki.colors().qualitative('medical');
  var tocMDMA = chemicalwiki.scatterPlot()
                    .width(width)
                    .height(height)
                    .xValue('dateParsed')
                    .yValue('index')
                    .sizeValue('bytes')
                    .colorValue('cat')
                    .colors(colors)
                    .page('Ayahuasca')

  viz.datum(data)
    .call(tocMDMA)

});

function parseTsv(data){
  var date = data.date;
  var parseTime = d3.timeParse("%d/%m/%y %H:%M");

  return{
    revid: data.revid,
    title: data.title,
    dateParsed: parseTime(date),
    bytes: +data.bytes,
    index: +data.index,
    titlesNumber: +data.titlesNumber,
    toclevel: +data.toclevel,
    anchor: data.anchor,
    cat : data['main category']
  }
}
