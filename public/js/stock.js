$('#btn-addTran').on('click',function(){
    let symbol = $('#stock-symbol').html();
    
    let a = document.createElement('a');
    a.href = `/addTran/${symbol}`;
    a.click();
});