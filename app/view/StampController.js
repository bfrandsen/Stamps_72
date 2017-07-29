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
        var pre = "[class$='x-fa fa-";
        if (event.getTarget(pre + "arrow-up'")) {
          this.onCopyRowClick(rec);
        }
        if (event.getTarget(pre + "photo'")) {
          this.onLoadPicButtonClick(rec, event);
        }
      }
    },
    'viewstamp': {
      cellkeydown: 'onCellkeydown',
      beforeedit: 'onBeforeEdit'
    },
    'viewstamp > pagingtoolbar': {
      change: 'onPageChange'
    }
  },
  onBeforeEdit: function (editor, context) {
    if (context.field === 'Imagename')
      if (context.value === '') {
        var preRecord = context.grid.getStore().getByInternalId(context.record.internalId - 1);
        if (preRecord !== null) {
          var value = preRecord.get('Imagename'), comma = value.lastIndexOf(',');
          if (comma >= 0)
            value = value.substr(comma + 1);
          context.grid.getStore().data.items[context.rowIdx].set('Imagename', this.stepImagename(value));

        }
      }
  },
  stepImagename: function (string) {
    var chars = string.split('');
    for (var i = chars.length - 1; i >= 0; i--) {
      if (chars[i] === 'Z') {
        chars[i] = 'A';
      } else if (chars[i] === '9') {
        chars[i] = '0';
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
              parentwindow.setWidth(22 + this.getWidth());
            else
              parentwindow.setWidth(parentwindow.getWidth() + this.getWidth());
            if (parentwindow.getHeight() - 62 < this.getHeight())
              parentwindow.setHeight(this.getHeight() + 62);
          });
        }}});
  },
  onInsertButtonClick: function (me) {
    var tb = me.up('toolbar'), store = this.getView().getStore();
    store.add({
      katalognummer: tb.query('#defaultnumber')[0].getValue(),
      Kvalitet: tb.query('#defaultquality')[0].getValue(),
      katalogvalue: tb.query('#defaultvalue')[0].getValue()
    });
    store.reload();
  },
  onCopyRowClick: function (/*view, rowIndex, colIndex, item, e, */record) {
    var tb = this.getView().down('toolbar');
    tb.query('#defaultnumber')[0].setValue(record.get('katalognummer'));
    tb.query('#defaultquality')[0].setValue(record.get('Kvalitet'));
    tb.query('#defaultvalue')[0].setValue(record.get('katalogvalue'));
  },
  onCellkeydown: function (me, td, ci, rec, tr, ri, e) {
    var ptb = this.getView().down('pagingtoolbar');
    if (ri === 25 && e.keyCode === 40) {
      ptb.moveNext();
    }
    if (ri === 0 && e.keyCode === 38)
      ptb.movePrevious();
  },
  onPageChange: function (me, data) {
    if (data.total !== 0) {
      var row = data.currentPage >= this.getPage() ? 0 : data.toRecord - data.fromRecord;
      this.setPage(data.currentPage);
      this.getView().getSelectionModel().select({row: row, column: 3});
      this.getView().getView().focusRow(row);
    }
  }
});