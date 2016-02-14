phantom.create(function (ph) {
	ph.createPage(function (page) {

		page.set("settings",{
			/*userAgent:'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.37',*/
			loadImages:false,
			webSecurityEnabled:false,
			javascriptEnabled:true
		});

		page.open(currentCatlink, function(success) {
			if(success) {
				var intervalCount = 0;
				var ajaxInterval = setInterval(function() {
					//console.log("Scrolling (" + intervalCount + ") > " + currentCatlink);
					page.evaluate(function() {
						var totalItemCount  = parseInt($("count.total-count").text());
						var lastEntryNumber = parseInt($("span.entryNumber").last().text().replace(".",""));	
						
						// scroll as long as this is true
						if(totalItemCount > lastEntryNumber) {
							window.scrollTo(0,document.body.scrollHeight);
							return false;
						} else {
						// once at the bottom, exctact stuff
							var itemLinks = {};
							$("div.headbox a").each(function(index,value) {  
								var link = $(value).attr("href");
								if(link.indexOf("branchenbuch") > -1) itemLinks[link] = 1;
							});
							return itemLinks;
						}
					},function(links) {
						if(links) {
							ph.exit();
							clearInterval(ajaxInterval);
							itemLinks[currentCatlink] = Object.keys(links);
							completed++;
							writeObjectToFile(itemLinks,filePath,function() {
								console.log("Done saving categories[" + Object.keys(itemLinks).length + "].links[" + Object.keys(links).length + "] to disk.");
								recurseCategoryLinks();	
							});
						}
					}); // page evaluate
				},500);
			} else {
				console.log("Phantom could not load page.");
			}
		}); // page.open
	}); // ph.createpage
}); // phantom.create , Windows: { dnodeOpts: {weak:false}}
