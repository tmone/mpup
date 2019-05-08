
// Dom7
var $$ = Dom7;

// install plugin to Framework7
Framework7.use(Framework7Keypad);

// Theme
var theme = 'md';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
}

var getCallLog = function (beginTime, cbResult, cbError) {
  var filters = [
    {
      "name": "date",
      "value": beginTime,
      "operator": ">="
    }
  ];

  window.plugins.callLog.getCallLog(filters, function (data) {
    if (cbResult) {
      cbResult(data);
    }
  }, function (err) {
    if (cbError) {
      cbError(err);
    }
  });
}

var montionCall = function (number, beginTime, cbResult, cbError) {
  //var beginTime = new Date().getTime();
  getCallLog(beginTime, function (rs) {
    if (rs && rs.length > 0) {
      var foundList = rs.filter(function (x, i) {
        return x.number == number;
      });
      if (foundList.length > 0 && cbResult) {
        cbResult(foundList[0]);
      } else {
        setTimeout(function () {
          montionCall(number, beginTime, cbResult, cbError);
        }, 1000);
      }
    } else {
      setTimeout(function () {
        montionCall(number, beginTime, cbResult, cbError);
      }, 1000);
    }
  }, cbError);
}

var CACHER = [];

// Init App
var app = new Framework7({
  id: 'vn.com.kerryexpress.mpup',
  root: '#app',
  theme: theme,
  data: {
    appName: "NHẬN HÀNG",
    user: {
      user_name: null,
      password: '****',
      dc: ''
    },
    editing: false,
    lastChoice: {},
    serverUrl: "http://210.211.121.146:30000",
    pushBill: true,
    geoID: 0,
    geoLocation: {},
    signal: true,
    version: "1.0.0",
    waitlist: null,
    items: [],
    popupDate: null,
    popupDateCallback: null,

  },
  methods: {
    requestSMSPermission: function () {
      var success = function (hasPermission) {
        if (!hasPermission) {
          sms.requestPermission(function () {
            console.log('[OK] Permission accepted')
          }, function (error) {
            console.info('[WARN] Permission not accepted')
            // Handle permission not accepted
            app.toast.create({
              text: "Lỗi: " + "Bạn đã không cấp quyền để chương trình gửi các cảnh báo quan trọng!",
              closeTimeout: 2000,
            }).open();
          })
        }
      };
      var error = function (e) {
        setTimeout(app.methods.requestSMSPermission, 60 * 1000);
      };
      sms.hasPermission(success, error);
    },
    sendSms: function (number, message) {
      if (!number || number.length < 10 || !message || message.length < 3) {
        return;
      }
      console.log("number=" + number + ", message= " + message);

      //CONFIGURATION
      var options = {
        replaceLineBreaks: true, // true to replace \n by a new line, false by default
        android: {
          intent: 'INTENT'  // send SMS with the native android SMS messaging
          //intent: '' // send SMS without opening any other app
        }
      };

      sms.hasPermission(function (hasPermission) {
        if (hasPermission) {
          sms.send(number, message, options, function () {
            console.log("send SMS Success!");
          }, function () {
            console.log("send SMS Error! Send again 60s.");
            setTimeout(function () {
              app.methods.sendSms(number, message);
            }, 60000)
          });
        }
        else {
          // show a helpful message to explain why you need to require the permission to send a SMS
          // read http://developer.android.com/training/permissions/requesting.html#explain for more best practices
        }
      }, error);


    },
    saveCallLog: function (id, num, rs, beginTime) {
      if (rs && rs.number && rs.number.length > 0) {
        $.ajax({
          url:
            // 'http://localhost:34567'
            app.data.serverUrl
            + "/api/CallLog/CallLog",
          data: {
            values: JSON.stringify({
              Pickup_Order_ID: id,
              Call_User: app.data.user.user_name,
              Phone_Number: rs.number || num,
              Begin_Datetime: new Date(beginTime) || new Date(),
              End_Datetime: new Date() || new Date(rs.time + rs.duration * 1000),
              Duration: rs.duration || 0,
              Type: rs.type || "",
              Others: JSON.stringify(Object.assign({}, rs, { lol: app.data.geoLocation }))
            })
          },
          method: "POST",
          success: function (rs) {
            if (rs && cb) {
              cb(rs);
            }
          },
          error: function (err) {
            //debugger;
            if (err.status != 200 || err.status != 201) {
              app.toast.create({
                text: "Lỗi: " + JSON.stringify(err),
                closeTimeout: 2000,
              }).open();
            }
          }
        }).done(function (data) {

        }).fail(function (err) {
          //debugger;
          if (err.status != 200 || err.status != 201) {
            app.toast.create({
              text: "Lỗi: " + JSON.stringify(err),
              closeTimeout: 2000,
            }).open();
          }
        });
      }

    },
    getDimWeight: function (Packed_Length, Packed_Width, Packed_Height, Service_Code) {

      var rs = 0;
      if (Packed_Length > 0 && Packed_Width > 0 && Packed_Height > 0) {
        var sp = 3000;
        if (Service_Code == '0201'
          || Service_Code == '0202'
          || Service_Code == '0203'
        ) {
          sp = 6000;
        } else if (Service_Code == '0205') {
          sp = 3000;
        }
        var drc = Packed_Length * Packed_Width * Packed_Height;
        rs = drc / sp;
      }
      return rs;
    },
    getSummary: function(cb){
      $.ajax({
        url:
          // 'http://localhost:34567'
          app.data.serverUrl
          + "/api/Summary/Summary?u="+app.data.user.user_name+"&p="+app.data.user.password,        
        success: function (rs) {
          if (rs && cb) {
            cb(rs);
          }
        },
        error: function (err) {
          //debugger;
          if (err.status != 200 || err.status != 201) {
            app.toast.create({
              text: "Lỗi: " + JSON.stringify(err),
              closeTimeout: 2000,
            }).open();
          }
        }
      }).done(function (data) {

      }).fail(function (err) {
        //debugger;
        if (err.status != 200 || err.status != 201) {
          app.toast.create({
            text: "Lỗi: " + JSON.stringify(err),
            closeTimeout: 2000,
          }).open();
        }
      });
    },
    getCost: function (Custom_Code, Service_Code, Weight, Sender_Province_code, Receiver_Province_Code, Receiver_District_Code, cb) {
      $.ajax({
        url:
          // 'http://localhost:34567'
          app.data.serverUrl
          + "/api/Cost",
        data: {
          c: Custom_Code,
          s: Service_Code,
          w: Weight,
          sp: Sender_Province_code,
          rp: Receiver_Province_Code,
          rd: Receiver_District_Code
        },
        method: "POST",
        success: function (rs) {
          if (rs && cb) {
            cb(rs);
          }
        },
        error: function (err) {
          //debugger;
          if (err.status != 200 || err.status != 201) {
            app.toast.create({
              text: "Lỗi: " + JSON.stringify(err),
              closeTimeout: 2000,
            }).open();
          }
        }
      }).done(function (data) {

      }).fail(function (err) {
        //debugger;
        if (err.status != 200 || err.status != 201) {
          app.toast.create({
            text: "Lỗi: " + JSON.stringify(err),
            closeTimeout: 2000,
          }).open();
        }
      });
    },
    updateItem: function (poID, stausID) {
      var item = app.data.items.find(function (x, i, a) {
        return x.ID == poID;
      });
      if (item != null) {
        item.PRO = stausID;
      }
    },
    pickup: function (poID, stausID, exceptionID, mess, bills, cb) {
      app.preloader.show("multi");
      $.ajax({
        url: //'http://localhost:34567' 
          app.data.serverUrl + "/api/PickupScan4/PickupScan4",
        data: {
          u: app.data.user.user_name,
          p: app.data.user.password,
          i: poID,
          m: mess || ' ',
          s: stausID,
          e: exceptionID,
          b: bills
        },
        method: "POST",
        success: function () {
          app.methods.updateItem(poID, stausID);
        },
        error: function (err) {
          //debugger;
          if (err.status != 200 || err.status != 201) {
            app.toast.create({
              text: "Lỗi: " + JSON.stringify(err),
              closeTimeout: 2000,
            }).open();
          }
        }
      }).done(function (data) {
        app.methods.updateItem(poID, stausID);
      }).fail(function (err) {
        //debugger;
        if (err.status != 200 || err.status != 201) {
          app.preloader.hide();
          app.toast.create({
            text: "Lỗi: " + JSON.stringify(err),
            closeTimeout: 2000,
          }).open();
        }
      }).always(function () {
        app.preloader.hide();
        if (cb) {
          cb();
        }
      });
    },
    initCacher: function (cacherName, filter) {
      var key = "ID";
      var mainKey = key || 0;
      //if (!CACHER[cacherName] || !Array.isArray(CACHER[cacherName])) {
      CACHER[cacherName] = [];
      //}
      function changedStore() {
        app.data.editing = true;
      }
      var getStore = app.methods.initStore(cacherName, filter);
      var tmpStore = new DevExpress.data.ArrayStore({
        key: key,
        data: CACHER[cacherName],
        onInserted: changedStore,
        onUpdated: changedStore,
        onRemoved: function (k) {
          getStore.remove(k)
            .done(function (key) {
              // Process the "key" here
            })
            .fail(function (error) {

              var msg = JSON.stringify(error);
              var ty = msg.includes("deadlock");

              //app.preloader.hide();
              app.toast.create({
                text: "Lỗi: " + (ty ? "Server đang bận. Thử lại sau ít phút" : msg),
                closeTimeout: 2000,
              }).open();
            });
        }
      });



      getStore.load().done(function (data) {
        if (data && data.length > 0) {
          var tmd = data.map(function (x) {
            tmpStore.push([{ type: "insert", data: x }]);
          });
        }
      });

      return {
        store: tmpStore,
        serverStore: getStore,
        reshapeOnPush: true,
        syncServer: function (scb, ecb) {
          var self = this;
          if (!app.data.signal) {
            setTimeout(function () {
              self.syncServer(scb, ecb);
            }, 10000);
            return;
          }

          var ldata = self.store._array;
          var total = ldata.length;
          var successCount = 0;
          var errorCount = 0;
          for (var i = 0; i < ldata.length; i++) {
            var it = ldata[i];
            if (!it.ID || it.ID.toString().includes("-")) {
              var tmpit = Object.assign({}, it, { ID: 0 });
              self.serverStore.insert(tmpit)
                .done(function (dataObj, key) {
                  self.store.push([{
                    type: "update",
                    key: it.ID,
                    data: dataObj
                  }]);
                  successCount++;
                  if (successCount + errorCount == total) {
                    if (errorCount > 0) {
                      if (ecb) {
                        ecb(errorCount);
                        setTimeout(function () {
                          self.syncServer(scb, ecb);
                        }, 30000);
                      }
                    } else {
                      if (scb) {
                        scb(successCount);
                      }
                    }
                  }
                })
                .fail(function (error) {
                  errorCount++;
                  if (successCount + errorCount == total) {
                    if (errorCount > 0) {
                      if (ecb) {
                        ecb(error);
                        setTimeout(function () {
                          self.syncServer(scb, ecb);
                        }, 30000);
                      }
                    } else {
                      if (scb) {
                        scb(successCount);
                      }
                    }
                  }
                });
            } else {
              self.serverStore.update(it.ID, it)
                .done(function (dataObj, key) {
                  successCount++;
                  if (successCount + errorCount == total) {
                    if (errorCount > 0) {
                      if (ecb) {
                        ecb(errorCount);
                        setTimeout(function () {
                          self.syncServer(scb, ecb);
                        }, 30000);
                      }
                    } else {
                      if (scb) {
                        scb(successCount);
                      }
                    }
                  }
                })
                .fail(function (error) {
                  errorCount++;
                  if (successCount + errorCount == total) {
                    if (errorCount > 0) {
                      if (ecb) {
                        ecb(errorCount);
                        setTimeout(function () {
                          self.syncServer(scb, ecb);
                        }, 30000);
                      }
                    } else {
                      if (scb) {
                        scb(successCount);
                      }
                    }
                  }
                });
            }
          }
        }
      };
    },
    initStore: function (storeName, filter) {
      if (storeName && storeName.length > 0) {
        return DevExpress.data.AspNet.createStore({
          key: "ID",
          loadUrl: app.data.serverUrl + "/api/" + storeName + "/Get",
          insertUrl: app.data.serverUrl + "/api/" + storeName + "/Insert",
          updateUrl: app.data.serverUrl + "/api/" + storeName + "/Update",
          deleteUrl: app.data.serverUrl + "/api/" + storeName + "/Delete",
          // loadUrl: "http://localhost:34567" + "/api/" + storeName + "/Get",
          // insertUrl: "http://localhost:34567" + "/api/" + storeName + "/Insert",
          // updateUrl: "http://localhost:34567" + "/api/" + storeName + "/Update",
          // deleteUrl: "http://localhost:34567" + "/api/" + storeName + "/Delete",
          onBeforeSend: function (operation, ajaxSettings) {
            ajaxSettings.data.u = app.data.user.user_name;
            ajaxSettings.data.p = app.data.user.password;
            if (filter && filter.length > 0) {
              if (ajaxSettings.data.filter && ajaxSettings.data.filter.length > 0) {
                ajaxSettings.data.filter = '[' + ajaxSettings.data.filter + ',"and",' + JSON.stringify(filter) + ']';
              } else {
                ajaxSettings.data.filter = JSON.stringify(filter);
              }
            }
          },
          onAjaxError: function (e) {
            var msg = JSON.stringify(e);
            var ty = msg.includes("deadlock");

            //app.preloader.hide();
            app.toast.create({
              text: "Lỗi: " + (ty ? "Server đang bận. Thử lại sau ít phút" : msg),
              closeTimeout: 2000,
            }).open();

          }
        });
      } else {
        return new DevExpress.data.ArrayStore({
          key: "ID",
          data: []
        });
      }
    },
    setWait: function () {
      try {
        var n = app.data.items.filter(function (x) {
          return x.PRO == 2;
        }).length || 0;
        cordova.plugins.notification.badge.hasPermission(function (granted) {
          if (granted) {
            if (n && n > 0) {
              cordova.plugins.notification.badge.set(n);
            } else {
              cordova.plugins.notification.badge.clear();
            }
          } else {
            cordova.plugins.notification.badge.requestPermission(function (granted) {
              if (!granted) {
                app.toast.create({
                  text: "Lỗi: Không được cấp quyền để hiển thị thông báo!",
                  closeTimeout: 2000,
                }).open();
              }
            });
          }
        });
        $$(".count-wait").text(DevExpress.localization.formatNumber(n, "###,##0"));
      } catch (er) { }
      try {
        var n = app.data.items.filter(function (x) {
          return x.PRO == 3;
        }).length || 0;
        $$(".count-finish").text(DevExpress.localization.formatNumber(n, "###,##0"));
      } catch (er) { }
      try {
        var n = app.data.items.filter(function (x) {
          return x.PRO == 4;
        }).length || 0;
        $$(".count-cancel").text(DevExpress.localization.formatNumber(n, "###,##0"));
      } catch (er) { }
    },
    loadData: function (isShow) {
      if (isShow == false || isShow == true) {

      }
      else {
        isShow = true;
      }
      var self = this;
      if (self.data.user.user_name && self.data.user.user_name.length > 3) {
        if (isShow) {
          app.preloader.show("multi");
        } else {
          app.progressbar.show();
          $$(".count-wait").text('*');
        };

        var store = app.methods.initStore("Pickup_Order", [
          "Route_Code", "=", app.data.user.user_name
        ]);
        store.load().done(function (data) {
          if (isShow) { app.preloader.hide(); } else {
            app.progressbar.hide();
          }
          self.methods.updateList(data);

          var total = app.data.items.length;
          var wait = app.data.items.filter(function (x) {
            return x.PRO == 2;
          }).length || 0;
          if (total > 0 && wait == 0) {
            // $$("#search-id").hide();
            $$("#done-id").show();
          } else {
            // $$("#search-id").show();
            $$("#done-id").hide();
          }


        });


        // $.ajax({
        //   url: app.data.serverUrl + "/api/MPUP/" + app.data.user.user_name + "?u=" + app.data.user.user_name + "&p=" + app.data.user.password,
        //   method: "GET",
        //   success: function (data) {
        //     if (isShow) { app.preloader.hide(); } else {
        //       app.progressbar.hide();
        //     }
        //     self.methods.updateList(data);
        //   },
        //   error: function (err) {
        //     app.preloader.hide();
        //     var msg = JSON.stringify(err);
        //     var ty = msg.includes("deadlock");

        //     //app.preloader.hide();
        //     app.toast.create({
        //       text: "Lỗi: " + (ty ? "Server đang bận. Thử lại sau ít phút" : msg),
        //       closeTimeout: 2000,
        //     }).open();
        //     //console.timeEnd("Pushs:" + r.Consignment_No);
        //     // if (cb) {
        //     //   cb(false);
        //     // }
        //   }
        // }).done(function (data) {
        //   if (isShow) { app.preloader.hide(); } else {
        //     app.progressbar.hide();
        //   }
        //   app.ptr.done();
        //   self.methods.updateList(data);
        // });
      }
    },
    UpsetStore: function (arr) {
      var self = this;
      if (arr && arr.length && arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
          try {
            var tmp = arr[i];
            var f = self.data.Store._array.find(function (x, i) {
              return x[self.data.Store.key] == tmp[self.data.Store.key];
            });
            if (f && f[self.data.Store.key] > 0) {
              self.data.Store.push([{
                type: "update", key: f[self.data.Store.key], data: tmp
              }]);
            } else {
              self.data.Store.push([{
                type: "insert", data: tmp
              }]);
            }
          } catch (err) { }
        }
      }
    },
    refreshList: function (type) {
      //app.data.list.replaceAllItems(app.data.items);
      if (!type || type < 2) {
        type = 2;
      }
      var tname = '.wait-list';
      if (type == 3) {
        tname = '.finish-list';
      } else if (type == 4) {
        tname = '.cancel-list';
      }
      app.data.waitlist = app.virtualList.create({
        // List Element
        el: tname,
        // Pass array with items
        items: app.data.items.filter(function (x) {
          return x.PRO == type;
        }),
        // Custom search function for searchbar
        searchAll: function (query, items) {
          var found = [];
          for (var i = 0; i < items.length; i++) {
            if (items[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
          }
          return found; //return array with mathced indexes
        },
        emptyTemplate: '<li style="min-height:64px; text-align:center;"><br>Không có dữ liệu...<br><br></li>',
        // List item Template7 template
        itemTemplate:
          '<li>' +
          ' <div class="item-content">' +
          '   <div class="item-media">' +
          '     <i class="icon f7-icons ios-only">{{#if CALL}}phone_round_fill{{else}}bolt_round_fill{{/if}}</i>' +
          '     <i class="icon material-icons md-only">{{#if CALL}}contact_phone{{else}}local_play{{/if}}</i>' +
          '   </div>' +
          '   <div class="item-inner search-avaliable">' +
          '     <div class="item-title-row">' +
          '       <div class="item-title">' +
          '         {{Sender_Name}}' +
          '       </div>' +
          '       <div class="after">' +
          '         <a href="#" class="link icon-only" data-id="{{ID}}">' +
          '           <i class="icon f7-icons ios-only">{{#if PIN}}bookmark_fill{{else}}bookmark{{/if}}</i>' +
          '           <i class="icon material-icons md-only">{{#if PIN}}bookmark{{else}}bookmark_border{{/if}}</i>' +
          '         </a>' +
          '       </div>' +
          '     </div>' +
          '     <div class="item-subtitle">' +
          '         SĐT: {{Phone_No}} {{#js_if "this.Contact_Person && this.Contact_Person.length>0"}} - {{Contact_Person}}{{/js_if}}' +
          '     </div>' +
          '     <div class="item-text">' +
          '         Đ/c: {{Address}}' +
          '     </div>' +
          '     {{#js_if "this.BILLS && this.BILLS>0"}}<div class="item-subtitle">' +
          '         Số đơn hàng: {{BILLS}}' +
          '     </div>{{/js_if}}' +
          '   </div>' +
          ' </div>' +
          (type == 2 ? (
            ' <div class="segmented segmented-raised">' +
            '   <a href="/po/{{ID}}/" data-id="{{ID}}" class="button bill-pickup"><i class="icon f7-icons ios-only">download_fill</i><i class="icon material-icons md-only">archive</i><span>Nhận hàng</span></a>' +
            '   <a href="#" data-id="{{ID}}"  data-phone="{{PHONES}}"  class="button bill-call"><i class="icon f7-icons ios-only">phone_fill</i><i class="icon material-icons md-only">call</i><span>Gọi</span></a>' +
            '   <a href="#" data-id="{{ID}}" class="button bill-cancel smart-select smart-select-init" data-open-in="popup" data-virtual-list="true" data-page-back-link-text="Thôi" data-close-on-select="true" data-page-title="Chọn lý do"><i class="icon f7-icons ios-only">close_round</i><i class="icon material-icons md-only">close</i><span>Hủy</span>' +
            '     <select class="bill-reason" data-id="{{ID}}" name="reason">' +
            '       <option value="" selected disabled hidden>0. Chọn lý do</option>' +
            '       <option value="REASON_1" >1. Người gửi hủy yêu cầu</option>' +
            '       <option value="REASON_2" >2. Chưa chuẩn bị hàng xong</option>' +
            '       <option value="REASON_3" >3. Hẹn ngày khác lấy hàng</option>' +
            '       <option value="REASON_4" >4. Lý do khác</option>' +
            '     </select>' +
            '   </a>' +
            ' </div>'
          ) : '') +
          '</li>',
        // Item height
        height: app.theme === 'ios' ? 63 : (app.theme === 'md' ? 73 : 46),
        on: {
          itemsAfterInsert: function (virtualList, fragment) {
            $$(".virtual-list ul").css("height", "auto");
          }
        }
      });

      $$(".virtual-list ul").css("height", "auto");

      $$(".bill-call").on('click', function () {
        var self = this;
        var id = $$(this).data("id");
        var phones = $$(this).data("phone");
        var phone_num = phones.split(";").filter(function (x) {
          return x && x.length >= 10;
        }).filter(function (x, i, ar) {
          return ar.indexOf(x) === i;
        });
        // Vertical Buttons
        if (phone_num && phone_num.length >= 1) {
          if (phone_num.length == 1) {
            app.methods.call(id, phone_num[0]);
          } else {
            phone_num.push("Thôi");
            app.dialog.create({
              title: 'Liên hệ khách hàng',
              text: 'Chọn một số để liên lạc',
              buttons: phone_num.map(function (x) {
                return {
                  text: x,
                  cssClass: "button button-large button-raised button-fill",
                  onClick: function (d, e) {
                    if (x.length >= 10) {
                      app.methods.call(id, x);
                    }
                    else {

                    }
                  }
                };
              }),
              verticalButtons: true,
            }).open();
          }
        }


      });
      $$(".bill-reason").on("change", function () {
        var self = this;
        var id = $$(self).data("id");
        var val = $$(self).val();
        if (val == "" || val == "REASON_0") {

          return;
        } else if (val == "REASON_3") {
          setTimeout(function () {
            app.data.popupDateCallback = function (year, month, day) {
              console.log(id, val, year, month, day);
              var d = new Date(year, month, day);
              var str = "Khách hẹn ngày khác: " + dateKey(d);
              app.methods.pickup(id, 4, 87, str, function () {
                app.methods.loadData(false);
                app.router.back();
              });
            }
            app.data.popupDate.open();
          }, 200);

        } else if (val == "REASON_4") {
          var dialog = app.dialog.prompt('Nhập lý do khác', "Hủy nhận hàng", function (name) {
            if (name && name.length > 2) {
              console.log(id, val, "Lý do khác", name);
              var str = "Lý do khác: " + name;
              app.methods.pickup(id, 4, 87, str, function () {
                app.methods.loadData(false);
                app.router.back();
              });
            } else {
              app.toast.create({
                text: "Lỗi: lý do '" + name + "' quá ngắn",
                closeTimeout: 2000,
              }).open();
            }
          });
          var t = dialog.$el.find('input');
          t.attr('placeholder', 'Lý do...');
          t.css("border", "solid 1px;");
          dialog.open();
          setTimeout(function () {
            t.focus();
          }, 500);
        } else if (val == "REASON_1") {
          console.log(id, val);
          var str = "Người gửi hủy yêu cầu";//+ (new Date(year,month,day).toJSON().substr(0,10));
          app.methods.pickup(id, 4, 87, str, function () {
            app.methods.loadData(false);
            app.router.back();
          });
        } else if (val == "REASON_2") {

          var str = "Chưa chuẩn bị hàng xong";//+ (new Date(year,month,day).toJSON().substr(0,10));
          app.methods.pickup(id, 4, 87, str, function () {
            app.methods.loadData(false);
            app.router.back();
          });
        } else {
          console.log(id, val);
        }

        $$(self).val("");
      });
    },
    updateList: function (rs) {
      try {
        app.methods.setWait();
        if (rs && rs.length > 0) {
          app.data.items = rs;
          app.methods.refreshList(2);
          app.methods.refreshList(3);
          app.methods.refreshList(4);
        }
      } catch (er) { }
    },
    call: function (id, phone) {
      if (device.platform.toLocaleUpperCase() == "ANDROID") {
        window.plugins.callLog.hasReadPermission(function (rs) {
          if (rs) {
            var beginTime = new Date().getTime();
            montionCall(phone, beginTime, function (rs) {
              app.methods.saveCallLog(id, phone, rs, beginTime);
            }, function (err) {
              console.log(err);
            });
            cordova.plugins.CordovaCall.setAppName('NHẬN HÀNG');
            cordova.plugins.CordovaCall.setIcon('logo');
            cordova.plugins.CordovaCall.sendCall(phone);
            cordova.plugins.CordovaCall.callNumber(phone, function (rs) {
              console.log(rs);
            }, function (er) {
              console.log(er);
            });
          } else {
            window.plugins.callLog.requestReadPermission(function (rs) {

            }, function (err) {
              console.log(err);
            })
          }
        }, function (err) {
          console.log(err);
        });
      } else {
        window.open("tel://" + phone);
      }
    },
    onOnline: function () {
      var networkState = navigator.connection.type;

      if (networkState !== Connection.NONE) {
        if (app.data.signal) {

        } else {
          if ($$('.modal-in').length > 0) {
            app.dialog.close();
          }
          app.data.signal = true;

        }
      }

    },
    onOffline: function () {
      app.data.signal = false;
      if ($$('.modal-in').length > 0) {

      } else {
        app.dialog.preloader('Mất kết nối...');
      }
    },
    onBackKeyDown: function () {

      var leftp = app.panel.left && app.panel.left.opened;
      var rightp = app.panel.right && app.panel.right.opened;

      if (leftp || rightp) {

        app.panel.close();
        return false;
      } else if ($$('.modal-in').length > 0) {

        app.dialog.close();
        app.popup.close();
        return false;
      } else if (app.views.main.router.url == '/') {
        app.dialog.confirm("Thoát ứng dụng", app.data.appName, function () {
          navigator.app.exitApp();
        }, function () {
          return false;
        });
      } else {
        if (app.data.editing) {
          app.dialog.confirm("Dữ liệu chưa được lưu? Vẫn thoát", app.data.appName, function () {
            mainView.router.back();
          }, function () {
            return false;
          });
        } else {
          mainView.router.back();
        }
      }
    },
  },
  routes: routes,
  vi: {
    placementId: 'pltd4o7ibb9rc653x14',
  },

});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/'
});

