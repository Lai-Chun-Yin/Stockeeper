let portfolios;
let portfolioOptionTemplate = Handlebars.compile(`
<option value="{{id}}">{{name}}</option>
`);

axios.get('/api/portfolio').then(function(results){
    portfolios=results.data;
    console.log(portfolios);
    portfolios.forEach(function(portfolio){
        let html = portfolioOptionTemplate({
            "id":portfolio.id,
            "name":portfolio.name
        });
        $('#select-portfolio').append(html);
    });
    if(portfolios.length===0){$('#alert-message').css({display:"block"});}
});

$( "input[value='Cancel']" ).on('click',function(){
    location.reload();
});