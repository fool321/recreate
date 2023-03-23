// Set up the SVG container
const svg = d3.select("#chart")
.append("svg")
.attr("width", 1200)
.attr("height", 700);

// Set up the scales
// const xScale = d3.scaleTime();
const xScale = d3.scaleTime().range([180, 1050]);
const yScale = d3.scaleLinear().range([600, 80]);

// Set up the axes

// Load the data
d3.csv("data/trade_sg.csv").then(function (data) {
  // Filter the data to select a specific country
  const country = "Singapore";
  const filteredData = data.filter(function (d) {
    return d["Reporter"] === country;
  });

  const importValues = filteredData
    .filter(function (d) {
      return d["Trade Flow"] === "Import";
    })
    .map(function (d) {
      return +d["Trade Value (US$)"];
    });
  const exportValues = filteredData
    .filter(function (d) {
      return d["Trade Flow"] === "Export";
    })
    .map(function (d) {
      return +d["Trade Value (US$)"];
    });

  // Update the domains of the scales
  const firstYear = new Date("1989-01-01");
  const lastYear = new Date("2021-01-01");
  xScale.domain([firstYear, lastYear]);
  yScale.domain([0, d3.max(importValues.concat(exportValues))]);
  console.log(xScale.domain());
  console.log(yScale.domain());
  const xAxis = d3.axisBottom(xScale).ticks(d3.timeYear.every(1));
  const yAxis = d3.axisRight(yScale).tickFormat(d3.format("$,d"));

  // Add the axes to the SVG container
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0, 600)")
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(1050, 0)")
    .call(yAxis);

  // Define the line function
  const importline = d3
    .line()
    .x(function (d, i) {
      console.log(d);
      return xScale(new Date(d.Year, 0, 1));
    }) // x value
    .y(function (d) {
      return yScale(+d["Trade Value (US$)"]);
    }); // y value

  // Create a path element for the line chart
  svg
    .append("path")
    .datum(
      filteredData.filter(function (d) {
        return d["Trade Flow"] === "Import";
      })
    ) // bind data to the path
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("class", "line export-line")
    .attr("d", importline); // use the line function to generate the path data

  svg
    .append("path")
    .datum(
      filteredData.filter(function (d) {
        return d["Trade Flow"] === "Export";
      })
    ) // bind data to the path
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("class", "line import-line")
    .attr("d", importline); // use the line function to generate the path data

  // Add a title
  svg
    .append("text")
    .attr("x", 600)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .text("Import and Export Values for " + country);

  // Add the legend
  svg
    .append("rect")
    .attr("class", "import-legend")
    .attr("x", 550)
    .attr("y", 100)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "red")
    .on("mouseover", function () {
      d3.selectAll(".import-line").classed("active", true);
      d3.selectAll(".export-line").classed("inactive", true);
    })
    .on("mouseout", function () {
      d3.selectAll(".import-line").classed("active", false);
      d3.selectAll(".export-line").classed("inactive", false);
    });

  svg
    .append("text")
    .attr("class", "import-legend-text legend-text")
    .attr("x", 580)
    .attr("y", 115)
    .text("Imports")
    .on("mouseover", function () {
      d3.selectAll(".import-line").classed("active", true);
      d3.selectAll(".export-line").classed("inactive", true);
    })
    .on("mouseout", function () {
      d3.selectAll(".import-line").classed("active", false);
      d3.selectAll(".export-line").classed("inactive", false);
    });

  svg
    .append("rect")
    .attr("class", "export-legend")
    .attr("x", 550)
    .attr("y", 150)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "steelblue")
    .on("mouseover", function () {
      d3.selectAll(".export-line").classed("active", true);
      d3.selectAll(".import-line").classed("inactive", true);
    })
    .on("mouseout", function () {
      d3.selectAll(".export-line").classed("active", false);
      d3.selectAll(".import-line").classed("inactive", false);
    });

  svg
    .append("text")
    .attr("class", "export-legend-text legend-text")
    .attr("x", 580)
    .attr("y", 165)
    .text("Exports")
    .on("mouseover", function () {
      d3.selectAll(".export-line").classed("active", true);
      d3.selectAll(".import-line").classed("inactive", true);
    })
    .on("mouseout", function () {
      d3.selectAll(".export-line").classed("active", false);
      d3.selectAll(".import-line").classed("inactive", false);
    });

  // Add some interactivity
  d3.selectAll(".line")
    .on("mouseover", function () {
      d3.select(this).classed("active", true);
    })
    .on("mouseout", function () {
      d3.select(this).classed("active", false);
    });

  d3.selectAll(".import-line").classed("active", true);
});