var setUserInfoSuccess = function (obj) {
  //console.log(obj.name);
  NativeStorage.getItem("userInfo", getUserInfoSuccess, getUserInfoError);
};
var setUserInfoError = function (error) {
  console.log(error.code);
  if (error.exception !== "") console.log(error.exception);
};
var getUserInfoSuccess = function (obj) {
  //console.log(obj.name);
  //NativeStorage.remove("userInfo", removeSuccess, removeError);
  if (obj && obj.user && obj.user.length > 4 && obj.key && obj.key != "****") {
    app.data.user.user_name = obj.user;
    app.data.user.password = obj.key;
    app.data.user.dc = obj.dc;
    $$("#user-name").text(obj.user);
    $$(".user-name").text(obj.user);
    $$("#user-fullname").text(obj.fullname);
    $$("#last-login").text(obj.last);
    if (obj.sex) {
      $$("#user-image").attr("src", "img/sex/" + obj.sex + ".png");
    } else {
      $$("#user-image").attr("src", "img/sex/null.png");
    }
    app.methods.loadData();
  } else {
    app.loginScreen.open("#my-login-screen");
  }
};
var getUserInfoError = function (error) {
  console.log(error);
  if (error.exception !== "") console.log(error.exception);
  if (error.code == 2) {
    app.loginScreen.open("#my-login-screen")
  }
};
var removeUserInfoSuccess = function () {
  console.log("Removed");
};
var removeUserInfoError = function (error) {
  console.log(error.code);
  if (error.exception !== "") console.log(error.exception);
};

