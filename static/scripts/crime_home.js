function clickToId() {
    jQuery.fn.d3Click = function () {
        this.each(function (i, e) {
            var evt = new MouseEvent("click");
            e.dispatchEvent(evt);
        });
    };
}
$(clickToId())


// Reset button
$("#reset").click(function () {
    var comment = $("#comment");

    if (comment.not(":hidden")) comment.slideUp();
    $("#data-container").d3Click();
    $("#postcode-text").val("");
    $("#suburb-text").val("");
    $("#crime-rate-text").text("None");
    var information_paragraph = $("#information-paragraph");
    if (information_paragraph.not(":hidden")) {
        information_paragraph.slideUp("fast");
    }
})


// Current-location button
$("#current-location").click(function () {


    $("#information-paragraph").slideUp("fast");

    if (navigator.userAgent.indexOf("Firefox") > 0) {
        // alert("Firefox browser dot not support getting current location.")
        // return;
    }

    $("#data-container").d3Click();

    if (!navigator.geolocation) {
        alert("Sorry, your browser does not support geolocation API.");
        return;
    }

    setTimeout(function () {
        var lat, lng;
        var raw_url = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCNSq5fvWuyqJ1UIJjEcSLzX7T5BqfSYtI&latlng="
        navigator.geolocation.getCurrentPosition(function (position, error) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            var url = raw_url + lat + "," + lng;
            var postcode, postcode_localities;
            $.get(url, null, function (data) {
                if (data.status === "OK") {
                    data.results.forEach(function (result) {
                        if (result.address_components[0].types[0] == "postal_code") {

                            result.address_components.forEach(function (component) {
                                if (component.types[0] == "postal_code") {
                                    postcode = component.short_name;
                                }
                            })
                            postcode_localities = result.postcode_localities;
                        }


                    })

                    clickToPostcode(postcode, postcode_localities);


                    // var detail_array = data.results[0].address_components;
                    //
                    // detail_array.forEach(function (e) {
                    //     if (e.types[0] === "postal_code") {
                    //         var postcode = e.short_name;
                    //         var postcode_localities = e.postcode_localities;
                    //         clickToPostcode(postcode, postcode_localities);
                    //     }
                    // })
                } else {
                    alert("Failed to fetch location from Google.")
                }
            }, "json")
        });
    }, 400);


})

// Search button
$("#search").click(searchOnClick)

function searchOnClick() {

    $("#data-container").d3Click();

    var postcode_text = $("#postcode-text").val();
    var suburb_text = $("#suburb-text").val();

    if (postcode_text == "" && suburb_text == "") {
        var p = $("#information-paragraph");
        p.text("Please enter postcode or suburb name.");
        p.css("color", "goldenrod");
        p.css("border-color", "goldenrod");
        p.slideDown("fast");
        return;
    }

    $("#information-paragraph").slideUp("fast");


    var url_raw = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCNSq5fvWuyqJ1UIJjEcSLzX7T5BqfSYtI&address=australia,victoria,";
    var url;

    if (postcode_text != "") {
        url = url_raw + postcode_text;
        $.get(url, null, function (data) {
            if (data.status === "OK") {
                var postcode_localities = data.results[0].postcode_localities; // can be none

                var detail_array = data.results[0].address_components;
                for (var i = 0; i < detail_array.length; i++) {
                    if (detail_array[i].types[0] === "postal_code") {
                        var postcode = detail_array[i].short_name;
                        clickToPostcode(postcode, postcode_localities)
                        break;
                    } else {
                        displayInformationParagraph();
                    }

                }


            } else {
                alert("Failed to fetch location from Google.")
            }
        }, "json")

    } else if (suburb_text != "") {
        // when input is text, make Geocoding request
        // alert("Using suburb");
        url = url_raw + suburb_text;
        $.get(url, null, function (data) {
            if (data.status === "OK") {
                var detail_array = data.results[0].address_components;
                detail_array.forEach(function (e) {
                    if (e.types[0] === "postal_code") {
                        var postcode = e.short_name;
                        clickToPostcode(postcode)
                    } else {
                        displayInformationParagraph();
                    }
                })
            } else {
                alert("Failed to fetch location from Google.")
            }
        }, "json")
    }
}


