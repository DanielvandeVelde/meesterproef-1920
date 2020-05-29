fetch(
  "https://raw.githubusercontent.com/wallscope/strvct-students/master/vocabularies/peacetech_medium.ttl"
)
  .then(response => response.text())
  .then(text => {
    const ttl = text;

    const jsonld = ttl2jsonld.parse(ttl);

    let array = new Array();
    array = jsonld["@graph"].map(item => {
      return {
        prefLabel: item["skos:prefLabel"],
        broader: item["skos:broader"] ? item["skos:broader"] : false,
        hiddenLabel: item["skos:hiddenLabel"] ? item["skos:hiddenLabel"] : false
      };
    });

    console.log(array);
  });
