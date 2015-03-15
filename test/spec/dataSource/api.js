﻿(function () {
  'use strict';
  /*global describe, blocks, it, expect */

  var testing = blocks.testing;

  describe('blocks.DataSource (API) ->', function () {
    var options;
    beforeEach(function () {
      testing.overrideAjax({
        'GetOptions': function (opts) {
          options = opts;
        }
      });
    });

    afterEach(function () {
      testing.restoreAjax();
      options = null;
    });

    describe('data()', function () {
      it('returns empty array by default', function () {
        var dataSource = new blocks.DataSource();
        expect(dataSource.data().length).toBe(0);
      });

      it('is observable', function () {
        var dataSource = new blocks.DataSource();
        expect(blocks.isObservable(dataSource.data)).toBe(true);
      });
    });

    describe('view()', function () {
      it('view() returns empty array by default', function () {
        var dataSource = new blocks.DataSource();
        expect(dataSource.view().length).toBe(0);
      });

      it('is observable', function () {
        var dataSource = new blocks.DataSource();
        expect(blocks.isObservable(dataSource.view)).toBe(true);
      });
    });

    describe('query()', function () {
      it('without parameters gets default options', function () {
        var dataSource = new blocks.DataSource();
        dataSource.query(function (data) {
          expect(data.length).toBe(2);
          expect(data[0].FirstName).toBe('Antonio');
        });
      });

      it('does not populate the view()', function () {
        var dataSource = new blocks.DataSource();
        dataSource.query();
        expect(dataSource.view().length).toBe(0);
      });

      it('does not populate the data()', function () {
        var dataSource = new blocks.DataSource();
        dataSource.query();
        expect(dataSource.data().length).toBe(0);
      });

      it('the callback is called', function () {
        var dataSource = new blocks.DataSource();
        var isCallbackCalled = false;
        dataSource.query(function () {
          isCallbackCalled = true;
        });
        expect(isCallbackCalled).toBe(true);
      });
    });

    describe('fetch()', function () {
      it('fetch callback is called', function () {
        var isFetchCalled = false;
        var dataSource = new blocks.DataSource();
        dataSource.fetch(function () {
          isFetchCalled = true;
        });
        expect(isFetchCalled).toBe(true);
      });

      it('fetch() populates the view correctly', function () {
        var dataSource = new blocks.DataSource();
        dataSource.fetch();
        expect(dataSource.view().length).toBe(2);
        expect(dataSource.view()[0].FirstName).toBe('Antonio');
      });

      it('fetch() populates the data correctly', function () {
        var dataSource = new blocks.DataSource();
        dataSource.fetch();
        expect(dataSource.data().length).toBe(2);
        expect(dataSource.data()[0].FirstName).toBe('Antonio');
      });

      it('fetch() retrieves paged data for the first page', function () {
        var dataSource = new blocks.DataSource();
        dataSource.pageSize(1);
        dataSource.fetch();
        expect(dataSource.data().length).toBe(2);
        expect(dataSource.view().length).toBe(1);
        expect(dataSource.data()[0].FirstName).toBe('Antonio');
        expect(dataSource.data()[1].FirstName).toBe('Mihaela');
        expect(dataSource.view()[0].FirstName).toBe('Antonio');
      });

      it('fetch() retieves paged data for the second page', function () {
        var dataSource = new blocks.DataSource();
        dataSource.page(2);
        dataSource.pageSize(1);
        dataSource.fetch();
        expect(dataSource.data().length).toBe(2);
        expect(dataSource.view().length).toBe(1);
        expect(dataSource.data()[0].FirstName).toBe('Antonio');
        expect(dataSource.data()[1].FirstName).toBe('Mihaela');
        expect(dataSource.view()[0].FirstName).toBe('Mihaela');
      });

      it('fetch() ', function () {

      });
    });

    describe('read()', function () {
      it('returns the dataSource object', function () {
        var dataSource = new blocks.DataSource();
        expect(dataSource.read()).toBe(dataSource);
      });

      it('retrieves all data', function () {
        var dataSource = new blocks.DataSource();
        dataSource.read();
        expect(dataSource.data().length).toBe(2);
        expect(dataSource.data.at(0)['FirstName']).toBe('Antonio');
        expect(dataSource.view().length).toBe(2);
        expect(dataSource.view.at(0)['FirstName']).toBe('Antonio');
      });

      it('without calling read() data is not selected', function () {
        var dataSource = new blocks.DataSource();
        expect(dataSource.data().length).toBe(0);
        expect(dataSource.view().length).toBe(0);
      });

      it('changes are automatically cleared after read repopulation', function () {
        var dataSource = new blocks.DataSource();
        dataSource.read();
        dataSource.add({
          FirstName: 'Test'
        });
        expect(dataSource.hasChanges()).toBe(true);
        dataSource.read();
        expect(dataSource.hasChanges()).toBe(false);
      });

      it('accepts parameters which are passed to the ajax request', function () {

      });

      it('accepts a callback function as last parameter after the additional parameters', function () {
        var dataSource = new blocks.DataSource();
        var isCallbackCalled = false;
        dataSource.read(1, 2, function () {
          isCallbackCalled = true;
        });
        expect(isCallbackCalled).toBe(true);
      });

      it('accepts a callback as only parameter', function () {
        var dataSource = new blocks.DataSource();
        var isCallbackCalled = false;
        dataSource.read(function () {
          isCallbackCalled = true;
        });
        expect(isCallbackCalled).toBe(true);
      });
    });

    describe('update()', function () {

    });

    describe('hasChanges()', function () {
      it('when no changes hasChanges returns false', function () {
        var dataSource = new blocks.DataSource();
        expect(dataSource.hasChanges()).toBe(false);
        dataSource.read();
        expect(dataSource.hasChanges()).toBe(false);
      });

      it('when there are changes hasChanges returns true', function () {
        var dataSource = new blocks.DataSource();
        dataSource.read();
        dataSource.add({
          FirstName: 'Test'
        });
        expect(dataSource.hasChanges()).toBe(true);
      });

      it('returns false when adding a new record and then removing it', function () {
        var dataSource = new blocks.DataSource();
        dataSource.read();
        dataSource.add({
          FirstName: 'Test'
        });
        dataSource.remove(dataSource.data.last());
        expect(dataSource.hasChanges()).toBe(false);
      });

      it('after sync() is called the changes are cleared', function () {
        var dataSource = new blocks.DataSource();
        dataSource.read();
        dataSource.add({
          FirstName: 'Test'
        });
        dataSource.sync();
        expect(dataSource.hasChanges()).toBe(false);
      });
    });

    describe('clearChanges()', function () {
      it('returns the dataSource object', function () {
        var dataSource = new blocks.DataSource();
        expect(dataSource.clearChanges()).toBe(dataSource);
      });

      it('clearChanges() clears all changes', function () {
        var dataSource = new blocks.DataSource();
        dataSource.add({
          FirstName: 'Test'
        });
        expect(dataSource.hasChanges()).toBe(true);
        expect(dataSource.clearChanges().hasChanges()).toBe(false);
      });

      it('clearChanges() clears multiple changes', function () {
        var dataSource = new blocks.DataSource();
        dataSource.read();
        dataSource.add({
          FirstName: 'Test'
        });
        dataSource.remove(0);
        var item = dataSource.data.first();
        item.City = 'Sofia';
        dataSource.update(item);

        expect(dataSource.clearChanges().hasChanges()).toBe(false);
      });

      it('after all changes are cleared sync() does not do anything', function () {
        var dataSource = new blocks.DataSource({
          create: {
            url: 'create'
          },
          update: {
            url: 'update'
          },
          destroy: {
            url: 'destroy'
          }
        });
        dataSource.read();
        dataSource.add({
          FirstName: 'Test'
        });
        dataSource.remove(0);
        var item = dataSource.data.first();
        item.City = 'Sofia';
        dataSource.update(item);

        var isAjaxCalled = false;
        testing.overrideAjax({
          'create': function () {
            isAjaxCalled = true;
          },
          'update': function () {
            isAjaxCalled = true;
          },
          'destroy': function () {
            isAjaxCalled = true;
          }
        })

        dataSource.clearChanges().sync();
        expect(isAjaxCalled).toBe(false);
      });
    });

    describe('sync()', function () {
      it('sync() returns the dataSource object', function () {
        var dataSource = new blocks.DataSource();
        expect(dataSource.sync()).toBe(dataSource);
      });

      it('sync() called without changes does nothing', function () {
        var isAjaxCalled = false;
        testing.overrideAjax({
          'SyncTest': function () {
            isAjaxCalled = true;
          }
        });
        var dataSource = new blocks.DataSource({
          create: {
            url: 'SyncTest'
          },
          update: {
            url: 'SyncTest'
          },
          destroy: {
            url: 'SyncTest'
          },
          read: {
            url: 'SyncTest'
          }
        });
        dataSource.sync();
        expect(isAjaxCalled).toBe(false);
      });

      it('ajax request is fired when there are changes', function () {
        var isAjaxCalled = false;
        testing.overrideAjax({
          'SyncTest': function () {
            isAjaxCalled = true;
          }
        });

        var dataSource = new blocks.DataSource({
          create: {
            url: 'SyncTest'
          }
        });

        dataSource.add({
          FirstName: 'Test'
        });

        dataSource.sync();

        expect(isAjaxCalled).toBe(true);
      });

      it('when adding item the DataItem is passed to the ajax request', function () {
        var dataItem;
        testing.overrideAjax({
          'SyncTest': function (options) {
            dataItem = jQuery.parseJSON(options.data);
          }
        });

        var dataSource = new blocks.DataSource({
          create: {
            url: 'SyncTest'
          }
        });
        dataSource.add({
          FirstName: 'Antonio',
          LastName: 'Stoilkov'
        });
        dataSource.sync();
        expect(dataItem.FirstName).toBe('Antonio');
        expect(dataItem.LastName).toBe('Stoilkov');
      });

      it('when updating item the DataItem is passed to the ajax request', function () {
        var dataItem;
        testing.overrideAjax({
          'SyncTest': function (options) {
            dataItem = jQuery.parseJSON(options.data);
          }
        });

        var dataSource = new blocks.DataSource({
          update: {
            url: 'SyncTest'
          }
        });
        dataSource.fetch();
        var item = dataSource.view.first();
        item.City = 'Sofia';
        dataSource.update(item);
        dataSource.sync();
        expect(dataItem.Id).toBe(0);
        expect(dataItem.City).toBe('Sofia');
      });

      it('when removing item and no idAttr is specified in the options the DataItem is passed to the ajax request', function () {

      });

      it('when removing item and the idAttr is specified in the options only the Id is passed to the ajax request', function () {

      });

      it('when autoSync is set to true the sync() method is called automatically on data operations', function () {

      });

      it('when there are multiple changes the sync() method calles an ajax request multiple times', function () {

      });
    });
  });
})();
