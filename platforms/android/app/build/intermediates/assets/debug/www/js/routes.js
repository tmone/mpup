var routes = [
  // Index page
  {
    path: '/',
    url: './index.html',
    name: 'home',
  },
  // About page
  {
    path: '/about/',
    componentUrl: './pages/about.html',
    name: 'about',
  },
  {
    path: '/po/:poID/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var poID = routeTo.params.poID;
      var PO = Object.assign({}, app.data.items.find(function (x) {
        return x.ID == poID;
      }));
      var Provinces = [];

      var Districts = [];

      var SubDistricts = [];
      

      var process = function (data) {
        // Hide Preloader
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/po.html',
          },
          {
            context: {
              po: PO,
              Provinces: Provinces,
              Districts: Districts,
              SubDistricts: SubDistricts,
              // Bills: data,               
            }
          }
        );
      }

      process();

    },
  },
  {
    path: '/po/:poID/edit/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      //app.preloader.show();

      // User ID from request
      var poID = routeTo.params.poID;
      var PO = Object.assign({}, app.data.items.find(function (x) {
        return x.ID == poID;
      }));
      var Provinces = PROVINCES.map(function (x) {
        return Object.assign({ Selected: x.ID == PO.Province_ID }, x);
      });
      var Districts = DISTRICTS.filter(function (x) {
        return x.Province_ID == PO.Province_ID;
      }).map(function (x) {
        return Object.assign({ Selected: x.ID == PO.District_ID }, x);
      });
      var SubDistricts = SUBDISTRICTS.filter(function (x) {
        return x.District_ID == PO.District_ID;
      }).map(function (x) {
        return Object.assign({ Selected: x.ID == PO.SubDistrict_ID }, x);
      });
      if (PO && PO.PHONES && PO.PHONES.length > 0) {
        PO.PHONES = PO.PHONES.split(";")
          .filter(function (x, i, a) {
            return a.indexOf(x) === i;
          });
        for (var i = 0; i < 10; i++) {
          PO.PHONES.push("");
        }
        PO.PHONES = PO.PHONES.slice(0, 10)
          .map(function (x, i) {
            var fn = "Phone_No";
            if (i >= 1) {
              fn = "Mobile_No" + i;
            }
            var show = false;
            if (x && x.length >= 10) {
              show = true;
            }
            return {
              Phone_Name: fn,
              Phone_Value: x,
              Show: show,
              Index: i
            };
          })

      }
      resolve(
        {
          componentUrl: './pages/poedit.html',
        },
        {
          context: {
            po: PO,
            Provinces: Provinces,
            Districts: Districts,
            SubDistricts: SubDistricts
          }
        }
      );
      // Hide Preloader
      //app.preloader.hide();
      //});
    },
  },
  {
    path: '/poc/:pocID/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // User ID from request
      var pocID = routeTo.params.pocID;

      var pocStore = app.methods.initStore("Pickup_Order_Consignment");
      var process = function (POC) {

        var Provinces = PROVINCES.map(function (x) {
          return Object.assign({ Selected: x.ID == POC.Recipient_Province_ID }, x);
        });
        var Districts = DISTRICTS.filter(function (x) {
          return x.Province_ID == POC.Recipient_Province_ID;
        }).map(function (x) {
          return Object.assign({ Selected: x.ID == POC.Recipient_District_ID }, x);
        });
        var SubDistricts = SUBDISTRICTS.filter(function (x) {
          return x.District_ID == POC.Recipient_District_ID;
        }).map(function (x) {
          return Object.assign({ Selected: x.ID == POC.Recipient_SubDistrict_ID }, x);
        });
        var Services = SERVICES.map(function (x) {
          return Object.assign({ Selected: POC.Service_ID == x.ID }, x);
        });
        if (POC && POC.Recipient_Mobile && POC.Recipient_Mobile.length > 0) {
          POC.PHONES = POC.Recipient_Mobile.split(";")
            .filter(function (x, i, a) {
              return a.indexOf(x) === i;
            });
        } else {
          POC.PHONES = [];
        }

        for (var i = 0; i < 10; i++) {
          POC.PHONES.push("");
        }
        POC.PHONES = POC.PHONES.slice(0, 10)
          .map(function (x, i) {
            var fn = "Mobile" + i;
            // if (i >= 1) {
            //   fn = "Mobile_No" + i;
            // }
            var show = false;
            if (x && x.length >= 10) {
              show = true;
            }
            if (i == 0 && !show) {
              show = true;
            }
            return {
              Phone_Name: fn,
              Phone_Value: x,
              Show: show,
              Index: i,
            };
          });

        resolve(
          {
            componentUrl: './pages/poc.html',
          },
          {
            context: {
              poc: POC,
              Provinces: Provinces,
              Districts: Districts,
              SubDistricts: SubDistricts,
              Services: Services,
              Store: pocStore
            }
          }
        );

      }
      var tmp = {
        Recipient_Province_ID: 0,
        Recipient_District_ID: 0,
        Recipient_SubDistrict_ID: 0,
        Service_ID: -1,
        ID: 0,
        Declared_Value: 0,
        COD_Amount: 0,
        Package_Doc: 0,
        Actual_Weight: 0,
        Dim_Weight: 0,
        Charge_Weight: 0,
        Freight_Charge: 0,
        ESA_Surcharge: 0,
        VAS_Surcharge: 0,
        Total_Charge: 0
      };
      pocStore.byKey(pocID).done(function (dataItem) {
        var obj = Object.assign(tmp, dataItem);
        process(obj);
      }).fail(function (error) {
        process(tmp);
      });


    },
  },
  // Right Panel pages
  {
    path: '/panel-right-1/',
    content: '\
      <div class="page">\
        <div class="navbar">\
          <div class="navbar-inner sliding">\
            <div class="left">\
              <a href="#" class="link back">\
                <i class="icon icon-back"></i>\
                <span class="ios-only">Back</span>\
              </a>\
            </div>\
            <div class="title">Panel Page 1</div>\
          </div>\
        </div>\
        <div class="page-content">\
          <div class="block">\
            <p>This is a right panel page 1</p>\
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo saepe aspernatur inventore dolorum voluptates consequatur tempore ipsum! Quia, incidunt, aliquam sit veritatis nisi aliquid porro similique ipsa mollitia eaque ex!</p>\
          </div>\
        </div>\
      </div>\
    ',
  },
  {
    path: '/panel-right-2/',
    content: '\
      <div class="page">\
        <div class="navbar">\
          <div class="navbar-inner sliding">\
            <div class="left">\
              <a href="#" class="link back">\
                <i class="icon icon-back"></i>\
                <span class="ios-only">Back</span>\
              </a>\
            </div>\
            <div class="title">Panel Page 2</div>\
          </div>\
        </div>\
        <div class="page-content">\
          <div class="block">\
            <p>This is a right panel page 2</p>\
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo saepe aspernatur inventore dolorum voluptates consequatur tempore ipsum! Quia, incidunt, aliquam sit veritatis nisi aliquid porro similique ipsa mollitia eaque ex!</p>\
          </div>\
        </div>\
      </div>\
    ',
  },

  // Components
  {
    path: '/accordion/',
    url: './pages/accordion.html',
  },
  {
    path: '/action-sheet/',
    componentUrl: './pages/action-sheet.html',
  },
  {
    path: '/autocomplete/',
    componentUrl: './pages/autocomplete.html',
  },
  {
    path: '/badge/',
    componentUrl: './pages/badge.html',
  },
  {
    path: '/buttons/',
    url: './pages/buttons.html',
  },
  {
    path: '/calendar/',
    componentUrl: './pages/calendar.html',
  },
  {
    path: '/calendar-page/',
    componentUrl: './pages/calendar-page.html',
  },
  {
    path: '/cards/',
    url: './pages/cards.html',
  },
  {
    path: '/checkbox/',
    url: './pages/checkbox.html',
  },
  {
    path: '/chips/',
    componentUrl: './pages/chips.html',
  },
  {
    path: '/contacts-list/',
    url: './pages/contacts-list.html',
  },
  {
    path: '/content-block/',
    url: './pages/content-block.html',
  },
  {
    path: '/data-table/',
    componentUrl: './pages/data-table.html',
  },
  {
    path: '/dialog/',
    componentUrl: './pages/dialog.html',
  },
  {
    path: '/elevation/',
    url: './pages/elevation.html',
  },
  {
    path: '/fab/',
    url: './pages/fab.html',
  },
  {
    path: '/fab-morph/',
    url: './pages/fab-morph.html',
  },
  {
    path: '/form-storage/',
    url: './pages/form-storage.html',
  },
  {
    path: '/gauge/',
    componentUrl: './pages/gauge.html',
  },
  {
    path: '/grid/',
    url: './pages/grid.html',
  },
  {
    path: '/icons/',
    componentUrl: './pages/icons.html',
  },
  {
    path: '/infinite-scroll/',
    componentUrl: './pages/infinite-scroll.html',
  },
  {
    path: '/inputs/',
    url: './pages/inputs.html',
  },
  {
    path: '/lazy-load/',
    url: './pages/lazy-load.html',
  },
  {
    path: '/list/',
    url: './pages/list.html',
  },
  {
    path: '/list-index/',
    componentUrl: './pages/list-index.html',
  },
  {
    path: '/login-screen/',
    componentUrl: './pages/login-screen.html',
  },
  {
    path: '/login-screen-page/',
    componentUrl: './pages/login-screen-page.html',
  },
  {
    path: '/messages/',
    componentUrl: './pages/messages.html',
  },
  {
    path: '/navbar/',
    url: './pages/navbar.html',
  },
  {
    path: '/navbar-hide-scroll/',
    url: './pages/navbar-hide-scroll.html',
  },
  {
    path: '/notifications/',
    componentUrl: './pages/notifications.html',
  },
  {
    path: '/panel/',
    url: './pages/panel.html',
  },
  {
    path: '/photo-browser/',
    componentUrl: './pages/photo-browser.html',
  },
  {
    path: '/picker/',
    componentUrl: './pages/picker.html',
  },
  {
    path: '/popup/',
    componentUrl: './pages/popup.html',
  },
  {
    path: '/popover/',
    url: './pages/popover.html',
  },
  {
    path: '/preloader/',
    componentUrl: './pages/preloader.html',
  },
  {
    path: '/progressbar/',
    componentUrl: './pages/progressbar.html',
  },
  {
    path: '/pull-to-refresh/',
    componentUrl: './pages/pull-to-refresh.html',
  },
  {
    path: '/radio/',
    url: './pages/radio.html',
  },
  {
    path: '/range/',
    componentUrl: './pages/range.html',
  },
  {
    path: '/searchbar/',
    url: './pages/searchbar.html',
  },
  {
    path: '/searchbar-expandable/',
    url: './pages/searchbar-expandable.html',
  },
  {
    path: '/sheet-modal/',
    componentUrl: './pages/sheet-modal.html',
  },
  {
    path: '/smart-select/',
    url: './pages/smart-select.html',
  },
  {
    path: '/sortable/',
    url: './pages/sortable.html',
  },
  {
    path: '/statusbar/',
    componentUrl: './pages/statusbar.html',
  },
  {
    path: '/stepper/',
    componentUrl: './pages/stepper.html',
  },
  {
    path: '/subnavbar/',
    url: './pages/subnavbar.html',
  },
  {
    path: '/subnavbar-title/',
    url: './pages/subnavbar-title.html',
  },
  {
    path: '/swiper/',
    url: './pages/swiper.html',
    routes: [
      {
        path: 'swiper-horizontal/',
        url: './pages/swiper-horizontal.html',
      },
      {
        path: 'swiper-vertical/',
        url: './pages/swiper-vertical.html',
      },
      {
        path: 'swiper-space-between/',
        url: './pages/swiper-space-between.html',
      },
      {
        path: 'swiper-multiple/',
        url: './pages/swiper-multiple.html',
      },
      {
        path: 'swiper-nested/',
        url: './pages/swiper-nested.html',
      },
      {
        path: 'swiper-loop/',
        url: './pages/swiper-loop.html',
      },
      {
        path: 'swiper-3d-cube/',
        url: './pages/swiper-3d-cube.html',
      },
      {
        path: 'swiper-3d-coverflow/',
        url: './pages/swiper-3d-coverflow.html',
      },
      {
        path: 'swiper-3d-flip/',
        url: './pages/swiper-3d-flip.html',
      },
      {
        path: 'swiper-fade/',
        url: './pages/swiper-fade.html',
      },
      {
        path: 'swiper-scrollbar/',
        url: './pages/swiper-scrollbar.html',
      },
      {
        path: 'swiper-gallery/',
        componentUrl: './pages/swiper-gallery.html',
      },
      {
        path: 'swiper-custom-controls/',
        url: './pages/swiper-custom-controls.html',
      },
      {
        path: 'swiper-parallax/',
        url: './pages/swiper-parallax.html',
      },
      {
        path: 'swiper-lazy/',
        url: './pages/swiper-lazy.html',
      },
      {
        path: 'swiper-pagination-progress/',
        url: './pages/swiper-pagination-progress.html',
      },
      {
        path: 'swiper-pagination-fraction/',
        url: './pages/swiper-pagination-fraction.html',
      },
      {
        path: 'swiper-zoom/',
        url: './pages/swiper-zoom.html',
      },
    ],
  },
  {
    path: '/swipeout/',
    componentUrl: './pages/swipeout.html',
  },
  {
    path: '/tabs/',
    url: './pages/tabs.html',
  },
  {
    path: '/tabs-static/',
    url: './pages/tabs-static.html',
  },
  {
    path: '/tabs-animated/',
    url: './pages/tabs-animated.html',
  },
  {
    path: '/tabs-swipeable/',
    url: './pages/tabs-swipeable.html',
  },
  {
    path: '/tabs-routable/',
    url: './pages/tabs-routable.html',
    tabs: [
      {
        path: '/',
        id: 'tab1',
        content: ' \
        <div class="block"> \
          <p>Tab 1 content</p> \
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam enim quia molestiae facilis laudantium voluptates obcaecati officia cum, sit libero commodi. Ratione illo suscipit temporibus sequi iure ad laboriosam accusamus?</p> \
          <p>Saepe explicabo voluptas ducimus provident, doloremque quo totam molestias! Suscipit blanditiis eaque exercitationem praesentium reprehenderit, fuga accusamus possimus sed, sint facilis ratione quod, qui dignissimos voluptas! Aliquam rerum consequuntur deleniti.</p> \
          <p>Totam reprehenderit amet commodi ipsum nam provident doloremque possimus odio itaque, est animi culpa modi consequatur reiciendis corporis libero laudantium sed eveniet unde delectus a maiores nihil dolores? Natus, perferendis.</p> \
        </div> \
        ',
      },
      {
        path: '/tab2/',
        id: 'tab2',
        content: '\
        <div class="block"> \
          <p>Tab 2 content</p> \
          <p>Suscipit, facere quasi atque totam. Repudiandae facilis at optio atque, rem nam, natus ratione cum enim voluptatem suscipit veniam! Repellat, est debitis. Modi nam mollitia explicabo, unde aliquid impedit! Adipisci!</p> \
          <p>Deserunt adipisci tempora asperiores, quo, nisi ex delectus vitae consectetur iste fugiat iusto dolorem autem. Itaque, ipsa voluptas, a assumenda rem, dolorum porro accusantium, officiis veniam nostrum cum cumque impedit.</p> \
          <p>Laborum illum ipsa voluptatibus possimus nesciunt ex consequatur rem, natus ad praesentium rerum libero consectetur temporibus cupiditate atque aspernatur, eaque provident eligendi quaerat ea soluta doloremque. Iure fugit, minima facere.</p> \
        </div> \
        ',
      },
      {
        path: '/tab3/',
        id: 'tab3',
        content: '\
        <div class="block"> \
          <p>Tab 3 content</p> \
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam enim quia molestiae facilis laudantium voluptates obcaecati officia cum, sit libero commodi. Ratione illo suscipit temporibus sequi iure ad laboriosam accusamus?</p> \
          <p>Deserunt adipisci tempora asperiores, quo, nisi ex delectus vitae consectetur iste fugiat iusto dolorem autem. Itaque, ipsa voluptas, a assumenda rem, dolorum porro accusantium, officiis veniam nostrum cum cumque impedit.</p> \
          <p>Laborum illum ipsa voluptatibus possimus nesciunt ex consequatur rem, natus ad praesentium rerum libero consectetur temporibus cupiditate atque aspernatur, eaque provident eligendi quaerat ea soluta doloremque. Iure fugit, minima facere.</p> \
        </div> \
        ',
      },
    ],
  },
  {
    path: '/toast/',
    componentUrl: './pages/toast.html',
  },
  {
    path: '/toggle/',
    url: './pages/toggle.html',
  },
  {
    path: '/toolbar-tabbar/',
    componentUrl: './pages/toolbar-tabbar.html',
    routes: [
      {
        path: 'tabbar/',
        componentUrl: './pages/tabbar.html',
      },
      {
        path: 'tabbar-labels/',
        componentUrl: './pages/tabbar-labels.html',
      },
      {
        path: 'tabbar-scrollable/',
        componentUrl: './pages/tabbar-scrollable.html',
      },
      {
        path: 'toolbar-hide-scroll/',
        url: './pages/toolbar-hide-scroll.html',
      },
    ],
  },
  {
    path: '/tooltip/',
    componentUrl: './pages/tooltip.html',
  },
  {
    path: '/timeline/',
    url: './pages/timeline.html',
  },
  {
    path: '/timeline-vertical/',
    url: './pages/timeline-vertical.html',
  },
  {
    path: '/timeline-horizontal/',
    url: './pages/timeline-horizontal.html',
  },
  {
    path: '/timeline-horizontal-calendar/',
    url: './pages/timeline-horizontal-calendar.html',
  },
  {
    path: '/virtual-list/',
    componentUrl: './pages/virtual-list.html',
  },
  {
    path: '/virtual-list-vdom/',
    componentUrl: './pages/virtual-list-vdom.html',
  },
  {
    path: '/vi/',
    componentUrl: './pages/vi.html',
  },

  // Color Themes
  {
    path: '/color-themes/',
    componentUrl: './pages/color-themes.html',
  },

  // Page Loaders
  {
    path: '/page-loader-template7/:user/:userId/:posts/:postId/',
    templateUrl: './pages/page-loader-template7.html',
    // additional context
    options: {
      context: {
        foo: 'bar',
      },
    },
  },
  {
    path: '/page-loader-component/:user/:userId/:posts/:postId/',
    componentUrl: './pages/page-loader-component.html',
    // additional context
    options: {
      context: {
        foo: 'bar',
      },
    },
  },

  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
