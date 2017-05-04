  {% load staticfiles %}

    function drawBubbleChart() {
        var data_container = $("#data-container");
        data_container.empty()

        var svg_diameter = data_container.width() * 1;

        // main program
        var margin = 20,
                diameter = svg_diameter;

        // original color, using HSL
        /*var color = d3.scale.linear()
                .domain([-1, 5])
                .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
                .interpolate(d3.interpolateHcl);*/

        // custom color, using RGB
        // hsl(152,80%,80%) == rgb(163.245,207)
        // hsl(227,30%,40%) == rgb(71,84,133)
        var color = d3.scale.linear()
                .domain([-1, 5])
                .range(["#d1fae7", "#0067cc"])
                .interpolate(d3.interpolateRgb);

        var lightcoral = '#ffcccc'
        var lightyellow = '#ffffcc'
        var lightgreen = '#ccffcc'
        var zoomColor = d3.scale.threshold()
                .domain([1000, 2100, 23000])
                .range([lightgreen, lightyellow, lightcoral, lightcoral])
                // .interpolate(d3.interpolateRgb);

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

        d3.json("{% static 'data/crime_rate/crimedata_new_v2.json' %}", function (error, root) {
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
                            .style("fill-opacity", function (d) {
                                return d.parent === root ? 1 : 0;
                            })
                            .style("display", function (d) {
                                return d.parent === root ? "inline" : "none";
                            })
                            .text(function (d) {
                                if (d.children)
                                    return d.name;
                            })
                            .style("font-size", "16px")
                    ;

            // add content to circle


            text.each(function (d) {
                var yoffset = 0;
                var suburb_str = "" + d.suburb;
                var text_element = d3.select(this);
                if (suburb_str.indexOf(",") == -1) {
                    text_element.append("tspan")
                            .attr("dy", 0)
                            .attr("x", 0)
                            .style("font-size", "14px")
                            .text(function (d) {
                                return d.suburb;
                            });
                    {#                                .style("fill-opacity", function (d) {#}
                    {#                                    return d.children ? 1 : 0;#}
                    {#                                })#}
                    {#                                .style("display", function (d) {#}
                    {#                                    return d.children ? "inline" : "none";#}
                    {#                                })#}

                } else {
                    var suburb_array = suburb_str.split(",");
                    text_element.append("tspan")
                            .attr("dy", '0')
                            .attr("x", 0)
                            .attr("text-anchor", "middle")
                            .style("font-size", "12px")
                            .text(suburb_array[0]);
                    /*for (var i = 0; i < suburb_array.length && i < 3; i++) {
                        
                    }*/
                }


            }); // end of d3.json


            /*text.append("tspan")
                   .attr("dy", 0)
                  .attr("x", 0)
                    .style("font-size", "12px")
                    .text(function (d) {
                        return d.suburb;
                    });*/

            text.append("tspan")
                    .attr("dy", "1.2em") // offest by 1.2 em
                    .attr("x", 0)
                    .style("font-size", "13px")

                    .text(function (d) {
                        return d.size ? d.size : null;
                    })
                    .style("fill", function (d) {
                        return '#222222'
/*                        if (d.size < 100) return "green"
                        else if (d.size < 641) return "blue"
                        else if (d.size >= 641) return "red"*/
                    });


            /***********************************
             * Transition
             */
            var node = svg.selectAll("circle,text");

            d3.select("#data-container")
                    .style("background", color(-1))
                    .on("click", function () {
                        zoom(root);
                    });


            zoomTo([root.x, root.y, root.r * 2 + margin]);

            /**
             * @params d the destination to zoom
            */
            function zoom(d) {
                // console.log(d)
                var focus0 = focus;
                focus = d;

                var transition = d3.transition()
                        .duration(d3.event.altKey ? 7500 : 750);

                transition.tween("zoom", function () {
                    

                    var view_start = view[2]
                    var view_end = focus.r * 2 + margin

                    var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                    return function (t) {
                        zoomTo(i(t));

                        // console.log(focus)
                        if(d.depth === 2){
                            var arr = d.children
                            for(let j=0; j<arr.length; j++){
                                var child = arr[j]
                                var scale = getColorScale(view_start, view_end, child, true)
                                changeCircleColor(child, scale(i(t)[2]))
                            }
                        } else {
                            var arr = focus0.children
                            if(focus0.depth === 2){
                                for(let j=0; j<arr.length; j++){
                                    var child = arr[j]
                                    var scale = getColorScale(view_start, view_end, child, false)
                                    changeCircleColor(child, scale(i(t)[2]))
                                }
                            }
                            
                        }
                        // changeCircleColor(d, newColor(i(t)[2]))
                        // console.log(newColor(i(t)[2]))
                    };
                })
                
                ;

                        // console.log(zoomColor(d.depth))
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
            }   // end of zoom

            function getColorScale(view_start, view_end, child, flag){
                var newColor = d3.scale.linear()
                        .domain([view_start, view_end]);
                if(flag){
                    newColor.range(['white', zoomColor(child.size)])
                } else {
                    newColor.range([zoomColor(child.size), 'white'])
                }
                
                return newColor;
            }

            function changeCircleColor(d, val){
                circle.filter(function(m){
                    return m === d
                })
                .style('fill', val)
            }

            function zoomTo(v) {
                var k = diameter / v[2];    view = v;
                node.attr("transform", function (d) {
                    return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
                });
                circle.attr("r", function (d) {
                    return d.r * k ;
                });
                

            }   // end of zoomTo
        });

        d3.select(self.frameElement).style("height", diameter + "px");


}   // end of draw bubble chart

$(drawBubbleChart())
$(window).resize(drawBubbleChart)