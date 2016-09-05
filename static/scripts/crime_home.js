/* Reset #data-container width */
function adjustDataContanierSize() {
    var new_width = $("svg").width();
    var new_height = $("svg").height();
    $("#data-container").width(new_width);
    $("#data-container").height(new_height);
    $("#data-container").css("margin-right", "0px")
}
// $(window).resize(adjustDataContanierSize)
// $(adjustDataContanierSize())

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
$("#reset-2").click(function () {

    if ($("#comment").not(":hidden")) $("#comment").slideUp();
    $("#data-container").d3Click()
    displayDashboardData("none", "0 ")
})


// Current-location button
$("#current-location-2").click(function () {

    if (navigator.userAgent.indexOf("Firefox") > 0) {
        // alert("Firefox browser dot not support getting current location.")
        // return;
    }
    var ua = navigator.userAgent;


    // if (navigator.userAgent.match('CriOS')) {
    //
    //     //get current latitude and longitude using API
    //     $.get("https://freegeoip.net/json/", null, function (data) {
    //         var url = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCNSq5fvWuyqJ1UIJjEcSLzX7T5BqfSYtI&latlng="
    //             + data.latitude + "," + data.longitude;
    //         $.get(url, null, function (data) {
    //             if (data.status === "OK") {
    //                 var detail_array = data.results[0].address_components;
    //                 detail_array.forEach(function (e) {
    //                     if (e.types[0] === "postal_code") {
    //                         var postcode = e.short_name;
    //                         var target = $("#" + postcode);
    //                         if (target.length > 0) {
    //                             $("#" + postcode).d3Click();
    //                             displayDashboardData(postcode, getTextData(postcode))
    //                             setComment(getTextData(postcode))
    //                             showText();
    //
    //                         }
    //                         else {
    //                             alert("Your post code is" + e.short_name + ". Not supported area.")
    //                         }
    //                     }
    //                 })
    //             } else {
    //                 alert("Sorry, your location is not supported. Only Victoria, Australia is supported")
    //             }
    //         }, "json")
    //     })
    // }


    $("#data-container").d3Click();
    var lat, lng;


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position, error) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            var url = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCNSq5fvWuyqJ1UIJjEcSLzX7T5BqfSYtI&latlng=" + lat + "," + lng;
            $.get(url, null, function (data) {
                if (data.status === "OK") {
                    var detail_array = data.results[0].address_components;
                    detail_array.forEach(function (e) {
                        if (e.types[0] === "postal_code") {
                            var postcode = e.short_name;
                            var target = $("#" + postcode);
                            if (target.length > 0) {

                                displayDashboardData(getSuburb(postcode), getTextData(postcode))
                                setComment(getTextData(postcode), getSuburb(postcode))
                                $("#" + postcode).d3Click();
                                showText();

                            }
                            else {
                                alert("Not supported area.")
                            }
                        }
                    })
                } else {
                    alert("Sorry, your location is not supported. Only Victoria, Australia is supported")
                }
            }, "json")
        });
    } else {
        alert("Your browser does not support geolocation API")
    }


})

// Search button
$("#search-2").click(function () {
    $("#data-container").d3Click();
    var input = $("#search-text").val();
    var isnum = /^\d+$/.test(input);
    if (isnum) {
        var target = $("#" + input);
        if (target.length > 0) {
            displayDashboardData(getSuburb(input), getTextData(input))
            setComment(getTextData(input), getSuburb(input))
            target.d3Click();
            showText();

        } else {
            alert("This area is not supported.")
        }
    } else {
        // when input is text, make Geocoding request
        var url = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCNSq5fvWuyqJ1UIJjEcSLzX7T5BqfSYtI&address=australia,"
            + input;
        $.get(url, null, function (data) {
            if (data.status === "OK") {
                var detail_array = data.results[0].address_components;
                detail_array.forEach(function (e) {
                    if (e.types[0] === "postal_code") {
                        var postcode = e.short_name;
                        var target = $("#" + postcode);
                        if (target.length > 0) {
                            displayDashboardData(getSuburb(postcode), getTextData(postcode))
                            setComment(getTextData(postcode), getSuburb(postcode))
                            $("#" + postcode).d3Click();

                            showText();
                        }
                        else {
                            alert("Not supported area.")
                        }
                    }
                })
            } else {
                alert("The entered location is not supported. Only Victoria, Australia is supported.")
            }
        }, "json")
    }


})

// fix button width
$('.crime-btn-group').width(
    Math.max.apply(
        Math,
        $('.crime-btn-group').map(function () {

            return $(this).outerWidth();
        }).get()
    )
);

function showText() {
    setTimeout(function () {
        var d3text = d3.selectAll("text.label")
        d3text.style("display", "inline")
        d3text.style("fill-opacity", 1)
    }, 800)

}

function displayDashboardData(selectedAreaText, crimeRateText) {
    $("#selected-area-text").text(selectedAreaText)
    $("#crime-rate-text").text(crimeRateText + "%")
}

function getTextData(id) {
    var selection = d3.selectAll("text").filter(function (d) {
        return d.name == id
    }).datum()
    return Math.round(selection.size * 1000) / 1000;
}

function getSuburb(id){
    var selection = d3.selectAll("text").filter(function (d) {
        return d.name == id
    }).datum()
    return selection.suburb;
}

function setComment(size, suburb) {
    var comment = $("#comment");
    if (size <= 0.05) {
        // low crime rate
        if (comment.is(":hidden")) {
            comment.css("color", "lightgreen")
            comment.text("Congratulations! " + suburb + " has a low crime rate.");
            comment.slideDown();
        } else {
            comment.slideUp(function () {
                comment.css("color", "lightgreen")
                comment.text("Congratulations! " + suburb + " has a low crime rate.");
                comment.slideDown()
            })
        }

    } else if (size > 0.05 && size < 0.1) {
        // medium crime rate
        if (comment.is(":hidden")) {
            comment.text("Not bad. " + suburb + " has a medium crime rate.");
            comment.css("color", "#5bc0de")
            comment.slideDown();
        } else {
            comment.slideUp(function () {
                comment.text("Not bad. " + suburb + " has a medium crime rate.");
                comment.css("color", "#5bc0de")
                comment.slideDown()
            })
        }

    } else {
        if (comment.is(":hidden")) {
            comment.text("Oops. " + suburb + " has a high crime rate.");
            comment.css("color", "lightcoral")
            comment.slideDown();

        } else {
            comment.slideUp(function () {
                comment.text("Oops. This area has a high crime rate.");
                comment.css("color", "lightcoral")
                comment.slideDown()
            })
        }
        // high crime rate
    }

}

// change the height of #selected-area-block
// $("#selected-area-block").height($("#selected-area-block").width()* 0.80)

// Geolocation API
// https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCNSq5fvWuyqJ1UIJjEcSLzX7T5BqfSYtI

// Google Maps APIs
// https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCNSq5fvWuyqJ1UIJjEcSLzX7T5BqfSYtI&address=caulfield


