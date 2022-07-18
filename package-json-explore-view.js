
// package-json-explore-view @ npm, a package.json explore view.

var width_splitter = require("width-splitter");
var to_px_by_offset = require("to-px-by-offset");
var bind_ui = require("bind-ui");

var package_json_to_html = require("package-json-to-html");
var package_json_treeview = require("package-json-treeview");
var json_container_treeview = require("json-container-treeview");

require("htm-tool-css");	//require ht css

var packageJsonExploreView = {
	config: {
		htmlText: require("./package-json-explore-view.htm"),

		init: "init",

		bindArray: [
			"showDetail", ["evt", "click", "onClickShowDetail"],
		],
	},

	packageDataset: null,		//a package_json_data_set object, refer package-json-data-set @ npm
	
	curPkg:null,	//current pkg

	init: function (el) {
		var _this = this;

		//offset splitter left half width
		var elSplitter = this.nme('splitter');
		to_px_by_offset.left(elSplitter);
		elSplitter.style.left = Math.round(parseInt(elSplitter.style.left) - (elSplitter.offsetWidth / 2)) + "px";

		width_splitter(elSplitter, this.nme('.list'), null,
			[this.nme('info'),], null, 50
		);

		package_json_treeview.initView(
			this.nme('.list'), null,
			{
				nameClickCallback: function (err, data) {
					if (err) return;
					_this.updateInfo(data);
				}
			}
		);
	},

	localLabel: null,		// refer package_json_to_html @npm
	localLabelTitle: null,		// refer package_json_to_html @npm

	updateInfo: function (pkgItem) {
		var isDirect = this.packageDataset.isDirect(pkgItem);

		var opt = {
			packageDir: pkgItem.path,
			rootPackageDir: this.packageDataset.top.path,
			packageDirUrl: ("/" + this.packageDataset.top.name + "/\*\/" +
				pkgItem.path.slice(this.packageDataset.top.path.length) + "/")
				.replace(/\\/g, "/").replace(/\/+/g, "/"),

			localLabel: this.localLabel,
			localLabelTitle: this.localLabelTitle,

			versionStyle: isDirect ? "" : "color:red;",
		};

		this.nme('info.summary').innerHTML = "<div style='white-space:nowrap;'>" +
			package_json_to_html(pkgItem.pkg, opt) + "</div>";

		var elDetail = this.nme('info.detail');
		elDetail.innerHTML = "";
		this.curPkg= pkgItem.pkg;
	},

	onClickShowDetail: function (evt) {
		var elDetail = this.nme('info.detail');
		json_container_treeview.initView(elDetail, this.curPkg);
	},

	updateView: function (packageDataset) {
		this.packageDataset = packageDataset;
		package_json_treeview.updateView(this.nme('.list'), packageDataset);

		//info
		this.updateInfo(this.packageDataset.top);
	},
};

//module

exports['class'] = function (el, cb) {
	return bind_ui(el, Object.create(packageJsonExploreView), null, cb);
}
