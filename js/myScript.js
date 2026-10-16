d3.select('h1').text('Hello D3!');


// const width = 700;
// const height = 500;
// const margin = 30;

// const svg = d3.select("svg");

// const url = "https://raw.githubusercontent.com/chumo/Data2Serve/master/transition_clusters.csv";

// d3.csv(url, d3.autoType)
//     .then(function (data) {

//         console.log("Loaded data:", data);
//         console.log("Columns:", data.columns);

//         // Use the same scales for initial and final positions.
//         const x = d3.scaleLinear()
//             .domain([
//                 d3.min(data, d => Math.min(d.Xi, d.Xf)),
//                 d3.max(data, d => Math.max(d.Xi, d.Xf))
//             ])
//             .range([margin, width - margin]);

//         const y = d3.scaleLinear()
//             .domain([
//                 d3.min(data, d => Math.min(d.Yi, d.Yf)),
//                 d3.max(data, d => Math.max(d.Yi, d.Yf))
//             ])
//             .range([height - margin, margin]);

//         // Draw each point at its initial position.
//         const dots = svg.selectAll("circle")
//             .data(data)
//             .join("circle")
//             .attr("cx", d => x(d.Xi))
//             .attr("cy", d => y(d.Yi))
//             .attr("r", 3)
//             .style("fill", d => d.color);

//         // Wait briefly, then move each point to its final position.
//         dots.transition()
//             .delay(500)
//             .duration(2000)
//             .ease(d3.easeCubicInOut)
//             .attr("cx", d => x(d.Xf))
//             .attr("cy", d => y(d.Yf));

//     })
//     .catch(function (error) {
//         console.error("Could not load the CSV:", error);
//     });

const url =
    "https://raw.githubusercontent.com/chumo/Data2Serve/master/transition_clusters.csv";

const svg = d3.select("svg");

const width = 700;
const height = 500;
const margin = 30;

// Load the CSV once when the page starts.
let data;

d3.csv(url, d3.autoType)
    .then(function (loadedData) {
        data = loadedData;
        console.log("Loaded data:", data);
        console.log("Columns:", data.columns);
    })
    .catch(function (error) {
        console.error("Could not load the CSV:", error);
    });

function loadAndParse(data) {
    // Use scales to fit all initial and final positions into the SVG.
    const x = d3.scaleLinear()
        .domain([
            d3.min(data, d => Math.min(d.Xi, d.Xf)),
            d3.max(data, d => Math.max(d.Xi, d.Xf))
        ])
        .range([margin, width - margin]);

    const y = d3.scaleLinear()
        .domain([
            d3.min(data, d => Math.min(d.Yi, d.Yf)),
            d3.max(data, d => Math.max(d.Yi, d.Yf))
        ])
        .range([height - margin, margin]);

    // Draw circles at their initial positions.
    const dots = svg.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.Xi))
        .attr("cy", d => y(d.Yi))
        .attr("r", 5)
        .attr("fill", d => d.color);

    // Animate circles to their final positions.
    dots.transition()
        .delay(500)
        .duration(2000)
        .ease(d3.easeCubicInOut)
        .attr("cx", d => x(d.Xf))
        .attr("cy", d => y(d.Yf));

    // Enlarge a circle when the mouse enters it.
    dots.on("mouseover", function () {
        d3.select(this)
            .interrupt()
            .transition()
            .duration(200)
            .attr("r", 20);
    });

    // Restore its original radius when the mouse leaves.
    dots.on("mouseout", function () {
        d3.select(this)
            .interrupt()
            .transition()
            .duration(200)
            .attr("r", 5);
    });
}

// Run the function when the button is clicked.
d3.select("#loadButton")
    .on("click", function () {
        if (!data) {
            console.warn("The CSV is still loading. Please try again.");
            return;
        }
        loadAndParse(data);
    });