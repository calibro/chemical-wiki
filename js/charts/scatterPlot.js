(function(){

  var chemicalwiki = window.chemicalwiki || (window.chemicalwiki = {});

  chemicalwiki.scatterPlot = function(){

    var height = 600,
        width = 600,
        xValue,
        yValue,
        sizeValue,
        colorValue,
        colors = ["#0EA789", "#0EA789"],
        brushDate,
        radius = 1,
        page,
        duration = 2000;


    function scatterPlot(selection){
      selection.each(function(data){

        var chart;

        var margin = {top: 30, right: 20, bottom: 130, left: 50},
            margin2 = {top: 610, right: 20, bottom: 20, left: 50},
            chartWidth = width - margin.left - margin.right,
            chartHeight = height - margin.top - margin.bottom,
            chartHeightContex = height - margin2.top - margin2.bottom ;

        if (selection.select('svg').empty()){

          chart = selection.append('svg')
          .attr('width', width)
          .attr('height', height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        }
        else
        {
          chart = selection.select('svg')
          .attr('width', width)
          .attr('height', height)
            .select("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }

        var xMin = d3.min(data, function(d) {return d[xValue]}),
            xMax = d3.max(data, function(d) {return d[xValue]}),
            // yMin = d3.min(data, function(d) {return d[yValue]}),
            // yMax = d3.max(data, function(d) {return d[yValue]}),
            yMax = d3.max(data, function(d) {return d.titlesNumber}),
            sizeMin = d3.min(data, function(d) {return d[sizeValue]}),
            sizeMax = d3.max(data, function(d) {return d[sizeValue]});

        var cats = d3.nest()
          .key(function(d){return d[colorValue]})
          .map(data)

        var x = d3.scaleTime()
            .domain([xMin,xMax])
            .range([0, chartWidth]);

        var y = d3.scaleLinear()
            .domain([yMax+1,1])
            .range([chartHeight, 0]);

        var xContext = d3.scaleTime()
            .domain([xMin,xMax])
            .range([0, chartWidth]);

        var yContext = d3.scaleLinear()
            .domain([yMax,1])
            .range([chartHeightContex, 0]);

        var sizeScale = d3.scaleSqrt()
            .domain([sizeMin,sizeMax])
            .range([2,10]);

        var brush = d3.brushX()
          .extent([[0, -1], [chartWidth, chartHeightContex]])
          .on("brush end", brushed);

        var color = d3.scaleOrdinal(colors).domain(cats.keys())

        var format = d3.format(".2s");

        var legends = chart.append("g")
            .attr('class','legend')
            .attr("transform", "translate(0,-20)")

        var legend = legends.selectAll('g')
          .data(cats.keys())
          .enter()
          .append('g')
          .attr("transform",function(d,i){
            return "translate(" + i*100+",0)"
          })

        legend.append('circle')
          .attr('fill',function(d){return color(d)})
          .attr('r', 5)
          .attr('cx', 0)
          .attr('cy', 0)

        legend.append('text')
          .text(function(d){return d})
          .attr('alignment-baseline', 'middle')
          .attr('x', 10)

        var xAxis = d3.axisBottom(x)
          //.tickArguments([d3.timeYear.every(1)])
          .tickSizeOuter(0);

        var xAxisContext = d3.axisBottom(xContext)
            //.tickSize(-chartHeightContex)
            .tickSizeOuter(0);

        chart.append("g")
            .attr('class','xAxis')
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(xAxis);

        var yAxis = d3.axisLeft(y)
          //.tickArguments([d3.timeYear.every(1)])
          //.tickSizeOuter(0);

        var yAxisContext = d3.axisLeft(yContext)
            .ticks(4)
            .tickSizeOuter(0);

        chart.append("g")
            .attr('class','yAxis')
            .attr("transform", "translate(" + -10 + ",0)")
            .call(yAxis)
            .select('path')
            .attr('opacity', 0)

        chart.select('.yAxis').selectAll('text')
          .attr('fill','#9B9B9B')

        chart.select('.yAxis').selectAll('line')
          .attr('stroke','#9B9B9B')

        chart.append("g")
            .attr('class','yAxisLegend')
            .attr("transform", "translate(-40," + chartHeight/2 +") rotate(-90)")
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('fill','#9B9B9B')
            .attr('font-size','12px')
            .text('TOC POSITION')


        var dataGrid = d3.nest()
          .key(function(d){ return d.dateParsed})
          .rollup(function(leaf){return d3.range(leaf[0].titlesNumber)})
          .entries(data)

        var gGrid = chart.selectAll("g.grid")
          .data(dataGrid)
          .enter().append("g")
          .attr("class","grid")
          .attr("transform", function(d){return "translate(" + x(new Date(d.key)) + ",0)"})

        var gGridRect = gGrid.selectAll("rect")
          .data(function(d){return d.value})
          .enter()
          .append('rect')
          .attr("y", function(d){return y(d+1)})
          .attr("x", -2)
          .attr("width", 4)
          .attr("height", 1)
          .attr("fill", "black")


         var circles = chart.selectAll(".cont")
          .data(data)
          .enter().append("circle")
          .attr("class","cont")
          .attr("cx", function(d){return x(d[xValue])})
          .attr("cy", function(d){return y(d[yValue])})
          .attr("r", function (d){ return sizeScale(d[sizeValue]) })
          .attr("fill", function(d){ return color(d[colorValue])})
          .attr('opacity', 0.5)
          .sort(function(a, b) { return d3.descending(a[sizeValue], b[sizeValue]) })
          .each(function(d){
            $(this).tooltip({
                'container': 'body',
                'title': d.title
            });
          })
          .on('mouseover', function(d){
            circles
              .raise()
              .filter(function(c){
                return c.title == d.title
              })
              .transition()
              .attr("stroke", "black")
              .attr('opacity',1)


          })
          .on('mouseout', function(d){

            circles
              .sort(function(a, b) { return d3.descending(a[sizeValue], b[sizeValue]) })
              .transition()
              .attr("stroke", "none")
              .attr('opacity',0.5)

          })
          .on('click', function(d){
            window.open('https://en.wikipedia.org/w/index.php?title=' + page + '&oldid='+ d.revid + '#' + d.anchor,'_blank')
          })


        var context = selection.select('svg').append("g")
          .attr("class", "context")
          .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        var lineContext = d3.line()
            .defined(function(d) { return d; })
            .x(function(d) { return xContext(new Date(d.key)); })
            .y(function(d) { return yContext(d.value.length); })

        var areaContext = d3.area()
            .defined(lineContext.defined())
            .x(lineContext.x())
            .y1(lineContext.y())
            .y0(yContext(0))
            .curve(d3.curveStep)


        context.append("g")
              .attr('class','xAxisContext')
              .attr("transform", "translate(0," + chartHeightContex + ")")
              .call(xAxisContext);

        context.append("g")
              .attr('class','yAxisContext')
              .attr("transform", "translate(-10,0)")
              .call(yAxisContext)
              .select('path')
              .attr('opacity', 0)

        context.append("g")
            .attr('class','yAxisLegend')
            .attr("transform", "translate(-40," + chartHeightContex/2 +") rotate(-90)")
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('fill','#9B9B9B')
            .attr('font-size','12px')
            .text('TOC LENGTH')

        context.select('.yAxisContext').selectAll('text')
          .attr('fill','#9B9B9B')

        context.select('.yAxisContext').selectAll('line')
          .attr('stroke','#9B9B9B')


        context.append("path")
          .attr("class", "area")
          .attr("fill", "#525A62")
          .attr("d", areaContext(dataGrid));

        context.append("g")
          .attr("class", "brush")
          .call(brush)

        var handle = context.select('.brush').selectAll(".handle--custom")
            .data([{type: "w"}, {type: "e"}])
            .enter().append("circle")
              .attr("class", "handle--custom")
              .attr("fill", "black")
              .attr("cursor", "ew-resize")
              .attr('cx', 0)
              .attr('cy', 0)
              .attr('r',4)

        context.select('.brush')
          .call(brush.move, x.range());


        function brushed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            //var s = d3.event.selection || xContext.range();
            var s = d3.event.selection;
            if(!s){
              context.select('.brush')
                  .call(brush.move, xContext.range())
              s = xContext.range();
            }
            x.domain(s.map(xContext.invert, xContext));
            chart.select(".xAxis").call(xAxis);

            circles
              .attr("cx", function(d){return x(d[xValue])})

            gGrid
              .attr("transform", function(d){return "translate(" + x(new Date(d.key)) + ",0)"})

            handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + s[i] + "," + chartHeightContex / 2 + ")"; });

          }

      }); //end selection
    } // end scatterPlot


  scatterPlot.height = function(x){
    if (!arguments.length) return height;
    height = x;
    return scatterPlot;
  }

  scatterPlot.width = function(x){
    if (!arguments.length) return width;
    width = x;
    return scatterPlot;
  }

  scatterPlot.xValue = function(x){
    if (!arguments.length) return xValue;
    xValue = x;
    return scatterPlot;
  }

  scatterPlot.yValue = function(x){
    if (!arguments.length) return yValue;
    yValue = x;
    return scatterPlot;
  }

  scatterPlot.sizeValue = function(x){
    if (!arguments.length) return sizeValue;
    sizeValue = x;
    return scatterPlot;
  }

  scatterPlot.colorValue = function(x){
    if (!arguments.length) return colorValue;
    colorValue = x;
    return scatterPlot;
  }

  scatterPlot.colors = function(x){
    if (!arguments.length) return colors;
    colors = x;
    return scatterPlot;
  }

  scatterPlot.radius = function(x){
    if (!arguments.length) return radius;
    radius = x;
    return scatterPlot;
  }

  scatterPlot.duration = function(x){
    if (!arguments.length) return duration;
    duration = x;
    return scatterPlot;
  }

  scatterPlot.page = function(x){
    if (!arguments.length) return page;
    page = x;
    return scatterPlot;
  }

  return scatterPlot;

  }

})();
