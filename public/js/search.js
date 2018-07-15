$('#search-table').on('click','tr',function(){
    let symbol = $(event.target).parent().children('td').first().html();
    let a = document.createElement('a');
    a.href = `/stock/${symbol}`;
    a.click();
});