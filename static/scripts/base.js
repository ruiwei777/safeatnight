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
    $("ul.nav.navbar-nav li").removeClass("active");
    if (window.location.pathname === "/") {
        $("#home-li").addClass("active")
    } else if (window.location.pathname.indexOf("sms") != -1) {
        $("#sms-li").addClass("active")
    } else if (window.location.pathname.indexOf("crime") != -1) {
        $("#cs-li").addClass("active")
    } else if (window.location.pathname.indexOf("about") != -1) {
        $("#about-li").addClass("active")
    }
}

// Add Placeholder for DMS form
function addPlaceHolderDMS(){
    $("#id_hour").attr("placeholder", "0 to 23");
    $("#id_minute").attr("placeholder", "0 to 59")
}
$(addPlaceHolderDMS())

// BEGIN of DMS layout
function makeWidgetSameLine() {
    $(".selectdatewidget.form-control").addClass('same-line-widget')
}

function makeMinuteAndHourSameLine() {
    $("#div_id_hour").addClass('inline-div')
    $("#div_id_minute").addClass('inline-div')
}

function makeAreaCodeAndNumberSameLine() {
    $("#div_id_receiver_area_code").addClass('area-code')
    $("#div_id_sender_area_code").addClass('area-code')
    $("#div_id_receiver").addClass('phone-number')
    $("#div_id_sender").addClass('phone-number')
}

function adjustDMSImage() {
    var height = $(window).height() * 0.25;

    $("#dms-img").attr("height", height + "");
    $("#dms-img").attr("width", height + "");
}

$(adjustDMSImage())
$(window).resize(adjustDMSImage)
$(makeWidgetSameLine())
$(makeMinuteAndHourSameLine())
$(makeAreaCodeAndNumberSameLine())


// END of DMS layout




$(adjustActive())
