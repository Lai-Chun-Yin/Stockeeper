let portfolios;
let transactions;
let positionsAll, positionsLong, positionsShort, positionsClosed;
let portfolioId = 1;
let portfolioTemplate = Handlebars.compile(`
<tr data-id="{{id}}">
<td>{{id}}</td>
<td>{{name}}</td>
<td><button class="btn-select-portfolio button secondary outline">Select</button></td>
<td><button class="btn-modify-portfolio button secondary outline"><i class="fas fa-undo-alt"></i></button>
<button class="btn-remove-portfolio button secondary outline"><i class="fas fa-trash-alt"></i></button></td>
</tr>
`);
let portfolioInputTemplate = Handlebars.compile(`
<td>{{id}}</td>
<td class="portRow-name"><input type="text" >{{name}}</input></td>
<td><button class="btn-input-portfolio mif-checkmark button secondary outline"></button></td>
<td><button class="btn-cancel-portfolio button secondary outline"><i class="fas fa-ban"></i></button></td>
`);
let positionHeadingHtml = Handlebars.compile(`
<caption> {{ positionType }} </caption>
<thead>
    <tr>
        <th>Symbol</th>
        <th>Current price</th>
        <th>Volume</th>
        <th>Cost Basis</th>
        <th>Market value</th>
        <th>Profit or loss</th>
    </tr>
</thead><tbody></tbody>
`);
let transactionHeadingHtml = `
<thead>
    <tr>
        <th>Symbol</th>
        <th>Trade price</th>
        <th>Trade volume</th>
        <th>Buy/Sell</th>
        <th>Trade time</th>
        <th>Remove</th>
    </tr>
</thead><tbody></tbody>
`;
let positionTemplate = Handlebars.compile(`
<tr>
<td>{{symbol}}</td>
<td>{{currentPrice}}</td>
<td>{{volume}}</td>
<td>{{costBasis}}</td>
<td>{{mktValue}}</td>
{{#ifCond pl ">" 0}}
    <td class="fg-green text-bold">{{pl}}</td>
{{else ifCond pl "<" 0}}
        <td class="fg-red text-bold">{{pl}}</td>
{{else}}
    <td class="fg-gray text-bold">{{pl}}</td>
{{/ifCond}}
</tr>`);

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

let transactionTemplate = Handlebars.compile(`
<tr data-id="{{id}}">
<td>{{symbol}}</td>
<td>{{tradePrice}}</td>
<td>{{volume}}</td>
<td>{{buySell}}</td>
<td>{{tradeTime}}</td>
<td><button class="btn-remove-trans button secondary outline">
<i class="fas fa-trash-alt"></i>
</button></td>
</tr>`);
let tranModifyTemplate = Handlebars.compile(`
<input type="text" class="tranRow-symbol">{{symbol}}</input>
`);

$('#portfolio-summary').on('click', '.btn-select-portfolio', function () {
    let portfolio_id = $(event.target).parent().parent().attr("data-id");
    portfolioId = portfolio_id;
    $(event.target).parent().parent().siblings('tr').css({
        "color": "black"
    });
    $(event.target).parent().parent().css({
        "color": "blue"
    });
    $('tbody .btn-select-portfolio').removeAttr('disabled');
    $(event.target).parent().children('.btn-select-portfolio').attr('disabled', 'disabled');
    fetchPortfolioData();
});
$('#btn-add-portfolio').on('click', function () {
    let trHtml = '<tr data-id="add"></tr>';
    let inputHtml = portfolioInputTemplate({
        id: "",
        name: ""
    });
    $('#portfolio-summary > tbody').append(trHtml);
    $('#portfolio-summary > tbody tr:last-child').append(inputHtml);
    // trHtml.appendTo($('#portfolio-summary > tbody')).append(inputHtml);
});
$('#portfolio-summary').on('click', '.btn-modify-portfolio', function () {
    let portfolio_id = $(event.target).parent().parent().attr("data-id");
    let portfolio_name = $(event.target).parent().siblings('td:eq(1)').val();
    let inputHtml = portfolioInputTemplate({
        id: portfolio_id,
        name: portfolio_name
    });
    let tr = $(event.target).parent().parent().empty();
    tr.append(inputHtml);
});
$('#portfolio-summary').on('click', '.btn-input-portfolio', function () {
    let portfolio_id = $(event.target).parent().parent().attr("data-id");
    let portfolio_name = $(event.target).parent().siblings('.portRow-name')
        .children('input').val();
    console.log(portfolio_name);
    if (portfolio_id === "add") {
        axios.post('/api/portfolio/', { name: portfolio_name }).then((newList) => {
            portfolios = newList.data;
            $('#portfolio-summary > tbody').empty();
            renderPortfolios();
        });
    } else {
        axios.put(`/api/portfolio/${portfolio_id}`, { name: portfolio_name })
            .then((newList) => {
                portfolios = newList.data;
                $('#portfolio-summary > tbody').empty();
                renderPortfolios();
            });
    }
});
$('#portfolio-summary').on('click', '.btn-remove-portfolio', function () {
    let portfolio_id = $(event.target).parent().parent().attr("data-id");
    axios.delete(`/api/portfolio/${portfolio_id}`).then(function (newList) {
        portfolios = newList.data;
        $('#portfolio-summary > tbody').empty();
        renderPortfolios();
    });
});
$('#btn-positions').on('click', function () {
    emptyPortfolioDetails();
    emptyCharts();
    renderPortfolioPositions();
});
$('#btn-transactions').on('click', function () {
    emptyPortfolioDetails();
    emptyCharts();
    renderPortfolioTransactions();
});
$('#portfolio-details').on('click', '.btn-modify-trans', function () {
    let tranRow = $(event.target).parent().parent();
    tranRow.empty();

});
$('#portfolio-details').on('click', '.btn-remove-trans', function () {
    let tranId = $(event.target).parent().parent().attr("data-id");
    axios.delete(`/api/transaction/${tranId}`).then(function (newTransactions) {
        transactions = newTransactions.data;
        emptyPortfolioDetails();
        renderPortfolioTransactions();
    });
});

