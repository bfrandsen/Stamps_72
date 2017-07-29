/* global Ext */

Ext.define('Stamps.view.Viewport', {
  extend: 'Ext.container.Viewport',
  requires:['Stamps.view.Stamp','Stamps.view.Tree'],
  layout: 'border',
  defaults: {
    split: true,
    border:false,
    layout:'fit'
  },
  items:[{          
    region:'center',
    xtype:'viewstamp', 
    id:'centerpanel',
    title:'Data visning',
    autoDestroy:true
  },{ 
    region:'west',
    xtype:'viewtree',
    id:'eastpanel'
  }]
});
