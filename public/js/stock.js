let symbol = $('#stock-symbol').html();
$('#btn-addTran').on('click',function(){
    let a = document.createElement('a');
    a.href = `/addTran/${symbol}`;
    a.click();
});
function largeNumFormat(num){
    if(num>=1000000000){return (num/1000000000).toFixed(1)+"b";}
    else if(num>=1000000){return (num/1000000).toFixed(1)+"m";}
    else if(num>=1000){return (num/1000).toFixed(1)+"k";}
    else {return num.toFixed(1);}
};

// Variables for stock chart
// var parseTime = d3.timeParse("%Y-%m-%dT");
var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var aspect = width / height;

var x = techan.scale.financetime()
    .range([0, width]);
var y = d3.scaleLinear()
    .range([height, 0]);

var candlestick = techan.plot.candlestick()
    .xScale(x)
    .yScale(y);
var accessor = candlestick.accessor();

// var xAxis = d3.axisBottom()
//     .scale(x);
// var yAxis = d3.axisLeft()
//     .scale(y);
var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y)

var svg = d3.select("#chart-area").append("svg")
    .attr("class","chart")
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

//Get data by Axios
axios.get(`/api/stock/${symbol}`).then(function(results){
    let historical = results.data.Historical;
    let current = results.data.Current;
    
    historical.forEach(function(dailyOhlc){
        dailyOhlc.date = d3.isoParse(dailyOhlc.date);
    });
    historical = historical.sort(function(a, b) { 
        return d3.ascending(a.date, b.date); 
      });
    console.log(historical);
    console.log(current);
    //Render the price info board
    $('#stock-name').html(current.longName);
    $('#current-price').html(`${current.currencySymbol} ${current.regularMarketPrice}`);
    let color = current.regularMarketChange>0?"green":
                (current.regularMarketChange<0?"red":"#eee");
    $('#price-change').html(current.regularMarketChange.toFixed(3))
        .css("color",color);
    $('#price-percentage-change').html((current.regularMarketChangePercent*100).toFixed(2)+"%")
        .css("color",color);
    
    $('#open-price').html(`${current.currencySymbol} ${current.regularMarketOpen}`);
    $('#high-price').html(`${current.currencySymbol} ${current.regularMarketDayHigh}`);
    $('#low-price').html(`${current.currencySymbol} ${current.regularMarketDayLow}`);
    $('#mkt-cap').html(`${current.currencySymbol} ${largeNumFormat(current.marketCap)}`);
    $('#volume').html(`${current.currencySymbol} ${largeNumFormat(current.regularMarketVolume
    )}`);
    $('#previous-close-price').html(`${current.currencySymbol} ${current.regularMarketPreviousClose}`);

    //Plot stock chart
    draw(historical);
})

function draw(data) {
    x.domain(data.map(candlestick.accessor().d));
    y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());

    svg.selectAll("g.candlestick").datum(data).call(candlestick);
    svg.selectAll("g.x.axis").call(xAxis);
    svg.selectAll("g.y.axis").call(yAxis);
}

$(window).trigger("resize");
$(window).on("resize", function () {
    let targetWidth = $('.chart').parent().width();
    $('.chart').attr("width", (targetWidth > width) ? width : targetWidth)
    .attr("height", (targetWidth > width) ? height : Math.round(targetWidth / aspect));
});