///////////////////
var convertObjLocation = function (position) {
  var rs = {};
  rs.Latitude = position.coords.latitude;//          + '\n' +
  rs.Longitude = position.coords.longitude;//         + '\n' +
  rs.Altitude = position.coords.altitude;//         + '\n' +
  rs.Accuracy = position.coords.accuracy;//          + '\n' +
  rs.Altitude_Accuracy = position.coords.altitudeAccuracy;//  + '\n' +
  rs.Heading = position.coords.heading;//           + '\n' +
  rs.Speed = position.coords.speed;//             + '\n' +
  rs.Timestamp = position.timestamp;//               + '\n');
  return rs;
}
//GEO///
var onGeoSuccess = function (position) {
  app.data.geoLocation = convertObjLocation(position);
  NativeStorage.setItem("location", convertObjLocation(position), function (data) { }, function (error) { });
};

// onError Callback receives a PositionError object
//
function onGeoError(error) {
  console.log(error);
}
//END GEO

function checkConnection() {

  var networkState = navigator.connection.type;
  console.log("Check network", networkState, new Date().toJSON());
  var states = {};
  states[Connection.UNKNOWN] = 'Unknown connection';
  states[Connection.ETHERNET] = 'Ethernet connection';
  states[Connection.WIFI] = 'WiFi connection';
  states[Connection.CELL_2G] = 'Cell 2G connection';
  states[Connection.CELL_3G] = 'Cell 3G connection';
  states[Connection.CELL_4G] = 'Cell 4G connection';
  states[Connection.CELL] = 'Cell generic connection';
  states[Connection.NONE] = 'No network connection';

  //alert('Connection type: ' + states[networkState]);
  if (networkState == Connection.NONE) {
    app.data.signal = false;
    if ($$('.modal-in').length > 0) {

    } else {
      app.dialog.preloader('Mất kết nối...');
    }
    setTimeout(checkConnection, 1000);
  } else {

    if (app.data.signal) {

    } else {
      app.dialog.close();
      app.data.signal = true;

    }
    setTimeout(checkConnection, 3000);
  }
}

