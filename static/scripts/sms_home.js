/**
 * Created by user on 13/09/16.
 */


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
        //console.log(item[0].value.charAt(0) == "0" && $.isNumeric(item[0].value))
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


/*----------------------------------------------
 Submit Button Validation
 ---------------------------------------------*/
function validatePhoneNumberBeforeSubmit() {
    var receiver = $("#id_receiver_number");
    var sender = $("#id_sender_number");
    if (!validatePhoneNumber(receiver) || !validatePhoneNumber(sender)) {
        return false;
    }

    return true;
}

function validateDate() {
    var now = new Date();
    var date_str = $("input[id=id_scheduled_time]").val();
    var submit_date = new Date(date_str);


    if (submit_date < now) {
        return false;
    } else {
        return true
    }

}


function validateFormSubmit() {
    if (!validateDate()) {
        alert("Invalid date.");
        return false;
    }

    if (!validatePhoneNumberBeforeSubmit()) {
        alert("Incorrect Phone number.");
        return false;
    }

    rememberMeCookies();

    return true;


}

$("#submit-btn").click(validateFormSubmit);

/*----------------------------------------------
 Add Placeholder to id_scheduled_time
 ---------------------------------------------*/
$("input[id=id_scheduled_time]").attr("placeholder", "Click the calendar to set time");


/*----------------------------------------------
 Swap between Send / Cancel message
 ---------------------------------------------*/
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


/*------------------------------------
 Cookies to remember phone number
 -----------------------------------*/
function rememberMeCookies() {
    var confirm = $("input[id=id_remember_me]").val();
    if (confirm) {
        var input_reciever_number = $("input[id=id_receiver_number]").val();
        var input_sender_number = $("input[id=id_sender_number]").val();
        Cookies.set("phone_number", {
            receiver_number: input_reciever_number,
            sender_number: input_sender_number
        });
    }
}

$("#div_id_remember_me").after("<div class='message'>Browser will remember your phone numbers using cookies.</div>");

function rememberMeOnValueChanged() {
    var remember_me_input = $("input[id=id_remember_me]");

    var confirm = remember_me_input.is(":checked");


    if (confirm) {
        $(".message")
            .slideDown("fast");
    } else {
        $(".message").slideUp("fast");
    }
}
$("input[id=id_remember_me]").change(rememberMeOnValueChanged);

function displayCookiesOnPageLoad() {
    var cookies = Cookies.getJSON("phone_number");

    var receiver_number_input = $("input[id=id_receiver_number]");
    var sender_number_input = $("input[id=id_sender_number]");



    if(cookies){
        receiver_number_input.css("background-color","rgb(250,255,189)").val(cookies.receiver_number);
        sender_number_input.css("background-color","rgb(250,255,189)").val(cookies.sender_number);

        receiver_number_input.keyup(function(){
            if(receiver_number_input.val() == parseInt(cookies.receiver_number)){
                receiver_number_input.css("background-color", "rgb(250,255,189)");
            } else {
                receiver_number_input.css("background-color", "inherit");
            }
        });

        sender_number_input.keyup(function(){
            if(sender_number_input.val() == parseInt(cookies.sender_number)){
                sender_number_input.css("background-color", "rgb(250,255,189)");
            } else {
                sender_number_input.css("background-color", "inherit");
            }
        });
    }

}


$(displayCookiesOnPageLoad);

