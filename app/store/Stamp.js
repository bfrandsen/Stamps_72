/* global Ext */

Ext.define('Stamps.store.Stamp', {
  extend: 'Ext.data.Store',
  alias: 'store.stamp',
  storeId : 'store-stamp',
  model: 'Stamps.model.Stamp',
  autoLoad: true,
  autoSync: true,
  remoteFilter: true,
  remoteSort: true,
  pageSize: 31,
  proxy: {
    type: 'ajax',
    api: {
      read: 'resources/data/stamps.php',
      update: 'resources/data/updstamps.php',
      create: 'resources/data/insstamps.php'
    },
    reader: {
      type: 'json',
      rootProperty: 'data',
      successProperty: 'success'
    },
    writer: {
      type: 'json',
      successProperty: 'success',
      rootProperty: 'data',
      encode: true,
      writeAllFields: false
    }
  }
});