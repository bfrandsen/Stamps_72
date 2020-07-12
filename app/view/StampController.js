/* global Ext */

Ext.define('Stamps.view.StampController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.viewstamp',
  config: {
    page: 1},
  control: {
    '#insertbutton': {
      click: 'onInsertButtonClick'
    },
    'actioncolumn': {
      click: function (view, cell, row, col, event, rec) {
        var pre = "[class$='x-fa";
        if (event.getTarget(pre + "s fa-arrow-up'")) {
          this.onCopyRowClick(rec);
        }
        if (event.getTarget(pre + "r fa-image'")) {
          this.onLoadPicButtonClick(rec, event);
        }
      }
    },
    'viewstamp': {
      beforecellkeydown: 'onBeforeCellkeydown',
      beforeedit: 'onBeforeEdit'
    },
    'viewstamp > pagingtoolbar': {
      change: 'onPageChange'
    },
    '#defaultnumber': {
      keyup: 'onKeyUp'
    }
  },
  onKeyUp: function (field, event, opt) {
    var n = Number(field.value);
    if (n) {
      var key = event.keyCode;
      if (key === 38 || key === 40)
        field.setValue(n + 39 - key);
      return false;
    }
  },
  onBeforeEdit: function (editor, context) {
    if (context.field === 'Imagename')
      if (context.value === '') {
        var store = context.grid.getStore();
        var preRecord = store.getByInternalId(context.record.internalId - 1), record = store.getByInternalId(context.record.internalId);
        if (preRecord !== null) {
          var value = preRecord.get('Imagename'), comma = value.indexOf(',');
          if (comma >= 0)
            value = value.substring(0, comma);
          for (var i = 0; i < record.get('sortorder') - preRecord.get('sortorder'); i++)
            value = this.stepImagename(value);
          store.data.items[context.rowIdx].set('Imagename', value);

        }
      }
  },
  stepImagename: function (string) {
    var chars = string.split('');
    for (var i = chars.length - 1; i >= 0; i--) {
      if (chars[i] === 'Z') {
        chars[i] = 'A';
        if (i === 0)
          chars.splice(i, 0, 'A');
      } else if (chars[i] === '9') {
        chars[i] = '0';
        if (i > 0) {
          if (chars[i - 1].match(/[A-Z]/i)) {
            chars.splice(i, 0, '1');
            break;
          }
        }
      } else {
        chars[i] = String.fromCharCode(chars[i].charCodeAt() + 1);
        break;
      }
    }
    return chars.join('');
  },
  onLoadPicButtonClick: function (rec, event) {
    var win = Ext.create('Ext.window.Toast', {
      align: 'tl',
      dir: rec.get('stampworldDirectory'),
      img: rec.get('Imagename'),
      width: 22,
      height: 62,
      title: rec.get('katalognummer'),
      bodyStyle: {
        background: '#222'
      },
      layout: {
        type: 'hbox',
        align: 'center'}
    });
    Ext.each(rec.get('Imagename').split(','), function (img) {
      this.addImage(win, img);
    }, this);
    win.show();
  },
  addImage: function (win, image) {
    image = image.indexOf('-') < 0 ? image + '-s' : image;
    win.add({xtype: 'image', alt: image, src: 'https://swmedia-4cd6.kxcdn.com/media/catalogue/' + win.dir + '/' + image + '.jpg',
      listeners: {render: function (me) {
          this.mon(this.getEl(), 'load', function (e) {
            var parentwindow = me.up('toast');
            if (parentwindow.getWidth() - this.getWidth() < 0)
              parentwindow.setWidth(22 + this.getWidth() + 1);
            else
              parentwindow.setWidth(parentwindow.getWidth() + this.getWidth());
            if (parentwindow.getHeight() - 62 < this.getHeight())
              parentwindow.setHeight(this.getHeight() + 62);
          });
        }}});
  },
  onInsertButtonClick: function (me) {
    var tb = me.up('toolbar'), store = this.getView().getStore(), task = new Ext.util.DelayedTask(function () {
      this.getView().down('pagingtoolbar').doRefresh();
    }, this);
    store.add({
      katalognummer: tb.query('#defaultnumber')[0].getValue(),
      Kvalitet: tb.query('#defaultquality')[0].getValue(),
      katalogvalue: tb.query('#defaultvalue')[0].getValue()
    });
    task.delay(250);
  },
  onCopyRowClick: function (/*view, rowIndex, colIndex, item, e, */record) {
    var tb = this.getView().down('toolbar');
    tb.query('#defaultnumber')[0].setValue(record.get('katalognummer'));
    tb.query('#defaultquality')[0].setValue(record.get('Kvalitet'));
    tb.query('#defaultvalue')[0].setValue(record.get('katalogvalue'));
  },
  onBeforeCellkeydown: function (me, td, ci, rec, tr, ri, e) {
    if (ri === me.getStore().pageSize - 1 && e.keyCode === 40) {
      this.getView().down('pagingtoolbar').moveNext();
      return false;
    }
    if (ri === 0 && e.keyCode === 38) {
      this.getView().down('pagingtoolbar').movePrevious();
      return false;
    }
    var plugin = me.up('grid').findPlugin('cellediting');
    if (plugin.editing && e.position.column.text === 'Imagenavn') {
      var editor = plugin.getActiveEditor(), value = editor.getValue();
      if (e.getKey() === 188) {
        var comma = value.lastIndexOf(',');
        editor.setValue(editor.getValue() + ',' + this.stepImagename(comma >= 0 ? value.substr(comma + 1) : value));
        e.preventDefault();
      }
      if (e.getKey() === 189) {
        editor.setValue(editor.getValue() + '-b');
        e.preventDefault();
      }
      return false;
    }
  },
  onPageChange: function (me, data) {
    if (data.total !== 0) {
      var row = data.currentPage >= this.getPage() ? 0 : data.toRecord - data.fromRecord;
      this.setPage(data.currentPage);
      this.getView().getSelectionModel().select({row: row, column: 4});
      this.getView().getView().focusRow(row);
    }
  }
});