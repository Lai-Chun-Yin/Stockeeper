let portfolios;
let transactions;
let positions;
let portfolioId = 1;
let portfolioTemplate = Handlebars.compile(`
<tr data-id="{{id}}">
<td>{{id}}</td>
<td>{{name}}</td>
<td><button class="btn-select-portfolio">Select</button></td>
<td><button class="btn-modify-portfolio">Modify</button>
<button class="btn-remove-portfolio">Remove</button></td>
</tr>
`);
let portfolioInputTemplate = Handlebars.compile(`
<td>{{id}}</td>
<td class="portRow-name"><input type="text" >{{name}}</input></td>
<td><button class="btn-input-portfolio">Done</button></td>
<td><button class="btn-cancel-portfolio">Cancel</button></td>
`);
let positionHeadingHtml = `
<thead>
    <tr>
        <th>Symbol</th>
        <th>Current price</th>
        <th>Volume</th>
        <th>Market value</th>
        <th>Profit or loss</th>
    </tr>
</thead><tbody></tbody>
`;
let transactionHeadingHtml = `
<thead>
    <tr>
        <th>Symbol</th>
        <th>Trade price</th>
        <th>Trade volume</th>
        <th>Buy/Sell</th>
        <th>Trade time</th>
        <th>Modify/Remove</th>
    </tr>
</thead><tbody></tbody>
`;
let positionTemplate = Handlebars.compile(`
<tr>
<td>{{symbol}}</td>
<td>{{currentPrice}}</td>
<td>{{volume}}</td>
<td>{{mktValue}}</td>
<td>{{pl}}</td>
</tr>`);
let transactionTemplate = Handlebars.compile(`
<tr data-id="{{id}}">
<td>{{symbol}}</td>
<td>{{tradePrice}}</td>
<td>{{volume}}</td>
<td>{{buySell}}</td>
<td>{{tradeTime}}</td>
<td><button class="btn-modify-trans">Modify</button>
<button class="btn-remove-trans">Remove</button></td>
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
    $(event.target).parent().children('.btn-select-portfolio').attr('disabled','disabled');
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
    $('#portfolio-details').empty();
    renderPortfolioPositions();
});
$('#btn-transactions').on('click', function () {
    $('#portfolio-details').empty();
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
        $('#portfolio-details').empty();
        renderPortfolioTransactions();
    });
});

$(function () {

    axios.get("/api/portfolio/").then(function (results) {
        portfolios = results.data;

        renderPortfolios();
    }).catch(function (err) { console.log(err); });

});

function fetchPortfolioData() {
    $('#portfolio-details').empty();
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
        positions = results.data.positions.map(function (position) {
            let cleanPosition = position;
            cleanPosition.sum = +position.sum;
            cleanPosition.value = +position.value;
            return cleanPosition;
        });
        positions = positions.filter((position) => {
            return position.sum >= 0;
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
    $('#portfolio-details').append(positionHeadingHtml);
    positions.forEach(function (position) {
        let html = positionTemplate({
            "symbol": position.asset_symbol,
            "currentPrice": position.current_price,
            "volume": position.sum,
            "mktValue": position.current_price * position.sum,
            "pl": position.current_price * position.sum - position.value
        });
        $('#portfolio-details > tbody').append(html);
    });
}

function renderPortfolioTransactions() {
    $('#portfolio-details').append(transactionHeadingHtml);
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
        $('#portfolio-details > tbody').append(html);
    });
}

//Graphes by d3
let mktValueChartHtml = `
<div>
<svg id="mktValue-chart" class="chart" width="600" height="400"
  viewBox="0 0 600 400"
  preserveAspectRatio="xMidYMid meet">
</svg></div>
`;
let plChartHtml = `
<div>
<svg id="pl-chart" class="chart" width="600" height="400"
  viewBox="0 0 600 400"
  preserveAspectRatio="xMidYMid meet">
</svg></div>
`;
let width = 600,
    height = 400,
    radius = Math.min(width, height) / 2;
let color = d3.scaleOrdinal(d3.schemeCategory20);
let aspect = width / height;
let legendRectSize = 25; // defines the size of the colored squares in legend
let legendSpacing = 6;

let pie = d3.pie()
    .value(function (d) { return d.current_price * d.sum; })
    .sort(null);
let arc = d3.arc()
    .innerRadius(radius - 80)
    .outerRadius(radius - 20);

$('#btn-graphs').on('click', function () {
    $('#portfolio-details').empty().append(mktValueChartHtml).append(plChartHtml);
    let mktValSvg = d3.select('#mktValue-chart')
        .append("g")
        .attr("transform", "translate(" + (width/2-100) + "," + height / 2 + ")");
    // let plSvg =  d3.select('#pl-chart')
    // .append("g")
    // .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    let g = mktValSvg.selectAll(".arc")
        .data(pie(positions))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) { return color(d.data.asset_symbol); });

    let mktValLegend = mktValSvg.selectAll('.legend') // selecting elements with class 'legend'
        .data(positions) // refers to an array of labels from our dataset
        .enter() // creates placeholder
        .append('g') // replace placeholders with g elements
        .attr('class', 'legend') // each g is given a legend class
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing      
            var offset = height * positions.length / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements  
            var horz = 8 * legendRectSize; // the legend is shifted to the left to make room for the text
            var vert = i * height - offset; // the top of the element is hifted up or down from the center using the offset defiend earlier and the index of the current element 'i'               
            return 'translate(' + horz + ',' + vert + ')'; //return translation       
        });
    mktValLegend.append('rect') // append rectangle squares to legend                                   
        .attr('width', legendRectSize) // width of rect size is defined above                        
        .attr('height', legendRectSize) // height of rect size is defined above                      
        .style('fill', function (d) { return color(d.asset_symbol) }) // each fill is passed a color
        .style('stroke', function (d) { return color(d.asset_symbol) });
    mktValLegend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (d) { return d.asset_symbol; });

    $(window).trigger("resize");
});

$(window).on("resize", function () {

    let chart = $('.chart');
    // plChart = d3.select('#pl-chart');
    let container = chart.parent();
    let targetWidth = container.width;
    chart.removeAttr("width").removeAttr("height");
    chart.attr("width", (targetWidth>600) ? 600 : targetWidth);
    chart.attr("height", (targetWidth>600) ? 400 :Math.round(targetWidth / aspect));

});
