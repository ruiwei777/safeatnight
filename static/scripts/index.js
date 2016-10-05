/**
 * Created by user on 19/09/16.
 */

function questionAnimate() {
    var switch_item = $(".item-1");
    var crime_item = $(".item-2");
    var tips_item = $(".item-3");

    switch_item.mouseenter(function () {
        $(".description-1").css("border-color", "white");
    });

    switch_item.mouseout(function () {
        $(".description-1").css("border-color", "transparent");
    });

    crime_item.mouseenter(function () {
        $(".description-2").css("border-color", "white");
    });

    crime_item.mouseout(function () {
        $(".description-2").css("border-color", "transparent");
    });

    tips_item.mouseenter(function () {
        $(".description-3").css("border-color", "white");
    });

    tips_item.mouseout(function () {
        $(".description-3").css("border-color", "transparent");
    });


}

$(questionAnimate);

function step() {


    $(".modal-wrap .button").click(function () {
        var $button = $(this);
        var $modal_body = $button.parents(".modal-body");
        var stepIndex = $modal_body.index();

        removeHighlightItem();

        if (stepIndex == 0) {
            if ($button.hasClass("button-left")) {
                // go to next step
                nextStep($modal_body);

            } else {
                lastStep($modal_body);
                highlightItem(2);
            }

        } else if (stepIndex == 1) {
            if ($button.hasClass("button-left")) {

                highlightItem(1)
            } else {

                nextStep($modal_body);

            }

        } else if (stepIndex == 2) {
            if ($button.hasClass("button-left")) {
                removeHighlightItem();
                highlightItem(0);
            } else {

                nextStep($modal_body);
                highlightItem(2);
            }

        } else if (stepIndex == 3) {


        }

    });

    function nextStep($modal_body) {
        var stepIndex = $modal_body.index();

        $modal_body.addClass("animate-out");
        setTimeout(function () {
            $modal_body.removeClass("is-showing");
            $(".modal-body").removeClass("animate-out");
            $modal_body.next().addClass("is-showing animate-in");
        }, 700)
        $(".modal-header span").eq(stepIndex).removeClass().next().addClass("is-active");

    }

    function lastStep($modal_body){
        var stepIndex = $modal_body.index();

        $modal_body.addClass("animate-out");
        setTimeout(function () {
            $modal_body.removeClass("is-showing");
            $(".modal-body").removeClass("animate-out");
            $modal_body.siblings().last().addClass("is-showing animate-in");
        }, 700)
        $(".modal-header span").eq(stepIndex).removeClass("is-active").siblings().last().addClass("is-active");

    }

    function removeHighlightItem(){
        var $items = $("#description .item");
        $items.removeClass("highlight");
    }

    function highlightItem(index) {
        var $items = $("#description .item");

        $items.eq(index).addClass("highlight");
    }
}

function pagOnClick(){
    var $pag = $(this);
    var index = $pag.index();

    $(".item.highlight").removeClass("highlight");

    //pagination color
    $pag.siblings().removeClass("is-active");
    $pag.addClass("is-active");

    //go to modal-body
    var $source = $(".modal-body.is-showing");
    $source.removeClass("animate-in");
    $source.addClass("animate-out");
    var $dest = $(".modal-body").eq(index);

    setTimeout(function(){
        $source.removeClass("is-showing");
        $source.removeClass("animate-in");
        $dest.removeClass("animate-out");
        $dest.addClass("is-showing animate-in");
    }, 700)



}

$(".modal-header > span").click(pagOnClick);
$(step);

