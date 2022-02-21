
//global variable, for html page, refer tpsvr @ npm.
package_json_explore_view = require("../package-json-explore-view.js");

module.exports = {

	"package_json_explore_view": function (done) {
		if (typeof window === "undefined") throw "disable for nodejs";

		//prepare dataset
		var pkgTop = require("../package.json");
		var pkgTopPath = "/virtual-path/" + pkgTop.name;
		var loadPackageFunc = function (pathFrom, name, cb, noLoop) {
			var packagePath = pathFrom + "/node_modules/" + name;
			var url = "../" + pathFrom.slice(pkgTopPath.length) + "/node_modules/" + name + "/package.json";
			url = url.replace(/\/+/g, "/");
			console.log("load from url, " + name + ", " + url);

			var xq = new XMLHttpRequest();
			xq.open("GET", url, true);
			xq.onreadystatechange = function () {
				if (xq.readyState === 4) {
					if (xq.status == 404) {
						if (pathFrom != pkgTopPath && !noLoop) {
							loadPackageFunc(pkgTopPath, name, cb, true);	//load from top
						}
						else { cb("404 unfound"); }
						return;
					}
					cb(null, { path: packagePath, pkg: JSON.parse(xq.responseText) });
				}
			}
			xq.send();
		}

		var package_json_data_set = require("package-json-data-set");
		var dataset = new package_json_data_set.class(pkgTop, pkgTopPath, loadPackageFunc);

		//dom
		document.getElementById('divResult3').innerHTML =
			"<div id='pkg-view' style='position:relative;width:90%;height:300px;border:1px solid green;'></div>";

		var el = document.getElementById('pkg-view');

		//.class(el, packageDataset)
		var tv = new package_json_explore_view.class(el, function (err, data) {
			if (err) { console.log(err); return; }

			tv.localLabel = "test";
			tv.localLabelTitle = "click to test";

			tv.updateView(dataset);
		});

		var query_by_name_path = require("query-by-name-path");

		query_by_name_path(el, ".info").addEventListener("click", function (evt) {
			var target = evt.target;

			if (target.classList.contains("local-label")) {
				alert(target.previousSibling.href + "\n" + target.previousSibling.textContent);
			}
		})

		return "ui-test";
	},

};

// for html page
//if (typeof setHtmlPage === "function") setHtmlPage("title", "10em", 1);	//page setting
if (typeof showResult !== "function") showResult = function (text) { console.log(text); }

//for mocha
if (typeof describe === "function") describe('package_json_explore_view', function () { for (var i in module.exports) { it(i, module.exports[i]).timeout(5000); } });
