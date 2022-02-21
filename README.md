# package-json-explore-view
a package.json explore view

# Install
```
npm install package-json-explore-view
```

# Usage & Api
```javascript

var package_json_explore_view = require("package-json-explore-view");

//prepare dataset
var pkgTop = require("../package.json");
var pkgTopPath = "/virtual-path/" + pkgTop.name;
var loadPackageFunc = function (pathFrom, name, cb, noLoop) {...}

var package_json_data_set = require("package-json-data-set");
var dataset = new package_json_data_set.class(pkgTop, pkgTopPath, loadPackageFunc);

//dom
document.getElementById('divResult3').innerHTML =
	"<div id='pkg-view' style='position:relative;width:90%;height:300px;border:1px solid green;'></div>";

var el = document.getElementById('pkg-view');

//.class(el)
var tv = new package_json_explore_view.class(el, function (err, data) {
	if (err) { console.log(err); return; }

	tv.updateView(dataset);
});

```
