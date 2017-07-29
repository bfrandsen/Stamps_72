/* global Ext */

Ext.define('Stamps.model.Dropdown', {
  extend: 'Ext.data.Model',
  idProperty: 'id',
  fields: [{
      name: 'id',
      type: 'int'
    }, {
      name: 'text',
      type: 'string'
    }]
});