/* global Ext */

Ext.define ('Stamps.store.Quality', {
  extend: 'Ext.data.Store',
  storeId: 'Quality',
  model: 'Stamps.model.Dropdown',
  autoLoad:true,
  proxy: {
    type: 'ajax',
    api: {
      read: 'resources/data/quality.php'
    },
    reader: {
      type: 'json',
      rootProperty: 'data',
      totalProperty: 'total'
    }
  }
});
