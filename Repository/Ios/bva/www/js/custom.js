// JavaScript Document




/********************** Drop Down Menu *****************************/
$(document).ready(function(){
  $(".dropdownbox").click(function(){
    $(".campuses").toggleClass("showMenu");
      $(".campuses > li").click(function(){
        $(".dropdownbox > p").text($(this).text());
        $(".campuses").removeClass("showMenu");
      });
});

});
/********************** Drop Down Menu *****************************/







/********************** Accordion *****************************/
(function($) {

  $('.accordion > li a').not('active').next().slideUp(150);
  $('.accordion > li:eq(0) a').addClass('active').next().slideDown(150);

  $('.accordion a').click(function(j) {
    var dropDown = $(this).closest('li').find('.accordion-content');

    $(this).closest('.accordion').find('.accordion-content').not(dropDown).slideUp(150);

    if ($(this).hasClass('active')) {
        $(this).removeClass('active')
		/* $(this).not('active').next().slideUp();*/


    } else {
      $(this).closest('.accordion').find('a.active').removeClass('active');
      $(this).addClass('active');


    }


    dropDown.stop(false, true).slideToggle(150);

    j.preventDefault();
  });
})(jQuery);

/********************** Accordion *****************************/







/****************************** On Off buttons ****************/

$('.onoffbtn').on('click', function(){
  if($(this).children().is(':checked')){
    $(this).addClass('active');
  }
  else{
    $(this).removeClass('active')
  }
});
/****************************** On Off buttons ****************/
