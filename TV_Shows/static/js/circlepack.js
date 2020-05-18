function render_circlepack(selector, data){

var svg = d3.select(selector),
    margin = 100,
    diameter = 515;

svg = svg.append('svg')
          .attr("width", "100%")
          .attr("height", 480);
          g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

var color = d3.scaleOrdinal(d3.schemeCategory20)
            .range(['#510C66','#B34AD3','#E5B8F3'])

// var color = d3.scaleLinear()
//     .domain([-1, 5])
//     .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
//     .interpolate(d3.interpolateHcl);

  var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);
var tooltip = d3.select(selector)
  .append("div")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  
  root = d3.hierarchy(data)
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });
   
  var focus = root,
      nodes = pack(root).descendants(),
      view;
  var depth_map = {'0': 'media', '1': 'Languages', '2': 'Genere', '3': 'Channel Name'}
  var circle = g.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
      .style("fill", function(d) { return d.children ? color(d.depth) : null; })
      .attr('href', function(d) { return depth_map[d.depth] + '$$' +d.data.name})
      .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); render_template(); render_card_template();})
    .on("mouseover", function(d){return tooltip.text(d.data.name).style("visibility", "visible");})
  .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

  var text = g.selectAll("text")

  
    .data(nodes)
    .enter().append("text")
      .attr("class", "label")
      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
      .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
      .text(function(d) { return d.data.name; });
    
  var node = g.selectAll("circle,text");

  node.append("circle")
     .attr("r", function(d) { return d.r+ 7; })
     .style("fill", function(d, i) { return color(i); }); 
    
  // svg
  //     .style("background", color(-1))
  //     .on("click", function() { zoom(root); });

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoom(d) {
    var focus0 = focus; focus = d;

    var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
          return function(t) { zoomTo(i(t)); };
        });

    transition.selectAll("text")
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

  function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }
  
  function hovered(hover) {
  return function(d) {
  d3.selectAll(d.ancestors().map(function(d) {}));
  };

 
}
$('#circlechart circle').on('click', function(){
  var selected = $(this).attr('href');
  var pageUrl = '?selected=' + selected;
  window.history.pushState('', '', pageUrl);
  render_donut('#donutchart', render_card_template());
})
}



