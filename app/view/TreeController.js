/* global Ext */

Ext.define('Stamps.view.TreeController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.viewtree',
  listen: {
    store: {
      '#currency': {
        load: 'onCurrencyLoad'
      }
    }
  },
  control: {
    'viewtree': {
      select: 'onTreeSelect'
    },
    'viewtree tableview': {
      beforedrop: 'onTreeBeforeDrop'
    },
    'viewtree actioncolumn': {
      click: function (view, cell, row, col, event, rec) {
        var pre = "[class$='x-far fa-";
        if (event.getTarget(pre + "plus-square'")) {
          this.onCreate(rec);
        }
        if (event.getTarget(pre + "minus-square'")) {
          this.onDelete(rec);
        }
      }
    }
  },
  onTreeSelect: function (me, rec, index) {
    if (rec.get('id').substr(0, 3) === 'typ') {
      var type = rec.get('id').slice(4),
              grid = Ext.ComponentQuery.query('viewstamp')[0],
              store = grid.getStore(),
              view = grid.getView(),
              bc = Ext.ComponentQuery.query('breadcrumb')[0];
      bc.setSelection(rec);
      view.deselect(view.getSelectedNodes());
      store.getProxy().setExtraParam('Nr', type);
      store.sorters.clear();
      store.load({addRecords: false});
      grid.down('#insertbutton').enable();
      grid.down('pagingtoolbar').moveFirst();
    }
  },
  //Ensures only country can be dragged
  onTreeBeforeDrop: function (node, data, overmodel) {
    var country = data.records[0].get('id');
    var catalog = overmodel.get('id');
    return catalog.substr(0, 3) === 'cat' && country.substr(0, 3) === 'cou';
  },
  onDelete: function (rec) {
    Ext.Ajax.request({
      url: 'resources/data/delete.php',
      params: {
        id: rec.get('id'),
        records: rec.get('records')},
      success: function (response, opts) {
        var obj = Ext.decode(response.responseText);
        Ext.Msg.show({
          title: 'Katalog ' + obj.success ? '' : 'ikke ' + 'slettet',
          buttons: Ext.Msg.OK,
          icon: obj.success ? Ext.Msg.INFO : Ext.Msg.WARNING,
          message: obj.status,
          fn: function (btn) {
            if (obj.success)
              Ext.getStore('store-tree').load();
          }});
      },
      failure: function (response, opts) {
        console.log('server-side failure with status code ' + response.status);
      }
    });
  },
  onCreate: function (rec) {
    var type = 'katalog';
    /*if (Ext.String.startsWith(rec.get('id'), 'cat'))
     type = 'nyt katalog';
     else if (Ext.String.startsWith(rec.get('id'), 'cou'))
     type = 'nyt land';
     else if (Ext.String.startsWith(rec.get('id'), 'typ'))
     type = 'ny kategori';*/
    Ext.create('Ext.window.Window', {
      width: 500,
      height: 150,
      padding: 5,
      modal: true,
      title: 'Adder ' + type,
      items: {xtype: 'form',
        items: [{xtype: 'textfield', width: 480, reference: 'title', fieldLabel: Ext.String.capitalize(type), value: rec.get('title'), allowBlank: false, name: 'title'}],
        buttons: [{text: 'OK', formBind: true, scope: rec,
            handler: function (btn) {
              var form = btn.up('form'), val = form.down('textfield').getValue();
              form.submit({
                url: 'resources/data/add.php',
                params: {
                  parent: rec.get('parentId'),
                  valuta: rec.get('valuta')},
                success: function (form, opts) {
                  btn.up('window').close();
                  var obj = Ext.decode(opts.response.responseText);
                  Ext.Msg.show({
                    title: 'Info',
                    buttons: Ext.Msg.OK,
                    icon: obj.success ? Ext.Msg.INFO : Ext.Msg.WARNING,
                    message: obj.status,
                    fn: function (btn) {
                      Ext.getStore('store-tree').load();
                    }});
                },
                failure: function (form, opts) {
                  console.log('server-side failure with status code ' + opts.response.status);
                }
              });
            }}]
      }
    }
    ).show();
  },
  onCurrencyLoad: function () {
    var rec = Ext.getStore('currency').getAt(0), dkk = rec.get('DKK');
    this.valutaAjax('NOK', dkk / rec.get('NOK'), false);
    this.valutaAjax('SEK', dkk / rec.get('SEK'), false);
    this.valutaAjax('EUR', dkk / rec.get('EUR'), true);
  },
  valutaAjax: function (land, kurs, final) {
    Ext.Ajax.request({
      url: 'resources/data/updatevaluta.php',
      method: 'POST',
      params: {
        Land: land,
        Kurs: kurs
      },
      success: function (response, opts) {
        var obj = Ext.decode(response.responseText);
        if (obj.success && final) {
          var tree = Ext.ComponentQuery.query('viewtree')[0];
          tree.expandNode(tree.getRootNode());
          tree.collapseNode(tree.getRootNode());
        }
      }
    });
  }
});
