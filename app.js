var filePath="spy.csv";
var dark = false;
function darkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
    
  }

function finalProj(){
    mainChart(filePath);
}

function removeCurrentViz(){
    d3.select("svg").remove();
}

function mainChart(filepath){
    introduce();
    d3.csv(filePath).then(function(spy_data){
        d3.select('#button_list')
            .attr('name', 'region')
            .on("click", function (d) {
                switch (d.srcElement.id){
                    case 'scatter':
                        // removeCurrentViz();
                        scatterPlot(spy_data);
                        break;
                    case "bar":
                        removeCurrentViz();
                        barPlot(spy_data);
                        break;
                    case "heat":
                        removeCurrentViz();
                        heatMap(spy_data);
                        break;
                    case "box":
                        removeCurrentViz();
                        boxPlot(spy_data);
                        break;
                    case "geo":
                        removeCurrentViz();
                        geoPlot(spy_data);
                        break;
                    case "explain":
                        removeCurrentViz();
                        explainViz();
                        break;
                    case "viz":
                        marksNChannels();
                    default:
                        console.log("You're not supposed to see this uwu");
                }
            })
    });
}

var width = window.innerWidth
var height = window.innerHeight

var margin  = {
    top: 25,
    bottom: 25,
    left: 55,
    right: 55
}

