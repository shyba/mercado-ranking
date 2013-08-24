/* from http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript */
Number.prototype.toCurrencyString=function(){
        return this.toFixed(2);
    }


/* captura os nomes e preços e armazena em 2 dicionários, um de item e o outro de elemento */
var cheap={},elems={};
$('table#cputable tr').each(function(i){
    item=$(this).find('td:first-child').text();
    value=$(this).find('td:nth-child(5)').text().replace('*','').replace('$','').replace(',','');
    cheap[item]=value;
    elems[item]=$(this);
})

/* header da funcionalidade que faltava */
$('th:contains(USD)').parent().append('<th class="header">Preço no Brasil</th>');

/* conserta o tablesorter - não funciona ainda :(*/
function fixtablesorter(){
$("#cputable").tablesorter({
	  widgets: ['zebra','repeatHeaders'],
	  sortList: [[0,0]],
    headers: { 3: {sorter:'value'}, 4: { sorter:'price' }, 5: { sorter:'price' } } 
}); 
}

/* usa a api do mercadolivre para calcular o preço médio do produto e coloca na página o valor e um link para a busca */

var ml={};
function buildFromML(){
for (i in cheap){
$.getJSON('https://api.mercadolibre.com/sites/MLB/search?q='+i+'&category=MLB1658?format=json', 
function(data){
    results=data.results;
    length=results.length;
    query=data.query.split('?')[0];
    ml[query]={results:results,length:length};
    if(length>0){
        var size=0,average=0;
        for(idx in results){
            product=results[idx];
            price=parseFloat(product.price);
            average+=price;
            size+=1;
        }
        average=average/size;
        average=average.toCurrencyString();
        console.log('Produto '+query+'+ tem preço médio de R$'+average+' com base em '+size+' produtos.');
        elems[query].append('<td><a href=\"http://informatica.mercadolivre.com.br/placas-video/pci-express/'+query+'\">'+average+'</a></td>');
    }   
});
}

}

buildFromML();


