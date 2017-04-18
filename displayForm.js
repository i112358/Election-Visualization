function displayForm(){
  d3.select("form").on("submit", function(){
    var jsonForm = {};
    var form = d3.select("#simpleForm");
    jsonForm["state"] = form["state"].value;
    jsonForm["name"] = form["name"].value;
    jsonForm["votes"] = form["votes"].value;
    var x = JSON.stringify(jsonForm);
    return d3.select("pre").text(x);
  });
}
