$.fn.stars = function() {
  return $(this).each(function() {
    $(this).html($('<span />').width(Math.max(0, (Math.min(5, parseFloat($(this).html())))) * 16));
  });
}

$(document).ready(function() {
  $('span.stars').stars();
  $.getJSON('/api/recipes', function(data) {
    $('#dynamic1').html(data[3].name);
    $('#ingredient1').html(data[3].ingredients);
    $('#my_image1').attr('src', data[3].image);
    $('#description1').html(data[3].description);
    $('#cooktime1').html(data[3].cookTime);
    //////////
    $('#dynamic2').html(data[0].name);
    $('#ingredient2').html(data[0].ingredients);
    $('#my_image2').attr('src', data[0].image);
    $('#description2').html(data[0].description);
    $('#cooktime2').html(data[0].cookTime);
    //////////
    $('#dynamic3').html(data[1].name);
    $('#ingredient3').html(data[1].ingredients);
    $('#my_image3').attr('src', data[1].image || 'error-404.png');
    $('#description3').html(data[1].description);
    $('#cooktime3').html(data[1].cookTime);
  });
  $("#tabs").tabs();
});