var onNotificationReceived = function (pushNotification) {
  var message = pushNotification.message;
  var title = pushNotification.title;

  if (message === null || message === undefined) {
    // Android messages received in the background don't include a message. On Android, that fact can be used to
    // check if the message was received in the background or foreground. For iOS the message is always present.
    title = 'Thông báo';
    message = 'Không có gì...';
  }

  // Custom name/value pairs set in the App Center web portal are in customProperties
  if (pushNotification.customProperties && Object.keys(pushNotification.customProperties).length > 0) {
    message += '\nCustom properties:\n' + JSON.stringify(pushNotification.customProperties);
  }

  app.toast.create({
    text: "<strong>" + title + "</strong><br>" + message,
    position: 'top',
    closeButton: true,
    closeButtonText: '<i class="f7-icons">close_round_fill</i>',
  }).open();

  //console.log(title, message);
}



$$(document).on('deviceready', function () {
  app.methods.requestSMSPermission();

  navigator.splashscreen.hide();
  $$(document).on("backbutton", app.methods.onBackKeyDown, false);
  $$(document).on("offline", app.methods.onOffline, false);
  $$(document).on("online", app.methods.onOnline, false);

  if (device.platform.toLocaleUpperCase() == "ANDROID") {
    //checkConnection();
    window.plugins.callLog.hasReadPermission(function (rs) {
      if (rs) {

      } else {
        window.plugins.callLog.requestReadPermission(function (rs) {
          console.log(rs);
        }, function (err) {
          console.log(err);
        })
      }
    }, function (err) {
      console.log(err);
    });
  }


  //AppCenter.Push.addEventListener('notificationReceived', onNotificationReceived);
  var platform = device.platform;
  if (device.platform.toLocaleUpperCase() == "ANDROID") {
    try {
      codePush.sync(null,
        {
          updateDialog: false,
          installMode: InstallMode.IMMEDIATE,
          deploymentKey: "2Q6HRRdTyLye3fjVrIXK1dfMsmmCH1cm14xc4"

        });
    } catch (ex) { }

  }
  //AppCenter.Analytics.setEnabled(true);

  NativeStorage.getItem("config", function (result) {
    app.data.serverUrl = result.server || app.data.serverUrl;
    app.data.pushBill = result.push;
  }, function (error) {
    NativeStorage.setItem("config", {
      server: app.data.serverUrl,
      push: app.data.pushBill
    }, function (data) {

    }, function (error) {

    });
  });

  NativeStorage.getItem("userInfo", getUserInfoSuccess, getUserInfoError);

  navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, { timeout: 10000, enableHighAccuracy: true });
  ////
  setInterval(function () {
    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, { timeout: 10000, enableHighAccuracy: true });
  }, 30000);

  // app.data.geoID = navigator.geolocation.watchPosition(function () {
  //   app.data.geoLocation = position;//LSM
  //   NativeStorage.setItem("location", position, function (data) { }, function (error) { });
  // }, function () { }, { timeout: 10000 });

  if (cordova.getAppVersion) {
    cordova.getAppVersion.getVersionNumber(function (version) {
      app.data.version = version;
      $$('.version').text(version);
    });
  }

  app.data.popupDate = app.calendar.create({
    inputEl: '#popupDate',
    dateFormat: 'yyyy-mm-dd',
    closeOnSelect: true,
    disabled: function (d) {
      if (d <= new Date()) {
        return true;
      }
      return false;
    },
    on: {
      dayClick: function (calendar, dayEl, year, month, day) {
        console.log(year, month, day);
        if (app.data.popupDateCallback) {
          app.data.popupDateCallback(year, month, day);
        }
      }
    }
  });


  app.methods.loadData();
}, false);



