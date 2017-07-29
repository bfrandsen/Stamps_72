/* global Ext */

Ext.define('Stamps.model.TreeItem', {
  extend: 'Ext.data.Model',
  fields: [
    {
      name: 'title',
      type: 'string'
    },
    {
      name: 'valuta',
      type: 'string'
    },
    {
      name: 'amount',
      type: 'string'
    },
    {
      name: 'records',
      type: 'string'
    }]
});