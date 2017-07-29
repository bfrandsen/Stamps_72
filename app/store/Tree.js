/* global Ext */

Ext.define('Stamps.store.Tree', {
  extend: 'Ext.data.TreeStore',
  storeId: 'store-tree',
  model: 'Stamps.model.TreeItem',
  autoLoad:true,
  autoSync: true,
  proxy: {
    type: 'ajax',
    api: {
      read: 'resources/data/treegrid.php',
      update: 'resources/data/updatetreegrid.php'
    },
    reader: {
      type: 'json',
      successProperty: 'success'
    },
    writer:{
      type:'json',
      successProperty: 'success',
      rootProperty: 'data',
      encode: true,
      writeAllFields: false
    }
  },
  folderSort: true
});