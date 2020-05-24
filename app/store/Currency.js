/* global Ext */

Ext.define ('Stamps.store.Currency', {
  extend: 'Ext.data.Store',
  storeId: 'currency',
  autoLoad:true,
  proxy: {
    type: 'jsonp',
    url: 'https://openexchangerates.org/api/latest.json?app_id=5e90f8da83994dbaba8a18852c67c1b0',
    reader: {
      type: 'json',
      record: 'rates'
    }
  }
});
