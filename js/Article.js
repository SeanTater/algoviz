/** Parse the JSON response from Wikipedia for one page */
function Article(json_page) {
    this.title = json_page.title;
    this.text = json_page.revisions[0]['*'];
    this.links = [];
    
    // Find wikipedia links
    var matcher = /\[\[([^\]]+)\]\]/g; // Match [[THIS]]
    var match = matcher.exec(this.text);
    while (match != null) {
        this.links.push(match[1].split("|")[0]); // [[THIS|xxx]] and.. [[THIS]]
        match = matcher.exec(this.text);
    }
    
    this.tokens = this.text.match(/\w+/g);
    if (Articles.all_titles.indexOf(this) < 0) {
        Articles.all.push(this);
        Articles.all_titles.push(this);
    }
    Articles.all_tokens = Articles.all_tokens.concat(this.tokens);
};

/** Download a Wikipedia Article */
Articles = {
    fetch: function(titles, article_done, fetch_done) {
        var titles_string = titles.reduce(function(a, b){return a + "|" + b;});
        Articles._article_done = article_done;
        Articles._fetch_done = fetch_done;
        $.ajax(Articles.api_string.replace("_", titles_string), {
            dataType: "jsonp",
            cache: true,
            crossDomain: true,
            // Using this instead of a success callback is much harder but allows
            // browser caching.
            jsonpCallback: "Articles.parse",
        });
    },
    parse: function(wiki_json) {
        console.log(wiki_json);
        for (var pageid in wiki_json.query.pages) {
            if (pageid > 0) {
                var a = new Article(wiki_json.query.pages[pageid]);
                Articles._article_done(a);
            }
        }
        Articles._fetch_done(a);
    },
    
    // Callbacks left by fetch, for parse to find when parse is called by jsonp
    _article_done: function(a){},
    _fetch_done: function(){},
    all: [],
    all_titles: [],
    api_string: "http://en.wikipedia.org/w/api.php?format=json&action=query&titles=_&prop=revisions&rvprop=content&redirects",
    all_tokens: []
};
