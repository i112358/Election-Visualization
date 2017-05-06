function displayForm(){
  var jsonForm = {};
    var form = document.getElementById("simpleForm");
    jsonForm["state"] = form.elements["state"].value;
    jsonForm["name"] = form.elements["name"].value;
    jsonForm["votes"] = form.elements["votes"].value;
    var x =  JSON.stringify(jsonForm);
    d3.select(".debug").text(x);
}
