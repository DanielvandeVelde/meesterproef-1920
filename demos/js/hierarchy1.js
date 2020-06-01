fetchDataset();

function fetchDataset() {
  fetch(
    "https://cors-anywhere.herokuapp.com/http://dev.verinote.net:4000/app/getentities"
  )
    .then(response => response.json())
    .then(data => {
      const cleanJSON = cleanData(data);
      nodeArray = getNodes(cleanJSON);
      arrowArray = getArrows(cleanJSON, nodeArray);

      const dataset = {
        nodes: nodeArray,
        arrows: arrowArray
      };

      drawD3(dataset);
    });
}

function getArrows(cleanData, nodeArray) {
  let arrowArray = new Array();

  cleanData.map((item, index) => {
    nodeArray.forEach((node, i) => {
      if (item.parent == node.id) {
        arrowArray.push({
          source: index,
          target: i
        });
      }
    });
  });

  return arrowArray;
}

function getNodes(cleanData) {
  let nodes = new Object();

  nodes = cleanData.map(node => {
    return {
      name: node.name ? node.name : node.id,
      id: node.id,
      note: node.note ? node.note : false
    };
  });

  return nodes;
}

function cleanData(data) {
  let cleanedData = data.map(item => {
    return {
      name: item.name ? item.name : false,
      id: item.uri ? sanitizeString(item.uri) : false,
      parent: item.parentURI ? sanitizeString(item.parentURI) : false,
      note: item.note ? item.note : false,
      keywords: item.keywords ? item.keywords : false
    };
  });

  return cleanedData;
}

function sanitizeString(string) {
  string = string.match("([^/]+$)") ? string.match("([^/]+$)")[0] : string; //Grab everything behind the last "/"
  string = string.replace(/_/g, " "); //Replace "_" with space
  string = string.replace(/-/g, " "); //Replace "-" with space
  string = string //Capitalize each word
    .toLowerCase()
    .split(" ")
    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");

  return string;
}

function drawD3(dataset) {
  var w = 1920;
  var h = 1000;
  var linkDistance = 200;

  var colors = d3.scale.category10();

  var div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var svg = d3
    .select("main")
    .append("svg")
    .attr({ width: w, height: h })
    .call(
      d3.behavior.zoom().on("zoom", function() {
        svg.attr(
          "transform",
          "translate(" +
            d3.event.translate +
            ")" +
            " scale(" +
            d3.event.scale +
            ")"
        );
      })
    )
    .append("g");

  var force = d3.layout
    .force()
    .nodes(dataset.nodes)
    .links(dataset.arrows)
    .size([w, h])
    .linkDistance([linkDistance])
    .charge([-500])
    .theta(0.1)
    .gravity(0.05)
    .start();

  var arrows = svg
    .selectAll("line")
    .data(dataset.arrows)
    .enter()
    .append("line")
    .attr("id", function(d, i) {
      return "edge" + i;
    })
    .attr("marker-end", "url(#arrowhead)")
    .style("stroke", "#ccc")
    .style("pointer-events", "none");

  var nodes = svg
    .selectAll("circle")
    .data(dataset.nodes)
    .enter()
    .append("circle")
    .attr({ r: 15 })
    .style("fill", function(d, i) {
      return colors(i);
    })
    .on("mouseover", function(d) {
      if (d.note) {
        div
          .transition()
          .duration(200)
          .style("opacity", 0.9);
        div
          .html(d.note)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      }
    })
    .on("mouseout", function(d) {
      div
        .transition()
        .duration(500)
        .style("opacity", 0);
    })
    .call(force.drag);

  var nodelabels = svg
    .selectAll(".nodelabel")
    .data(dataset.nodes)
    .enter()
    .append("text")
    .attr({
      x: function(d) {
        return d.x;
      },
      y: function(d) {
        return d.y;
      },
      class: "nodelabel",
      stroke: "black"
    })
    .text(function(d) {
      return d.name;
    });

  var edgepaths = svg
    .selectAll(".edgepath")
    .data(dataset.arrows)
    .enter()
    .append("path")
    .attr({
      d: function(d) {
        return (
          "M " +
          d.source.x +
          " " +
          d.source.y +
          " L " +
          d.target.x +
          " " +
          d.target.y
        );
      },
      class: "edgepath",
      "fill-opacity": 0,
      "stroke-opacity": 0,
      fill: "blue",
      stroke: "red",
      id: function(d, i) {
        return "edgepath" + i;
      }
    })
    .style("pointer-events", "none");

  var edgelabels = svg
    .selectAll(".edgelabel")
    .data(dataset.arrows)
    .enter()
    .append("text")
    .style("pointer-events", "none")
    .attr({
      class: "edgelabel",
      id: function(d, i) {
        return "edgelabel" + i;
      },
      dx: 80,
      dy: 0,
      "font-size": 10,
      fill: "#aaa"
    });

  edgelabels
    .append("textPath")
    .attr("xlink:href", function(d, i) {
      return "#edgepath" + i;
    })
    .style("pointer-events", "none")
    .text(function(d, i) {
      return "label " + i;
    });

  svg
    .append("defs")
    .append("marker")
    .attr({
      id: "arrowhead",
      viewBox: "-0 -5 10 10",
      refX: 25,
      refY: 0,
      //'markerUnits':'strokeWidth',
      orient: "auto",
      markerWidth: 10,
      markerHeight: 10,
      xoverflow: "visible"
    })
    .append("svg:path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5")
    .attr("fill", "#ccc")
    .attr("stroke", "#ccc");

  force.on("tick", function() {
    arrows.attr({
      x1: function(d) {
        return d.source.x;
      },
      y1: function(d) {
        return d.source.y;
      },
      x2: function(d) {
        return d.target.x;
      },
      y2: function(d) {
        return d.target.y;
      }
    });

    nodes.attr({
      cx: function(d) {
        return d.x;
      },
      cy: function(d) {
        return d.y;
      }
    });

    nodelabels
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y;
      });

    edgepaths.attr("d", function(d) {
      var path =
        "M " +
        d.source.x +
        " " +
        d.source.y +
        " L " +
        d.target.x +
        " " +
        d.target.y;
      return path;
    });

    edgelabels.attr("transform", function(d, i) {
      var item = document.getElementsByClassName("edgelabel")[i];
      if (d.target.x < d.source.x && item) {
        var bbox = item.getBBox();
        rx = bbox.x + bbox.width / 2;
        ry = bbox.y + bbox.height / 2;
        return "rotate(180 " + rx + " " + ry + ")";
      } else {
        return "rotate(0)";
      }
    });
  });
}
