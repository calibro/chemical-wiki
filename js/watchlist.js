var viz = d3.select('.viz'),
    width = viz.node().getBoundingClientRect().width,
    height = 400;


var controllers = viz.append('div')
  .attr('class', 'row')

var colorsContainer =  controllers
  .append('div')
  .attr('class', 'col-md-6')

var buttonContainer = controllers
  .append('div')
  .attr('class', 'col-md-6')
  .append('div')
  .attr("class", "buttonContainer pull-right")
  .text('Sort substance by: ')

// var legendTop = viz.append('div')
//   .attr("class", "legendTop")
//   .append('svg')

var vizContainer = viz.append('div')
  .attr('class','vizContainer')
  .style("overflow-y", "scroll")
  .style("height", height+"px")

var legendBottom = viz.append('div')
  .attr("class", "legendBottom")
  .append('svg')


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

  var colors = chemicalwiki.colors().diverging('designer');
  colors = [colors[1], colors[colors.length-1]]
  /* visualization */
  var vizHeight = data.length * 30;
  drugsDotPlot = chemicalwiki.dotPlot()
                    .width(width)
                    .height(vizHeight)
                    .yValue('substance')
                    .xValues(['wikipedia_date', 'watchlist_date'])
                    .sortedBy('wikipedia_date')
                    .colorValue('category')
                    .colors(colors)

  vizContainer.datum(data)
    .call(drugsDotPlot)

  var x = drugsDotPlot.xAxis();

  var xAxisBottom = d3.axisBottom(x)
    .tickSizeOuter(0);

  var xAxisTop = d3.axisTop(x)
    .tickSizeOuter(0);

  // legendTop
  //     .attr("width", drugsDotPlot.width())
  //     .attr("height", 20)
  //     .append("g")
  //     .attr("transform", "translate(" +  drugsDotPlot.margin().left +",19)")
  //     .attr('class','xAxis')
  //     .call(xAxisTop);

  legendBottom
      .attr("width", drugsDotPlot.width())
      .attr("height", 20)
      .append("g")
      .attr("transform", "translate(" +  drugsDotPlot.margin().left +",0)")
      .attr('class','xAxis')
      .call(xAxisBottom);

  /* buttons */
  var btn = [
    {label:'wikipedia', value:'wikipedia_date'},
    {label:'watchlist', value:'watchlist_date'},
    {label:'alphabetic', value:'substance'}
  ]
  var btnGroup = buttonContainer.append('div')
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
      return d.label;
    })
    .on('click', function(d){
      btns.attr('class', function(e){
        if(e.value != d.value){
          return 'btn btn-default'
        }else{
          return 'btn btn-default active'
        }
      })

      drugsDotPlot.sortedBy(d.value).height(vizHeight)

      vizContainer.datum(data)
        .call(drugsDotPlot)
    })

});

function parseTsv(data){

  var parseTime = d3.timeParse("%d/%m/%Y");

  data.wikipedia_date = parseTime(data.wikipedia_date)
  data.watchlist_date = parseTime(data.watchlist_date)

  return data
}