$(function () {

    axios.get("/api/portfolio/").then(function (results) {
        portfolios = results.data;

        renderPortfolios();
    }).catch(function (err) { console.log(err); });

});

function emptyPortfolioDetails() {
    $('#portfolio-details-long').empty();
    $('#portfolio-details-short').empty();
    $('#portfolio-details-closed').empty();
    $('#portfolio-details-txn').empty();
  }

function fetchPortfolioData() {
    emptyPortfolioDetails();
    $('#btn-positions').attr('disabled', 'disabled');
    $('#btn-transactions').attr('disabled', 'disabled');
    $('#btn-graphs').attr('disabled', 'disabled');
    axios.get(`/api/portfolio/${portfolioId}`).then(function (results) {
        //data cleaning
        transactions = results.data.transactions.map(function (transaction) {
            let cleanTransaction = transaction;
            cleanTransaction.purchase_price = +transaction.purchase_price;
            return cleanTransaction;
        });
        let positions = results.data.positions.map(function (position) {
            let cleanPosition = position;
            cleanPosition.sum = +position.sum;
            cleanPosition.value = +position.value;
            return cleanPosition;
        });
        positionsAll=positions;
        positionsLong = positions.filter((position) => {
            return position.sum > 0;
        });
        positionsShort = positions.filter((position) => {
            return position.sum < 0;
        });
        positionsClosed = positions.filter((position) => {
            return position.sum == 0;
        });
        $('#btn-positions').removeAttr('disabled');
        $('#btn-transactions').removeAttr('disabled');
        $('#btn-graphs').removeAttr('disabled');
        renderPortfolioPositions();
    }).catch(function (err) {
        $('#btn-positions').removeAttr('disabled');
        $('#btn-transactions').removeAttr('disabled');
        $('#btn-graphs').removeAttr('disabled');
        console.log(err);
    });
}
function renderPortfolios() {
    portfolios.forEach(function (portfolio) {
        let html = portfolioTemplate({
            "id": portfolio.id,
            "name": portfolio.name,
        });
        $('#portfolio-summary > tbody').append(html);
    });
}

