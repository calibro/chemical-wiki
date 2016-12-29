(function(){

  var chemicalwiki = window.chemicalwiki || (window.chemicalwiki = {});

  chemicalwiki.smallMultiplePoint = function(){

    var height = 600,
        width = 600,
        xValue,
        yValue,
        scale = 'relative',
        oldScale,
        stackColors = ["#0EA789", "#0EA789"],
        color = 'black',
        brushDate,
        radius = 1,
        annotations = [],
        oldVandalism,
        vandalism = true,
        duration = 250;


    function smallMultiplePoint(selection){
      selection.each(function(data){

        var chart,
            context,
            canvas;

        var margin = {top: 10, right: 10, bottom: 20, left: 10},
            chartWidth = width - margin.left - margin.right,
            chartHeight = height - margin.top - margin.bottom;

        if (selection.select('svg').empty()){


          selection.append('canvas')
            .style('position','absolute')
            .style('top',0)
            .style('left',0)

          canvas = document.querySelector("canvas");
          context = canvas.getContext("2d");

          var ratio = getRetinaRatio();

          selection.select('canvas')
            .attr("width", width*ratio)
            .attr("height", height*ratio)
            .style('width', width + 'px')
            .style('height', height + 'px');

          context.scale(ratio, ratio);
          context.translate(margin.left, margin.top);

          chart = selection.append('svg')
          .attr('width', width)
          .attr('height', height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }
        else
        {

          canvas = document.querySelector("canvas");
          context = canvas.getContext("2d");

          chart = selection.select('svg')
          .attr('width', width)
          .attr('height', height)
            .select("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }


        var xMin = d3.min(data, function(layer) { return d3.min(layer.values, function(d) {
          if(vandalism===false){
            if(d.vandalism===false){
              return d.x
            }
          }else{
            return d.x;
          }
        }); })
        var xMax = d3.max(data, function(layer) { return d3.max(layer.values, function(d) {
          if(vandalism===false){
            if(d.vandalism===false){
              return d.x
            }
          }else{
            return d.x;
          }
        }); });


        var x = d3.scaleTime()
            .domain([xMin,xMax])
            .range([0, chartWidth]);

        var h = (chartHeight - (10*(data.length-1))) / data.length;

        var y = d3.scaleLinear()
            .range([h, 0]);


        var format = d3.format(".2s");

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
              .call(xAxis);

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

          updateCanvas()

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

          function multiple(single,i) {

            var g = d3.select(this);

            if (scale == 'absolute'){
              y.domain([0, d3.max(data, function(layer) { return d3.max(layer.values, function(d) {
                if(vandalism===false){
                  if(d.vandalism===false){
                    return d.y
                  }
                }else{
                  return d.y;
                }
              }); })])
            }else{
              y.domain([0, d3.max(single.values, function(d) {
                if(vandalism===false){
                  if(d.vandalism===false){
                    return d.y
                  }
                }else{
                  return d.y;
                }

              })]);
            }

            var yAxis = d3.axisLeft(y)
              .ticks(4)
              .tickFormat(function(d){
                if(d > 0){
                  return format(d);
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

              g.append('line')
                .attr('x1', 0)
                .attr('x2', chartWidth)
                .attr('y1', h+1)
                .attr('y2', h+1)
                .attr('stroke', 'black')
            }

          }

          function updateCanvas(){

            if(oldScale!=scale && !oldScale){
              // prepare data
              data.forEach(function(d,i){
                y.domain([0, d3.max(d.values, function(d) {
                  if(vandalism===false){
                    if(d.vandalism===false){
                      return d.y
                    }
                  }else{
                    return d.y;
                  }
                })]);

                d.values.forEach(function(e){
                  e.relativeY = y(e.y)+((h+10)*i)
                })

                y.domain([0, d3.max(data, function(layer) { return d3.max(layer.values, function(d) {
                  if(vandalism===false){
                    if(d.vandalism===false){
                      return d.y
                    }
                  }else{
                    return d.y;
                  }
                }); })])

                d.values.forEach(function(e){
                  e.absoluteY = y(e.y)+((h+10)*i)
                })

              })

              //draw first time rect
              data.forEach(function(d,i){
                d.values.forEach(function(e){
                  if(vandalism === false){
                    if(e.vandalism === false){
                      context.fillRect(x(e.x)-1, e[scale+'Y']-1, 2, 2);
                      context.fillStyle = color;
                    }
                  }else{
                    context.fillRect(x(e.x)-1, e[scale+'Y']-1, 2, 2);
                    context.fillStyle = color;
                  }
                })
              })

              oldScale = scale;

            }else if((oldScale!=scale && oldScale) || (oldVandalism != vandalism)){
              oldVandalism = vandalism

              // prepare data
              data.forEach(function(d,i){
                y.domain([0, d3.max(d.values, function(d) {
                  if(vandalism===false){
                    if(d.vandalism===false){
                      return d.y
                    }
                  }else{
                    return d.y;
                  }
                })]);

                d.values.forEach(function(e){
                  e.relativeY = y(e.y)+((h+10)*i)
                })

                y.domain([0, d3.max(data, function(layer) { return d3.max(layer.values, function(d) {
                  if(vandalism===false){
                    if(d.vandalism===false){
                      return d.y
                    }
                  }else{
                    return d.y;
                  }
                }); })])

                d.values.forEach(function(e){
                  e.absoluteY = y(e.y)+((h+10)*i)
                })

              })

              var timeScale = d3.scaleLinear()
                .domain([0, duration])
                .range([0,1]);


              var t = d3.timer(function(elapsed){

                  if(elapsed >= duration){
                    t.stop()
                    context.clearRect(0, 0, width, height);
                    var time = timeScale(duration);
                    data.forEach(function(d,i){
                      d.values.forEach(function(e){
                        if(vandalism === false){
                          if(e.vandalism === false){
                            var intepolation = d3.interpolateNumber(e[oldScale+'Y'], e[scale+'Y']);
                            var value = intepolation(time);
                            context.fillRect(x(e.x)-1, value-1, 2, 2);
                          }
                        }else{
                          var intepolation = d3.interpolateNumber(e[oldScale+'Y'], e[scale+'Y']);
                          var value = intepolation(time);
                          context.fillRect(x(e.x)-1, value-1, 2, 2);
                        }
                      })
                    })
                    oldScale = scale;
                  }else{
                    context.clearRect(0, 0, width, height);
                    var time = timeScale(elapsed);
                    data.forEach(function(d,i){

                      d.values.forEach(function(e){
                        if(vandalism === false){
                          if(e.vandalism === false){
                            var intepolation = d3.interpolateNumber(e[oldScale+'Y'], e[scale+'Y']);
                            var value = intepolation(time);
                            context.fillRect(x(e.x)-1, value-1, 2, 2);
                          }
                        }else{
                          var intepolation = d3.interpolateNumber(e[oldScale+'Y'], e[scale+'Y']);
                          var value = intepolation(time);
                          context.fillRect(x(e.x)-1, value-1, 2, 2);
                        }
                      })
                    })
                  }


                });
            }else{
              console.log("non cambia")
            }

          }

          function getRetinaRatio() {
                var devicePixelRatio = window.devicePixelRatio || 1
                var backingStoreRatio = [
                    context.webkitBackingStorePixelRatio,
                    context.mozBackingStorePixelRatio,
                    context.msBackingStorePixelRatio,
                    context.oBackingStorePixelRatio,
                    context.backingStorePixelRatio,
                    1
                ].reduce(function(a, b) { return a || b })

                return devicePixelRatio / backingStoreRatio
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

  smallMultiplePoint.color = function(x){
    if (!arguments.length) return color;
    color = x;
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

  smallMultiplePoint.annotations = function(x){
    if (!arguments.length) return annotations;
    annotations = x;
    return smallMultiplePoint;
  }

  smallMultiplePoint.scale = function(x){
    if (!arguments.length) return scale;
    scale = x;
    return smallMultiplePoint;
  }

  smallMultiplePoint.vandalism = function(x){
    if (!arguments.length) return vandalism;
    vandalism = x;
    return smallMultiplePoint;
  }

  return smallMultiplePoint;

  }

})();
