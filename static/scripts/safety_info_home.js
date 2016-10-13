/**
 * Created by user on 5/10/16.
 */

// Block 1 Animation
$(window).scroll(function () {
    var wScroll = $(this).scrollTop();
    var vh = $(this).height();
    var vw = $(this).width();


    $(".background-block.block-1 .heading").css({
        "transform": "translate(0," + wScroll / 2.5 + "px)"
    });

    $(".background-block.block-2 .img-block").css({
        "transform": "translate(0,-" + wScroll / 2.5 + "px)"
    });

    if (wScroll > ($(".background-block.block-3 .img-block").offset().top - vh / 1.5)) {
        $(".background-block.block-3 .img-block").addClass("is-showing");
    }


    var img4_begin_position = $(".background-block.block-4").offset().top - vh/1.5;
    if (wScroll > img4_begin_position) {
        var offset = wScroll - img4_begin_position;


        var division = vw > 500 ? vw > 1100 ?  4 : 2 :  1;

        $(".background-block.block-4 .img-block").css({
            "transform": "translate(0,-" + offset / division + "%)"
        });
    }

});