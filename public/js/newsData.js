// Get json from Financial Times API
$.ajax({
    // url: `https://newsapi.org/v2/top-headlines?country=us&apiKey=45ce7f4b35ae43b7b6b98e3123af79a7`,
    url: `https://newsapi.org/v2/top-headlines?country=hk&category=business&apiKey=45ce7f4b35ae43b7b6b98e3123af79a7`,
    // url: `https://newsapi.org/v2/top-headlines?sources=financial-post&apiKey=45ce7f4b35ae43b7b6b98e3123af79a7`,
    method: "GET"
}).done((data) => {
    //implementation will be replaced
    constructData(data);
    console.log(data);
});

// Contruct json data to html elements
function constructData(data){
    $(document).ready(function () {
        let templateScript = Handlebars.compile(`
        {{#each articles}}
            <div class="cell-lg-3 card image-header" style="width: 344px">
                <div class="card-header fg-white"
                     style="background-image: url({{ urlToImage }})">
                </div>
                <div class="card-content p-2">
                    <h5>{{ title }}</h5>
                    <p class="fg-gray">Posted on: {{ publishedAt }}</p>
                    {{ description }}
                    {{ source.name }}
                </div>
                <div class="card-footer">
                    <button class="button secondary"><a style="color: white; text-decoration:none" target="_blank" href="{{ url }}">Read More</a></button>
                </div>
            </div>
        {{/each}}
        `);
        var html = (templateScript(data));
        $(".row").append(html);
    });
}
    

