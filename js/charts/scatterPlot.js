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
        duration = 2000;


    function scatterPlot(selection){
      selection.each(function(data){

        var chart,
            canvas;
        var margin = {top: 20, right: 10, bottom: 20, left: 10},
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

        var sizeScale = d3.scaleSqrt()
            .domain([sizeMin,sizeMax])
            .range([2,10]);

        var color = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.keys(cats))

        var format = d3.format(".2s");

        var xAxis = d3.axisBottom(x)
          //.tickArguments([d3.timeYear.every(1)])
          .tickSizeOuter(0);

        chart.append("g")
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(xAxis);

        var dataGrid = d3.nest()
          .key(function(d){ return d.dateParsed})
          .rollup(function(leaf){return d3.range(leaf[0].titlesNumber)})
          .entries(data)


        chart.selectAll(".cont")
          .data(data)
          .enter().append("circle")
          .attr("class","cont")
          .attr("cx", function(d){return x(d[xValue])})
          .attr("cy", function(d){return y(d[yValue])})
          .attr("r", function (d){ return sizeScale(d[sizeValue]) })
          .attr("fill", function(d){ return color(d[colorValue])})
          .sort(function(a, b) { return d3.descending(a[sizeValue], b[sizeValue]) });

        var gGrid = chart.selectAll("g.grid")
          .data(dataGrid)
          .enter().append("g")
          .attr("class","grid")
          .attr("transform", function(d){return "translate(" + x(new Date(d.key)) + ",0)"})

        gGrid.selectAll("circle")
          .data(function(d){return d.value})
          .enter()
          .append('circle')
          .attr("cy", function(d){return y(d+1)})
          .attr("r", 1)

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

  return scatterPlot;

  }

})();
