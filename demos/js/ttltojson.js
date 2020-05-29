fetch(
  "https://raw.githubusercontent.com/wallscope/strvct-students/master/vocabularies/peacetech_medium.ttl"
)
  .then(response => response.text())
  .then(text => {
    const ttl = text;

    const jsonld = ttl2jsonld.parse(ttl);

    console.log(jsonld);

    let array = jsonld["@graph"].map(item => {
      return {
        prefLabel: item["skos:prefLabel"],
        broader: item["skos:broader"]
          ? sanitizeString(item["skos:broader"]["@id"])
          : false,
        hiddenLabel: item["skos:hiddenLabel"] ? item["skos:hiddenLabel"] : false
      };
    });
    console.log(array);
  });

function sanitizeString(parameter) {
  let string = parameter;
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
