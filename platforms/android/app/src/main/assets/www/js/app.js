// Dom7
var $$ = Dom7;

// install plugin to Framework7
Framework7.use(Framework7Keypad);

// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
}

var getCallLog = function (beginTime, cbResult, cbError) {
  let filters = [
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

var Cachers = [];
var CacheStore = new DevExpress.data.ArrayStore({
  key: "ID",
  data: Cachers
});

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
    lastChoice: {},
    serverUrl: "http://210.211.121.146:30000",
    pushBill: true,
    geoLocation: {},
    signal: true,
    version: "1.0.0",
    list: null,
    items: [],
    popupDate: null,
    popupDateCallback: null,
    Store: CacheStore,
  },
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
    loadData: function () {
      var self = this;
      if (self.data.user.user_name && self.data.user.user_name.length > 3) {
        app.preloader.show();
        $.ajax({
          url: app.data.serverUrl + "/api/MPUP/" + app.data.user.user_name + "?u=" + app.data.user.user_name + "&p=" + app.data.user.password,
          method: "GET",
          success: function (data) {
            app.preloader.hide();
            self.methods.updateList(data);
          },
          error: function (err) {
            app.preloader.hide();
            var msg = JSON.stringify(err);
            var ty = msg.includes("deadlock");

            //app.preloader.hide();
            app.toast.create({
              text: "Lỗi: " + (ty ? "Server đang bận. Thử lại sau ít phút" : msg),
              closeTimeout: 2000,
            }).open();
            //console.timeEnd("Pushs:" + r.Consignment_No);
            // if (cb) {
            //   cb(false);
            // }
          }
        }).done(function (data) {
          app.preloader.hide();
          self.methods.updateList(data);

        });
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
    refreshList: function () {
      //app.data.list.replaceAllItems(app.data.items);

      app.data.list = app.virtualList.create({
        // List Element
        el: '.virtual-list',
        // Pass array with items
        items: app.data.items,
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
          '     <i class="icon f7-icons ios-only">{{#if CALL}}phone_round_fill{{else}}phone_landscape{{/if}}</i>' +
          '     <i class="icon material-icons md-only">{{#if CALL}}contact_phone{{else}}stay_current_landscape{{/if}}</i>' +
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
          ' <div class="segmented segmented-raised">' +
          '   <a href="/po/{{ID}}/" data-id="{{ID}}" class="button bill-pickup"><i class="icon f7-icons ios-only">download_fill</i><i class="icon material-icons md-only">archive</i><span>Nhận hàng</span></a>' +
          '   <a href="#" data-id="{{ID}}"  data-phone="{{PHONES}}"  class="button bill-call"><i class="icon f7-icons ios-only">phone_fill</i><i class="icon material-icons md-only">call</i><span>Gọi</span></a>' +
          '   {{#if CALL}}<a href="#" data-id="{{ID}}" class="button bill-cancel smart-select smart-select-init" data-open-in="popup" data-virtual-list="true" data-page-back-link-text="Thôi" data-close-on-select="true" data-page-title="Chọn lý do"><i class="icon f7-icons ios-only">close_round</i><i class="icon material-icons md-only">close</i><span>Hủy</span>' +
          '     <select class="bill-reason" data-id="{{ID}}" name="reason">' +
          '       <option value="" selected disabled hidden>0. Chọn lý do</option>' +
          '       <option value="REASON_1" >1. Người gửi hủy yêu cầu</option>' +
          '       <option value="REASON_2" >2. Chưa chuẩn bị hàng xong</option>' +
          '       <option value="REASON_3" >3. Hẹn ngày khác lấy hàng</option>' +
          '       <option value="REASON_4" >4. Lý do khác</option>' +
          '     </select>' +
          '   </a>{{/if}}' +
          ' </div>' +
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
            }
            app.data.popupDate.open();
          }, 200);

        } else if (val == "REASON_4") {
          var dialog = app.dialog.prompt('Nhập lý do khác', "Hủy nhận hàng", function (name) {
            if (name && name.length > 2) {
              console.log(id, val, "Lý do khác", name);
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
        } else {
          console.log(id, val);
        }

        $$(self).val("");
      });
    },
    updateList: function (rs) {
      try {
        if (rs && rs.length > 0) {
          app.data.items = rs;
          app.methods.refreshList();
        }
      } catch (er) { }
    },
    call: function (id, phone) {
      if (device.platform.toLocaleUpperCase() == "ANDROID") {
        window.plugins.callLog.hasReadPermission(function (rs) {
          if (rs) {
            var beginTime = new Date().getTime();
            montionCall(phone, beginTime, function (rs) {
            }, function (err) {
              console.log(err);
            });
            cordova.plugins.CordovaCall.setAppName('NHẬN HÀNG');
            cordova.plugins.CordovaCall.setIcon('logo');
            cordova.plugins.CordovaCall.sendCall(PHONE);
            cordova.plugins.CordovaCall.callNumber(PHONE, function (rs) {
              console.log(rs);
            }, function (er) {
              console.log(er);
            });
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
      } else {
        window.open("tel://" + phone);
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
        app.dialog.confirm("Thoát ứng dụng", "KES Connect Mobile", function () {
          navigator.app.exitApp();
        }, function () {
          return false;
        });
      } else {
        mainView.router.back();
      }

    },
  },
  routes: routes,
  vi: {
    placementId: 'pltd4o7ibb9rc653x14',
  },

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

///GEO///
var onGeoSuccess = function (position) {
  app.data.geoLocation = position;
  NativeStorage.setItem("location", position, function (data) { }, function (error) { });
};

// onError Callback receives a PositionError object
//
function onGeoError(error) {

}
///END GEO

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
    app.toast.create({
      text: "Không có tín hiệu mạng",
      closeTimeout: 2000,
    }).open();
    setTimeout(checkConnection, 10000);
  } else {
    if (app.data.signal) {

    } else {
      app.data.signal = true;
      app.gridComponent.refresh();
    }
    setTimeout(checkConnection, 30000);
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

$$(document).on("backbutton", app.methods.onBackKeyDown, false);

$$(document).on('deviceready', function () {
  if (device.platform.toLocaleUpperCase() == "ANDROID") {
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


  AppCenter.Push.addEventListener('notificationReceived', onNotificationReceived);
  var platform = device.platform;
  if (device.platform.toLocaleUpperCase() == "ANDROID") {
    codePush.sync(null,
      {
        updateDialog: true,
        installMode: InstallMode.IMMEDIATE,
        deploymentKey: "2Q6HRRdTyLye3fjVrIXK1dfMsmmCH1cm14xc4"

      });
  }
  AppCenter.Analytics.setEnabled(true);

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

  navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
  ////
  setInterval(function () {
    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
  }, 60000);

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
    app.methods.refreshList();
  }
});
