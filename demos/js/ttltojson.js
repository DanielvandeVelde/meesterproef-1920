fetch(
  "https://raw.githubusercontent.com/wallscope/strvct-students/master/vocabularies/peacetech_medium.ttl"
)
  .then(response => response.text())
  .then(text => {
    const ttl = text;

    const jsonld = ttl2jsonld.parse(ttl);
    const cleanJSON = cleanData(jsonld);

    nodeArray = getNodes(cleanJSON);
    arrowArray = getArrows(cleanJSON, nodeArray);

    const dataset = {
      nodes: nodeArray,
      arrows: arrowArray
    };

    drawD3(dataset);
  });

function getArrows(cleanData, nodeArray) {
  let arrowArray = new Array();

  cleanData.map((item, index) => {
    if (item.broader) {
      nodeArray.forEach((node, i) => {
        if (item.broader == node.id) {
          arrowArray.push({
            source: index,
            target: i
          });
        }
      });
    }
  });

  return arrowArray;
}

function getNodes(cleanData) {
  let nodes = cleanData.map(node => {
    return {
      name: node.prefLabel,
      id: node.id
    };
  });

  return nodes;
}

function cleanData(data) {
  let cleanedData = data["@graph"].map(item => {
    return {
      id: item["@id"] ? sanitizeString(item["@id"]) : false,
      prefLabel: item["skos:prefLabel"],
      broader: item["skos:broader"]
        ? sanitizeString(item["skos:broader"]["@id"])
        : false,
      hiddenLabel: item["skos:hiddenLabel"] ? item["skos:hiddenLabel"] : false,
      note: item["skos:note"] ? item["skos:note"] : false
    };
  });

  return cleanedData;
}

function sanitizeString(string) {
  string = string.match("([^/]+$)")[0]; //Grab everything behind the last "/"
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
  var w = 1000;
  var h = 600;
  var linkDistance = 200;

  var colors = d3.scale.category10();

  var svg = d3
    .select("body")
    .append("main")
    .append("svg")
    .attr({ width: w, height: h });

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
      if (d.target.x < d.source.x) {
        bbox = this.getBBox();
        rx = bbox.x + bbox.width / 2;
        ry = bbox.y + bbox.height / 2;
        return "rotate(180 " + rx + " " + ry + ")";
      } else {
        return "rotate(0)";
      }
    });
  });
}
/**
DONE:

Grabbing the .ttl file with fetch
Putting it through the ttl2jsonld parsing to get a somewhat decent JSON-LD file
Getting the data out of it that I most likely need
Broader consists of a link that links up to the parent node
stripping broader of the link and naming it like the ID of the parent node

TODO:

Put it in a format to create graphs
Create an array for links between parents and children

Big dataset has preflabels as arrays, not strings.
  - All items in array end in e.g. "@en"

QUESTIONS:

How important/frequent are things like Keywords and Notes ?
What is skos:related, siblings? Are they connected?
Is Notes normal and do they need to be kept in?
Are the Arrays for prefLabels normal, do they always end in @en?


**/
