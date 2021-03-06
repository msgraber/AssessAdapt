//, summarizebyunit

define(["dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dojo/text!./templates/trib.html", 
	"dojo/dom-style", 
	"dojo/dom-class", 
	"dojo/_base/fx", 
	"dojo/_base/lang", 
	"dojo/_base/array",
	"dojo/on", 
	"dojo/mouse", 	
	"dojo/query", 	
	"dojo/store/Memory", 
	"dijit/form/ComboBox", 
	"dijit/form/DropDownButton", 
	"dijit/DropDownMenu", 
	"dijit/MenuItem", 
	"dojo/dom", 
	"dojo/parser", 
	"dijit/layout/TabContainer", 
	"dijit/layout/ContentPane", 
	"dojo/dom-construct",
	"dojox/charting/Chart", 
	"dojox/charting/axis2d/Default", 
	"dojox/charting/plot2d/Default", 
	"dojox/charting/plot2d/Bars", 
	"dojox/charting/themes/Wetland", 
	"dojox/charting/plot2d/StackedBars",
	"dojox/charting/plot2d/Pie",
	"dojox/charting/widget/SelectableLegend",
	"dojox/charting/plot2d/Columns",
	"dojox/charting/plot2d/Lines",
	"dojox/charting/plot2d/Grid",
	"dojox/charting/action2d/Tooltip",
	"dojox/gfx",
	"dojox/gfx/utils",
	"dojo/json",
	"dijit/form/Button",
	"dijit/Dialog",
	"esri/layers/ArcGISDynamicMapServiceLayer",
	"esri/tasks/IdentifyTask",
	"esri/tasks/IdentifyParameters"],
function(declare, 
    WidgetBase, 
    TemplatedMixin, 
    template, 
    domStyle, 
    domClass, 
    baseFx, 
    lang, 
	array,
    on, 
    mouse, 
    dojoquery, 
    Memory, 
    ComboBox, 
    DropDownButton, 
    DropDownMenu, 
    MenuItem, 
    dom, 
    parser, 
    TabContainer, 
    ContentPane, 
    domConstruct, 
    Chart, 
    axisDefault, 
    plotDefault, 
    Bars, 
    Wetland, 
    StackedBars,
    Pie,
    Legend,
    Columns,
    Lines,
	ChartGrid,
	ChartTooltip,
    gfx,
    gfxutils,
    JSON,
    Button,
	Dialog,
	ArcGISDynamicMapServiceLayer,
	IdentifyTask,
	IdentifyParameters
	){
        return declare([WidgetBase, TemplatedMixin], {
            // Some default values for our author
            // These typically map to whatever you're handing into the constructor
            name: "No Name",
            // Using require.toUrl, we can get a path to our AuthorWidget's space
            // and we want to have a default avatar, just in case
            //avatar: require.toUrl("custom/AuthorWidget/images/defaultAvatar.png"),
            bio: "",
 
            // Our template - important!
            templateString: template,
 
            // A class to be applied to the root node in our template
            baseClass: "StatsPanel",
 
            // A reference to our background animation
            mouseAnim: null,
            
            inputLayer: null,
            
            toolbar: null,
        
            currentlevel : 2,
            
            expanded: true,
            
            outputid: "",
            
            destroy: function(){
            	   	
				this.inherited(arguments);
            	
            },
            
            
            postCreate: function(){
			    // Get a DOM node reference for the root of our widget
			    var domNode = this.domNode;
			   
			 
			    // Run any parent postCreate processes - can be done at any point
			    this.inherited(arguments);  


		   },
		   
		   startup: function() {
		   
		    //thing = this;
		    
		   this.clearButton = new Button({
            label: "Clear Selection",
            onClick: lang.hitch(this,this.clearall)
        }, "Cselect");
		   
		   
		var menu = new DropDownMenu({ style: "display: none;"});
        var menuItem1 = new MenuItem({
            label: "Cumulative",
            onClick: lang.hitch(this, function(){ 
            		   atb = dijit.byId("ATypeButton");
            		   atb.set("label", "Cumulative"); 
            		   this.clearall();
            		 })
        });
        menu.addChild(menuItem1);

        var menuItem2 = new MenuItem({
            label: "Compare",
            onClick: lang.hitch(this,function(){ 
            		   atb = dijit.byId("ATypeButton");
            		   atb.set("label", "Compare"); 
            		   this.clearall();
            		 })
        });
        menu.addChild(menuItem2);

        var button = new DropDownButton({
            label: "Cumulative",
            name: "programmatic2",
            dropDown: menu,
            id: "ATypeButton"
        });
        dom.byId("ASelect").appendChild(button.domNode);
        
       
        var menu2 = new DropDownMenu({ style: "display: none;"});
        var menuItem12 = new MenuItem({
            label: "Entire Great Lakes Basin",
            onClick: lang.hitch(this,this.changelevel, 1, "Entire Great Lakes Basin")
        });
        menu2.addChild(menuItem12);

        var menuItem22 = new MenuItem({
            label: "Individual Lake Drainage Basins",
            onClick: lang.hitch(this,this.changelevel, 2, "Individual Lake Drainage Basins")
            
        });
        menu2.addChild(menuItem22);
        
        var menuItem23 = new MenuItem({
            label: "Subwatersheds",
            onClick: lang.hitch(this,this.changelevel, 3, "Subwatersheds")
        });
        menu2.addChild(menuItem23);

        var button2 = new DropDownButton({
            label: "Individual Lake Drainage Basins",
            name: "programmatic2",
            dropDown: menu2,
            id: "LevelButton"
        });
        dom.byId("LSelect").appendChild(button2.domNode);
		          
		     //query("#" + this.domNode.id + " a").onclick(function(e){
	         //  e.preventDefault(); 
	          // });
	             
			 this.map.reposition();
			 
			 this.inherited(arguments);
		
		
		
		this.maplayer = new ArcGISDynamicMapServiceLayer("http://tnc.usm.edu/ArcGIS/rest/services/IMDS/ProjectTracking/MapServer");
		this.maplayer.setOpacity(0.6)	
		this.maplayer.setVisibleLayers([1])
		layerDefinitions = [];
		layerDefinitions[1] = "Level = 2";
		this.maplayer.setLayerDefinitions(layerDefinitions);	
        this.map.addLayer(this.maplayer);
		
		
		var wsrenderer = new esri.renderer.SimpleRenderer(new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL,new dojo.Color([0,0,0]), 0),new dojo.Color([255, 0, 0, 0.3])));
		
		
		this.featureLayer = new esri.layers.FeatureLayer("http://tnc.usm.edu/ArcGIS/rest/services/IMDS/ProjectTracking/MapServer/1",{
          mode: esri.layers.FeatureLayer.MODE_SELECTION,
         outFields: ["*"]
        });
		
		this.featureLayer.setRenderer(wsrenderer);
		
		this.featureLayer.setMaxAllowableOffset(1000);
		
	
        this.map.addLayer(this.featureLayer);
        
        
        //thing = this;
		query = new esri.tasks.Query();
		query.where = "Level = 2";
		//this.featureLayer.selectFeatures(query,esri.layers.FeatureLayer.SELECTION_NEW,function(f,sm) {thing.featureSelector(f,sm,thing)});
        
      
		this.clickhandle = dojo.connect(this.map,"onClick", lang.hitch(this,this.genreport));
		
		dojo.connect(this.map, "onMouseMove", lang.hitch(this,this.displaywatershed));
		
		
		initExtent = new esri.geometry.Extent({"xmin":-90,"ymin":40,"xmax":-80,"ymax":53,"spatialReference":{"wkid":4326}});
	
		this.initExtent = []
		this.initExtent.push(initExtent);
		this.initExtent.push(initExtent);
		this.initExtent.push(initExtent);
		this.initExtent.push(new esri.geometry.Extent({"xmin":-90,"ymin":40,"xmax":-85,"ymax":48,"spatialReference":{"wkid":4326}}));
		
			 //on(closebuts[0], "click", lang.hitch(this,this._close));
			 
			 //this.tool = new this.tooltype({"name":"George",map:this.map});
			 //this.tool.placeAt(this.domNode);
		     //this.tool.startup();
		     
			 
		   },
		   
		  changelevel: function(newlevel, label) {
			  
			           atb = dijit.byId("LevelButton");
            		   atb.set("label", label); 
            		   
            		   layerDefinitions = [];
            		   layerDefinitions[1] = "Level = " + newlevel;
            		   this.maplayer.setLayerDefinitions(layerDefinitions);	
            		   
            		   this.currentlevel = newlevel;
        
            		   this.clearall();
            		   //this.map.setExtent(this.initExtent[newlevel])
            		   
            		   //this.zoomcurrentlevel();
			  
		  },
		  
		  zoomcurrentlevel: function() {
			  
			  this.map.setExtent(this.initExtent[this.currentlevel])
			  
		  },
		   
		 displaywatershed: function(evt) {

			identify = new IdentifyTask("http://tnc.usm.edu/ArcGIS/rest/services/IMDS/ProjectTracking/MapServer");
			identifyParams = new IdentifyParameters();
			identifyParams.tolerance = 3;
			identifyParams.returnGeometry = false;
			identifyParams.layerIds = [1];
			identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
			identifyParams.width  = this.map.width;
			identifyParams.height = this.map.height;
			identifyParams.geometry = evt.mapPoint;
			identifyParams.mapExtent = this.map.extent;
			identify.execute(identifyParams,lang.hitch(this,function(identifyResults) {this.idreturn(identifyResults, evt)}));
			
			this.map.infoWindow.hide();
			
		 },
		 
		 idreturn: function(identifyResults, evt) {
		 
				if (identifyResults.length == 0) { 
					this.map.infoWindow.hide();
				}
		 
				array.forEach(identifyResults, lang.hitch(this,function(entry, i){
				    if (entry.feature.attributes.Level == this.currentlevel) {
						console.log(entry.feature.attributes.InlandAquaticUnit );
						//console.log(evt)
						//g = evt.graphic;
						this.map.infoWindow.setContent(entry.feature.attributes.InlandAquaticUnit);
						this.map.infoWindow.setTitle("Watershed:");
						this.map.infoWindow.show(evt.screenPoint,this.map.getInfoWindowAnchor(evt.screenPoint));
						//this.map.infoWindow.show(0,0);
					}
				}));	
				
		 },
		 
		 genreport: function(evt) {
		    		//thing.up().setTitle("Assess and Adapt - No Basin Selected");
		
		
	//	if (thing.cbox.value == "cumulative") {
		
	//		thing.removeAll();
		
	
	//	} 
	
		  atb = dijit.byId("ATypeButton");
		  ctype = atb.label;
	
		
	      var query = new esri.tasks.Query();
		  
		  toleranceInPixel = 1;
		  point = evt.mapPoint;
		  var pixelWidth = this.map.extent.getWidth() / this.map.width;
       	  var toleraceInMapCoords = toleranceInPixel * pixelWidth;
		  query.geometry = new esri.geometry.Extent(point.x - toleraceInMapCoords,
                    point.y - toleraceInMapCoords,
                    point.x + toleraceInMapCoords,
                    point.y + toleraceInMapCoords,
                    this.map.spatialReference );
                    
           
		  query.where = this.maplayer.layerDefinitions[1];	
          
          //if (evt.shiftKey == true) {
          if (ctype == "Cumulative") {
          	 node = dom.byId(this.outputid);
			 dojo.empty(node);
			 
			 
          this.featureLayer.selectFeatures(query,esri.layers.FeatureLayer.SELECTION_ADD,lang.hitch(this,this.featureSelector));
			} else {
		  this.featureLayer.selectFeatures(query,esri.layers.FeatureLayer.SELECTION_NEW,lang.hitch(this,this.featureSelector));
			}
			
		 	
		 },
		 
		 clearall: function(clears) {
			 
			 node = dom.byId(this.outputid);
			 dojo.empty(node);
			 

			 this.featureLayer.clearSelection();
			 
			 this.map.setExtent(this.initExtent[this.currentlevel])
			 
			 this.zoomcurrentlevel();
			 
			 
		 },
		 
		featureSelector: function(features, selectionMethod) {
		
		
		//this.removeAll();
		
		feats = this.featureLayer.getSelectedFeatures()
		
		
		if (feats.length == 1) {
		
		newlab = feats[0].attributes["InlandAquaticUnit"];
		
		} else if (feats.length == 2) {
		
		newlab = feats[0].attributes["InlandAquaticUnit"] + " and " + feats[1].attributes["InlandAquaticUnit"]
		
		} else {
			
		newlab = feats[0].attributes["InlandAquaticUnit"] + " and " + (feats.length - 1) + " other selected basins."	
			
		}
		
	refNode = dojo.byId(this.outputid);
		
		tablerec = domConstruct.create("table");
		domConstruct.place(tablerec, refNode, "first");
		
		tablerow1 = domConstruct.create("tr");
		domConstruct.place(tablerow1, tablerec, "last");
		
		td1 = domConstruct.create("td");
		domConstruct.place(td1, tablerow1, "last");
		
		td2 = domConstruct.create("td");
		domConstruct.place(td2, tablerow1, "last");
		
		tit = domConstruct.create("h3");
		tit.innerHTML = "<b>" + newlab + "</b>"
		domConstruct.place(tit, refNode, "first");
		
		brn = domConstruct.create("br");
		domConstruct.place(brn, refNode, "first");
		
		//domAttr.set(td1, "width", "5");
		
		//this.up().setTitle(newlab);
		
		FeatureExtent = esri.graphicsExtent(feats);
		
		this.map.setExtent(FeatureExtent, true);
		
		//alert(features[0].attributes.SPGoal)
		
		featlist = []
		
		for (f in feats) {
		
			featlist.push(feats[f].attributes["OBJECTID"]);
		
		}
		
	lev = feats[0].attributes["Level"];
	
	checklinks = [53,9]
	
	checkvals = checklinks.join(",")
	
	relatedlinkstext = ("<br>Related Content</b> - (Click a link below)<ul class='a'><li><a href='http://tnc.usm.edu/pt/?taxa=" + checkvals + "&level=" + lev + "&units=" + featlist.join(",") + "&geo=trib' target='_blank'>Interested in sturgeon conservation projects or funding? Click here.</a></li><li><a href='http://imds.greenlitestaging.com/knowledge-network/532' target='_blank'>Read more about Lake Sturgeon profile</a></li><li><a href='http://imds.greenlitestaging.com/data-catalog/search?keywords=&term_node_tid_depth%5B%5D=9&term_node_tid_depth_3%5B%5D=53' target='_blank'>Get data related to stream connectivity</a></li><li><a href='http://imds.greenlitestaging.com/dynamic-maps-search/search?keywords=&term_node_tid_depth%5B%5D=9&term_node_tid_depth_3%5B%5D=53' target='_blank'>View maps related to stream connectivity issue</a></li><li><a href='http://imds.greenlitestaging.com/decision-tools-search/search?keywords=&term_node_tid_depth%5B%5D=9&term_node_tid_depth_3%5B%5D=53' target='_blank'>Get tools related to stream connectivity</a></li></ul>");
	
	td2.innerHTML = relatedlinkstext;
	
	spoptions = {fieldname:"Sturgeon_Status_",start:2005,end:2012,title:"Sturgeon Population", ylabel:"Total Sturgeon Population (count)",ingnoresum:true,yformat:Ext.util.Format.numberRenderer('0,000')}
	mcoptions = {fieldname:"Miles_Connected_",start:2005,end:2012,title:"Miles Reconnected", ylabel:"Miles of Stream Reconnected",ingnoresum:false,yformat:Ext.util.Format.numberRenderer('0,000')}
	droptions = {fieldname:"Barriers_Addressed_",start:2005,end:2012,title:"Barriers Addressed", ylabel:"Number of Dams Removed",ingnoresum:false,yformat:Ext.util.Format.numberRenderer('0,000')}
	foptions = {fieldname:"Funding_",start:2005,end:2012,title:"Funding", ylabel:"Funding ($)",ingnoresum:false,yformat:Ext.util.Format.usMoney}
	
	parser.parse();

	bn = domConstruct.create("div");
	domConstruct.place(bn, td2, "first");
	

	var n = domConstruct.create("div");
	domConstruct.place(n, td1, "last");
	

	
		var tc = new TabContainer({
            style: "height: 420px; width: 600px;"
        }, n);

        var cp1 = new ContentPane({
             title: spoptions.title
        });
        tc.addChild(cp1);
        
        cp1.set("content","<div style='height:300px' id='" + cp1.id + spoptions.fieldname + "'></div>" + "<center><div style='height:40px;width:200px;' id='" + cp1.id + spoptions.fieldname + "legend'></div></center>")
        
        spoptions['refid'] = cp1.id + spoptions.fieldname;

        var cp2 = new ContentPane({
             title: mcoptions.title,
             content:"<div id='" + mcoptions.fieldname + "loc'></div>"
        });
        tc.addChild(cp2);

        cp2.set("content","<div style='height:300px' id='" + cp2.id + mcoptions.fieldname + "'></div>" + "<center><div style='height:40px;width:200px' id='" + cp2.id + mcoptions.fieldname + "legend'></div></center>")
        
        mcoptions['refid'] = cp2.id + mcoptions.fieldname;
                
        var cp3 = new ContentPane({
             title: droptions.title,
             content:"<div id='" + droptions.fieldname + "loc'></div>"
        });
        tc.addChild(cp3);
        
        cp3.set("content","<div style='height:300px' id='" + cp3.id + droptions.fieldname + "'></div>" + "<center><div style='height:40px;width:200px' id='" + cp3.id + droptions.fieldname + "legend'></div></center>")
        
        droptions['refid'] = cp3.id + droptions.fieldname;

        var cp4 = new ContentPane({
             title: foptions.title,
             content:"<div id='" + foptions.fieldname + "loc'></div>"
        });
        tc.addChild(cp4);
        
        cp4.set("content","<div style='height:300px' id='" + cp4.id + foptions.fieldname + "'></div>" + "<center><div style='height:40px;width:200px' id='" + cp4.id + foptions.fieldname + "legend'></div></center>")
        
        foptions['refid'] = cp4.id + foptions.fieldname;
        
        
        tc.startup();	

    console.log(feats); 
	
	spchart = this.createChartDojo(feats, spoptions);
	
	tc.selectChild(cp2);
	
	mcchart = this.createChartDojo(feats, mcoptions);
	
	tc.selectChild(cp3);
	
	drchart = this.createChartDojo(feats, droptions);
	
	tc.selectChild(cp4);
	
	fchart = this.createChartDojo(feats, foptions);
	
	tc.selectChild(cp1);
		
//	tabs =	Ext.create('Ext.tab.Panel', {
//    activeTab: 0,
 //   items: [
//            mcchart,drchart,fchart
//    ]
//	});
		
//	this.add([tabs]);	

console.log(spchart);

	this.exportButton = new Button({
        label: "Export Report",
        onClick: function(){
            // Do something:
            //alert(feats[0].attributes);
	
			//window.open(dataUrl, "Chart Export", "width=600, height=300, location=no");
			
			outcontent = "Chart Data (Should have downloaded, Copy and Paste if nessessary):<br>"
			
			csvData = new Array();
			
			atts = new Array();
			for (f in feats) {
		
				console.log(feats[f].attributes);
				if (f==0) {
				   for (a in feats[f].attributes) {
				    atts.push(a);
					}
				csvData.push(atts);
				outcontent = outcontent + atts.join(",");
				outcontent = outcontent + "<br>"
				}
				
				cfd = new Array();
				
				for (a in feats[f].attributes) {
					
					cfd.push(feats[f].attributes[a])
				
				}
				csvData.push(cfd);
				outcontent = outcontent + cfd.join(",");
				outcontent = outcontent + "<br>"				
		
			}
			
			//var data = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
			var csvContent = "data:text/csv;charset=utf-8,";
			csvData.forEach(function(infoArray, index){

				dataString = infoArray.join(",");
				csvContent += index < infoArray.length ? dataString+ "\n" : dataString;

			}); 
			
			encodedUri = encodeURI(csvContent);
			window.open(encodedUri);
			
			outcontent = outcontent + "<br>Right-click on the links below to download each chart. <br>"
			
			a = dojoquery("#" + cp1.id + " canvas")
			dataUrl1 = a[0].toDataURL();
			
			outcontent = outcontent + "<a href='" + dataUrl1 +  "' target='_blank'> Download Sturgeon Population Chart </a><br>"
			
			a = dojoquery("#" + cp2.id + " canvas")
			dataUrl2 = a[0].toDataURL();

			outcontent = outcontent + "<a href='" + dataUrl2 +  "' target='_blank'> Download Miles Reconnected Chart </a><br>"
			
			a = dojoquery("#" + cp3.id + " canvas")
			dataUrl3 = a[0].toDataURL();
			
			outcontent = outcontent + "<a href='" + dataUrl3 +  "' target='_blank'> Download Barriers Addressed Chart </a><br>"

			a = dojoquery("#" + cp4.id + " canvas")
			dataUrl4 = a[0].toDataURL();
			
			outcontent = outcontent + "<a href='" + dataUrl4 +  "' target='_blank'> Download Funding Chart </a><br>"

			
			myDialog = new Dialog({
					title: "Report",
					content: outcontent,  //"<img src=" + dataUrl + " />",
					style: "width: 600px, height: 300px"
			});
			
			myDialog.show();
			
        }}, bn);
		
	},
		


  createChartDojo: function(features, options) {
  
  root = options.fieldname;
  starty = options.start;
  endy = options.end;
  intitle = options.title;
  ignorersum = options.ingnoresum;
  yformat = options.yformat;
  ylab = options.ylabel;

sers = [{
            type: 'line',
            highlight: {
                size: 20,
                radius: 7
            },
            axis: 'left',
            xField: 'name',
            yField: 'Goal',
            title: 'Goal',
            markerConfig: {
                type: 'cross',
                size: 4,
                radius: 4,
                'stroke-width': 0
            },
			style: {
    			stroke: '#FF0000',
    			'stroke-width': 3,
    			opacity: 0.9
				}
        },
        {
            type: 'line',
            style: {
    			stroke: '#00ff00',
    			'stroke-width': 2,
    			opacity: 0.9
				},
            axis: 'left',
            fill: false,
            xField: 'name',
			title: intitle,
            yField: 'obs',
            markerConfig: {
                type: 'circle',
				fill: '#000099',
                size: 4,
                radius: 4,
                'stroke-width': 0
            }
        }]

fds = ['Goal', 'obs']

d = []
x = 0

labelarray = []
goalarray = []
ogoalarray = []
dataarray = []
cdataarray = []

maxval = 0;

if (ignorersum) {

for (var i = starty; i <= endy; i++) {

	cval = 0 
	for (f in features) {
	cval = cval + features[f].attributes[root + i]
	}
 
	//cval = features[0].attributes[root + i]
	
	x = x + cval;
	
	gval = 0
	for (f in features) {
	gval = gval + features[f].attributes[root + "Overall_Goal"]
	}
	
	d.push({ 'name': i, 'Goal': gval,  'obs': cval,  'rsum': x})
	labelarray.push({value: (i-(starty-1)), text:i + ""});
	goalarray.push(gval);
	dataarray.push(cval);
	cdataarray.push(x);
	
	if (gval > maxval) { maxval = gval};
	if (cval > maxval) { maxval = cval};
	if (x > maxval) { maxval = x};
	
	
var store2 = Ext.create('Ext.data.JsonStore', {
    fields: ['name', 'Goal', 'obs', 'rsum'],
    data: d
});

}
 
} else {



for (var i = starty; i <= endy; i++) {

	cval = 0
	for (f in features) {	
	cval = cval + features[f].attributes[root + i]
	}
	x = x + cval;
	
	gval = 0
	for (f in features) {
	gval = gval + features[f].attributes[root + "Overall_Goal"]
	}
	
	ogval = 0
	for (f in features) {
	ogval = ogval + features[f].attributes[root + "Goal_" + i]
	}
	
	labelarray.push({value: (i-(starty-1)), text:i + ""});
	goalarray.push(gval);
	ogoalarray.push(ogval);
	dataarray.push(cval);
	cdataarray.push(x);
	d.push({ 'name': i, 'Goal': gval, 'yGoal': ogval, 'obs': cval,  'rsum': x})

	if (gval > maxval) { maxval = gval};
	if (cval > maxval) { maxval = cval};
	if (x > maxval) { maxval = x};
	if (ogval > maxval) { maxval = ogval};
	
}

var store2 = Ext.create('Ext.data.JsonStore', {
    fields: ['name', 'Goal', 'yGoal', 'obs', 'rsum'],
    data: d
});

 fds.push('yGoal')
 sers.push({
            type: 'line',
            style: {
    			stroke: '#EE8800',
    			'stroke-width': 2,
    			opacity: 0.9
				},
            axis: 'left',
            fill: false,
            xField: 'name',
			title: 'Yearly Goal',
            yField: 'yGoal',
            markerConfig: {
                type: 'circle',
				fill: '#EEEE00',
                size: 4,
                radius: 4,
                'stroke-width': 0
            }
        })

}



if (!(ignorersum)) {

fds.push('rsum')
sers.push({
            type: 'column',
            axis: 'left',
			title: 'Cumulative',
            highlight: true,
            tips: {
              trackMouse: true,
              width: 80,
              height: 28,
              renderer: function(storeItem, item) {
                this.setTitle(storeItem.get('name') + ': ' + storeItem.get('rsum') );
              }
            },
            //label: {
//              display: 'insideEnd',
//              'text-anchor': 'middle',
//                field: 'rsum',
//                renderer: Ext.util.Format.numberRenderer('0'),
//                orientation: 'vertical',
//                color: '#333'
//            },
			style: {
    			fill: '#119900',
    			opacity: 0.9
				},
            xField: 'name',
            yField: 'rsum'
        })

} 

  cloc = dojoquery("#" + options.refid);
  chart1 = new Chart(cloc[0], {});
  
  markers = {
	circle: "m-1,0 c0,-2 4,-2 4,0 m-4,0 c0,2 4,2 4,0",
	square: "m-3,-3 l0,6 6,0 0,-6 z",
	diamond: "m0,-3 l3,3 -3,3 -3,-3 z",
	plus: "m0,-3 l0,6 m-3,-3 l6,0",
	x: "m-3,-3 l6,6 m0,-6 l-6,6",
	uptriangle: "m-3,3 l3,-6 3,6 z",
	downtriangle: "m-3,-3 l3,6 3,-6 z"
	};
  
  chart1.addPlot("lins", {type: "Lines", markers: true});
  chart1.addPlot("cols", {type: "Columns", gap: 5});

  chart1.addPlot("default", { type: ChartGrid,
         hMajorLines: true,
         hMinorLines: false,
         vMajorLines: false,
         vMinorLines: false,
		 markers: true,
		 markerSize: 1,
         majorHLine: { color: "#aaa", width: 1 }});

   ndig = maxval.toString().length - 1
   
   powv = (Math.pow(10,ndig))
   
  chart1.addAxis("x", {minorTicks: false, title:"Year",labels: labelarray, titleOrientation:"away", htmlLabels: false});
  chart1.addAxis("y", {vertical: true, title: ylab, leftBottom: true, minorTicks: false, htmlLabels: false, min: 0, max: Math.ceil(maxval / powv) * powv});

  
  chart1.addSeries(" Goal",goalarray,{stroke: {color:"#f00", width:"3"}, marker: markers.circle, fill: "#0f0", plot:"lins"});
  if (ogoalarray.length > 0) {
	chart1.addSeries(" Yearly Goal",ogoalarray,{stroke: {color:"#fa0", width:"3"}, marker: markers.circle, fill: "#0f0", plot:"lins"});
  }
 
  chart1.addSeries( " " + intitle,dataarray,{stroke: {color:"#00f", width:"3"}, marker: markers.circle, fill: "#0f0", plot:"lins"});
  if (ignorersum == false) {
	chart1.addSeries(" Cumulative",cdataarray,{stroke: {color:"#0a0"}, fill: "#7b4", plot:"cols"});
  }	

  var tt = new ChartTooltip(chart1,"lins");
  
  chart1.render();	
  
  legend = new Legend({ chart: chart1, htmlLabels: false}, options.refid + "legend");
  

  //ob = chart1.getSeries("Unproteed") 
  
  //console.log(chart1)
  
  //output = JSON.stringify(ob);
  
  //alert(output)

/*

cht = Ext.create('Ext.chart.Chart', {
	renderTo: options.refid,
    width: 570,
    height: 370,
	title: intitle,
    animate: true,
    store: store2,
	background: {
    //color string
    fill: '#FFF'
	},
	legend: {
        position: 'bottom'
    },
    axes: [
        {
            type: 'Numeric',
            position: 'left',
            fields: fds,
            label: {
                renderer: yformat
            },
            title: intitle,
            grid: true,
            minimum: 0
        },
        {
            type: 'Category',
            position: 'bottom',
            fields: ['name'],
            title: 'Year'
        }
    ],
    series: sers
});

	
*/
	
return chart1;

	
},





  createChart: function(features, options) {
  
  root = options.fieldname;
  starty = options.start;
  endy = options.end;
  intitle = options.title;
  ignorersum = options.ingnoresum;
  yformat = options.yformat;


sers = [{
            type: 'line',
            highlight: {
                size: 20,
                radius: 7
            },
            axis: 'left',
            xField: 'name',
            yField: 'Goal',
            title: 'Goal',
            markerConfig: {
                type: 'cross',
                size: 4,
                radius: 4,
                'stroke-width': 0
            },
			style: {
    			stroke: '#FF0000',
    			'stroke-width': 3,
    			opacity: 0.9
				}
        },
        {
            type: 'line',
            style: {
    			stroke: '#00ff00',
    			'stroke-width': 2,
    			opacity: 0.9
				},
            axis: 'left',
            fill: false,
            xField: 'name',
			title: intitle,
            yField: 'obs',
            markerConfig: {
                type: 'circle',
				fill: '#000099',
                size: 4,
                radius: 4,
                'stroke-width': 0
            }
        }]

fds = ['Goal', 'obs']


d = []
x = 0


if (ignorersum) {

for (var i = starty; i <= endy; i++) {

	cval = 0 
	for (f in features) {
	cval = cval + features[f].attributes[root + i]
	}
 
	//cval = features[0].attributes[root + i]
	
	x = x + cval;
	
	gval = 0
	for (f in features) {
	gval = gval + features[f].attributes[root + "Overall_Goal"]
	}
	
	d.push({ 'name': i, 'Goal': gval,  'obs': cval,  'rsum': x})

var store2 = Ext.create('Ext.data.JsonStore', {
    fields: ['name', 'Goal', 'obs', 'rsum'],
    data: d
});

}
 
} else {



for (var i = starty; i <= endy; i++) {

	cval = 0
	for (f in features) {	
	cval = cval + features[f].attributes[root + i]
	}
	x = x + cval;
	
	gval = 0
	for (f in features) {
	gval = gval + features[f].attributes[root + "Overall_Goal"]
	}
	
	ogval = 0
	for (f in features) {
	ogval = ogval + features[f].attributes[root + "Goal_" + i]
	}
	
	
	d.push({ 'name': i, 'Goal': gval, 'yGoal': ogval, 'obs': cval,  'rsum': x})
	
}

var store2 = Ext.create('Ext.data.JsonStore', {
    fields: ['name', 'Goal', 'yGoal', 'obs', 'rsum'],
    data: d
});

 fds.push('yGoal')
 sers.push({
            type: 'line',
            style: {
    			stroke: '#EE8800',
    			'stroke-width': 2,
    			opacity: 0.9
				},
            axis: 'left',
            fill: false,
            xField: 'name',
			title: 'Yearly Goal',
            yField: 'yGoal',
            markerConfig: {
                type: 'circle',
				fill: '#EEEE00',
                size: 4,
                radius: 4,
                'stroke-width': 0
            }
        })

}



if (!(ignorersum)) {

fds.push('rsum')
sers.push({
            type: 'column',
            axis: 'left',
			title: 'Cumulative',
            highlight: true,
            tips: {
              trackMouse: true,
              width: 80,
              height: 28,
              renderer: function(storeItem, item) {
                this.setTitle(storeItem.get('name') + ': ' + storeItem.get('rsum') );
              }
            },
            //label: {
//              display: 'insideEnd',
//              'text-anchor': 'middle',
//                field: 'rsum',
//                renderer: Ext.util.Format.numberRenderer('0'),
//                orientation: 'vertical',
//                color: '#333'
//            },
			style: {
    			fill: '#119900',
    			opacity: 0.9
				},
            xField: 'name',
            yField: 'rsum'
        })

} 



cht = Ext.create('Ext.chart.Chart', {
	renderTo: options.refid,
    width: 570,
    height: 370,
	title: intitle,
    animate: true,
    store: store2,
	background: {
    //color string
    fill: '#FFF'
	},
	legend: {
        position: 'bottom'
    },
    axes: [
        {
            type: 'Numeric',
            position: 'left',
            fields: fds,
            label: {
                renderer: yformat
            },
            title: intitle,
            grid: true,
            minimum: 0
        },
        {
            type: 'Category',
            position: 'bottom',
            fields: ['name'],
            title: 'Year'
        }
    ],
    series: sers
});

		
return cht;

	
},
		   
		   _close: function() {
		   
		   		this.destroy();   
			   
		   }

        });
});