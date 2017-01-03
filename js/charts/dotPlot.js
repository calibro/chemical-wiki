(function(){

  var chemicalwiki = window.chemicalwiki || (window.chemicalwiki = {});

  chemicalwiki.dotPlot = function(){

    var height = 600,
        width = 600,
        xValues,
        yValue,
        x,
        margin = {top: 0, right: 20, bottom: 0, left: 20},
        sizeValue,
        colorValue,
        colors = ["#0EA789", "#0EA789"],
        sortedBy,
        duration = 2000;


    function dotPlot(selection){
      selection.each(function(data){

        var chart,
            defs;

        data = data.sort(function(a,b){return d3.ascending(a[sortedBy],b[sortedBy])})

        var yDomain = data.map(function(d){return d[yValue]})
        var maxMargin = d3.max(yDomain, function(d){return d.length})*5;

        margin.left = maxMargin;

        var chartWidth = width - margin.left - margin.right,
            chartHeight = height - margin.top - margin.bottom;

        height = height + margin.top + margin.bottom;

        if (selection.select('svg').empty()){

          chart = selection.append('svg')
          .attr('width', width)
          .attr('height', height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

          defs = selection.select('svg').append('defs');
          var gradient = defs
              .append("linearGradient")
              .attr("id", "gradient1")

          gradient.append("stop")
              .attr("offset", "0%")
              .attr("stop-color", colors[1])
              .attr("stop-opacity", 1);

          gradient.append("stop")
              .attr("offset", "100%")
              .attr("stop-color", colors[0])
              .attr("stop-opacity", 1);

          var gradient2 = defs
              .append("linearGradient")
              .attr("id", "gradient2")

          gradient2.append("stop")
              .attr("offset", "0%")
              .attr("stop-color", colors[0])
              .attr("stop-opacity", 1);

          gradient2.append("stop")
              .attr("offset", "100%")
              .attr("stop-color", colors[1])
              .attr("stop-opacity", 1);
        }
        else
        {
          chart = selection.select('svg')
          .attr('width', width)
          .attr('height', height)
            .select("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          defs = selection.select('svg').select('defs');
        }

        var xMin = d3.min(data, function(d) {return d3.min([d[xValues[0]], d[xValues[1]]])}),
            xMax = d3.max(data, function(d) {return d3.max([d[xValues[0]], d[xValues[1]]])});

        var cats = d3.nest()
          .key(function(d){return d[colorValue]})
          .map(data)

        x = d3.scaleTime()
            .domain([xMin,xMax])
            .range([0, chartWidth]);

        var y = d3.scaleBand()
            .domain(yDomain)
            .range([0, chartHeight]);

        var color = d3.scaleOrdinal(colors).domain(cats.keys())

        var yAxis = d3.axisRight(y)
          .tickSizeOuter(0)
          .tickSize(0)

        var drugPijamaGroup = chart
          .selectAll(".gPijamaDrug")
          .data(data, function(d){return d[yValue]})

        drugPijamaGroup.enter().append('rect')
              .attr("class", 'gPijamaDrug')
              .attr("transform", function(d){
                return 'translate(0,' + y(d[yValue])+ ')';
              })
              .attr('x' ,-margin.left)
              .attr('height' ,y.bandwidth())
              .attr('width', chartWidth + margin.left)
              .attr('fill', function(d,i){
                return i % 2 == 0?'#f6f6f6':'white';
              })

        if(chart.select('.yAxis').empty()){

          chart.append("g")
              .attr("transform", "translate("+ -margin.left +",0)")
              .attr('class','yAxis')
              .call(yAxis)
              .select('path')
              .attr('opacity',0)

          chart.select(".yAxis").selectAll('text').attr('font-size', '13px')


          }else{
            chart.select(".yAxis")
                .transition()
                .call(yAxis);
          }


        var drugGroup = chart
          .selectAll(".gDrug")
          .data(data, function(d){return d[yValue]})

        drugGroup.enter().append('g')
            .attr("class", 'gDrug')
            .attr("transform", function(d){
              return 'translate(0,' + y(d[yValue])+ ')';
            }).each(function(d,i){

              var g = d3.select(this);

              g.append('circle')
                .attr("cx",x(d[xValues[0]]))
                .attr("cy",y.bandwidth()/2)
                .attr("r", 2)
                .attr("fill", colors[1])

              g.append('circle')
                .attr("cx",x(d[xValues[1]]))
                .attr("cy",y.bandwidth()/2)
                .attr("r", 2)
                .attr("fill", colors[0])

              g.append('rect')
                .attr("x",function(){
                  return x(d[xValues[0]])<x(d[xValues[1]])?x(d[xValues[0]]):x(d[xValues[1]])
                })
                .attr("y",y.bandwidth()/2-1)
                .attr("width", function(){
                  return x(d[xValues[0]])<x(d[xValues[1]])?x(d[xValues[1]])-x(d[xValues[0]]):x(d[xValues[0]])-x(d[xValues[1]])
                })
                .attr("height", 2)
                .attr("fill", function(){
                  return x(d[xValues[0]])<x(d[xValues[1]])?'url(#gradient1)':'url(#gradient2)';
                })

            })
            .attr('opacity',0)
            .transition(duration)
            .delay(function(d,i){
              return 20*i
            })
            .attr('opacity',1)

        drugGroup.transition()
          .attr("transform", function(d){
            return 'translate(0,' + y(d[yValue])+ ')';
          })

      }); //end selection
    } // end dotPlot


  dotPlot.height = function(x){
    if (!arguments.length) return height;
    height = x;
    return dotPlot;
  }

  dotPlot.width = function(x){
    if (!arguments.length) return width;
    width = x;
    return dotPlot;
  }

  dotPlot.xValues = function(x){
    if (!arguments.length) return xValues;
    xValues = x;
    return dotPlot;
  }

  dotPlot.yValue = function(x){
    if (!arguments.length) return yValue;
    yValue = x;
    return dotPlot;
  }

  dotPlot.colorValue = function(x){
    if (!arguments.length) return colorValue;
    colorValue = x;
    return dotPlot;
  }

  dotPlot.colors = function(x){
    if (!arguments.length) return colors;
    colors = x;
    return dotPlot;
  }

  dotPlot.sortedBy = function(x){
    if (!arguments.length) return sortedBy;
    sortedBy = x;
    return dotPlot;
  }

  dotPlot.duration = function(x){
    if (!arguments.length) return duration;
    duration = x;
    return dotPlot;
  }

  dotPlot.xAxis = function(){
    return x;
  }

  dotPlot.margin = function(x){
    if (!arguments.length) return margin;
    margin = x;
    return dotPlot;
  }

  return dotPlot;

  }

})();
