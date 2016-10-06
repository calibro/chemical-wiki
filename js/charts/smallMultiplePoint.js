(function(){

  var chemicalwiki = window.chemicalwiki || (window.chemicalwiki = {});

  chemicalwiki.smallMultiplePoint = function(){

    var height = 600,
        width = 600,
        xValue,
        yValue,
        stackColors = ["#0EA789", "#0EA789"],
        brushDate,
        radius = 1,
        duration = 2000;


    function smallMultiplePoint(selection){
      selection.each(function(data){

        var chart,
            canvas;
        var margin = {top: 10, right: 10, bottom: 20, left: 10},
            chartWidth = width - margin.left - margin.right,
            chartHeight = height - margin.top - margin.bottom;

        if (selection.select('svg').empty()){
          selection.append('canvas')
            .attr('width', width)
            .attr('height', height)
            .style('position','absolute')
            .style('top',0)
            .style('left',0)

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

        var scale = false;

        var x = d3.scaleTime()
            .domain([xMin,xMax])
            .range([0, chartWidth]);

        var h = (chartHeight - (10*(data.length-1))) / data.length;

        var y = d3.scaleLinear()
            .range([h, 0]);

        var canvas = document.querySelector("canvas"),
            context = canvas.getContext("2d");

        context.translate(margin.left, margin.top);

        var format = d3.format(".2s");

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

          function multiple(single,i) {

            var g = d3.select(this);

            if (scale) y.domain([0, d3.max(data, function(layer) { return d3.max(layer.values, function(d) { return d.y; }); })])
            else y.domain([0, d3.max(single.values, function(d) { return d.y; })]);

            context.beginPath();

            single.values.forEach(function(d){
              context.moveTo(x(d.x) + radius, (y(d.y)+((h+10)*i)));
              context.arc(x(d.x), (y(d.y)+((h+10)*i)), radius, 0, 2 * Math.PI);
            })

            context.fill();
            var yAxis = d3.axisLeft(y)
              .ticks(4)
              .tickFormat(function(d){
                if(d > 0){
                  return format(d);
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

      }); //end selection
    } // end smallMultiplePoint


  smallMultiplePoint.height = function(x){
    if (!arguments.length) return height;
    height = x;
    return smallMultiplePoint;
  }

  smallMultiplePoint.width = function(x){
    if (!arguments.length) return width;
    width = x;
    return smallMultiplePoint;
  }

  smallMultiplePoint.xValue = function(x){
    if (!arguments.length) return xValue;
    xValue = x;
    return smallMultiplePoint;
  }

  smallMultiplePoint.yValue = function(x){
    if (!arguments.length) return yValue;
    yValue = x;
    return smallMultiplePoint;
  }

  smallMultiplePoint.stackColors = function(x){
    if (!arguments.length) return stackColors;
    stackColors = x;
    return smallMultiplePoint;
  }

  smallMultiplePoint.radius = function(x){
    if (!arguments.length) return radius;
    radius = x;
    return smallMultiplePoint;
  }

  smallMultiplePoint.duration = function(x){
    if (!arguments.length) return duration;
    duration = x;
    return smallMultiplePoint;
  }

  return smallMultiplePoint;

  }

})();