// Login Screen Demo
$$('#my-login-screen .login-button').on('click', function () {
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();

  $.get(app.data.serverUrl + "/api/MPOD?u=" + username + "&p=" + password, function (data, status) {
    if (data && data.user_name && data.user_name.length > 0) {
      // Alert username and password
      //app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
      var obj = {
        user: data.user_name,
        fullname: "Nhân viên Kerry",
        key: password,
        last: new Date(),
        sex: null,
        location: "Not set",
        dc: data.dc,
      };
      //debugger;
      NativeStorage.setItem("userInfo", obj, setUserInfoSuccess, setUserInfoError);
      location.reload();
    } else {
      app.toast.create({
        text: "Thông tin đăng nhập không đúng",
        closeTimeout: 2000,
      }).open();
    }
  });
});
// Logout
$$('#dang-xuat').on('click', function () {
  NativeStorage.setItem("userInfo", {}, setUserInfoSuccess, setUserInfoError);
  app.loginScreen.open("#my-login-screen");
  location.reload();
});

$$('.language').on('click', function () {
  app.actions.create({
    buttons: [
      {
        text: 'Chọn ngôn ngữ',
        label: true
      },
      {
        text: 'Tiếng việt',
        bold: true
      },
      {
        text: 'English',
      },
      {
        text: 'Hủy',
        color: 'red'
      },
    ]
  }).open();
});

$$(document).on('page:afterin', function (e) {
  if (e.detail.route.name == "home") {
    app.methods.refreshList(2);
    app.methods.refreshList(3);
    app.methods.refreshList(4);
  }
});

//app.ptr.create('.ptr-content');
// $$('.ptr-content').on('ptr:refresh', function (e) {
//   app.methods.loadData(false);
// });
$$(".tab").on("tab:hide", function () {
  var tname = $$(this).data("name");
  if (tname == "wait-list") {
    app.methods.loadData(false);
  }
});
// $$(".tab").on("tab:show", function () {
//   var tname = $$(this).data("name");
//   if (tname == "wait-list") {
//     var total = app.data.items.length;
//     var wait = app.data.items.filter(function (x) {
//       return x.PRO == 2;
//     }).length || 0;
//     if (total > 0 && wait == 0) {
//       $$("#search-id").hide();
//       $$("#done-id").show();
//     } else {
//       $$("#search-id").show();
//       $$("#done-id").hide();
//     }
//   }

// });