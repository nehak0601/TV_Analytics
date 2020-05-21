$(document).ready(function(){
      render_circlepack('#circlechart', chart1_);
      render_donut('#donutchart', render_card_template());
      render_template();
      //render_card_template();
});


$('body')
  .on('click', '#donutchart path', function(){
    render_show_details($(this).attr('data-val'))
    //$('.imageplaceholder > img').attr('src', 'static/images/' + $(this).attr('data-val') + '.jpg')
    render_image($(this).attr('data-val'))
  })
  

function render_show_details(show_name) {
    var render_template = $('#cardscript').html('<b>' + show_name);
}

function render_image(show_name){
  //var render_image_template = $('#my_image').attr('src','static/images/UTTAR RAMAYAN.jpg')
  var render_image_template = $('#imagescript').html()
  var template = _.template(render_image_template);
  //console.log(template)
  var compiledTemplate = template({'srcdata': show_name});
  document.querySelector('#imageplaceholder').innerHTML = compiledTemplate
}


function render_template() {
    $('#mydatatable').remove();
    var templateStr = $('#tablescript').html();
    var template = _.template(templateStr);
    var filtered_data = prog_data;
    if(get_filter() != undefined) {
    if(get_filter().split('$$')[1] != "Media") {
      // console.log('filtered data')
      // console.log(get_filter().split('$$')[0], get_filter().split('$$')[1])
      filtered_data = _.filter(prog_data, function(o) { return o[get_filter().split('$$')[0]] == get_filter().split('$$')[1] });
    }}

    var compiledTemplate = template({'tabledata': filtered_data});
    document.querySelector('#tableplaceholder').innerHTML = compiledTemplate
    $('#mydatatable').DataTable({"pageLength": 5,  "scrollY": "147px"});
    $('.dataTables_length').hide();
    // $('.dataTables_info').hide();
}

function render_card_template() {
    
    var filtered_data = prog_data;
    if(get_filter() != undefined) {
    if(get_filter().split('$$')[1] != "Media") {
      filtered_data = _.filter(prog_data, function(o) { return o[get_filter().split('$$')[0]] == get_filter().split('$$')[1] });
    }
    }
    filtered_data = _(filtered_data)
                  .groupBy('Programme')
                  .map((prog, id) => ({
                    Programme: id,
                    Impressions: _.sumBy(prog, 'Impressions'),
                  }))
                  .value()


    final_data = _.reverse(_.orderBy(filtered_data, ['Impressions']));
    final_data = final_data.slice(0, 5)
    // console.log(final_data)
    // console.log(_.reverse(_.orderBy(filtered_data, ['Impressions'])))
    return final_data
}

   
function get_filter() {
  return decodeURIComponent(window.location.search.split('=')[1])
}