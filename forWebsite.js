var width = 900
var height = 800


var margin  = {
    top: 40,
    bottom: 40,
    left: 60,
    right: 60
}

var viewport = {
    width: 150,
    height: 150
}
var r = 60

function finalProj(){
    var filePath="spy.csv";
    nodeDiagram(filePath);
    viz1(filePath); 
}



var testdata = function(filePath){
    d3.csv(filePath).then(function(data){
        console.log(data)
    });
}

 


var nodeDiagram = function(filePath){
    d3.csv(filePath).then(function(spy_data){
        

        // var svg = d3.select("#MC_plot").append("svg").attr("width",width - margin.left - margin.right).attr("height",height - margin.top - margin.bottom)

        // var data={
        //     "nodes":[
        //     {id: 1, name: 'Scatterplot', x: 90, y: 485, continent: "NA"}, // bottom left
        //     {id: 2, name: 'Bar Chart', x: 90, y: 94, continent: "AS"}, // top left
        //     {id: 3, name: 'Heatmap', x: 250, y: 94, continent: "AS"}, // top right
        //     {id: 4, name: 'Geometric', x: 250, y: 485, continent: "EU"}, // bottom right
        //     {id: 5, name: 'Boxplot', x: 105, y: 246, continent: "AS"}, // Middle left
        //     {id: 6, name: 'Viz Explanations', x: 345, y: 120, continent: "EU"} // Middle right
        //     ],
        //     "edges":[
        //     {'source': {'id': 1, 'name': 'Scatterplot', 'x': 80, 'y': 485},
        //     'target': {'id': 4, 'name': 'Geometric', 'x': 250, 'y': 485}},
        //     {'source': {'id': 4, 'name': 'Geometric', 'x': 250, 'y': 485},
        //     'target': {'id': 6, 'name': 'Viz Explanations', 'x': 345, 'y': 120}},
        //     {'source': {'id': 1, 'name': 'Scatterplot', 'x': 90, 'y': 485},
        //     'target': {'id': 5, 'name': 'Boxplot', 'x': 105, 'y': 246}},
        //     {'source': {'id': 2, 'name': 'Bar Chart', 'x': 90, 'y': 94},
        //     'target': {'id': 3, 'name': 'Heatmap', 'x': 249, 'y': 162}},
        //     {'source': {'id': 2, 'name': 'Bar Chart', 'x': 90, 'y': 94},
        //     'target': {'id': 5, 'name': 'Boxplot', 'x': 105, 'y': 246}},
        //     {'source': {'id': 3, 'name': 'Heatmap', 'x': 249, 'y': 162},
        //     'target': {'id': 6, 'name': 'Viz Explanations', 'x': 345, 'y': 120}}]
        //     }
        // //We will create a new array called data["links"] to store the {source id: target id} pairs of each edge
        // data["links"]=[]
        // for(var i=0;i < data.edges.length;i++){
        //     obj={}
        //     obj["source"]=data.edges[i]["source"].id
        //     obj["target"]=data.edges[i]["target"].id
        //     data.links.push(obj);
        //     }
        // console.log(data["links"])

        // var color = {
        //     'NA': 'blue',
        //     'AS': 'red',
        //     'EU': 'green'
        //     }
        // //create edges using "line" elements
        // var links = svg.selectAll("line")
        //     .data(data.links)
        //     .enter()
        //     .append("line")
        //     .attr("stroke", "none")

        // //create nodes using "circle" elements
        // var nodes = svg.selectAll("circle")
        //     .data(data.nodes)
        //     .enter()
        //     .append("circle")
        //     .style("fill", function(d, i) {
        //     return color[d.continent];
        //     });

        // var force = d3.forceSimulation(data.nodes)
        //     .force('charge', d3.forceManyBody().strength(-2500))
        //     .force("link", d3.forceLink(data.links).id(function(d){return d.id}))
        //     .force('center', d3.forceCenter(width/2, height/2))
            

        // var label = svg.selectAll("label")
        //     .data(data.nodes)
        //     .enter()
        //     .append("text")
        //     .text(function(d){return d.name})

        // //create force graph

        // force.on("tick", function() {
        //     links.attr("x1", function(d) { return d.source.x; })
        //         .attr("y1", function(d) { return d.source.y; })
        //         .attr("x2", function(d) { return d.target.x; })
        //         .attr("y2", function(d) { return d.target.y; });
        //     nodes.attr("cx", function(d) { return d.x; })
        //         .attr("cy", function(d) { return d.y; })
        //         .attr("r", r)
        //     label.attr("x", function(d){ return d.x; })
        //         .attr("y", function(d){ return d.y; })
        //         .attr('font-size', 10)
        // });
        var svg = d3.select("#MC_plot").append("svg").attr("width",width - margin.left - margin.right).attr("height",height - margin.top - margin.bottom)
        spy_dates = d3.groups(spy_data, d => d.Date )
        // create x and y scales
        var xScale = d3.scaleBand().domain(spy_dates).range([0,width - q1_padding]);
        var yScale = d3.scaleBand().domain(sortedCityArray).range([height-q1_padding,q1_padding])

        var data ={
            "nodes":[
            {id: 1, name: 'Scatterplot', x: 90, y: 485, continent: "NA", xs:  d3.scaleBand().domain(spy_dates).range([0,width - q1_padding])}, // bottom left
            {id: 2, name: 'Bar Chart', x: 90, y: 94, continent: "AS"}, // top left
            {id: 3, name: 'Heatmap', x: 250, y: 94, continent: "AS"}, // top right
            {id: 4, name: 'Geometric', x: 250, y: 485, continent: "EU"}, // bottom right
            {id: 5, name: 'Boxplot', x: 105, y: 246, continent: "AS"}, // Middle left
            {id: 6, name: 'Viz Explanations', x: 345, y: 120, continent: "EU"} // Middle right
            ],
            "edges":[
            {'source': {'id': 1, 'name': 'Scatterplot', 'x': 80, 'y': 485},
            'target': {'id': 4, 'name': 'Geometric', 'x': 250, 'y': 485}},
            {'source': {'id': 4, 'name': 'Geometric', 'x': 250, 'y': 485},
            'target': {'id': 6, 'name': 'Viz Explanations', 'x': 345, 'y': 120}},
            {'source': {'id': 1, 'name': 'Scatterplot', 'x': 90, 'y': 485},
            'target': {'id': 5, 'name': 'Boxplot', 'x': 105, 'y': 246}},
            {'source': {'id': 2, 'name': 'Bar Chart', 'x': 90, 'y': 94},
            'target': {'id': 3, 'name': 'Heatmap', 'x': 249, 'y': 162}},
            {'source': {'id': 2, 'name': 'Bar Chart', 'x': 90, 'y': 94},
            'target': {'id': 5, 'name': 'Boxplot', 'x': 105, 'y': 246}},
            {'source': {'id': 3, 'name': 'Heatmap', 'x': 249, 'y': 162},
            'target': {'id': 6, 'name': 'Viz Explanations', 'x': 345, 'y': 120}}]
            }
        //We will create a new array called data["links"] to store the {source id: target id} pairs of each edge
        data["links"]=[]
        for(var i=0;i < data.edges.length;i++){
            obj={}
            obj["source"]=data.edges[i]["source"].id
            obj["target"]=data.edges[i]["target"].id
            data.links.push(obj);
            }
        console.log(data["links"])

        var color = {
            'NA': 'blue',
            'AS': 'red',
            'EU': 'green'
            }
        //create edges using "line" elements
        var links = svg.selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .attr("stroke", "none");

        //create nodes using "circle" elements
        var nodes = svg.selectAll("circle")
            .data(data.nodes)
            .enter()
            .append("circle")
            .style("fill", function(d, i) {
                    return color[d.continent];
                    })  

        var visualizations = svg.selectAll("rect")
                .data(data.nodes)
                .enter()
                .append("rect")
                .attr("x", function(d){return d.x})
                .attr("y",function(d){return d.y})
                .attr("width",r)
                .attr("height",r)
                .attr("fill","white")
                .attr("stroke","black")

        var force = d3.forceSimulation(data.nodes)
            .force('charge', d3.forceManyBody().strength(-2500))
            .force("link", d3.forceLink(data.links).id(function(d){return d.id}))
            .force('center', d3.forceCenter(width/2, height/2))
            

        var label = svg.selectAll("label")
            .data(data.nodes)
            .enter()
            .append("text")
            .text(function(d) { return "Zoom Out"; })
            .style("font-size", "12px")
            .style("fill", "black")
            .style("pointer-events", "none")

        
        function zoomed(event) {
            var transform = event.transform;
            visualizations.attr("transform",transform)
            links.attr("transform", transform);
            nodes.attr("transform", transform);
            label.attr("transform", transform);
              }

        //create force graph
        force.on("tick", function() {
            links.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
            nodes.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr("r", r)
                
            visualizations.attr("x", function(d) { return d.x - margin.left ; } )
                        .attr("y", function(d) { return d.y - margin.top - margin.bottom/2 })
                        .attr("width", function(d) { return r*2; })
                        .attr("height", function(d){ return r*2})
            
        });
        var zoom = d3.zoom()
            .scaleExtent([0.5, 1]) // set the minimum and maximum zoom levels
            .on("zoom", zoomed);

        svg.call(zoom);

        visualizations.on("click", function(event, d) {

            // calculate the position and scale of the zoom target
            var bounds = this.getBBox();
            var dx = bounds.width;
            var dy = bounds.height;
            var x = (bounds.x + bounds.x + dx) / 2;
            var y = (bounds.y + bounds.y + dy) / 2;
            var scale = 1/Math.max(dx / width, dy / height);
            var translate = [(width - margin.left - margin.right) / 2 - scale * x, (height - margin.top )/ 2 - scale * y];
          
            // create a transition that zooms in on the target
            svg.transition()
              .duration(750)
              .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
          });
        
        

    });
}