function renderPortfolioPositions() {
    let posLongHtml = positionHeadingHtml({
        "positionType": "Long Positions"
    });
    $('#portfolio-details-long').append(posLongHtml);
    positionsLong.forEach(function (position) {
        let html = positionTemplate({
            "symbol": position.asset_symbol,
            "currentPrice": position.current_price,
            "volume": position.sum,
            "costBasis": position.value,
            "mktValue": (position.current_price * position.sum).toFixed(2),
            "pl": (position.current_price * position.sum - position.value)
                .toFixed(2)
        });
        $('#portfolio-details-long > tbody').append(html);
    });

    let posShortHtml = positionHeadingHtml({
      "positionType": "Short Positions"
    });
    $('#portfolio-details-short').append(posShortHtml);
    positionsShort.forEach(function (position) {
        let html = positionTemplate({
            "symbol": position.asset_symbol,
            "currentPrice": position.current_price,
            "volume": position.sum,
            "costBasis": position.value,
            "mktValue": (position.current_price * position.sum).toFixed(2),
            "pl": (position.current_price * position.sum - position.value)
                .toFixed(2)
        });
        $('#portfolio-details-short > tbody').append(html);
    });

    let posClosedHtml = positionHeadingHtml({
      "positionType": "Closed Positions"
    });
    $('#portfolio-details-closed').append(posClosedHtml);
    positionsClosed.forEach(function (position) {
        let html = positionTemplate({
            "symbol": position.asset_symbol,
            "currentPrice": position.current_price,
            "volume": position.sum,
            "costBasis": position.value,
            "mktValue": (position.current_price * position.sum).toFixed(2),
            "pl": (position.current_price * position.sum - position.value)
                .toFixed(2)
        });
        $('#portfolio-details-closed > tbody').append(html);
    });
}

function renderPortfolioTransactions() {
    $('#portfolio-details-txn').append(transactionHeadingHtml);
    transactions.forEach(function (transaction) {
        let buySellSymbol;
        let timeString = moment(transaction.transaction_time).format("MMM Do YY");
        if (transaction.buy_sell) { buySellSymbol = "Buy"; }
        else { buySellSymbol = "Sell"; }
        let html = transactionTemplate({
            "id": transaction.id,
            "symbol": transaction.asset_symbol,
            "tradePrice": transaction.purchase_price,
            "volume": transaction.purchase_quantity,
            "buySell": buySellSymbol,
            "tradeTime": timeString
        });
        $('#portfolio-details-txn > tbody').append(html);
    });
}

//Graphes by d3
let mktValueChartHtml = `
<svg id="mktValue-chart" class="chart" width="800" height="600"
  viewBox="0 0 800 600"
  preserveAspectRatio="xMidYMid meet">
</svg>
`;
let plChartHtml = `
<svg id="pl-chart" class="chart" width="800" height="600"
  viewBox="0 0 800 600"
  preserveAspectRatio="xMidYMid meet">
</svg>
`;

let t = d3.transition().duration(750);
let margin = { left: 100, right: 20, top: 80, bottom: 100 };
let width = 800,
    height = 600,
    radius = Math.min(width, height - margin.top) / 2;
let color = d3.scaleOrdinal(d3.schemeCategory20);
let aspect = width / height;
let legendRectSize = 30; // defines the size of the colored squares in legend
let legendSpacing = 6;

let pie = d3.pie()
    .value(function (d) { return d.current_price * d.sum; })
    .sort(null);
let arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius - 20);

function emptyCharts (){
    $("#mktValue-chart-container").empty();
    $("#pl-chart-container").empty();
    $("#pl-chart-control").css("display","none");
}

