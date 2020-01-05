/* global Ext */

Ext.define('Stamps.view.Tree', {
  extend: 'Ext.tree.Panel',
  xtype: 'viewtree',
  controller: 'viewtree',
  requires: ['Stamps.view.TreeController'],
  title: 'Navigator',
  iconCls: 'x-fa fa-archive',
  width: 600,
  collapsible: false,
  useArrows: true,
  autoLoad: true,
  rootVisible: false,
  multiSelect: false,
  singleExpand: true,
  plugins: {ptype: 'cellediting',
    clicksToEdit: 2,
    id: 'edit'},
  viewConfig: {
    plugins: [{
        ptype: 'treeviewdragdrop',
        displayField: 'title',
        sortOnDrop: true
      }]
  },
  columns: [{xtype: 'actioncolumn',
      width: 44,
      getTypeFromRecord: function (rec) {
        var prefix = rec.get('id').substring(0, 3);
        return prefix === 'cat' ? 'katalog' : (prefix === 'cou' ? 'land' : 'kategori');
      },
      items: [{getClass: function (v, meta, rec) {
            return this.getTypeFromRecord(rec) === 'katalog' ? 'x-fa fa-plus-square-o' : '';
          },
          getTip: function (v, meta, rec) {
            var typ = this.getTypeFromRecord(rec);
            return 'Adder ' + this.getTypeFromRecord(rec);
          },
          isDisabled: function (v, row, col, item, rec) {
            return this.getTypeFromRecord(rec) !== 'katalog';
          }
        }, {getClass: function (v, meta, rec) {
            return this.getTypeFromRecord(rec) === 'katalog' ? 'x-fa fa-minus-square-o' : '';
          },
          getTip: function (v, meta, rec) {
            return 'Slet ' + this.getTypeFromRecord(rec);
          },
          isDisabled: function (v, row, col, item, rec) {
            return this.getTypeFromRecord(rec) !== 'katalog';
          }
        }]}, {
      xtype: 'treecolumn', //this is so we know which column will show the tree
      text: 'Titel',
      width: 280,
      dataIndex: 'title',
      align: 'start',
      editor: {
        allowBlank: false
      }
    }, {
      text: 'Valuta',
      flex: 1,
      sortable: false,
      dataIndex: 'valuta',
      align: 'center'
    }, {
      text: 'Beløb',
      width: 115,
      sortable: false,
      dataIndex: 'amount',
      align: 'end',
      renderer: function (value) {
        return Ext.util.Format.currency(value, ' kr.', 2, true);
      }
    }, {
      header: 'Poster',
      flex: 1,
      sortable: false,
      dataIndex: 'records',
      align: 'end'
    }],
  store: 'store-tree'
});
