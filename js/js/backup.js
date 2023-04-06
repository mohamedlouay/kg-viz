      // Vertical Mouse 
           /* var mouseG = svgChart.append("g")
                    .attr("class", "mouse-over-effects");

            mouseG.append("path") // this is the black vertical line to follow mouse
                        .attr("class", "mouse-line")
                        .style("stroke", "black")
                        .style("stroke-width", "1px")
                        .style("opacity", "0");    

            var lines = document.getElementsByClassName('line');

            var mousePerLine = mouseG.selectAll('.mouse-per-line')
                                    .data(sumstat)
                                    .enter()
                                    .append("g")
                                    .attr("class", "mouse-per-line");

            mousePerLine.append("circle")
                .attr("r", 7)
                .style("stroke", d=> color(d.key))
                .style("fill", "none")
                .style("stroke-width", "1px")
                .style("opacity", "0");         
                                
            mousePerLine.append("text")
                .attr("transform", "translate(10,3)");

        mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
            .attr('width', width) // can't catch mouse events on a g element
            .attr('height', height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mouseout', function() { // on mouse out hide line, circles and text
                d3.select(".mouse-line")
                .style("opacity", "0");
                d3.selectAll(".mouse-per-line circle")
                .style("opacity", "0");
                d3.selectAll(".mouse-per-line text")
                .style("opacity", "0");
            })
            .on('mouseover', function() { // on mouse in show line, circles and text
                d3.select(".mouse-line")
                .style("opacity", "1");
                d3.selectAll(".mouse-per-line circle")
                .style("opacity", "1");
                d3.selectAll(".mouse-per-line text")
                .style("opacity", "1");
            })
                /* var line = d3.line()
                    .curve(d3.curveCardinal)
                    .x(function(d) { return x(new Date(d.date)); })
                    .y(function(d) { return y(parseFloat(d.temp)); });  
                
                // console.log("line", line)
                
                 var lines = svgChart.selectAll("lines")
                .data(sumstat)
                .enter()
                .append("g");
             
                
                
               /* svgChart.append("path")
                    .datum(newdata)
                    .attr("class", "line")
                    .attr("d", function(d) { return line(d); })
                    .attr("fill", "none") //.attr("fill", d => color(d.key))
                    .style('fill-opacity', 0.1)
                    .attr("stroke", "#ed3700");

                // draw legend

                var svglegend = d3.select("svg#chart-legend-hour2");
                svglegend.append("text")
                    .attr("x", '50%')             
                    .attr("y", 20)
                    .attr("text-anchor", "middle")
                    .style("font-size", "14px")
                    .text(station);
                
                
                 let line = svgChart.selectAll('g.line') 
                .data(sumstat)
                .enter()
                .append('g')
                .attr('class', 'line')
                .attr('transform', `translate(${margin.left}, 0)`)
                
                
                line.append("path")
                .attr("fill", "none") //.attr("fill", d => color(d.key))
                .style('fill-opacity', 0.1)
                .attr("stroke-width", 1.5)
                .attr("d", function(d){
                    console.log("data", d)
                    return d3.line()
                    .curve(d3.curveCardinal)
                    .x(function(d) { return x(new Date(d.date))})
                    .y(function(d) { return y(parseFloat(d.temp)); })
                    (d.values)
                })
                */


                 
            /*      lineGroup.selectAll('circle')
            .data(d => d.values)
            .enter()
            .append('circle')
            .attr('cx', d => suffix === 'date' ? x(new Date(d.time)) : x(d.time))
            .attr('cy', d => y(parseFloat(d.value)))
            .attr('r', 3)
            .attr('stroke', d => color(d.name))
            .attr('fill', 'white')
            .on('click', d => {
                switch(suffix) {
                    case 'month': // query data per day for a particular month
                    endpoint.query(build_queryByMonth(d.time, insee)).done(function(json) { onSuccessMember3(json, 'date', d.time, insee)});
                    break;
                    
                    case 'date': // query data per hour for a particular day
                    endpoint.query(buildQuery_slices(d.time, insee)).done(function(json) { onSuccessMember3(json, 'hour', d.time, insee)});
                    break;
                }
                
            })
            
            */

            function onSuccessMember3(json, suffix, value) {
                
                let data = json.results.bindings
                let insee = arguments.length > 3 ? arguments[3] : value
                
                let margin = {left: 20, right: 20, bottom: 20, top: 80}
                let width = 600, height = 300
                
                var svgChart = d3.select("svg#line-chart-" + suffix)
                
                svgChart.selectAll('g').remove()
                
                svgChart.attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.bottom + margin.top)
                    .append("g")
                
                // data preparation for d3
                let newdata = []
                
                for (let i = 0; i < data.length; i++) {
                    
                    for (let key of ["max_temp", "avg_temp", "min_temp", ]) {
                        newdata.push({
                            time: data[i][suffix].value,
                            name: key,
                            value: data[i][key].value
                            
                        })
                    }
                }
                
                console.log("newdata", newdata)
                var sumstat = d3.nest()
                .key(function(d) { return d.name;})
                .entries(newdata)
                console.log("groupeddata", sumstat)
                
                var x;
                if (suffix == "month") {
                    // Add X axis --> it is a date format
                    x = d3.scaleLinear()
                    .domain(d3.extent(newdata, function(d) { return +d.time; }))
                } else if (suffix == "date") {
                    console.log("time = ", d3.extent(newdata, d => new Date(d.time)))
                    x = d3.scaleTime()
                    .domain(d3.extent(newdata, d => new Date(d.time)))
                }
                
                x.range([ 0, width ])
                
                svgChart.append("g")
                .attr("transform", `translate(${margin.left}, ${height})`)
                .call(d3.axisBottom(x).ticks(12));
                
                // Add Y axis
                var y = d3.scaleLinear()
                .domain(d3.extent(newdata, function(d) { return parseFloat(d.value) }))
                .range([ height, 0 ]);
                
                svgChart.append("g")
                .attr("transform", `translate(${margin.left}, 0)`)
                .call(d3.axisLeft(y));
                
                
                // color palette
                var res = sumstat.map(function(d){ return d.key }) // list of group names
                var color = d3.scaleOrdinal()
                .domain(res)
                .range(['#ff0000','#32cd32','#0000cd'])
                
                
                let lineGroup = svgChart.selectAll('g.lineGroup') 
                .data(sumstat)
                .enter()
                .append('g')
                .attr('class', 'lineGroup')
                .attr('transform', `translate(${margin.left}, 0)`)
                
                
                lineGroup.append("path")
                .attr("fill", d => color(d.key))
                .style('fill-opacity', 0.1)
                .attr("stroke", function(d){ return color(d.key) })
                .attr("stroke-width", 1.5)
                .attr("d", function(d){
                    return d3.area()
                    .curve(d3.curveCardinal)
                    .x(function(d) { return suffix === 'date' ? x(new Date(d.time)) : x(d.time); })
                    // .y(function(d) { return y(parseFloat(d.value)); }) // pour la ligne
                    .y0( height )
                    .y1(function(d) { return y(parseFloat(d.value)); })
                    (d.values)
                })   
                .on("mouseover", function (d) {                                  
                    d3.select(this)                          //on mouseover of each line, give it a nice thick stroke
                    .style("stroke-width",'3px');
                    var selectthegraphs = $('.g.lineGroup').not(this);     //select all the rest of the lines, except the one you are hovering on and drop their opacity
                    d3.selectAll(selectthegraphs)
                    .style("opacity",0.2);
                })
                .on("mouseout", function (d) {                                  
                    d3.select(this)                          //on mouseover of each line, give it a nice thick stroke
                    .style("stroke-width",'1.5px');
                    
                })
                
                // create tooltip 
                
                
                
                // show points as circles 
                
                lineGroup.selectAll('circle')
                .data(d => d.values)
                .enter()
                .append('circle')
                .attr('cx', d => suffix === 'date' ? x(new Date(d.time)) : x(d.time))
                .attr('cy', d => y(parseFloat(d.value)))
                .attr('r', 3)
                .attr('stroke', d => color(d.name))
                .attr('fill', 'white')
                .on('click', d => {
                    switch(suffix) {
                        case 'month': // query data per day for a particular month
                        endpoint.query(build_queryByMonth(d.time, insee)).done(function(json) { onSuccessMember3(json, 'date', d.time, insee)});
                        break;
                        
                        case 'date': // query data per hour for a particular day
                        endpoint.query(buildQuery_slices(d.time, insee)).done(function(json) { onSuccessMember3(json, 'hour', d.time, insee)});
                        break;
                    }
                    
                })
                .on("mouseover", function(event) { 
                    d3.select(this)                          //on mouseover of each line, give it a nice thick stroke
                    .style("stroke-width",'3px');
                    tooltip.style("display", null);
                    d3.select('#tooltip-date')
                    .text("d => d.time");
                    d3.select('#tooltip-close')
                    .text("d => d.value ");
                })
                .on("mouseout", function(event) {
                    tooltip.style("display", "none");
                })
                
                /*.on("mouseover", function (d) {                                  
                    d3.select(this)                          //on mouseover of each line, give it a nice thick stroke
                    .style("stroke-width",'3px');
                    
                    var selectthegraphs = $('.g.lineGroup').not(this);     //select all the rest of the lines, except the one you are hovering on and drop their opacity
                    d3.selectAll(selectthegraphs)
                    .style("opacity",0.2);
                })
                .on("mouseout", function (d) {                                  
                    d3.select(this)                          //on mouseover of each line, give it a nice thick stroke
                    .style("stroke-width",'1.5px');
                    
                })*/
                
                
                //var selectthegraphs = $('.thegraph').not(this);     //select all the rest of the lines, except the one you are hovering on and drop their opacity
                //d3.selectAll(selectthegraphs)
                //.style("opacity",0.2);
                
                //var getname = document.getElementById(d.name);    //use get element cause the ID names have spaces in them
                //var selectlegend = $('.legend').not(getname);    //grab all the legend items that match the line you are on, except the one you are hovering on
                
                //d3.selectAll(selectlegend)    // drop opacity on other legend names
                //.style("opacity",.2);
                
                //d3.select(getname)
                //  .attr("class", "legend-select");  //change the class on the legend name that corresponds to hovered line to be bolder        	
                //})
                ////////////////// chart legend 
                
                
                let svgLegend = d3.select('svg#chart-legend-' + suffix)
                
                
                console.log('insee', insee)
                svgLegend.append('text')
                .attr('x', 350)
                .attr('y', (d,i) => 10 + i * 17)
                .style('font-size', '11px')
                .attr("text-anchor", "middle")
                .style("fill", "#5a5a5a")
                .style("font-family", "Raleway")
                .style("font-weight", "300")
                .style("font-size", "18px")
                
                console.log("res = ", res)
                
                let legendGroup = svgLegend.selectAll('g')
                .data(res)
                .enter()
                .append('g')
                
                legendGroup.append('line')
                .style("stroke", d => color(d))
                .style("stroke-width", 3)
                .attr("x1", 0)
                .attr("y1", (d,i) => 10 + i * 15)
                .attr("x2", 30)
                .attr("y2", (d,i) => 10 + i * 15);
                
                legendGroup.append('text')
                .attr('x', 40)
                .attr('y', (d,i) => 10 + i * 17)
                .style('font-size', '11px')
                .text(d => d)
                
            }



            function markerOnClick(e)
            {
                // console.log("hi. you clicked the marker at " + e.latlng.lng + 'hhh' + e.latlng.lat );
                // endpoint.query(buildquery_closetStation(e.latlng.lng, e.latlng.lat)).done(affiche);
            }
            
            function affiche(res) /// draw pins on the map
            {
                
                var data = res.results.bindings
                let data2 = res.head.vars
                var infoStation = []
                
                for (var b in res.results.bindings) {
                    for (let i = 0; i < 7; i++) 
                    {
                        infoStation.push({
                            "key": res.head.vars[i], 
                            "value": res.results.bindings[b][res.head.vars[i]].value, 
                        })
                    }
                }
                
                columns = ['key', 'value']
                var table = d3.select("body").select(".dataviz-1").select("#station").select("#objecttable").html("")
                var tbody = table.append("tbody");
                
                var rows = tbody.selectAll("tr")
                        .data(infoStation)
                        .enter()
                        .append("tr");
                
                var cells = rows.selectAll('td')
                        .data(function (row) {
                            return columns.map(function (column) {
                                return {column: column, value: row[column]};
                            });
                        })
                        .enter()
                        .append('td')
                        .html(function (d) { 
                            if (d.value.startsWith("http"))
                            {
                                return "<a href="+ d.value +">" + d.value + "</a>"
                            }
                            else
                            {return d.value;}
                        })
                        .style("border-bottom", "1px black solid")
                        .style("padding", "15px");
                
                
                let uri_station = res.results.bindings[0][res.head.vars[0]]['value'];
                
                endpoint.query(Query_slices_byStation(uri_station)).done(function(json) { 
                    console.log("new data = ", uri_station, json)
                    
                    
                });
                
            } 


                 /*
        json: the raw data from the query
        suffix: whether the chart will show data per month, day, or hour
        value: the value that launched the query 
        insee (optional): the code INSEE of the region to which the data belongs
        */
        function onSuccessMember4(json, insee) {
        
            
           
                                            
            
            
            
                    
                    
                

            var bisectDate = d3.bisector(d => d.date).left;
            
            
                
        }