$('#btn-graphs').on('click', function () {
    //Plot mkt val chart
    emptyPortfolioDetails();
    emptyCharts();
    $('#mktValue-chart-container').append(mktValueChartHtml);
    $('#pl-chart-container').append(plChartHtml);
    $('#pl-chart-control').css("display","block");
    let mktValSvg = d3.select('#mktValue-chart')
        .append("g")
        .attr("transform", "translate(" + (width / 2 - 100) + "," + (height / 2+40) + ")");

    let g = mktValSvg.selectAll(".arc")
        .data(pie(positionsLong))
        .enter().append("g")
        .attr("class", "arc");
    let path = g.append('path');
    path.attr("d", arc)
        .style("fill", function (d) { return color(d.data.asset_symbol); });

    let legendScale = d3.scaleBand()
        .domain(positionsLong.map(function (d) { return d.asset_symbol }))
        .range([margin.top, height])
        .padding(0.2);
    let mktValLegend = mktValSvg.selectAll('.legend') // selecting elements with class 'legend'
        .data(positionsLong) // refers to an array of labels from our dataset
        .enter() // creates placeholder
        .append('g') // replace placeholders with g elements
        .attr('class', 'legend') // each g is given a legend class
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing      
            var offset = height * positionsLong.length / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements  
            var horz = 11 * legendRectSize; // the legend is shifted to the left to make room for the text
            var vert = i * height - offset; // the top of the element is hifted up or down from the center using the offset defiend earlier and the index of the current element 'i'               
            return 'translate(' + horz + ',' + vert + ')'; //return translation       
        });
    mktValLegend.append('rect') // append rectangle squares to legend                                   
        .attr('width', function (d) { return Math.min(legendRectSize, legendScale(d.asset_symbol)) }) // width of rect size is defined above                        
        .attr('height', function (d) { return Math.min(legendRectSize, legendScale(d.asset_symbol)) }) // height of rect size is defined above                      
        .style('fill', function (d) { return color(d.asset_symbol) }) // each fill is passed a color
        .style('stroke', function (d) { return color(d.asset_symbol) });
    mktValLegend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (d) { return d.asset_symbol; });

    let mktValueTooltip = d3.select('#mktValue-chart-container')
        .append('div')
        .attr('class', 'tooltip');
    mktValueTooltip.append('div')
        .attr('class', 'label');
    mktValueTooltip.append('div')
        .attr('class', 'mktValue');
    mktValueTooltip.append('div')
        .attr('class', 'percent');

    path.on('mouseover', function (d) {
        var total = d3.sum(positionsLong.map(function (position) {
            return position.current_price * position.sum;
        }));
        var percent = Math.round(1000 * (d.data.current_price * d.data.sum) / total) / 10;
        mktValueTooltip.select('.label').html(d.data.asset_symbol);
        mktValueTooltip.select('.mktValue').html('$' + (d.data.current_price * d.data.sum).toFixed(2));
        mktValueTooltip.select('.percent').html(percent + '%');
        mktValueTooltip.style('display', 'block');
    });
    path.on('mouseout', function () {
        mktValueTooltip.style('display', 'none');
    });
    path.on('mousemove', function (d) {
        mktValueTooltip.style('top', (d3.event.layerY + 10) + 'px')
            .style('left', (d3.event.layerX + 10) + 'px');
    });
    // Mkt Value - Title
    d3.select('#mktValue-chart').append("text")
        .attr("y", 40)
        .attr("x", width / 2)
        // .attr("transform", "translate(" + (-100) + ", " + margin.top + ")")
        .attr("font-size", "30px")
        .attr("text-anchor", "middle")
        .text("Market Value of stocks");

    plotPL(positionsLong);

    //Trigger resize for responsive chart
    $(window).trigger("resize");
});

$('#pl-chart-control > button').on("click",function(){
    let type = $(event.target).html();
    console.log("type");
    if(type==="long"){plotPL(positionsLong);}
    else if(type==="short"){plotPL(positionsShort);}
    else if(type==="closed"){plotPL(positionsClosed);}
});

function plotPL (positions){
    if(positions.length===1){ positions.push({
        current_price:0,
        sum:0,
        value:0
    });}
    $('#pl-chart').empty();
    //Plot profit or loss bar chart
    let plSvg = d3.select('#pl-chart')
        .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    // PL chart X Scale
    let plx = d3.scaleBand()
        .domain(positions.map(function (d) { return d.asset_symbol }))
        .range([0, width - margin.left - margin.right])
        .padding(0.2);
    // PL chart Y Scale
    let ply = d3.scaleLinear()
        .domain(d3.extent(positions, function (d) { return d.current_price * d.sum - d.value }))
        .range([height - margin.top - margin.bottom, 0]);
    let bars = plSvg.selectAll("rect")
        .data(positions)
    bars.enter()
        .append("rect")
        .attr("y", function (d) { return ply(Math.max(d.current_price * d.sum - d.value, 0)); })
        .attr("x", function (d) { return plx(d.asset_symbol) })
        .attr("height", function (d) { return Math.abs(ply(d.current_price * d.sum - d.value) - ply(0)); })
        .attr("width", plx.bandwidth)
        .attr("fill", function (d) { return color(d.asset_symbol)});
    // X Axis
    let xAxisCall = d3.axisBottom(plx);
    plSvg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
        .call(xAxisCall);

    // Y Axis
    let yAxisCall = d3.axisLeft(ply)
        .tickFormat(function (d) { return "$" + d; });
    plSvg.append("g")
        .attr("class", "y axis")
        .call(yAxisCall);
    
    // Profit or Loss - Title
    d3.select('#pl-chart').append("text")
        .attr("y", 40)
        .attr("x", width / 2)
        .attr("font-size", "30px")
        .attr("text-anchor", "middle")
        .text("Profit / Loss of stocks");
}

$(window).on("resize", function () {
    let targetWidth = $(window).width();
    d3.select('#mktValue-chart').attr("width", (targetWidth > 800) ? 800 : targetWidth)
        .attr("height", (targetWidth > 800) ? 600 : Math.round(targetWidth / aspect));
    d3.select('#pl-chart').attr("width", (targetWidth > 800) ? 800 : targetWidth)
        .attr("height", (targetWidth > 800) ? 600 : Math.round(targetWidth / aspect));
});
