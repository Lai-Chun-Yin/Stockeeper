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

$('#portfolio-summary').on('click','.btn-select-portfolio',function(){
    let portfolio_id = $(event.target).parent().parent().attr("data-id");
    portfolioId = portfolio_id;
    $(event.target).parent().parent().css({
        "color": "blue"
    });
    fetchPortfolioData();
});
$('#btn-add-portfolio').on('click',function(){
    let trHtml = '<tr data-id="add"></tr>';
    let inputHtml = portfolioInputTemplate({
        id:"",
        name: ""
    });
    $('#portfolio-summary > tbody').append(trHtml);
    $('#portfolio-summary > tbody tr:last-child').append(inputHtml);
    // trHtml.appendTo($('#portfolio-summary > tbody')).append(inputHtml);
});
$('#portfolio-summary').on('click','.btn-modify-portfolio',function(){
    let portfolio_id = $(event.target).parent().parent().attr("data-id");
    let portfolio_name = $(event.target).parent().siblings('td:eq(1)').val();
    let inputHtml = portfolioInputTemplate({
        id: portfolio_id,
        name: portfolio_name
    });
    let tr = $(event.target).parent().parent().empty();
    tr.append(inputHtml);
});
$('#portfolio-summary').on('click','.btn-input-portfolio',function(){
    let portfolio_id = $(event.target).parent().parent().attr("data-id");
    let portfolio_name = $(event.target).parent().siblings('.portRow-name')
    .children('input').val();
    console.log(portfolio_name);
    if(portfolio_id==="add"){
        axios.post('/api/portfolio/',{name: portfolio_name}).then((newList)=>{
            portfolios = newList.data;
            $('#portfolio-summary > tbody').empty();
            renderPortfolios();
        });
    }else{
        axios.put(`/api/portfolio/${portfolio_id}`,{name: portfolio_name})
        .then((newList)=>{
            portfolios = newList.data;
            $('#portfolio-summary > tbody').empty();
            renderPortfolios();
        });
    }
});
$('#portfolio-summary').on('click','.btn-remove-portfolio',function(){
    let portfolio_id = $(event.target).parent().parent().attr("data-id"); 
    axios.delete(`/api/portfolio/${portfolio_id}`).then(function(newList){
        portfolios = newList.data;
        $('#portfolio-summary > tbody').empty();
        renderPortfolios();
    });
});
$('#btn-positions').on('click',function(){
    $('#portfolio-details').empty();
    renderPortfolioPositions();
});
$('#btn-transactions').on('click',function(){
    $('#portfolio-details').empty();
    renderPortfolioTransactions();
});
$('#portfolio-details').on('click','.btn-modify-trans',function(){
    let tranRow = $(event.target).parent().parent();
    tranRow.empty();
    
});
$('#portfolio-details').on('click','.btn-remove-trans',function(){
    let tranId = $(event.target).parent().parent().attr("data-id");
    axios.delete(`/api/transaction/${tranId}`).then(function(newTransactions){
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

function fetchPortfolioData(){
    axios.get(`/api/portfolio/${portfolioId}`).then(function (results) {
        //data cleaning
        transactions = results.data.transactions.map(function(transaction){
            let cleanTransaction = transaction;
            cleanTransaction.purchase_price = +transaction.purchase_price;
            return cleanTransaction;
        });
        positions = results.data.positions.map(function(position){
            let cleanPosition = position;
            cleanPosition.sum = +position.sum;
            cleanPosition.value= +position.value;
            return cleanPosition;
        });
        positions = positions.filter((position)=>{
            return position.sum >= 0;
        });

        renderPortfolioPositions();
    }).catch(function (err) { console.log(err); });
}
function renderPortfolios() {
    portfolios.forEach(function(portfolio){
        let html = portfolioTemplate({
            "id":portfolio.id,
            "name":portfolio.name,
        });
        $('#portfolio-summary > tbody').append(html);
    });
}

function renderPortfolioPositions(){
    $('#portfolio-details').append(positionHeadingHtml);
    positions.forEach(function(position){
        let html = positionTemplate({
            "symbol":position.asset_symbol,
            "currentPrice":position.current_price,
            "volume":position.sum,
            "mktValue":position.current_price*position.sum,
            "pl":position.current_price*position.sum-position.value
        });
        $('#portfolio-details > tbody').append(html);
    });
}

function renderPortfolioTransactions(){
    $('#portfolio-details').append(transactionHeadingHtml);
    transactions.forEach(function(transaction){
        let buySellSymbol;
        if(transaction.buy_sell){buySellSymbol="Buy";}
        else{buySellSymbol="Sell";}
        let html = transactionTemplate({
            "id":transaction.id,
            "symbol":transaction.asset_symbol,
            "tradePrice":transaction.purchase_price,
            "volume":transaction.purchase_quantity,
            "buySell":buySellSymbol
        });
        $('#portfolio-details > tbody').append(html);
    });
}



