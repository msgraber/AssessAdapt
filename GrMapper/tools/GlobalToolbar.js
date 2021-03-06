

Ext.define('GrMapper.tools.DualGlobalToolbar', {
    extend: 'Ext.container.Container',
	requires: ['GrMapper.tools.NavLinkMaps','GrMapper.DualMapPort'],
	alias: 'widget.globaltoolbar',

	style:"z-index:3000;background: none; border: 0px",
	
	config: {
        mapPort: {}
    },
	
    initComponent: function() {
		
		this.callParent();
		
	viewswitcher = Ext.create('Ext.button.Cycle', {
    showText: true,
	style:"background-color:#d2e0f2;",
    prependText: 'View: ',
	mp: this.mapPort,
    menu: {
        items: [{
            text: 'Left',
            iconCls: 'view-text',
            checked: true,
			value: 0
        },{
            text: 'Right',
            iconCls: 'view-html',
			value: 1
        },{
            text: 'Split',
            iconCls: 'view-html',
			value: 2
        }]
    },
    changeHandler: function(cycleBtn, activeItem) {
        //Ext.Msg.alert('Change View', activeItem.value);
		
		this.mp.changeMapView(activeItem.value);
		
    }
});
	
	this.viewSwitcher = viewswitcher;
	
	vmaps = [this.mapPort.items.get(0).map,this.mapPort.items.get(1).map]
		
		this.add([viewswitcher,{xtype:'linkmaps', maps:vmaps}])
		
														   										   
    }
	

	
});