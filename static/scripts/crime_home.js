/**
 * Created by user on 29/08/16.
 */

// getting window width and height
var window_width = $(window).width() * 0.45;
var window_height = $(window).height() * 0.45;

var svg_diameter = window_height > window_width ? window_width : window_width;

// main program
var margin = 20,
    diameter = svg_diameter;

var color = d3.scale.linear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

var pack = d3.layout.pack()
    .padding(2)
    .size([diameter - margin, diameter - margin])
    .value(function (d) {
        return d.size;
    })

var svg = d3.select("#data-container")

    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .append("g")
    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

d3.json("{% static 'data/structure_crime_1.json' %}", function (error, root) {
    if (error) throw error;

    var focus = root,
        nodes = pack.nodes(root),
        view;

    var circle = svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("class", function (d) {
            return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
        })
        .attr("id", function (d) {
            return d.name;
        })
        .style("fill", function (d) {
            return d.children ? color(d.depth) : null;
        })
        .on("click", function (d) {
            if (focus !== d) zoom(d), d3.event.stopPropagation();
        });

    var text = svg.selectAll("text")
            .data(nodes)
            .enter().append("text")
            .attr("class", "label")
            .style("fill-opacity", function (d) {
                return d.parent === root ? 1 : 0;
            })
            .style("display", function (d) {
                return d.parent === root ? "inline" : "none";
            })
            .text(function (d) {
                return d.name;
            })
        ;

    // add content to text
    text.append("tspan")
        .attr("dy", 0)
        .attr("x", 0)
        .text(function (d) {
            return d.name;
        });

    text.append("tspan")
        .attr("dy", "1.2em") // offest by 1.2 em
        .attr("x", 0)
        .text(function (d) {
            return d.size;
        });


    var node = svg.selectAll("circle,text");

    d3.select("body")
    // .style("background", color(-1))
        .on("click", function () {
            zoom(root);
        });
    d3.select("#data-container").style("background", color(-1));

    zoomTo([root.x, root.y, root.r * 2 + margin]);

    function zoom(d) {
        var focus0 = focus;
        focus = d;

        var transition = d3.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .tween("zoom", function (d) {
                var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                return function (t) {
                    zoomTo(i(t));
                };
            });

        transition.selectAll("text")
            .filter(function (d) {
                return d.parent === focus || this.style.display === "inline";
            })
            .style("fill-opacity", function (d) {
                return d.parent === focus ? 1 : 0;
            })
            .each("start", function (d) {
                if (d.parent === focus) this.style.display = "inline";
            })
            .each("end", function (d) {
                if (d.parent !== focus) this.style.display = "none";
            });
    }

    function zoomTo(v) {
        var k = diameter / v[2];
        view = v;
        node.attr("transform", function (d) {
            return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
        });
        circle.attr("r", function (d) {
            return d.r * k;
        });
    }
});

d3.select(self.frameElement).style("height", diameter + "px");

jQuery.fn.d3Click = function () {
    this.each(function (i, e) {
        var evt = new MouseEvent("click");
        e.dispatchEvent(evt);
    });
};

$(window).resize(function () {

})