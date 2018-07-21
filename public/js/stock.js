let symbol = $('#stock-symbol').html();
$('#btn-addTran').on('click', function () {
    let a = document.createElement('a');
    a.href = `/addTran/${symbol}`;
    a.click();
});
function largeNumFormat(num) {
    if (num >= 1000000000) { return (num / 1000000000).toFixed(1) + "b"; }
    else if (num >= 1000000) { return (num / 1000000).toFixed(1) + "m"; }
    else if (num >= 1000) { return (num / 1000).toFixed(1) + "k"; }
    else { return num.toFixed(1); }
};

// data storage variables
let historical;
let filteredHistorical;
let current;
let coordsText, timeAnnotation, ohlcAnnotation;
// Variables for stock chart
// var parseTime = d3.timeParse("%Y-%m-%dT");
var margin = { top: 20, right: 40, bottom: 30, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var aspect = width / height;


//Get data by Axios
axios.get(`/api/stock/${symbol}`).then(function (results) {
    historical = results.data.Historical;
    current = results.data.Current;

    historical.forEach(function (dailyOhlc) {
        dailyOhlc.date = d3.isoParse(dailyOhlc.date);
    });
    historical = historical.sort(function (a, b) {
        return d3.ascending(a.date, b.date);
    });
    console.log(historical);
    console.log(current);
    //Render the price info board
    $('#stock-name').html(current.longName);
    $('#current-price').html(`${current.currencySymbol} ${current.regularMarketPrice}`);
    let color = current.regularMarketChange > 0 ? "green" :
        (current.regularMarketChange < 0 ? "red" : "#eee");
    $('#price-change').html(current.regularMarketChange.toFixed(3))
        .css("color", color);
    $('#price-percentage-change').html((current.regularMarketChangePercent * 100).toFixed(2) + "%")
        .css("color", color);

    $('#open-price').html(`${current.currencySymbol} ${current.regularMarketOpen}`);
    $('#high-price').html(`${current.currencySymbol} ${current.regularMarketDayHigh}`);
    $('#low-price').html(`${current.currencySymbol} ${current.regularMarketDayLow}`);
    $('#mkt-cap').html(`${current.currencySymbol} ${largeNumFormat(current.marketCap)}`);
    $('#volume').html(`${current.currencySymbol} ${largeNumFormat(current.regularMarketVolume
    )}`);
    $('#previous-close-price').html(`${current.currencySymbol} ${current.regularMarketPreviousClose}`);

    //Plot stock chart
    filteredHistorical = historical;
    draw(filteredHistorical, width, height);
    $('.chart-panel').css("display", "block");
    $(window).trigger("resize");
})

function draw(data, width, height) {
    $("#chart-area").empty();

    var x = techan.scale.financetime()
        .range([0, width]);
    var y = d3.scaleLinear()
        .range([height, 0]);

    var candlestick = techan.plot.candlestick()
        .xScale(x)
        .yScale(y);
    var accessor = candlestick.accessor();
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);
    var xTopAxis = d3.axisTop(x);
    var yRightAxis = d3.axisRight(y);

    var svg = d3.select("#chart-area").append("svg")
        .attr("class", "chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("g")
        .attr("class", "candlestick");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")");

    svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

    ohlcAnnotation = techan.plot.axisannotation()
        .axis(yAxis)
        .orient('left')
        .format(d3.format(',.2f'));

    var ohlcRightAnnotation = techan.plot.axisannotation()
        .axis(yRightAxis)
        .orient('right')
        .translate([width, 0]);

    timeAnnotation = techan.plot.axisannotation()
        .axis(xAxis)
        .orient('bottom')
        .format(d3.timeFormat('%Y-%m-%d'))
        .width(65)
        .translate([0, height]);

    var timeTopAnnotation = techan.plot.axisannotation()
        .axis(xTopAxis)
        .orient('top');
    var crosshair = techan.plot.crosshair()
        .xScale(x)
        .yScale(y)
        .xAnnotation([timeAnnotation, timeTopAnnotation])
        .yAnnotation([ohlcAnnotation, ohlcRightAnnotation])
        .on("enter", enter)
        .on("out", out)
        .on("move", move);

    x.domain(data.map(candlestick.accessor().d));
    y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());

    svg.selectAll("g.candlestick").datum(data).call(candlestick);
    svg.selectAll("g.x.axis").call(xAxis);
    svg.selectAll("g.y.axis").call(yAxis);
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yRightAxis);
    svg.append("g")
        .attr("class", "x axis")
        .call(xTopAxis);

    svg.append("g")
        .attr("class", "y annotation left")
        .datum([{value: -1}, {value: -1}, {value: -1}, {value:-1}]) // 74 should not be rendered
        .call(ohlcAnnotation);

    svg.append("g")
        .attr("class", "x annotation bottom")
        .datum([{value: x.domain()[0]}])
        .call(timeAnnotation);

    svg.append("g")
        .attr("class", "y annotation right")
        .datum([{value: 0}, {value:0}])
        .call(ohlcRightAnnotation);

    svg.append("g")
        .attr("class", "x annotation top")
        .datum([{value: x.domain()[0]}])
        .call(timeTopAnnotation);
    coordsText = svg.append('text')
        .style("text-anchor", "end")
        .attr("class", "coords")
        .attr("x", width - 5)
        .attr("y", 15);

    svg.append('g')
        .attr("class", "crosshair")
        .call(crosshair)
        .datum({ x: 0 ,y: 0 })
        .each(function (d) { move(d); }); // Display the current data
}
function drawEmpty() {
    d3.select("#chart-area").append("svg")
        .attr("class", "chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
}

$(window).on("resize", function () {
    let targetWidth = $('.chart').parent().width();
    width = targetWidth > 960 ?
        880 : (targetWidth - margin.left - margin.right);
    height = targetWidth > 960 ?
        450 : Math.round((targetWidth - margin.left - margin.right) / aspect);
    draw(filteredHistorical, width, height);
    // $('.chart').attr("width", (targetWidth > width) ? width : targetWidth)
    // .attr("height", (targetWidth > width) ? height : Math.round(targetWidth / aspect));
});

$('.btn-chart-period').on("click", function () {
    let targetTime;
    switch ($(event.target).html()) {
        case "1Y":
            targetTime = moment().subtract(1, "y");
            break;
        case "6M":
            targetTime = moment().subtract(6, 'M');
            break;
        case "3M":
            targetTime = moment().subtract(3, 'M');
            break;
        default:
            targetTime = moment().subtract(3, "y");
    }
    filteredHistorical = historical.filter(function (dailyOhlc) {
        return targetTime.isBefore(dailyOhlc.date);
    });
    draw(filteredHistorical, width, height);
});

function enter() {
    coordsText.style("display", "inline");
}

function out() {
    coordsText.style("display", "none");
}

function move(coords) {
    coordsText.text(
        timeAnnotation.format()(coords.x) + ", " + ohlcAnnotation.format()(coords.y)
    );
}