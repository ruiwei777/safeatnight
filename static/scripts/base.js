/**
 * Created by user on 17/08/16.
 */
/* Make buttons' size the max one's size */
$('.width-group').width(
    Math.max.apply(
        Math,
        $('.width-group').map(function () {
            return $(this).outerWidth();
        }).get()
    )
);

/* Adjust current "active" class in navbar */
function adjustActive() {
    $(".navbar ul li a").removeClass("active");
    if (window.location.pathname === "/") {
        $("#home-a").addClass("active")
    } else if (window.location.pathname.indexOf("sms") != -1) {
        $("#sms-a").addClass("active")
    } else if (window.location.pathname.indexOf("crime") != -1) {
        $("#cs-a").addClass("active")
    } else if (window.location.pathname.indexOf("safeatnight") != -1) {
        $("#about-a").addClass("active")
    } else if (window.location.pathname.indexOf("us") != -1) {
        $("#us-a").addClass("active")
    } else if (window.location.pathname.indexOf("info") != -1) {
        $("#info-a").addClass("active")
    }
}


$(adjustActive())
