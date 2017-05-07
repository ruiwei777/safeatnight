function clickToId() {
    jQuery.fn.d3Click = function () {
        this.each(function (i, e) {
            var evt = new MouseEvent("click");
            e.dispatchEvent(evt);
        });
    };
}

/*function clickToId(elementId){
    var e = document.createEvent('UIEvents');
    e.initUIEvent('click', true, true, window, 1);
    d3.select('[id="'+ elementId +'"]').node().dispatchEvent(e);
}*/

/*function initOnClick(){
    var $nodes = $("circle")
    if($nodes.length < 2){
        setTimeout(initOnClick, 1000)
        return
    }


}*/

$(clickToId)
// $(window).on('load', initOnClick)



// Reset button
$("#reset").click(function () {
    var comment = $("#comment");

    if (comment.not(":hidden")) comment.slideUp();
    $("#data-container").d3Click();
    $("#search-text").val("");
    $("#postcode-text").text("None");
    $("#suburb-text").text("None");
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
                    setTimeout(displaySafetySwitch, 2500);
                } else {
                    displayInformationParagraph();
                }
            }, "json")
        });
    }, 400);


})

// Search button
$("#search").click(searchOnClick)

function searchOnClick() {

    $("#data-container").d3Click();

    var search_text = $("#search-text").val();
    var suburb_text = $("#suburb-text").text();

    if (search_text == "") {
        var p = $("#information-paragraph");
        p.text("Please enter postcode or suburb name.");
        p.css("color", "goldenrod");

        p.slideDown("fast");
    } else {
        $("#information-paragraph").slideUp("fast");
        var url_raw = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCNSq5fvWuyqJ1UIJjEcSLzX7T5BqfSYtI&address=australia,victoria,";
        var url;
        url = url_raw + search_text;
        $.get(url, null, function (data) {
            if (data.status === "OK") {
                var detail_array = data.results[0].address_components;
                // Check if it in Victoria
                for (var i = 0; i < detail_array.length; i++) {
                    var item = detail_array[i];
                    //got result but it's not Victoria
                    if (item.types[0] == "administrative_area_level_1" && item.short_name != "VIC") {
                        displayInformationParagraph();
                        return;
                    }
                }
                // display data
                var postcode_localities = data.results[0].postcode_localities; // can be none
                for (var i = 0; i < detail_array.length; i++) {
                    if (detail_array[i].types[0] === "postal_code") {
                        var postcode = detail_array[i].short_name;
                        clickToPostcode(postcode, postcode_localities);
                        break;
                    } else {
                        displayInformationParagraph();
                    }
                }
                setTimeout(displaySafetySwitch, 1500);
            } else {
                alert("Failed to fetch location from Google.")
            }
        }, "json")
    }
}


/**
 * After simulating d3 click, show the text on bubbles
 */
// function showText() {
//     setTimeout(function () {
//         var d3text = d3.selectAll("text.label");
//         d3text.style("display", "inline");
//         d3text.style("fill-opacity", 1)
//     }, 800)

// }

function displayDashboardData(postcode, postcode_localities, crimeRateText) {
    $("#postcode-text").text(postcode);
    $("#crime-rate-text").text(crimeRateText);
    if (postcode_localities) {
        $("#suburb-text").text(postcode_localities.join(", "))
    } else {
        $("#suburb-text").text(getSuburb(postcode))
    }


}

/**
 * Pass no parameters to show not support message;
 * @param crime_rate
 */
function displayInformationParagraph(crime_rate) {
    var p = $("#information-paragraph");
    var color = "goldenrod";

    if (crime_rate) {
        if (crime_rate <= 747) {
            // color = "inherit";
            p.text(crime_rate + " offences are recorded from Apr.2015 to Mar.2016, lower than average");
            return;
        }

        else if (crime_rate > 747) {
            p.text(crime_rate + " offences are recorded from Apr.2015 to Mar.2016, above average.");
            color = "lightcoral";
        }


    } else {
        p.text("Your area is not supported for the moment.");
    }


    p.css("color", color);
    p.css("border-color", color);

    p.slideDown("fast");


}

function getCrimeRate(id) {
    var selection = d3.selectAll("text").filter(function (d) {
        return d.name == id
    }).datum();
    return Math.round(selection.size * 1000) / 1000;
}

function getSuburb(id) {
    var selection = d3.selectAll("text").filter(function (d) {
        return d.name == id
    }).datum();
    return selection.suburb;
}


/**
 * Click to the d3 element and display information
 * @param postcode
 * @param postcode_localities
 */
function clickToPostcode(postcode, postcode_localities) {

    var d3_circle = $("#" + postcode);
    var parent = d3.selectAll("circle")
    .filter(function(d){
        if((d.depth === 2 && d.children) || (d.name === "Melbourne CBD")){
            return true;
        }
        else 
            return false;
    })
    .filter(function(d){
        var children = d.children
        for(var i=0; i<children.length; i++){
            child = children[i]
            var name = d.name.split(" - ")
            var child_name = Number(postcode)

            if ( name.length === 2){
                var lower = Number(name[0])
                var upper = Number(name[1])
                
                return lower <= child_name && child_name <= upper ? true : false

            } else if(child_name >= 3000 && child_name <= 3006 
                && child_name !== 3205 && name.length ===1) {
                // Melbourne CBD
                return true
            }
        }

    })
    // console.log(parent)
    var $target = $("[id='" +parent[0][0].id + "']")
    // console.log($target)
    $target.d3Click()




    if (d3_circle.length > 0) {
        displayDashboardData(postcode, postcode_localities, getCrimeRate(postcode))
        //setComment(getCrimeRate(search_text), getSuburb(search_text))
        displayInformationParagraph(getCrimeRate(postcode));
        // d3_circle.d3Click();
        // showText();

    } else {
        displayInformationParagraph();
    }
}


// Bind Enter to onClick
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


$("#search-text").enterKey(searchOnClick);
$("#suburb-text").enterKey(searchOnClick);

// Geolocation API
// https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCNSq5fvWuyqJ1UIJjEcSLzX7T5BqfSYtI

// Google Maps APIs
// https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCNSq5fvWuyqJ1UIJjEcSLzX7T5BqfSYtI&address=caulfield

/**
 * Show Safety Switch Tips
 */
function displaySafetySwitch() {
    $(".modal-body").addClass("is-showing animate-in");
}