function scatterPlot(spy_data){
    removeCurrentViz();
    // creating svg element
    var svg = d3.select("#plot")
                .append("svg")
                .attr("width",width - margin.left - margin.right).attr("height",height-margin.top-margin.bottom)
    spy_dates = d3.groups(spy_data, d => d.Year)

    spy_close = d3.selectAll(spy_data, d => d.Close)

    y_axis_domain = d3.groups(spy_data,d => Math.round(d.Close,2));
    const formatTime = d3.timeFormat("%d %B %Y");
    const parseTimeDate = d3.timeParse("%Y-%m-%d");

    var years = [];
    for (let obj of d3.groups(spy_data, d => d.Year)) {
        // console.log(parseTime(obj[0]))
      years.push(d3.timeParse("%Y")(obj[0]));
    }

    
    var groupedbyDate= d3.flatRollup(spy_data,v => d3.sum(v, d=> d.Close), x => x.Date )
    var mappedGroups = d3.map(groupedbyDate, function(d){
        return {
            date: parseTimeDate(d[0]),
            close:d[1]
        }
    })
    mappedGroups = d3.filter(mappedGroups, d => d.close < 363.07159423).slice(0,7032)
    
    var values = [];
    var i = 0;
    for (let obj of y_axis_domain) {
        if (i == 10){values.push(obj[0]); i = 0}
        i+=1;
      
    }
 

    
    var xScale = d3.scaleTime().domain([years[0],years[years.length - 3]]).range([margin.left,width - margin.right*3]);
    var yScale = d3.scaleLinear().domain([0, values[values.length - 1]]).range([height/1.19 - margin.top,margin.bottom]);
    // creating x-axis
    svg.append("g")
    .attr("transform","translate("+-3+","+ ((height/1.25 + margin.top/2))+")")
    .call(d3.axisBottom(xScale).ticks(years.length))
    // these lines edit the positioning and font of all y-axis labels
    .selectAll("text")
    .style("text-anchor","center")
    .style("font-size",'10px')

    // creating y-axis
    svg.append("g")
    .attr("transform","translate("+(margin.left )+","+ 0+")")
    .call(d3.axisLeft(yScale).ticks(values.length))
    // these lines edit the positioning and font of all y-axis labels
    .selectAll("text")
    .style("text-anchor","end")
    .style("font-size",'10px');

    svg.append("text")
    .attr("x", (width/2))
    .attr("y", 0 + (margin.left / 2))
    .attr("text-anchor","middle")
    .style("font-size","24px")
    .text("Value of SPY 1993 - 2021")
    .style("fill","white")
    
    svg.append("text")
    // .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", (width-margin.right)/2 )
    .attr("y", height-margin.top*4)
    .style("font-size","24px")
    .text("Year")
    .style("fill","white");

    svg.append("text")
        // .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", margin.left - (height/2 ))
        .attr("y", margin.top+margin.bottom*1.25)
        .attr("dx", "2.75em")
        .attr("dy", "-1.85em")
        .attr("transform", "rotate(-90)")
        .text("Price (close)")
        .style("font-size","20px")
        .style("fill","white");

    // Create the area variable: where both the area and the brush take place
    const area = svg.append('g')
        .attr("clip-path", "url(#clip)")

  // Create an area generator
    const areaGenerator = d3.area()
        .x(d => xScale(d.date))
        .y0(yScale(0))
        .y1(d => yScale(d.close))

    // Add the area
    area.append("path")
        .datum(mappedGroups)
        .attr("class", "myArea")  
        .attr("fill", "lightblue")
        .attr("fill-opacity", .5)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("d", areaGenerator )
        .attr("transform","translate(-2, 0)")
    
    // create scatterplot
    svg.selectAll("circle")
     .data(mappedGroups)
     .enter()
     .append("circle")
     .attr("cx", function(d){return xScale(d['date'])})
     .attr("cy", function(d){return yScale(d['close'])})
     .attr("r",1)
     .attr("transform","translate(-2, 0)")
     .attr("fill","white")
     .on("mouseover",function(d,i) {
        var xPos = parseFloat(d3.select(this).attr("cx"));
        var yPos = parseFloat(d3.select(this).attr("cy"));
        svg.append("rect").attr("id","tooltipR").attr("x",
        function(){
            if (xPos > height * 0.75) {
                return xPos - margin.left - margin.left/2 - 35
            }else if ((xPos < height * 0.25)){
                return xPos - margin.left - margin.left/2 - 35
            }else{
                return xPos - margin.left - margin.left/2 - 35
            }
        })
        .attr("y",yPos - margin.top - 10)
        .attr("height",30).attr("width",150).attr("rx",3).attr("ry",5).style("fill","white")
        d3.select(this).attr("fill","orange").attr("r",6)
        svg.append("text")
            .attr("id", "tooltipT2")
            .attr("x", xPos)
            .attr("y", yPos)

            .attr("text-anchor", "end")
            .attr("font-family", "comic-sans")
            .attr("font-size", "15px")
            .attr("font-weight", "bold")
            .attr("fill","black")
            // inputs value
            .text(formatTime(i.date))
            .attr("dy","-0.5em")
            .attr("dx","0.3em")
            //  shifts value to center of square
            .attr('transform',"translate(0,-15)")
            // makes sure we can't interact with the displayed value
            // e.g. highlighting with mouse pointer
            .attr("pointer-events","none")

        svg.append("text")
            .attr("id", "tooltipT")
            .attr("x", xPos)
            .attr("y", yPos)

            .attr("text-anchor", "end")
            .attr("font-family", "comic-sans")
            .attr("font-size", "15px")
            .attr("font-weight", "bold")
            .attr("fill","black")
            .attr('transform',"translate(0,-10)")
            .text("Close: " + i.close.toFixed(2))
            .attr("dy","0em")
            .attr("dx","0.3em")
        }
     )
        
    .on('mouseout', function(d) {
        // removes tooltip once mouse isn't in that section
        d3.select("#tooltip").remove();
        d3.select("#tooltipR").remove();
        d3.select("#tooltipT").remove();
        d3.select("#tooltipT2").remove();
        d3.select(this).attr("fill","white").attr("r",2)
    });

    // caption
    svg.append("text")
        .attr("x", margin.left * 1.2)
        .attr("y", margin.top*2 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("This connected scatterplot represents the increase in price of the SPY ETF since it's inception in 1993.")
        .style("fill","white")
    svg.append("text")
        .attr("x", margin.left * 1.2)
        .attr("y", margin.top*3.5 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("Each data point represents the closing price for that trading day. Hover over any data point to view that day's closing price")
        .style("fill","white")
    
        
}




function barPlot(data){
    removeCurrentViz();
    // creating svg element
    var svg = d3.select("#plot")
                .append("svg")
                .attr("width",width - margin.left - margin.right).attr("height",height-margin.top-margin.bottom)
    console.log(data)
    var map = {
        0: "Monday",
        1: "Tuesday",
        2:"Wednesday",
        3: "Thursday",
        4: "Friday"
    }
    var groupedByWeekday = d3.flatRollup(data, d => d3.sum(d, v => v.Volume),x => map[x.Weekday])
    groupedByWeekday = d3.map(groupedByWeekday, function(d){
        return{
            day:d[0],
            volume:d[1]/100000000000
        }
    })
    groupedByWeekday = groupedByWeekday.slice(1,5).concat(groupedByWeekday[0])
    var xScale = d3.scaleBand().domain(groupedByWeekday.map(function(d){return d.day})).range([margin.left,width - margin.right*3]);
    var yScale = d3.scaleLinear().domain([1, 2]).range([height/1.25 - margin.top,margin.bottom]);

    // creating x-axis
    svg.append("g")
    // .tickSize(0) removes tick marks from viz
    .attr("transform","translate("+0+","+ ((height/1.25) - margin.top )+")")
    .call(d3.axisBottom(xScale).ticks(5))//.tickSize(0))
    // this removes the "domain line" from the axis
    // .call(g => g.select(".domain").remove())
    // these lines edit the positioning and font of all y-axis labels
    .selectAll("text")
    .style("text-anchor","center")
    .style("font-size",'15px')
    // lines that edit positioning
    // .attr("dx", "0em")
    // .attr("dy", ".55em")

    // creating y-axis
    svg.append("g")
    .attr("transform","translate("+margin.left+","+ 0+")")
    .call(d3.axisLeft(yScale).ticks(10))
    // these lines edit the positioning and font of all y-axis labels
    .selectAll("text")
    .style("text-anchor","end")
    .style("font-size",'15px');

    svg.selectAll(".bar")
         .data(groupedByWeekday)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.day); })
         .attr("y", function(d) { return yScale(d.volume); })
         .attr("width", xScale.bandwidth() - 10)
         .attr("height", function(d) { return height - margin.top - margin.bottom - yScale(d.volume); })
         .attr("transform","translate(10,-132)").style("fill","gray");

    svg.append("text")
    .attr("x", (width/2))
    .attr("y", 0 + (margin.left / 2))
    .attr("text-anchor","middle")
    .style("font-size","24px")
    .text("Trading Volume Grouped By Weekday")
    .style("fill","white")
    
    svg.append("text")
    // .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", (width-margin.right)/2 )
    .attr("y", height-margin.top*4)
    .style("font-size","24px")
    .text("Weekday")
    .style("fill","white");

    svg.append("text")
        // .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", margin.left - (height/2 ))
        .attr("y", margin.top+margin.bottom*1.25)
        .attr("dx", "2.75em")
        .attr("dy", "-1.5em")
        .attr("transform", "rotate(-90)")
        .style("font-size","24px")
        .text("Volume (Trillions)")
        .style("fill","white");
    svg.append("text")
        .attr("x", margin.left * 2)
        .attr("y", margin.top*4 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("This chart shows the sum of all trading volume per weekday. Most stock trading occurs after Wednesday.")
        .style("fill","white")
    svg.append("text")
        .attr("x", margin.left * 2)
        .attr("y", margin.top*5.5 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("Consumer Product Index (CPI) Data and Federal Open Market Committee (FOMC) notes are released earlier in the week.")
        // , giving both institutional and retail traders information that allows them to add or removed shares from their current holdings.
        .style("fill","white")
            svg.append("text")
        .attr("x", margin.left * 2)
        .attr("y", margin.top*7 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("This gives both institutional and retail traders information that allows them to add or remove shares from their current holdings.")
        .style("fill","white")
    
}


function heatMap(data){
    removeCurrentViz();
    var svg = d3.select("#plot")
                .append("svg")
                .attr("width",width + margin.left + margin.right).attr("height",height+margin.top+margin.bottom)
    rolled_data = d3.flatRollup(data, d=> d3.sum(d, v => v.Volume), r=> r.Year , q => q.Week)
    
    mapped = d3.map(rolled_data, function(d){
        return {
            year: d[0],
            week_no: parseInt(d[1]),
            volume: d[2]

        }
    })
   
     
    console.log(new Set(Array.from(mapped, d=> d.week_no)))
    var xScale = d3.scaleBand().domain(new Set(Array.from(mapped, d=> d.year))).range([margin.left,width - margin.right]);
    var yScale = d3.scaleBand().domain(d3.sort(new Set(Array.from(mapped, d=> d.week_no)), function(a,b){return d3.ascending(a,b)}) ).range([height-margin.top * 4 - 20,0])
    colorScale = d3.scaleSequential().domain([0,d3.max(mapped, d => d.volume)]).interpolator(d3.interpolatePlasma/*d3.interpolateBuGn*/);
    svg.selectAll()            
            .data(mapped)
            .enter()
            .append("rect")
            .attr("x", function(d,i){return xScale(d.year)})
            .attr("y", function(d,i){return yScale(d.week_no)})
            .attr('rx',5)
            .attr("ry",5)
            .attr("width",  xScale.bandwidth() - 1)
            .attr("height", yScale.bandwidth() -1)
            .attr('transform',"translate("+0+"," + margin.bottom*2+ ")")
            .style("fill",function(d){
                return colorScale(d.volume)
            })
            .on("mouseover",function(d,i) {
                // console.log(i.volume)
                var xPos = parseFloat(d3.select(this).attr("x"));
                var yPos = parseFloat(d3.select(this).attr("y"));
                svg.append("rect").attr("id","tooltipR").attr("x",xPos - margin.left - margin.left/2)
                    .attr("y",yPos + 10)
                    .attr("height",45).attr("width",325).attr("rx",2).attr("ry",3).style("fill","black")
                svg.append("text")
                    .attr("id", "tooltip")
                    .attr("x", xPos)
                    .attr("y", yPos)
                    .attr("text-anchor", "middle")
                    .attr("font-family", "comic-sans")
                    .attr("font-size", "15px")
                    .attr("font-weight", "bold")
                    .attr("fill", function() {
                        if (i.volume > d3.max(mapped, d=>d.volume) * 0.5){
                            return "white" 
                        }else{
                            return "white"
                        }
                            })
                    .attr("dy","2.5em")
                    .attr("dx", "5.5em")
                    .text("Volume for Year " + i.year + ", Week " + i.week_no + ": " + i.volume/1000000000 + " Billion")
                    .attr("pointer-events","none");
                }
            )
                
            .on('mouseout', function(d) {
                // removes tooltip once mouse isn't in that section
                d3.select("#tooltip").remove();
                d3.select("#tooltipR").remove();
              })

    // creating x-axis
    svg.append("g")
        .attr("transform","translate("+0+","+ (height - margin.bottom * 2.75)+")")
        .call(d3.axisBottom(xScale).tickSize(0))
        .call(g => g.select(".domain").remove())
        // these lines edit the positioning and font of all y-axis labels
        .selectAll("text")
        .style("text-anchor","center")
        .style("font-size",'15px')

    // creating y-axis
    svg.append("g")
        .attr("transform","translate("+margin.left+","+ margin.bottom*2+")")
        .call(d3.axisLeft(yScale).tickSize(0))
        .call(g => g.select(".domain").remove())
        // these lines edit the positioning and font of all y-axis labels
        .selectAll("text")
        .style("text-anchor","end")
        .style("font-size",'14px');

    svg.append("text")
        .attr("x", (width/2))
        .attr("y", 0 + (margin.left / 2))
        .attr("text-anchor","middle")
        .style("font-size","24px")
        .text("SPY Trading Volume, by Week")
        .style("fill","white")
    
    svg.append("text")
    // .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", (width-margin.right)/2 )
        .attr("y", height-margin.top)
        .style("font-size","24px")
        .text("Year")
        .style("fill","white");

    svg.append("text")
        // .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", margin.left - (height/2 ))
        .attr("y", margin.top+margin.bottom*1.25)
        .attr("dx", "2.75em")
        .attr("dy", "-1.2em")
        .attr("transform", "rotate(-90)")
        .style("font-size","24px")
        .text("Week")
        .style("fill","white");
}

function boxPlot(data){
    byYear = d3.groups(data, d=>d.Year)
    var svg = d3.select("#plot")
                .append("svg")
                .attr("width",width - margin.left - margin.right).attr("height",height-margin.top-margin.bottom)

    mappedYear = d3.map(byYear, function(d){
        return{
            year:d[0],
            year_data:d[1]
        }
    })
    // console.log(mappedYear)
  // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
  const sumstat = d3.groups(data, d => d.Year) 
    .map((d) => {
        
        const values = d[1].map(g => g.Open).sort(d3.ascending);
        const q1 = d3.quantile(values, 0.25);
        const median = d3.quantile(values, 0.5);
        const q3 = d3.quantile(values, 0.75);
        const interQuantileRange = q3 - q1;
        const min = q1 - 1.5 * interQuantileRange;
        const max = q3 + 1.5 * interQuantileRange;
        return {key: d[0], value: {q1, median, q3, interQuantileRange, min, max}};
  });
    
    dateArray = Array.from(mappedYear, d=>d.year)
    
    // Show the X scale
    const x = d3.scaleBand()
        .range([margin.left, width - margin.right - margin.left])
        .domain(dateArray)
        .paddingInner(1)
        .paddingOuter(0.5);
        // svg.append("g")
        // .attr("transform", "translate(0," + height + ")")
        // .call(d3.axisBottom(x));

    // Show the Y scale
    const y = d3.scaleLinear()
        .domain([0, 500])
        .range([height/1.18 - margin.top,margin.bottom]);
        svg.append("g")
        .attr("transform","translate("+margin.left+","+ 0+")")
        .call(d3.axisLeft(y))
        // these lines edit the positioning and font of all y-axis labels
        .selectAll("text")
        .style("text-anchor","end")
        .style("font-size",'15px');
        
    svg.append("g")
        // .tickSize(0) removes tick marks from viz
        .attr("transform","translate("+0+","+ ((height/1.25) + margin.top/2)+")")
        .call(d3.axisBottom(x).ticks(5))//.tickSize(0))
        // this removes the "domain line" from the axis
        // .call(g => g.select(".domain").remove())
        // these lines edit the positioning and font of all y-axis labels
        .selectAll("text")
        .style("text-anchor","center")
        .style("font-size",'15px')
        // lines that edit positioning
        // .attr("dx", "0em")
        // .attr("dy", ".55em")
        // svg.append("g").call(d3.axisLeft(y));

    // Show the main vertical line
    svg
        .selectAll("vertLines")
        .data(sumstat)
        .join("line")
        .attr("x1", d => x(d.key))
        .attr("x2", d => x(d.key))
        .attr("y1", d => y(d.value.min))
        .attr("y2", d => y(d.value.max))
        .attr("stroke", "steelblue")
        .style("stroke-width", 1);

    // Rectangle for the main box
    const boxWidth = 25;
    svg
        .selectAll("boxes")
        .data(sumstat)
        .join("rect")
        .attr("x", d => x(d.key) - boxWidth / 2)
        .attr("y", d => y(d.value.q3))
        .attr("height", d => y(d.value.q1) - y(d.value.q3))
        .attr("width", boxWidth)
        .attr("stroke", "white")
        .style("fill", "steelblue")
        .on('mouseover', function(d,i){
            console.log(i)
            var xPos = parseFloat(d3.select(this).attr("x"));
            var yPos = parseFloat(d3.select(this).attr("y"));
            svg.append("rect").attr("id","tooltipR").attr("x",function(){
                if (width - xPos < margin.left*5) {
                    console.log('here!')
                    return (xPos - margin.right*3.5 + margin.left/6)
                }else{
                    return (xPos +  margin.left/2)
                }
            })
                .attr("y",yPos - 50)
                .attr("height",45).attr("width",150).attr("rx",2).attr("ry",3).style("fill","lightgray");

            svg.append("text")
                .attr("id", "tooltip1")
                .attr("x",function(){
                    if (width - xPos < margin.left*5) {
                        console.log('here!')
                        return (xPos - margin.right*3.5 )
                    }else{
                        return (xPos + margin.left/2.5)
                    }
                })
                .attr("y", yPos - 65)
                .attr("text-anchor", "middle")
                .attr("font-family", "comic-sans")
                .attr("font-size", "15px")
                .attr("font-weight", "bold")
                .attr("fill", "black")
                .attr("dy","2.5em")
                .attr("dx", "5.5em")
                .text("Year " + i.key)
                .attr("pointer-events","none");

            svg.append("text")
                .attr("id", "tooltip")
                .attr("x",function(){
                    if (width - xPos < margin.left*5) {
                        console.log('here!')
                        return (xPos - margin.right*3.5)
                    }else{
                        return (xPos + margin.left/2.5)
                    }
                })
                .attr("y", yPos - 50)
                .attr("text-anchor", "middle")
                .attr("font-family", "comic-sans")
                .attr("font-size", "15px")
                .attr("font-weight", "bold")
                .attr("fill", "black")
                .attr("dy","2.5em")
                .attr("dx", "5.5em")
                .text(" Low: $" + Math.round(i.value.min) + " High: $" + Math.round(i.value.max) )
                .attr("pointer-events","none");
            
        })
        .on('mouseout', function(d) {
            // removes tooltip once mouse isn't in that section
            d3.select("#tooltip").remove();
            d3.select("#tooltip1").remove();
            d3.select("#tooltipR").remove();

          })

    // Show the median
    svg
    .selectAll("medianLines")
    .data(sumstat)
    .join("line")
    .attr("x1", d => x(d.key) - boxWidth / 2)
    .attr("x2", d => x(d.key) + boxWidth / 2)
    .attr("y1", d => y(d.value.median))
    .attr("y2", d => y(d.value.median))
    .attr("stroke", "black")
    .style("stroke-width", 1);

    svg.append("text")
        .attr("x", (width/2))
        .attr("y", 0 + (margin.left / 2))
        .attr("text-anchor","middle")
        .style("font-size","24px")
        .text("Yearly SPY Range")
        .style("fill","white")
    
    svg.append("text")
    // .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", (width-margin.right)/2 )
        .attr("y", height-margin.top*3)
        .style("font-size","24px")
        .text("Year")
        .style("fill","white");

    svg.append("text")
        // .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", margin.left - (height/2 ))
        .attr("y", margin.top+margin.bottom*1.25)
        .attr("dx", "2.75em")
        .attr("dy", "-2.0em")
        .attr("transform", "rotate(-90)")
        .text("Price")
        .style("font-size","20px")
        .style("fill","white")
    svg.append("text")
        .attr("x", margin.left * 2)
        .attr("y", margin.top * 4 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("This is a representation of the SPY's price range for any given year.")
        .style("fill","white")
    // Note how the price was very stagnant until 2002's low was broken in 2009.
    svg.append("text")
        .attr("x", margin.left * 2)
        .attr("y", margin.top * 5.5 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("After 2009 tested the low that was set in 2002, the price kept pushing higher, breaking the high made in 2008.")
        .style("fill","white")
    svg.append("text")
        .attr("x", margin.left * 2)
        .attr("y", margin.top * 7 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("This was due to the value of most companies within the SPY increasing rapidly during this time.")
        .style("fill","white")

}

// function geoPlot(data){
//     var svg = d3.select("#plot")
//         .append("svg").attr("width", width).
//         attr("height", height);

//     const projection = d3.geoAlbersUsa()
//         .scale(1500)
//         .translate([width/2, height/2]) //chain translate and scale
//     const pathgeo1 = null
    
//     const statesmap = d3.json("us-states.json");
//     statesmap.then(function (map){
//         console.log(map);
//         var path = d3.geoPath()
//         .projection(projection);
//         svg.selectAll("path").attr("class","uspath").data(map.features).enter().append('path')
//         .attr("d", path)
//         .attr("fill","gray");
//     });
//     return console.log("This is a geo plot");
// }

function introduce(){
    removeCurrentViz();
    var svg = d3.select("#plot")
                .append("svg")
                .attr("width",width - margin.left - margin.right).attr("height",height-margin.top-margin.bottom)
    svg.append("text")
        .attr("x", (width/2))
        .attr("y", margin.top + (margin.left / 2))
        .attr("text-anchor","middle")
        .style("font-size","24px")
        .text("Welcome to my Visual Analysis of the SPY! I will be exploring various aspects of the S&P 500 E.T.F., better known as the SPY")
        .style("fill","white")

    svg.append("text")
        .attr("x", (width/2))
        .attr("y", margin.top + (margin.left / 2))
        .attr("dy","2em")
        .attr("text-anchor","middle")
        .style("font-size","24px")
        .text("Select a visualization above to get started")
        .style("fill","white")
}


function explainViz(){
    removeCurrentViz();
    var svg = d3.select("#plot")
                .append("svg")
                .attr("width",width - margin.left - margin.right).attr("height",height-margin.top-margin.bottom)
    svg.append("text")
        .attr("x", (width/2))
        .attr("y", margin.top + (margin.left / 2))
        .attr("text-anchor","middle")
        .style("font-size","24px")
        .text("These are the changes I've made since my Project Proposal: ")
        .style("fill","white")
    svg.append("text")
        .attr("x", (width/2))
        .attr("y", margin.top*2.5 + (margin.left / 2))
        .attr("text-anchor","middle")
        .style("font-size","24px")
        .text("Buttons: The purpose of my buttons now is to change between visualizations.")
        .style("fill","white")
    svg.append("text")
        .attr("x", (width/2))
        .attr("y", margin.top*4.5 + (margin.left / 2))
        .attr("text-anchor","middle")
        .style("font-size","24px")
        .text("Box Plot Viz: I had proposed to create boxplots of daily ranges, but given the data size and how the stock price varies, it made more sense to plot yearly ranges.")
        .style("fill","white")

    svg.append("text")
        .attr("x", (width/2))
        .attr("y", margin.top*6.5 + (margin.left / 2))
        .attr("text-anchor","middle")
        .style("font-size","24px")
        .text("Tooltips: I created tooltips for both the Heatmap and Scatter plot.")
        .style("fill","white")
}   
function marksNChannels(){
    var svg = d3.select("#plot")
                .append("svg")
                .attr("width",width - margin.left - margin.right).attr("height",height-margin.top-margin.bottom)
    removeCurrentViz();
    svg.append("text")
        .attr("x", margin.left * 1.2)
        .attr("y", margin.top*2 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("Scatterplot: Marks - Points, Line Chart, Area. ")
        .style("fill","white")
    svg.append("text")
        .attr("x", margin.left * 2)
        .attr("y", margin.top*3.5 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("Color Choice - I tried to use the contrast dark mode provides in order to use colors like light blue for the area, which are easier on the eyes given a dark background.")
        .style("fill","white")

    svg.append("text")
        .attr("x", margin.left * 2)
        .attr("y", margin.top*5 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("Channels - I used both vertical and horizontal positioning, as well as color, in order to control the appearance of the marks.")
        .style("fill","white")

    svg.append("text")
        .attr("x", margin.left * 1.2)
        .attr("y", margin.top*6.5 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("Bar Chart: Marks - Lines. ")
        .style("fill","white")
    svg.append("text")
        .attr("x", margin.left * 2)
        .attr("y", margin.top*8 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("Color Choice - I used gray for the bar color, given a darker background it is easy on the eyes.")
        .style("fill","white")

    svg.append("text")
        .attr("x", margin.left * 2)
        .attr("y", margin.top*9.5 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("Channels - I size as well as color, in order to control the appearance of marks.")
        .style("fill","white")

    svg.append("text")
        .attr("x", margin.left * 1.2)
        .attr("y", margin.top*11 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("Heat Map: Marks - Points (technically) ")
        .style("fill","white")
    svg.append("text")
        .attr("x", margin.left * 2)
        .attr("y", margin.top*12.5 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("Color Choice - I used d3.interpolatePlasma for the color scheme. I thought these colors were best given that values that are less 'populated' are darker")
        .style("fill","white")
    svg.append("text")
        .attr("x", margin.left * 2)
        .attr("y", margin.top*13.5 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("which makes the brighter colors stand out immediately as important")
        .style("fill","white")
    svg.append("text")
        .attr("x", margin.left * 2)
        .attr("y", margin.top*15 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("Channels - I used size as well as color, in order to control the appearance of these marks.")
        .style("fill","white")

    svg.append("text")
        .attr("x", margin.left * 2)
        .attr("y", margin.top*16.5 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("Description - This is a heatmap of trading volume per-week for every year since the SPY's inception.")
        .style("fill","white")
    svg.append("text")
        .attr("x", margin.left * 2)
        .attr("y", margin.top*18 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("Some of the largest trading volume came during late 2008 - early 2009.  Hover over any shape to view trading volume that week.")
        .style("fill","white")

    svg.append("text")
        .attr("x", margin.left * 1.2)
        .attr("y", margin.top*19.5 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("Box Plot: Marks - Lines and Areas used to create my boxplots ")
        .style("fill","white")
    svg.append("text")
        .attr("x", margin.left * 2)
        .attr("y", margin.top*21 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("Color Scheme - I used steelblue for the whisker lines and box plot, and black for the median lines for each plot")
        .style("fill","white")

    svg.append("text")
        .attr("x", margin.left * 2)
        .attr("y", margin.top*22.5 + (margin.left / 2))
        .attr("text-anchor","right")
        .style("font-size","24px")
        .text("Channels - I use size, color, and horizontal/vertical positioning in order to control the appearance of these marks.")
        .style("fill","white")

    
}