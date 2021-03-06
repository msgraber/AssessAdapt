

//Ext JS 4.x class definition
Ext.define('GrMapper.DualMapPort', {
extend: 'Ext.container.Container',
	alias: 'widget.dualmapport',
	requires: ['GrMapper.Map','GrMapper.tools.NavToolbar','GrMapper.tools.MapToolbar'],
	
	mapIndex: 0,
	
	initload: true,

	afterRender: function () {
	
	//var initExtent = new esri.geometry.Extent({"xmin":-9214432,"ymin":4851761,"xmax":-8375052,"ymax":6555226,"spatialReference":{"wkid":102100}});
	
	initExtent = new esri.geometry.Extent({"xmin":-11479948.6343687,"ymin":2041824.17566893,"xmax":-8316319.72941851,"ymax":4454289.9361020,"spatialReference":{"wkid":102100}});
	//initExtent = new esri.geometry.Extent({"xmin":-9986841.20216703,"ymin":5051578.21578541,"xmax":-9343934.68771502,"ymax":5898729.28427151,"spatialReference":{"wkid":102100}});
	//initExtent = new esri.geometry.Extent({"xmin":-9986841.20216703,"ymin":5051578.21578541,"xmax":-9343934.68771502,"ymax":5898729.28427151,"spatialReference":{"wkid":102100}});
	
	m1 = Ext.create('GrMapper.Map', {style:"margin:0",layout:'absolute',mapOptions:{extent:initExtent,slider:false,wrapAround180:true}})  //style:"margin:2 1 2 2
	m2 = Ext.create('GrMapper.Map', {style:"margin:0",layout:'absolute',mapOptions:{extent:initExtent,slider:false,wrapAround180:true}})  //style:"margin:2 2 2 1"
		
    this.add([m1,m2]);
	
	this.items.each(function(item) {
					
	//item.map.setExtent(initExtent);
	
	
	ntb = Ext.create('GrMapper.tools.NavToolbar', {
	map: this.map,
	fullExtent: initExtent,
    x:0,
	y:31,
	id: item.id + "ntb"
	});				 
							 
	this.add(ntb);	
	
	mtb = Ext.create('GrMapper.tools.MapToolbar', {
	grMap: this,
    x:31,
	y:0,
	id: item.id + "mtb"
	});				 
							 
	this.add(mtb);	

	hidetoolbarsbutton = Ext.create('Ext.button.Button', {
	style:"z-index:3001",
	icon: "GrMapper/resources/images/tools/arrow_reduce.png",
    x:0,
	y:0,
	width: 32,
	height: 32,
	tooltip: "Hide/Show the toolbar for this map",
	id: item.id + "htb",
	enableToggle: true,
	toggleHandler: function(but, pressed) {
		
	xy = this.getPosition();
	  if (pressed == true) { yto = xy[1] - 120; xto = xy[0] - 70; oto = 0.25; this.setIcon("GrMapper/resources/images/tools/arrow_expand.png")} else { yto = xy[1]+ 31; xto = xy[1]; oto = 1; this.setIcon("GrMapper/resources/images/tools/arrow_reduce.png")}
	  
	  
	  	htoob = Ext.getCmp(this.id.replace("htb","ntb"))
		htoob.animate({ duration: 500,
    						to: {
        					 y: yto
    						},
							easing: 'easeInOut'
							});
		
	  	htoob = Ext.getCmp(this.id.replace("htb","mtb"))
		htoob.animate({ duration: 500,
    						to: {
        					 y: xto
    						}
							});

		this.animate({ duration: 1000,
    						to: {
        					 opacity: oto
    						}
							});
		
	},
	listeners: {mouseout: function () { 
		
	  if (this.pressed == true) {	
		
		this.animate({ duration: 500,
    						to: {
        					 opacity: 0.25
    						}
							});
		
				}
	   }, mouseover: function () { 
		
	  if (this.pressed == true) {	
		
		this.animate({ duration: 500,
    						to: {
        					 opacity: 1
    						}
							});
		
				}
	   } 
	}
	});				 
							 
							 
	this.add(hidetoolbarsbutton);

							 
	})
	
	
	this.on("resize", this.resizeViews, this);
	
		bm = new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer");
		
        veTileLayer2 = new esri.virtualearth.VETiledLayer({
          bingMapsKey: 'Ah29HpXlpKwqVbjHzm6mlwMwgw69CYjaMIiW_YOdfTEMFvMr5SNiltLpYAcIocsi',
          mapStyle: esri.virtualearth.VETiledLayer.MAP_STYLE_AERIAL_WITH_LABELS
        });

        //m1.map.addLayer(bm);
		//m2.map.addLayer(veTileLayer2);
		
		GrMapper.DualMapPort.superclass.afterRender.apply(this, arguments);
		
	this.changeMapView(0);

	},
	
 
    initComponent: function() {
	
    this.layout =  {
        type: 'absolute'
		//,align: 'stretch'
    }
	
    GrMapper.DualMapPort.superclass.initComponent.apply(this, arguments);
		
    },
	
	changeMapView: function(index) {
		
		this.resizeViews();
		
		h = this.getHeight();
		w = this.getWidth();
		
		this.mapIndex = index;
	
		
		if (index == 0) {
		maptohide = this.items.get(1);
		dojo.style(maptohide.id, "z-index", "10");
		maptohide.setWidth(w);
		maptohide.resizeContainer();
		maptoshow = this.items.get(0);
		dojo.style(maptoshow.id, "z-index", "100");
		maptoshow.setWidth(w);
		maptoshow.resizeContainer();
		
		maptohide.animate({
   						duration: 700,
    						to: {
        					x: w,
							//width: w,
							opacity: 0.5
    						},
							listeners: {
							afteranimate: function() {
								this.resizeViews();
								if (this.initload == true) {
									this.items.get(1).map.setExtent(initExtent);
									this.items.get(0).map.setExtent(initExtent);
									this.initload = false;
									}
            					},
							scope: this
							}
							});

		maptoshow.animate({
   						duration: 700,
    						to: {
        					x: 0,
							//width: w,
							opacity: 1
    						},
							listeners: {
							afteranimate: function() {
								this.resizeViews();
								if (this.initload == true) {
									this.items.get(1).map.setExtent(initExtent);
									this.items.get(0).map.setExtent(initExtent);
									this.initload = false;
									}
            					},
							scope: this
							}
							});
		
		} 
		
		
		if (index == 1) {
		maptohide = this.items.get(0);
		dojo.style(maptohide.id, "z-index", "10");
		maptohide.setWidth(w);
		maptohide.resizeContainer();
		maptoshow = this.items.get(1);
		dojo.style(maptoshow.id, "z-index", "100");
		maptoshow.setWidth(w);
		maptoshow.resizeContainer();
		
		maptohide.animate({
   						duration: 700,
    						to: {
        					x: (w * -1),
							//width: w,
							opacity: 0.5
    						},
							listeners: {
							afteranimate: function() {
								this.resizeViews();
            					},
							scope: this
							}
							});

		maptoshow.animate({
   						duration: 700,
    						to: {
        					x: 0,
							//width: w,
							opacity: 1
    						},
							listeners: {
							afteranimate: function() {
								this.resizeViews();
            					},
							scope: this
							}
							});
		
					
		} 
		
		
		if (index == 2) {
		
		maptohide = this.items.get(0);
		dojo.style(maptohide.id, "z-index", "10");
		maptoshow = this.items.get(1);
		dojo.style(maptoshow.id, "z-index", "100");
			
			//this.items.each(function(item) {
					//this.show();
					//this.setWidth(Math.round(w/2));
					//this.resizeContainer();
			//		})
			
			this.items.get(0).animate({
   						duration: 700,
    						to: {
        					x: 0,
							width: Math.round(w/2),
							opacity: 1
    						},
							listeners: {
							afteranimate: function() {
								this.resizeViews();
								this.items.get(0).resizeContainer();
            					},
							scope: this
							}
							});
			
			this.items.get(1).animate({
   						duration: 700,
    						to: {
        					x: Math.round(w/2),
							width: Math.round(w/2),
							opacity: 1
    						},
							listeners: {
							afteranimate: function() {
								this.resizeViews();
								this.items.get(1).resizeContainer();
            					},
							scope: this
							}
							});
		
		}
		
	},
	
	resizeViews: function() {
		
		h = this.getHeight();
		w = this.getWidth();
		
		//console.log("resize: " + this.mapIndex + " (" + h + "," + w + ")")
		
	 if (this.mapIndex == 0) {
			
		this.items.get(0).setWidth(w);
		this.items.get(0).setHeight(h);
		this.items.get(0).setPosition(0,0);
		
		this.items.get(1).setWidth(w);
		this.items.get(1).setHeight(h);
		this.items.get(1).setPosition(w,0);
		
	 }
	 
	 if (this.mapIndex == 1) {

		this.items.get(0).setWidth(w);
		this.items.get(0).setHeight(h);
		this.items.get(0).setPosition((w * -1),0);
		
		this.items.get(1).setWidth(w);
		this.items.get(1).setHeight(h);
		this.items.get(1).setPosition(0,0);
		
	 }
	 
	 if (this.mapIndex == 2) {
		this.items.each(function(item) {
				
				item.setWidth(Math.round(w/2));
				item.setHeight(h);
								 
								 });
		
		this.items.get(1).setPosition(Math.round(w/2),0);
	 }

	this.items.get(1).resizeContainer();
	this.items.get(0).resizeContainer();

	}
	
});