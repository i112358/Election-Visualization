function results(year){
  var RedBlue = {
    "Republican": "red",
    "Democratic": "blue"
  }

  d3.json("results_"+year+".json", function(data) {

    //calculate winning party change colour on map
    for(var eachState in data){
      var i = 0;
      var state;
      var result = {};
      for(var eachCandidate in data[eachState]){
        state = data[eachState][eachCandidate]["abbr"];
        if(data[eachState][eachCandidate]["parties"].includes("Republican"))
          result["Republican"] = data[eachState][eachCandidate]["votes"];
        else if (data[eachState][eachCandidate]["parties"].includes("Democratic"))
          result["Democratic"] = data[eachState][eachCandidate]["votes"];
        i++;
      }
      var winner = (result["Republican"] > result["Democratic"]) ? "Republican" : "Democratic";
      d3.select("#"+state).style("fill", RedBlue[winner]);

      //add on click for each state
      d3.select("#"+state).on("click", function(){
        var margin = {top: 20, right: 30, bottom: 30, left: 40},
            width = 500 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        var modal = d3.select("#barChart").style("display","block");
        var close = d3.select("#close");

        var tooltip = modal.append("div").attr("id","tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden");

        var x = d3.scaleBand()
            .rangeRound([0, 500])
            .paddingInner([0.2]);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var chart = d3.select("#modal-content").append("svg").attr("class","chart")
            .attr("width", width)
            .attr("height", height);

        var candidate = [];
        var votes = [];
        var i = 0

        var year_state = String(year)+"_"+this.id;
        for(var ran in data[year_state]){
          candidate[i] = data[year_state][ran]["name"];
          votes[i] = data[year_state][ran]["votes"];
          i++;
        }

        x.domain(candidate);
        y.domain([0, d3.max(votes)]);

        var bar = chart.selectAll("g")
            .data(candidate)
          .enter().append("g")
            .attr("transform", function(d,i) { return "translate(" + x(candidate[i]) + ",0)"; });

        bar.append("rect")
            .attr("y", function(d,i) { return y(votes[i]); })
            .attr("height", function(d,i) { return height - y(votes[i]); })
            .attr("width", x.bandwidth())
            .on("mouseover", function(d,i){return tooltip.text(candidate[i]+", "+votes[i]).style("visibility", "visible");})
            .on("mousemove", function(d,i){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout", function(d,i){return tooltip.style("visibility", "hidden");});

        chart.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        close.on("click", function(){
          modal.select("#tooltip").remove();
          d3.select("#modal-content").select("svg").remove();
          d3.select("#barChart").style("display","none");
        });
      });
    }
  });
}
