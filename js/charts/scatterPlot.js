(function(){

  var chemicalwiki = window.chemicalwiki || (window.chemicalwiki = {});

  chemicalwiki.scatterPlot = function(){

    var height = 600,
        width = 600,
        xValue,
        yValue,
        sizeValue,
        colorValue,
        stackColors = ["#0EA789", "#0EA789"],
        brushDate,
        radius = 1,
        page,
        duration = 2000;


    function scatterPlot(selection){
      selection.each(function(data){

        var chart;

        var margin = {top: 20, right: 20, bottom: 130, left: 20},
            margin2 = {top: 610, right: 20, bottom: 20, left: 20},
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
            .domain([yMax,1])
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

        var color = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.keys(cats))

        var format = d3.format(".2s");

        var xAxis = d3.axisBottom(x)
          //.tickArguments([d3.timeYear.every(1)])
          .tickSizeOuter(0);

        var xAxisContext = d3.axisBottom(xContext)
            //.tickArguments([d3.timeYear.every(1)])
            .tickSizeOuter(0);

        chart.append("g")
            .attr('class','xAxis')
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(xAxis);

        var dataGrid = d3.nest()
          .key(function(d){ return d.dateParsed})
          .rollup(function(leaf){return d3.range(leaf[0].titlesNumber)})
          .entries(data)

        var line = d3.line()
            .defined(function(d) { return d; })
            .x(function(d) { return x(new Date(d.key)); })
            .y(function(d) { return y(d.value.length); })

        var area = d3.area()
            .defined(line.defined())
            .x(line.x())
            .y1(line.y())
            .y0(y(0))
            .curve(d3.curveStep)

        var bkg = chart.append("path")
          .attr("class", "area")
          .attr("fill", "none")
          .attr("stroke", "#ccc")
          .attr("d", area(dataGrid));


         var circles = chart.selectAll(".cont")
          .data(data)
          .enter().append("circle")
          .attr("class","cont")
          .attr("cx", function(d){return x(d[xValue])})
          .attr("cy", function(d){return y(d[yValue])})
          .attr("r", function (d){ return sizeScale(d[sizeValue]) })
          .attr("fill", function(d){ return color(d[colorValue])})
          .sort(function(a, b) { return d3.descending(a[sizeValue], b[sizeValue]) })
          .each(function(d){
            $(this).tooltip({
                'container': 'body',
                'title': d.title
            });
          })
          .on('mouseover', function(d){
            var node = d3.select(this);
            node.attr("stroke", "black").raise()
          })
          .on('mouseout', function(d){
            var node = d3.select(this);
            node.attr("stroke", "none")
            circles.sort(function(a, b) { return d3.descending(a[sizeValue], b[sizeValue]) })
          })
          .on('click', function(d){
            window.open('https://en.wikipedia.org/w/index.php?title=' + page + '&oldid='+ d.revid + '#' + d.anchor,'_blank')
          })


        // var gGrid = chart.selectAll("g.grid")
        //   .data(dataGrid)
        //   .enter().append("g")
        //   .attr("class","grid")
        //   .attr("transform", function(d){return "translate(" + x(new Date(d.key)) + ",0)"})
        //
        // gGrid.selectAll("circle")
        //   .data(function(d){return d.value})
        //   .enter()
        //   .append('circle')
        //   .attr("cy", function(d){return y(d+1)})
        //   .attr("r", 1)

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

        context.append("path")
          .attr("class", "area")
          //.style("fill", function(d){ return colors()(d[0].group); })
          .attr("d", areaContext(dataGrid));

        context.append("g")
          .attr("class", "brush")
          .call(brush)
          .call(brush.move, x.range());


        function brushed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            var s = d3.event.selection || xContext.range();
            x.domain(s.map(xContext.invert, xContext));
            chart.select(".xAxis").call(xAxis);

            circles
              .attr("cx", function(d){return x(d[xValue])})

            bkg
              .attr("d", area(dataGrid));
            //
            // gGrid
            //   .attr("transform", function(d){return "translate(" + x(new Date(d.key)) + ",0)"})

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

  scatterPlot.stackColors = function(x){
    if (!arguments.length) return stackColors;
    stackColors = x;
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
