(function(){

  var chemicalwiki = window.chemicalwiki || (window.chemicalwiki = {});

  chemicalwiki.smallMultipleArea = function(){

    var height = 600,
        width = 600,
        xValue,
        yValue,
        stackColors = ["#0EA789", "#0EA789"],
        brushDate,
        duration = 2000;
        // dispatch = d3.dispatch("clicked");


    function smallMultipleArea(selection){
      selection.each(function(data){

        var chart;
        var margin = {top: 10, right: 10, bottom: 20, left: 10},
            chartWidth = width - margin.left - margin.right,
            chartHeight = height - margin.top - margin.bottom;

        if (selection.select('svg').empty()){
          chart = selection.append('svg')
          .attr('width', width)
          .attr('height', height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }
        else
        {
          chart = selection.select('svg')
          .attr('width', width)
          .attr('height', height)
            .select("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }

        var xMin = d3.min(data, function(layer) { return d3.min(layer.values, function(d) { return d.x; }); }),
            xMax = d3.max(data, function(layer) { return d3.max(layer.values, function(d) { return d.x; }); });

        var intervals = d3.timeMonth.range(xMin, xMax);

        intervals.forEach(function(d){
          data.forEach(function(f){
            var elm = f.values.filter(function(e){
              return e.x.getTime() === d.getTime();
            });

            if(!elm.length){
              f.values.push({
                x: d,
                y: 0
              })
              f.values.sort(function(a,b){return d3.ascending(a.x,b.x)})
            }
          })
        })
        var scale = false;

        var x = d3.scaleTime()
            .domain([xMin,xMax])
            .range([0, chartWidth]);

        var h = (chartHeight - (10*(data.length-1))) / data.length;

        var y = d3.scaleLinear()
            .range([h, 0]);

        var line = d3.line()
            .defined(function(d) { return d; })
            .x(function(d) { return x(d.x); })
            .y(function(d) { return y(d.y); })

        var area = d3.area()
            .defined(line.defined())
            .x(line.x())
            .y1(line.y())
            .y0(y(0))
            .curve(d3.curveStep)

        var xAxis = d3.axisBottom(x)
          .tickArguments([d3.timeYear.every(1)])
          .tickSizeOuter(0);

        chart.append("g")
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(xAxis);

        chart.selectAll("g.flow")
          .data(data)
          .enter().append("g")
          .attr("class","flow")
          .attr("title", function(d) { return d.key; })
          .attr("transform", function(d,i) { return "translate(0," + ((h+10)*i) + ")"})
          .each(multiple);

          function multiple(single) {

            var g = d3.select(this);

            if (scale) y.domain([0, d3.max(data, function(layer) { return d3.max(layer.values, function(d) { return d.y; }); })])
            else y.domain([0, d3.max(single.values, function(d) { return d.y; })]);

            g.append("path")
              .attr("class", "area")
              //.style("fill", function(d){ return colors()(d[0].group); })
              .attr("d", area(single.values));

            var yAxis = d3.axisLeft(y)
              .ticks(4)
              .tickFormat(function(d){
                if(d > 0){
                  return d;
                }
              })
              .tickSizeOuter(0);

            g.append("g")
              .attr("transform", "translate(" + chartWidth +",0)")
              .call(yAxis);

            g.append("text")
              .attr("y", 10)
              .text(function(d) { return d.key; });

          }



        // svg.append("g")
        //     .attr("class", "x axis")
        //     .attr("transform", "translate(0," + height + ")")
        //     .call(d3.axisBottom(x));
        //
        // svg.append("g")
        //     .attr("class", "y axis")
        //     .call(d3.axisLeft(y));


        // var legendScale = d3.scale.ordinal().rangeBands([0, chartWidth], 0, 0.1).domain(colorDomain)
        //
        // var legends = chart.selectAll(".timeline-legend").data(colorDomain)
        //
        // var legend = legends.enter()
        //   .append("g")
        //   .attr("class", "timeline-legend")
        //   .attr("transform", function(d){ return "translate(" + legendScale(d) + "," + (height - 20) + ")"});
        //
        // legend
        //   .append("rect")
        //   .attr("fill", function(d){return color(d)})
        //   .attr("width", 15)
        //   .attr("height", 15)
        //   .attr("x", 0)
        //   .attr("y", -15)
        //   .attr("opacity", function(d,i){return i > 0 ? 0.5 : 0.9})
        //
        // legend
        //   .append("text")
        //   .text(function(d){return d.toUpperCase()})
        //   .attr("x", 20)
        //   .attr("dy", "-0.1em")
        //
        // if(chart.select("g.x.axis").empty() || chart.select("g.y.axis").empty()){
        //   var lineData = [ { "x": 0,   "y": 0},  { "x": chartWidth,  "y": 0}];
        //   var lineFunction = d3.svg.line()
        //                    .x(function(d) { return d.x; })
        //                    .y(function(d) { return d.y; })
        //                    .interpolate("linear");
        //
        //   chart.append("g")
        //     .attr("class", "x axis")
        //     .attr("transform", "translate(0," + chartHeight + ")")
        //       .append("path")
        //       .attr("d", lineFunction(lineData))
        //
        //
        //   chart.append("g")
        //       .attr("class", "y axis")
        //       .attr("transform", "translate(" + chartWidth + ",0)")
        //       .call(yAxis);
        // }else{
        //   chart.select("g.y.axis").call(yAxis)
        // }

      }); //end selection
    } // end smallMultipleArea


  smallMultipleArea.height = function(x){
    if (!arguments.length) return height;
    height = x;
    return smallMultipleArea;
  }

  smallMultipleArea.width = function(x){
    if (!arguments.length) return width;
    width = x;
    return smallMultipleArea;
  }

  smallMultipleArea.xValue = function(x){
    if (!arguments.length) return xValue;
    xValue = x;
    return smallMultipleArea;
  }

  smallMultipleArea.yValue = function(x){
    if (!arguments.length) return yValue;
    yValue = x;
    return smallMultipleArea;
  }

  smallMultipleArea.stackColors = function(x){
    if (!arguments.length) return stackColors;
    stackColors = x;
    return smallMultipleArea;
  }


  smallMultipleArea.startDate = function(x){
    if (!arguments.length) return startDate;
    startDate = x;
    return smallMultipleArea;
  }


  smallMultipleArea.duration = function(x){
    if (!arguments.length) return duration;
    duration = x;
    return smallMultipleArea;
  }


  // d3.rebind(smallMultipleArea, dispatch, 'on');

  return smallMultipleArea;

  }

})();
