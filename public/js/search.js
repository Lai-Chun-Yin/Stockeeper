$('#search-table').on('click','tr',function(){
    let symbol = $(event.target).parent().children('td').first().html();
    console.log(symbol);
    let a = document.createElement('a');
    a.href = `/stock/${symbol}`;
    a.click();
});