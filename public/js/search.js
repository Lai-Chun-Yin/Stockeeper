$('#search-table').on('click','tr',function(){
    // let symbol = $(event.target).parent().children('td').first().html();
    let symbol = $(event.target).parent().parent().find('td .cell-wrapper:eq(0)').text();
    console.log(symbol);
    let a = document.createElement('a');
    a.href = `/stock/${symbol}`;
    a.click();
});