/**
 * After simulating d3 click, show the text on bubbles
 */
function showText() {
    setTimeout(function () {
        var d3text = d3.selectAll("text.label");
        d3text.style("display", "inline");
        d3text.style("fill-opacity", 1)
    }, 800)

}

function displayDashboardData(postcode, postcode_localities, crimeRateText) {
    $("#postcode-text").val(postcode);
    $("#crime-rate-text").text(crimeRateText);
    if (postcode_localities) {
        $("#suburb-text").val(postcode_localities.join(", "))
    } else {
        $("#suburb-text").val(getSuburb(postcode))
    }


}

function displayInformationParagraph(crime_rate) {
    var p = $("#information-paragraph");
    var color = "goldenrod";

    if (crime_rate) {
        if (crime_rate <= 99) {
            p.text("Congratulation! This area has a very LOW crime rate.");
            color = "#5cb85c";
        } else if (crime_rate <= 640) {
            p.text("Not bad. This area has a MEDIUM crime rate.");
            color = "dodgerblue";
        } else if (crime_rate >= 641) {
            p.text("Warning: this area has a top 30% amount of recorded offense in Victoria.");
            color = "lightcoral";
        }


    } else {
        p.text("Sorry, your area is not supported for the moment.");
    }


    p.css("color", color);
    p.css("border-color", color);

    p.slideDown("fast");


}

function getCrimeRate(id) {
    var selection = d3.selectAll("text").filter(function (d) {
        return d.name == id
    }).datum()
    return Math.round(selection.size * 1000) / 1000;
}

function getSuburb(id) {
    var selection = d3.selectAll("text").filter(function (d) {
        return d.name == id
    }).datum()
    return selection.suburb;
}


/**
 * Click to the d3 element and display information
 * @param postcode
 * @param postcode_localities
 */
function clickToPostcode(postcode, postcode_localities) {

    var d3_circle = $("#" + postcode);
    if (d3_circle.length > 0) {
        displayDashboardData(postcode, postcode_localities, getCrimeRate(postcode))
        //setComment(getCrimeRate(postcode_text), getSuburb(postcode_text))
        displayInformationParagraph(getCrimeRate(postcode));
        d3_circle.d3Click();
        showText();

    } else {
        displayInformationParagraph();
    }
}


// Bind Enter to on click
$.fn.enterKey = function (fnc) {
    return this.each(function () {
        $(this).keypress(function (ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                fnc.call(this, ev);
            }
        })
    })
}

/*
 var elem = $('#search')[0];
 var data = jQuery.hasData( elem ) && jQuery._data( elem );
 console.log(data.events.click[0].handler);
 */


$("#postcode-text").enterKey(searchOnClick);
$("#suburb-text").enterKey(searchOnClick);


/**
 * Browser warning
 */
function detectBrowser() {
    var header = $("header");
    if (navigator.userAgent.indexOf("Firefox") != -1) {
        header.css("margin-bottom", "0")
            .after("<div class='bg-info text-center' style='font-size: 16px'>Firefox Browser might not get your location. Please Switch to" +
                " Chrome to get better experience.</div>")

    }
    else if (navigator.userAgent.indexOf("Chrome") == -1) {
        $("header").css("margin-bottom", "0")
            .after("<div class='bg-info text-center' style='font-size: 16px'>Browsers other than Chrome might cause display issues.</div>")
            .css("background", "deepskyblue")
    }
}

$(detectBrowser)


// Geolocation API
// https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCNSq5fvWuyqJ1UIJjEcSLzX7T5BqfSYtI

// Google Maps APIs
// https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCNSq5fvWuyqJ1UIJjEcSLzX7T5BqfSYtI&address=caulfield


