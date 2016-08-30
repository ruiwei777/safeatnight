/**
 * Created by user on 17/08/16.
 */
$(document).ready(function () {
    resize_carousel()
});

$(window).resize(resize_carousel)

function resize_carousel() {
    var height = $(window).height() * 0.78 ;  //getting windows height
    jQuery('#myCarousel').css('height', height + 'px');   //and setting height of carousel
    jQuery('.item').css('height', height + 'px');   //and setting height of item
}