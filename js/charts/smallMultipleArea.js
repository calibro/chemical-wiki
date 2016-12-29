(function(){

  var chemicalwiki = window.chemicalwiki || (window.chemicalwiki = {});

  chemicalwiki.smallMultipleArea = function(){

    var height = 600,
        width = 600,
        xValue,
        yValue,
        scale = 'relative',
        stackColors = ["#0EA789", "#0EA789"],
        color = 'black',
        brushDate,
        annotations = [],
        duration = 2000;


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
          .tickSize(-chartHeight)
          .tickSizeOuter(0);

        var gxAxis = chart.select('g.xAxis');
        if(!gxAxis.empty()){
          gxAxis
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(xAxis);
        }else {
          chart.append("g")
              .attr('class', 'xAxis')
              .attr("transform", "translate(0," + chartHeight + ")")
              .call(xAxis)

          chart.select('.xAxis').selectAll('line').attr('stroke','#ccc')
        }


        var flows = chart.selectAll("g.flow")
          .data(data, function(d){return d.key})
          // .attr("title", function(d) { return d.key; })
          // .attr("transform", function(d,i) { return "translate(0," + ((h+10)*i) + ")"})
          // .each(multiple);

        flows.exit().remove()

        flows.enter().append("g")
          .merge(flows)
          .attr("class","flow")
          .attr("title", function(d) { return d.key; })
          .attr("transform", function(d,i) { return "translate(0," + ((h+10)*i) + ")"})
          .each(multiple);

        if(annotations.length){

          var xSwoopyScale = d3.scaleLinear()
              .domain([0, chartWidth])
              .range([0, chartWidth]);

          var ySwoopyScale = d3.scaleLinear()
              .domain([chartHeight, 0])
              .range([chartHeight, 0]);

          var swoopy = d3.swoopyDrag()
            .x(function(d){return x(d.xVal)})
            .y(function(d){ return ySwoopyScale(d.yVal) })
            //.draggable(true)
            .annotations(annotations)

          var swoopySel = chart.select('g.annotations')

          if(swoopySel.empty()){

            chart.append('marker')
              .attr('id', 'arrow')
              .attr('viewBox', '-10 -10 20 20')
              .attr('markerWidth', 20)
              .attr('markerHeight', 20)
              .attr('orient', 'auto')
            .append('path')
              .attr('d', 'M-6.75,-6.75 L 0,0 L -6.75,6.75')

            swoopySel = chart.append('g')
              .attr('class','annotations')
              .call(swoopy)

            swoopySel.selectAll('path').attr('marker-end', 'url(#arrow)')

          }else {
            swoopySel.call(swoopy)
            swoopySel.selectAll('path').attr('marker-end', 'url(#arrow)')
          }

        }


          function multiple(single) {

            var g = d3.select(this);

            if (scale == 'absolute'){
              y.domain([0, d3.max(data, function(layer) { return d3.max(layer.values, function(d) { return d.y; }); })])
            }else{
              y.domain([0, d3.max(single.values, function(d) { return d.y; })]);
            }

            var gArea = g.select('.area');

            if(!gArea.empty()){
              gArea
                .transition()
                .attr("d", area(single.values));

            }else {
              g.append("path")
                .attr("class", "area")
                .attr("fill", color )
                .attr("stroke", 'black' )
                .attr("d", area(single.values));
            }

            var yAxis = d3.axisLeft(y)
              .ticks(4)
              .tickFormat(function(d){
                if(d > 0){
                  return d;
                }
              })
              .tickSizeOuter(0);

            var gyAxis = g.select('g.yAxis');

            if(!gyAxis.empty()){
              gyAxis
                .transition()
                .attr("transform", "translate(" + chartWidth +",0)")
                .call(yAxis);

              }else{
              g.append("g")
                .attr('class','yAxis')
                .attr("transform", "translate(" + chartWidth +",0)")
                .call(yAxis);

              g.select('.yAxis').select('path').attr('opacity',0)

            }

            if(g.select('text.name').empty()){
              g.append("text")
                .attr('class','name')
                .attr("y", 10)
                .text(function(d) { return d.key; });
            }

          }

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

  smallMultipleArea.color = function(x){
    if (!arguments.length) return color;
    color = x;
    return smallMultipleArea;
  }

  smallMultipleArea.scale = function(x){
    if (!arguments.length) return scale;
    scale = x;
    return smallMultipleArea;
  }

  smallMultipleArea.duration = function(x){
    if (!arguments.length) return duration;
    duration = x;
    return smallMultipleArea;
  }

  smallMultipleArea.annotations = function(x){
    if (!arguments.length) return annotations;
    annotations = x;
    return smallMultipleArea;
  }

  return smallMultipleArea;

  }

})();
