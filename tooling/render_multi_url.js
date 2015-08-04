var RenderUrlsToFile, arrayOfUrls, system;

system = require("system");

/*
 * Render given urls
 * @param array of URLs to render
 * @param callbackPerUrl Function called after finishing each URL, including the last URL
 * @param callbackFinal Function called after finishing everything 
 * */
RenderUrlsToFile = function(urls, callbackPerUrl, callbackFinal) {
	var getFilename, next, page, retrieve, urlIndex, webpage, pagename ; //<--
	urlIndex = 0;
	webpage = require("webpage");
	page = null;

	getFilename = function(url) {
		var filename = url.replace(/\?action=print/g,'');  //<--
		return filename.replace(/\//g,'_')+  ".png";  //<--
	};
	next = function(status, url, file) {
		page.close();
		callbackPerUrl(status, url, file);
		return retrieve();
	};
	retrieve = function() {
		var url;
		if (urls.length > 0) {
			url = urls.shift();
			urlIndex++;
			page = webpage.create();
			page.viewportSize = {
				width: 800,
				height: 600
			};
			page.settings.userAgent = "Phantom.js bot";
			return page.open("http://" + url, function(status) {
				var file;
				file = getFilename(url);
				if (status === "success") {
					return window.setTimeout((function() {
						page.render(file);
						return next(status, url, file);
					}), 200);
				} else {
					return next(status, url, file);
				}
			});
		} else {
			return callbackFinal();
		}
	};
	return retrieve();
};

// arrayOfUrls = null;
require('./urls_to_render.js');

RenderUrlsToFile(arrayOfUrls, (function(status, url, file) {
	if (status !== "success") {
		return console.log("Unable to render '" + url + "'");
	} else {
		return console.log("Rendered '" + url + "' at '" + file + "'");
	}
}), function() {
	return phantom.exit();
});
