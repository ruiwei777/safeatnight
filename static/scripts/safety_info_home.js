/**
 * Created by user on 5/10/16.
 */

function popUp() {
    var $panels = $(".col .panel");
    $panels.each(function (i) {
        var delay = i * 200;
        console.log(i);
        var $panel = $(this);
        setTimeout(function(){
            $panel.addClass("popup");
        }, delay)

        }
    )
    ;
}

$(popUp);