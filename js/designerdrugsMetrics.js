var viz = d3.select('.viz'),
    width = viz.node().getBoundingClientRect().width,
    height = 600;

var legendContainer = viz.append('div')
  .attr('class','row legendContainer')

var tableContainer = viz.append('div')
      .attr('class', 'tableContainer')

var filtersContainer = viz.append('div')
  .attr('class', 'filtersContainer')
  .append('div')
  .attr('class', 'row')


d3.tsv(dataFile, parseTsv,function(data){

  data.sort(function(a, b) {
     return d3.ascending(a.category, b.category) || d3.ascending(a.substance, b.substance);
    })

  var table = tableContainer.append('table')
    .attr('class', 'table table-striped header-fixed')

  var headersData =[
    {header:'substance', label:'substance'},
    {header:'page_size', label:'page size (byte)'},
    {header:'total_revisions', label:'total edits'},
    {header:'number_of_editors', label:'editors'},
    {header:'external_links', label:'external links'},
    {header:['first_edit', 'last_edit'], label:'first & last edit'},
  ]

  var colors = chemicalwiki.colors().qualitative('designer');
  var colorScale = d3.scaleOrdinal()
     .domain(d3.set(data, function(d){return d.category}).values())
     //.range(["#B8414F","#2F8CBD", "#F67C2D", "#DF8213", "#7E3A08", "#BDC0DF", "#246D9C", "#9ECAED", "#F9BA80", "#8072AC", "#542687"])
     .range(colors)

  var page_sizeScale = d3.scaleLog()
    .domain(d3.extent(data, function(d){return d.page_size}))
    .range([1,100])

  var total_revisionsScale = d3.scaleLog()
    .domain(d3.extent(data, function(d){return d.total_revisions}))
    .range([1,100])

  var number_of_editorsScale = d3.scaleLog()
    .domain(d3.extent(data, function(d){return d.number_of_editors}))
    .range([1,100])

  var external_linksScale = d3.scaleLog()
    .domain(d3.extent(data, function(d){return d.external_links}))
    .range([1,100])

  var firstlastScale = d3.scaleTime()
    .domain([d3.min(data, function(d){return d.first_edit}),d3.max(data, function(d){return d.last_edit})])
    .range([0,100])

  var scales = {
    page_sizeScale: page_sizeScale,
    total_revisionsScale: total_revisionsScale,
    number_of_editorsScale: number_of_editorsScale,
    external_linksScale: external_linksScale
  }


  var headers = table
        .append('thead')
        .append('tr')
        .selectAll('th')
        .data(headersData)
        .enter()
        .append('th')
        .html(function(d){
            return d.label + ' <span class="glyphicon glyphicon-sort pull-right" aria-hidden="true"></span>'
        })
        .on('click', function(d){
          if(d.label == 'first & last edit'){
            lines
              .sort(function(a,b){
                  return d.sort?d3.ascending(a.first_edit,b.first_edit):d3.descending(a.first_edit,b.first_edit)
              })

          }else{

            lines
              .sort(function(a,b){
                  return d.sort?d3.ascending(a[d.header],b[d.header]):d3.descending(a[d.header],b[d.header])
              })

          }


          headers.selectAll('span')
            .attr('class', 'glyphicon glyphicon-sort pull-right')

          d3.select(this).select('span')
            .attr('class', function(){
              return d.sort?'glyphicon glyphicon-sort-by-attributes pull-right':'glyphicon glyphicon-sort-by-attributes-alt pull-right';
            })

          d.sort = !d.sort;
        })

  var lines = table
        .append('tbody')
        .selectAll('tr')
        .data(data, function(d){return d.substance})
        .enter()
        .append('tr')

  var columns = lines
        .selectAll('td')
        .data(function(d){
          var data = [
            { value: d.substance,
              key: 'substance',
              prop: {category: d.category,link: d.link}
            },
            { value: d.page_size, key: 'page_size', prop: {category: d.category,link: d.link}},
            { value: d.total_revisions, key: 'total_revisions', prop: {category: d.category,link: d.link}},
            { value: d.number_of_editors, key: 'number_of_editors', prop: {category: d.category,link: d.link}},
            { value: d.external_links, key: 'external_links', prop: {category: d.category,link: d.link}},
            { value: [d.first_edit, d.last_edit], key: 'firstlast', prop: {category: d.category,link: d.link}}
          ]
          return data;
        })
        .enter()
        .append('td')
        .style('vertical-align', 'middle')


    columns.filter(function(d){
      return d.key != 'firstlast' && d.key != 'substance'
    })
    .append('div')
    .style('width', function(d){
      var scale = scales[d.key + 'Scale'];
      return scale(d.value) + '%'
    })
    .style('height', "15px")
    .style('background-color', function(d){
      return colorScale(d.prop.category)
    })
    .each(function(d){
      $(this).tooltip({
          'container': 'body',
          'title': d3.format(",.1s")(d.value)
      });
    })

    columns.filter(function(d){
      return d.key == 'substance';
    })
    .append('a')
    .attr('href', function(d){
      return d.prop.link
    })
    .attr('target', '_blank')
    .text(function(d){
      return d.value
    })

    var radius = 6;
    var gantt = columns.filter(function(d){
      return d.key == 'firstlast';
    })
    .append('div')
    .style('position','relative')
    .style('width','100%')
    .style('padding-top','7px' )

    gantt
      .append('div')
      .style('position','absolute')
      .style('width', radius*2+'px')
      .style('height', radius*2+'px')
      .style('border-radius', '50%')
      .style('background-color', function(d){
        return colorScale(d.prop.category)
      })
      .style('left', function(d){
        return 'calc( ' + firstlastScale(d.value[0]) + '% - ' + radius +'px )';
      })
      .style('bottom', '-7px')
      .each(function(d){
        $(this).tooltip({
            'container': 'body',
            'title': d3.timeFormat("%B %d, %Y")(d.value[0])
        });
      })

    gantt
      .append('div')
      .style('position','absolute')
      .style('height', '3px')
      .style('background-color', function(d){
        return colorScale(d.prop.category)
      })
      .style('left', function(d){
        return 'calc('+firstlastScale(d.value[0]) + '% + 6px)'
      })
      .style('width', function(d){
        var value = firstlastScale(d.value[1]) - firstlastScale(d.value[0]);
        return 'calc('+ value + '% - 12px)';
      })


    gantt
      .append('div')
      .style('position','absolute')
      .style('width', '12px')
      .style('height', '12px')
      .style('border-radius', '50%')
      .style('background-color', function(d){
        return colorScale(d.prop.category)
      })
      .style('left', function(d){
        return 'calc( ' + firstlastScale(d.value[1]) + '% - 6px )';
      })
      .style('bottom', '-7px')
      .each(function(d){
        $(this).tooltip({
            'container': 'body',
            'title': d3.timeFormat("%B %d, %Y")(d.value[1])
        });
      })

    var checkboxesContainer = legendContainer
        .append('div')
        .attr('class','col-md-8')
        .append('form')
        .attr('class', 'form-inline')

    var checkboxes = checkboxesContainer.selectAll('.form-group')
      .data(colorScale.domain())
      .enter()
      .append('div')
      .attr('class', 'form-group')

    var labelCont = checkboxes
          .append('label')
          .attr('class', 'btn btn-default btn-xs active')
          .style('background-color', function(d){
            return colorScale(d);
          })

    var check = labelCont.append('input')
          .attr('type', 'checkbox')
          .property("checked", true)
          .on('change', function(d){
            var checked = d3.select(this).property("checked");
            var btn = d3.select(this.parentNode).classed('active', checked)
            updateFilter()
          })

    labelCont.append('span')
      .attr('class', 'glyphicon glyphicon-ok')

      checkboxes
          .append('label')
          .text(function(d){return d})

    var resetContainer = legendContainer
        .append('div')
        .attr('class','col-md-4')

    resetContainer.append('button')
      .attr('class', 'btn btn-default pull-right')
      .text('reset view')
      .on('click', function(){

        pageSizeFilterContainer.datum(pageSizeFilterData)
          .call(pageSizeBarchart.resetBrush(true))

        linksFilterContainer.datum(linksFilterData)
          .call(linksBarchart.resetBrush(true))

        totalEditsFilterContainer.datum(totalEditsFilterData)
          .call(totalEditsBarchart.resetBrush(true))

        editorsFilterContainer.datum(editorsFilterData)
          .call(editorsBarchart.resetBrush(true))

        check.property("checked", true).on('change')()

        labelCont.classed('active', true)

        headers.selectAll('span')
          .attr('class', 'glyphicon glyphicon-sort pull-right')

        lines.sort(function(a,b){
          return d3.ascending(a.category, b.category) || d3.ascending(a.substance, b.substance);
        })

      })

    filtersContainer.selectAll('div')
      .data(headersData)
      .enter()
      .append('div')
      .attr('class', function(d){
        return 'col-md-2 ' + d.header
      })

    var pageSizeFilter = page_sizeScale.domain(),
        totalEditsFilter = total_revisionsScale.domain(),
        editorsFilter = number_of_editorsScale.domain(),
        linksFilter = external_linksScale.domain();

    var pageSizeFilterData = data.map(function(d){
      return {
        key: d.substance,
        value: d.page_size
      }
    })

    var pageSizeFilterContainer = filtersContainer.select('.page_size');

    var pageSizeBarchart = chemicalwiki.barchart()
                      .width($('.page_size').width())
                      .height(50)
                      .on('brushEnd', function(d){
                        pageSizeFilter = d;
                        updateFilter();
                      })

    pageSizeFilterContainer.datum(pageSizeFilterData)
      .call(pageSizeBarchart)

    var totalEditsFilterData = data.map(function(d){
      return {
        key: d.substance,
        value: d.total_revisions
      }
    })

    var totalEditsFilterContainer = filtersContainer.select('.total_revisions');

    var totalEditsBarchart = chemicalwiki.barchart()
                      .width($('.total_revisions').width())
                      .height(50)
                      .on('brushEnd', function(d){
                        totalEditsFilter = d;
                        updateFilter();
                      })

    totalEditsFilterContainer.datum(totalEditsFilterData)
      .call(totalEditsBarchart)

    var editorsFilterData = data.map(function(d){
      return {
        key: d.substance,
        value: d.number_of_editors
      }
    })

    var editorsFilterContainer = filtersContainer.select('.number_of_editors');

    var editorsBarchart = chemicalwiki.barchart()
                      .width($('.number_of_editors').width())
                      .height(50)
                      .on('brushEnd', function(d){
                        editorsFilter = d;
                        updateFilter();
                      })

    editorsFilterContainer.datum(editorsFilterData)
      .call(editorsBarchart)

    var linksFilterData = data.map(function(d){
      return {
        key: d.substance,
        value: d.external_links
      }
    })

    var linksFilterContainer = filtersContainer.select('.external_links');

    var linksBarchart = chemicalwiki.barchart()
                      .width($('.external_links').width())
                      .height(50)
                      .on('brushEnd', function(d){
                        linksFilter = d;
                        updateFilter();
                      })

    linksFilterContainer.datum(linksFilterData)
      .call(linksBarchart)

    var firstlastContainer = filtersContainer.select('.filtersContainer > .row > div:last-child')
      .append('svg')
      .attr('width', $('.filtersContainer > .row > div:last-child').width())
      .attr('height', 50)
      .append('g')
      .attr('transform', 'translate(4,32)')

    var newfirstlastscale = firstlastScale.copy()
    var firstLastXaxis = d3.axisBottom(newfirstlastscale.range([0,$('.filtersContainer > .row > div:last-child').width()-8])).ticks(3)

    firstlastContainer.call(firstLastXaxis)


    function updateFilter(){
      var categories = []
      check.each(function(d){
        var checked = d3.select(this).property("checked");
        if(checked){
          categories.push(d)
        }
      })

      lines
        .style('display','block')
        .filter(function(d){
          return (categories.indexOf(d.category) > -1?false:true) || (d.page_size < pageSizeFilter[0] || d.page_size > pageSizeFilter[1]) || (d.total_revisions < totalEditsFilter[0] || d.total_revisions > totalEditsFilter[1]) || (d.number_of_editors < editorsFilter[0] || d.number_of_editors > editorsFilter[1]) || (d.external_links < linksFilter[0] || d.external_links > linksFilter[1]);
        })
        .style('display','none')
    }

    d3.select('.loaderContainer')
      .transition()
      .on('end', function(d){
        d3.select(this).style('display', 'none')
      })
      .duration(1000)
      .style('opacity', '0')


});

function parseTsv(data){
  var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");

  return{
    substance: data.substance,
    category: data.category,
    page_size: +data.page_size,
    first_edit: parseTime(data.first_edit),
    last_edit: parseTime(data.last_edit),
    external_links: +data.external_links,
    total_revisions: +data.total_revisions,
    number_of_editors: +data.number_of_editors,
    link : data.link
  }
}
