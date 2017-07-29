/* global Ext */

Ext.define('Stamps.model.Stamp', {
  extend: 'Ext.data.Model',
  fields: [
  {
    name: 'id',     
    type: 'int'
  },{
    name: 'Nr',     
    type: 'string'
  },
  {
    name: 'katalognummer',     
    type: 'string'
  },
  {
    name: 'Kvalitet', 
    type: 'integer'
  },
  {
    name: 'katalogvalue',     
    type: 'float'
  },
  {
    name: 'value',     
    type: 'float'
  },
  {
    name: 'valuta',     
    type: 'string'
  },
  {
    name: 'stampworldDirectory',     
    type: 'string'
  },
  {
    name: 'Imagename',     
    type: 'string'
  }
  ]
});