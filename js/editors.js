var viz = d3.select('#networkContainer'),
    width = viz.node().getBoundingClientRect().width,
    height = 500;

viz.style("height", height+"px");

sigma.parsers.json(dataFile, {
    renderer:{
      type: 'canvas',
      container: document.getElementById('networkContainer'),
    },
    settings: {
      mouseWheelEnabled: true,
      zoomMin: 0.1,
      zoomMax: 1,
      labelThreshold: 5,
      labelSize: 'fixed',
      labelSizeRatio: 1,
      maxEdgeSize:3,
      labelAlignment: 'top',
      font: 'Source Sans Pro',
      borderColor: '#fff',
      borderSize:1,
      doubleClickEnabled: false,
      minNodeSize: 1,
      maxNodeSize: 5
    }
}, function(s) {
    sigInst = s;
    var camera = sigInst.camera;
    var filter = sigma.plugins.filter(sigInst);

    var drag = false;

    var _dragListener = new sigma.events.drag(sigInst.renderers[0]);
    _dragListener.bind('drag', function(e) {
        drag = true;
    });
    _dragListener.bind('drop', function(e) {
        drag = false;
    });

    var colors = chemicalwiki.colors().qualitative('designer');
    colors.unshift('#84304b');
    colors.unshift('#000');
    var keys = d3.set(sigInst.graph.nodes(),function(d){return d.attributes.SubstanceCat}).values()
    var colorScale = d3.scaleOrdinal().domain(keys).range(colors)

    var colorLegend = d3.select('.nwLegend').selectAll('span')
      .data(keys)
      .enter()
      .append('span')
      .style('display', 'inline-block')

    colorLegend.append('span')
      .style('width', '10px')
      .style('height', '10px')
      .style('border-radius','50%')
      .style('display', 'inline-block')
      .style('margin-right','5px')
      .style('background', function(d){
        return colorScale(d);
      })

    colorLegend.append('span')
      .text(function(d){
        if(d == '#N/A'){
          return 'Users'
        }else{
          return d
        }

      })
      .style('margin-right','15px')

    sigInst.graph.nodes().forEach(function(e){
      e.type = 'border';
      e.color = colorScale(e.attributes.SubstanceCat)
      // if(e.attributes.Type == "User"){
      //   e.label = 'Editor'
      // }
    });

    sigInst.graph.edges().forEach(function(e){
      e.color = 'rgba(130,130,130,0.2)';
      e.originalColor = e.color;
    });

    sigInst.refresh();

    var substances = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: sigInst.graph.nodes().map(function(d){return d.id})
    });

    $("#searchsub").typeahead({
        hint: true,
        highlight: true,
        minLength: 1
      },
      { source: substances}
      ).bind('typeahead:select', function(ev, suggestion) {
          var elm = sigInst.graph.nodes().filter(function(d){
            return d.id == suggestion;
          })[0]

          selectNode(elm);
          $('#searchsub').typeahead('val', null);
        });

    d3.select('#zoomIn').on('click', function(){
      if (camera.ratio < sigInst.settings("zoomMin")) return;
      sigma.misc.animation.camera(camera, {
        ratio: camera.ratio / camera.settings('zoomingRatio')
      }, {
        duration: 200
      });
    });

    d3.select('#zoomOut').on('click', function(){
      if (camera.ratio > sigInst.settings("zoomMax")) return;
      sigma.misc.animation.camera(camera, {
        ratio: camera.ratio * camera.settings('zoomingRatio')
      }, {
        duration: 200
      });
    })

    d3.select('#zoomReset').on('click', function(){
      sigma.misc.animation.camera(camera, {
          ratio: 1 ,
          x: 0,
          y: 0,
          angle: 0
        }, {
          duration: 200
        });
    })

    var selectNode = function(node){
      sigma.misc.animation.camera(camera, {
        ratio: camera.ratio ,
        x: node["read_cam0:x"],
        y: node["read_cam0:y"],
        angle: 0
      }, {
        duration: 200
      });

      filter.undo().apply();
      filter.neighborsOf(node.id).apply();
      var linked = sigInst.graph.nodes().filter(function(d){return !d.hidden && d.id != node.id})

      var edges = sigInst.graph.edges().filter(function(d){
        return d.source == node.id || d.target == node.id
      })

      sigInst.graph.nodes().forEach(function(d){
        if(d.id != node.id){
          d.selected = false;
        }else{
          d.selected = true;
        }
      })

      d3.select('.selectedNodes')
        .html("<h4>selected node</h4><p>" + node.label+"</p>");

      d3.select('.selectedNodes').classed('no-opacity', false)

      var div = d3.select('.linkedNodes')

      div.select("h4").remove()
      div.insert("h4", ".networkSide")
      div.select("h4").text('linked articles')

      var divLink = div.select('.networkSide')
      divLink.selectAll('.linkButton').remove();

      divLink.selectAll('.linkButton')
        .data(linked.sort(function(a,b){return d3.ascending(a.label,b.label)}))
        .enter()
        .append('span')
        .attr('class', 'linkButton badge')
        .style('background-color', function(d){
          // if(subDict[d.label.toLowerCase()]){
          //   return shadesDict[subDict[d.label.toLowerCase()]]
          // }
        })
        .html(function(d){
          var linkvalue = edges.filter(function(e){
            return d.id == e.source || d.id == e.target
          })[0].size;
          return d.label + ' <span class="badge">' + linkvalue + '</span>'
        })
        .on('click', function(d){
          var elm = sigInst.graph.nodes().filter(function(e){return e.id == d.id})[0]
          selectNode(elm)
        })

      div.classed('no-opacity', false)
    }

    sigInst.bind('clickNode', function(e) {
      if(!drag){
        sigma.misc.animation.camera(camera, {
          ratio: camera.ratio ,
          x: e.data.node["read_cam0:x"],
          y: e.data.node["read_cam0:y"],
          angle: 0
        }, {
          duration: 200
        });

        filter.undo().apply();
        filter.neighborsOf(e.data.node.id).apply();
        var linked = sigInst.graph.nodes().filter(function(d){return !d.hidden && d.id != e.data.node.id})

        sigInst.graph.nodes().forEach(function(d){
          if(d.id != e.data.node.id){
            d.selected = false;
          }else{
            d.selected = true;
          }
        })

        var edges = sigInst.graph.edges().filter(function(d){
          return d.source == e.data.node.id || d.target == e.data.node.id
        })

        d3.select('.selectedNodes')
          .html("<h4>selected node</h4><p>" + e.data.node.label+"</p>");

        d3.select('.selectedNodes').classed('no-opacity', false)

        var div = d3.select('.linkedNodes')

        div.select("h4").remove()
        div.insert("h4", ".networkSide")
        div.select("h4").text('linked nodes')

        var divLink = div.select('.networkSide')
        divLink.selectAll('.linkButton').remove()

        divLink.selectAll('.linkButton')
          .data(linked.sort(function(a,b){return d3.ascending(a.label,b.label)}))
          .enter()
          .append('span')
          .attr('class', 'linkButton badge')
          .style('background-color', function(d){
            // if(subDict[d.label.toLowerCase()]){
            //   return shadesDict[subDict[d.label.toLowerCase()]]
            // }
          })
          .html(function(d){
            var linkvalue = edges.filter(function(e){
              return d.id == e.source || d.id == e.target
            })[0].size;
            return d.label + ' <span class="badge">' + linkvalue + '</span>'
          })
          .on('click', function(d){
            selectNode(d)
          })

        div.classed('no-opacity', false)
      }
    });

   sigInst.bind('clickStage', function(e) {
     if(!drag){
       filter.undo().apply();

       sigInst.graph.nodes().forEach(function(d){
           d.selected = false;
       })

       d3.select('.selectedNodes').classed('no-opacity', true)
       var div = d3.select('.linkedNodes').classed('no-opacity', true)
       setTimeout(function(){
         d3.select('.selectedNodes').html('')
         div.select("h4").remove()
         div.selectAll('.linkButton').remove();
       },500)
      }
    });

    d3.select('.loaderContainer')
      .transition()
      .on('end', function(d){
        d3.select(this).style('display', 'none')
      })
      .duration(1000)
      .style('opacity', '0')
      
});
