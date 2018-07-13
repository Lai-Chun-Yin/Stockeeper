let portfolios;
let transactions;
let positions;
let portfolioId = 1;
let portfolioTemplate = Handlebars.compile(`
<tr>
<td>{{id}}</td>
<td>{{name}}</td>
<td>Click to modify</td>
<td>Click to remove</td>
</tr>
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

$('#btn-positions').on('click',function(){
    $('#portfolio-details').empty();
    renderPortfolioPositions();
});
$('#btn-transactions').on('click',function(){
    $('#portfolio-details').empty();
    renderPortfolioTransactions();
});
$('#portfolio-details').on('click','.btn-modify-trans',function(){
    
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
        console.log(transactions);
        renderPortfolioPositions();
    }).catch(function (err) { console.log(err); });


});

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



