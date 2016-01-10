// TODO list only the files needed (files modified or not added since last sucessful run)

/*
find /home/web/benetou.fr/fabien/wiki.d/ -mtime 0
*/

// TODO make a graph of the entire wiki with relevant meta-data
// note that the format should be relevant to how we will use it later on
// e.g. easy to parse links from a page, etc

var fs = require('fs');
var MyDir = "/home/web/benetou.fr/fabien/wiki.d/";
var MyFile = "fromNode_MyWikiWithTargetsAssociative.js";

var wiki = {"Nodes" : {} };

var files = fs.readdirSync(MyDir);
for (file in files){
	var ignored = [".php",".flock",".zip",",del-",".pageindex",".stopwords",".htaccess", "totalcounter.stat", ".lastmod", ".exercisesscore"];
	var wrongfile=false;
	for (ignore in ignored){
		if (files[file].indexOf(ignored[ignore])>-1){
				wrongfile=true;
				}
	}
	if (wrongfile){ continue;}
	var filename = files[file];
	var fullpath = MyDir+files[file];

	var lines = fs.readFileSync(fullpath).toString().split('\n');
	var filenameparts = filename.split(".",2);
	var node = {Id: filename, Group: filenameparts[0], Label: filenameparts[1]} ;
	wiki.Nodes[filename] = node;

	for (line in lines) {
			/*
			   var Nodes = [ "PmWiki.Links" = 
{Id:"PmWiki.Links", Group:"PmWiki", Label:"Links", Size:6064, Time:1161032541, Rev:5, Texture: "HomePage.png", Targets: ["group1,page2", "group2.page1"]},
			 */
			var parts = lines[line].split("=",2);
			switch (parts[0]) {
			case "name":
				//console.log("name: ",parts[1]);
				node.Id = parts[1];
				break;
			case "rev":
				//console.log("rev: ",parts[1]);
				node.Rev = parseInt(parts[1]);
				break;
			case "ctime":
				//console.log("ctime: ",parts[1]);
				node.ChangeTime = parseInt(parts[1]);
				break;
			case "time":
				//console.log("time: ",parts[1]);
				break;
			case "targets":
				node.Targets = parts[1];
				if (parts[1]) {
					node.Targets = parts[1].split(",");
				}
				break;
			case "text":
				//console.log("text: ",parts[1]);
				//node.Text = parts[1];
				break;
			default:
				//console.log("unexpected data: ",parts[0]);
			}
	}
}
fs.writeFileSync(MyFile, JSON.stringify(wiki), 'utf-8', function(err) { });
/* should get
var MyWiki = {"Nodes":{'ReadingNotes.RaceAgainstTheMachine': {'Rev': 2, 'ChangeTime': 1348912456, 'Targets': ['R
*/

/*
echo 'arrayOfUrls = [' > urls_to_render.js
*/
//curl -s "http://fabien.benetou.fr/Site/AllRecentChanges?action=source" | sed "s/^\* \[\[\(.*\)\]\]  .*/\1/" | sed "s/\./\//" | sed s"/.*/\"fabien.benetou.fr\/\0\",/" >> urls_to_render.js
/*
echo '];' >> urls_to_render.js
cd ../MyRenderedPages/
../tooling/phantomjs ../tooling/render_multi_url.js  
*/
