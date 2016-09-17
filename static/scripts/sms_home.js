/**
 * Created by user on 13/09/16.
 */

// Add Placeholder for DMS form
function addPlaceHolderDMS() {
    $("#id_hour").attr("placeholder", "0 to 23");
    $("#id_minute").attr("placeholder", "0 to 59")
}
$(addPlaceHolderDMS());

/**
 * Adjust Image Size
 */
function adjustDMSImage() {
    var image = $("#dms-img");
    var height = $(window).height() * 0.20;

    image.attr("height", height + "");
    image.attr("width", height + "");
}
$(adjustDMSImage());
$(window).resize(adjustDMSImage);

// BEGIN of DMS layout
function makeWidgetSameLine() {
    $(".selectdatewidget.form-control").addClass('same-line-widget')
}

function makeMinuteAndHourSameLine() {
    $("#div_id_hour").addClass('inline-div');
    $("#div_id_minute").addClass('inline-div')
}

function makeAreaCodeAndNumberSameLine() {
    $("#div_id_receiver_area_code").addClass('area-code');
    $("#div_id_sender_area_code").addClass('area-code');
    $("#div_id_receiver").addClass('phone-number');
    $("#div_id_sender").addClass('phone-number');
}


// $(makeWidgetSameLine());
// $(makeMinuteAndHourSameLine());
// $(makeAreaCodeAndNumberSameLine());


/**
 * New Layout
 * @param item
 * @returns {*}
 */
function wrap() {
    $("#div_id_receiver_areacode, #div_id_receiver_number").wrapAll("<div class='flex'></div>");
    $("#div_id_receiver_areacode").addClass("flex-1");
    $("#div_id_receiver_number").addClass("flex-1").css("min-width", "70%");

    $("#div_id_sender_areacode, #div_id_sender_number").wrapAll("<div class='flex'></div>");
    $("#div_id_sender_areacode").addClass("flex-1");
    $("#div_id_sender_number").addClass("flex-1").css("min-width", "70%");

    // $("#div_id_hour, #div_id_minute").wrapAll("<div class='flex'></div>");
    // $("#div_id_hour").addClass("flex-1");
    // $("#div_id_minute").addClass("flex-1");
}

$(wrap)


// END of DMS layout

// Validation Phone Number
function validatePhoneNumber(item) {

    if (item[0].value.length == 10) {
        console.log(item[0].value.charAt(0) == "0" && $.isNumeric(item[0].value))
        return item[0].value.charAt(0) == "0" && $.isNumeric(item[0].value)
    } else if (item[0].value.charAt(0) != "0" && item[0].value.length == 9) {

        return $.isNumeric(item[0].value)
    } else {
        return false;
    }


    return true;
}

function receiverKeyPressHandler() {
    //console.log($(this))
    if (!validatePhoneNumber($(this))) {
        $("label[for='id_receiver_number']").removeClass("correct").addClass("error").text("Receiver Number is incorrect")
    } else {
        $("label[for='id_receiver_number']").removeClass("error").addClass("correct").text("Receiver Number")
    }

}

function senderKeyPressHandler() {
    //console.log($(this))
    if (!validatePhoneNumber($(this))) {
        $("label[for='id_sender_number']").removeClass("correct").addClass("error").text("Your Number is incorrect")
    } else {
        $("label[for='id_sender_number']").removeClass("error").addClass("correct").text("Your Number")
    }

}

$("#id_receiver_number").on("keyup", receiverKeyPressHandler)
$("#id_sender_number").on("keyup", senderKeyPressHandler)


// Submit Button
function validatePhoneNumberBeforeSubmit() {
    var receiver = $("#id_receiver_number");
    var sender = $("#id_sender_number");
    if (!validatePhoneNumber(receiver) || !validatePhoneNumber(sender)) {
        return false;
    }

    return true;
}

// function validateDate() {
//     var now = new Date();
//     var year = $("#id_date_year").val();
//     var month = $("#id_date_month").val() - 1;
//     var day = $("#id_date_day").val();
//     var hour = $("#id_hour").val();
//     var minute = $("#id_minute").val();
//
//
//     var d = new Date(year, month, day, hour, minute, 0, 0);
//     if (d < now) {
//         return false;
//     } else {
//         return true
//     }
//
// }


function validateFormSubmit() {
    if (!validatePhoneNumberBeforeSubmit()) {
        alert("Incorrect Phone number.");
        return false;
    }

    if (!validateDate()) {
        alert("Sorry, sending message to the past is not supported for the moment.");
        return false;
    }
}

$("#submit-btn").click(validateFormSubmit);

// Add Placeholder to #id_scheduled_time
$("input[id=id_scheduled_time]").attr("placeholder", "Click the calendar to set time");

function swapForm() {
    var cancel_form = $("#cancel_form");
    var sms_form = $("#sms_form");
    var send_button = $("#send_button");
    var cancel_button = $("#cancel_button");
    var sms_info = $("#sms_info")

    cancel_form.css("display", "none");
    send_button.css("font-weight", "bold");

    send_button.click(function () {
        send_button.css("font-weight", "bold");
        cancel_button.css("font-weight", "lighter");
        sms_info.text("You are sending message.")

        cancel_form.fadeOut("fast", function () {
            sms_form.fadeIn("fast")
        })

    });

    cancel_button.click(function () {
        cancel_button.css("font-weight", "bold");
        send_button.css("font-weight", "lighter");
        sms_info.text("You are cancelling message.")
        sms_form.fadeOut("fast", function () {
            cancel_form.fadeIn("fast")
        })
    });
}

$(swapForm);