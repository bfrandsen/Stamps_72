/* global Ext */

Ext.define('Stamps.view.Stamp', {
  extend: 'Ext.grid.Panel',
  viewConfig: {
    preserveScrollOnRefresh: true
  },
  xtype: 'viewstamp',
  controller: 'viewstamp',
  requires: ['Stamps.view.StampController'],
  store: {type: 'stamp'},
  scrollable: 'y',
  multiColumnSort: true,
  columns: [{xtype: 'actioncolumn',
      width: 30,
      items: [{iconCls: 'x-fas fa-arrow-up',
          tooltip: 'Copy to form'
        }]},
    {xtype: 'actioncolumn',
      width: 30,
      items: [{getClass: function (v, meta, rec) {
            if (rec.get('Imagename'))
            {
              return 'x-far fa-image';
            }
          },getTip: function (v, meta, rec) {
            if (rec.get('Imagename'))
            {
              return 'Vis billede';
            }
          },
          isDisabled: function (v, row, col, item, rec) {
            return !rec.get('Imagename');
          }
        }]},
    {
      dataIndex: 'Nr',
      text: 'Index',
      width: 100,
      hidden: true
    },
    {
      dataIndex: 'Imagename',
      text: 'Imagenavn',
      width: 200,
      hidden: true,
      editor: {
        allowBlank: true
      },
      filter: 'string'
    }, {
      dataIndex: 'katalognummer',
      text: 'Katalognummer',
      width: 155,
      align: 'right',
      editor: {
        allowBlank: false
      },
      filter: 'string'
    }, {
      dataIndex: 'Kvalitet',
      text: 'Kvalitet (Type)',
      width: 200,
      editor: {
        xtype: 'combobox',
        typeAhead: true,
        queryMode: 'local',
        store: {type: 'quality'},
        valueField: 'id'
      },
      filter: {type: 'list', store: {type: 'quality'}},
      renderer: function (value) {
        var types = Ext.getStore('Quality');
        return types.getAt(types.findExact('id', value)).get('text');
      }
    }, {
      dataIndex: 'katalogvalue',
      text: 'Katalogværdi',
      width: 150,
      align: 'right',
      editor: {
        allowBlank: false
      },
      filter: 'number',
      renderer: function (value, meta, record) {
        return Ext.util.Format.currency(value, record.get('valuta'), 2, true, ' ');
      }
    }, {
      dataIndex: 'value',
      text: 'Værdi',
      flex: 1,
      align: 'right',
      sortable: false,
      renderer: function (value) {
        return Ext.util.Format.currency(value, 'kr.', 2, true, ' ');
      }
    }],
  selModel: {
    pruneRemoved: false,
    type: 'cellmodel'
  },
  plugins: [
    {ptype: 'cellediting', clicksToEdit: 2, id: 'edit'}, {ptype: 'gridfilters', menuFilterText: 'Filtrer', id: 'filter'}
  ],
  /*features: [{
   ftype: 'filters',
   // encode and local configuration options defined previously for easier reuse
   encode: false, // json encode the filter query
   local: false   // defaults to false (remote filtering)    
   }],*/
  dockedItems: [{
      xtype: 'pagingtoolbar',
      dock: 'bottom',
      displayInfo: true
    }, {
      xtype: 'toolbar',
      store: {type: 'stamp'},
      dock: 'top',
      items: [{
          xtype: 'textfield',
          id: 'defaultnumber',
          enableKeyEvents: true,
          fieldLabel: 'Katalognummer:',
          value: 'Change',
          labelWidth: 100,
          width: 180
        }, {
          xtype: 'combobox',
          id: 'defaultquality',
          width: 200,
          typeAhead: true,
          queryMode: 'local',
          store: {type: 'quality'},
          valueField: 'id',
          value: 6
        }, {
          xtype: 'numberfield',
          id: 'defaultvalue',
          fieldLabel: 'Katalogværdi:',
          value: 10,
          labelWidth: 80,
          width: 180
        }, {
          id: 'insertbutton',
          glyph: 43,
          tooltip: 'Indsæt ny post',
          disabled: true
        }]
    }]
});