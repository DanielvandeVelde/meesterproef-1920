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
      arrows: [
        //Arrows from to
        { from: 0, to: 0 }
      ]
    };

    console.log(dataset);
  });

function getArrows(cleanData, nodeArray) {
  let stuff = cleanData.map((item, i) => {
    //i
    if ("broader" == "id") {
      return {
        from: i,
        to: parent
      };
    }
  });

  return stuff;
}

function getNodes(cleanData) {
  let nodes = cleanData.map(node => {
    return {
      name: node.id
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
