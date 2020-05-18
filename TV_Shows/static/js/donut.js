function render_donut(selector, data){
    $(selector).empty();
    var svg = d3.select(selector),
          margin = {top: 70, bottom: 40, left:130},
          width = $(selector).width() 
          height = 170 - margin.top 
          radius = Math.min(width, height) / 1;


    svg = svg.append('svg')
            .attr('width', "100%")
            .attr('height', height + margin.top + margin.bottom)
            .attr('viewBox', "0 0 " + ($(selector).width()) + " " + (height +  margin.bottom))

    if(data == '')
      $(selector).html('<div class="alert alert-warning role=alert">' + 'Sorry! No data available for this Genre.' + '</div>')
      $( "#newimage" ).load(window.location.href + " #newimage" );     
                  
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var legendRectSize = (radius * 0.1);
    var legendSpacing = radius * 0.1;
    
var color = d3.scaleOrdinal(["red", "orange", "#FFD700", "#FFFF66", "#FFFFCC"]);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.Impressions; });

var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 20);

var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

  var arc = g.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");
  arc.append("path")
      .attr("d", path)
      .attr("fill", function(d) { return color(d.data.Programme); })
      .attr('data-val', function(d) { return d.data.Programme;})
      //.on("click", function(d) { d3.event.stopPropagation(); });
  
  // arc.append("text")
  //     .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
  //     .attr("dy", "0.35em")
  //     .text(function(d) { return d.data.Programme; });

  var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing ;
            var offset =  height * color.domain().length / 2;
            var horz = -3 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });
  var color = d3.scaleOrdinal(["red", "orange", "#FFD700", "#FFFF66", "#FFFFCC"]);
    legend.append('rect')
        // .attr('width', legendRectSize)
        // .attr('height', legendRectSize)
        .attr("x", width - (160))
        .attr("y", height - (20))
        .attr("width", 10)
        .attr("height", 10)
        // .style('fill', 'red')
        .style('stroke', 'steelblue')
        .style("fill", function(d, i){return color(i)});
    
    legend.append('text')
        .attr("x", width - (145))
        .attr("y", height - (10))
        .style('font-size', '11px')
        .text(function(d) { return d; })

}