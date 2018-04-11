//import {
//  withPluginApi,
//  decorateCooked
//} from 'discourse/lib/plugin-api';
//import ComposerController from 'discourse/controllers/composer';
//import {
//  onToolbarCreate
//} from 'discourse/components/d-editor';
//import Composer from 'discourse/models/composer';
//import {
//  default as computed,
//  on,
//  observes
//} from 'ember-addons/ember-computed-decorators';
//
//
//
//var stop = false;
//var hide = true;
//
//function initializeHideToggle(api) {
//  if (Discourse != undefined) {
//    if (Discourse.User != undefined) {
//      if (Discourse.User.current() != undefined) {
//        var usr = Discourse.User.findByUsername(Discourse.User.current().username);
//        (function waitForUser() {
//          if (usr != undefined) {
//            if (usr._result != undefined) {
//              var groupHide = usr._result.groups.find((g) => g.name == "hide_devs");
//              if (groupHide != undefined) {
//                console.log("Enabling hide plugin because user is allowed.");
//                api.onToolbarCreate(toolbar => {
//                  toolbar.addButton({
//                    id: "toggle_hide_devs_btn",
//                    group: "extras",
//                    icon: "user-secret",
//                    perform: function () {
//                      var btn2 = $(".toggle_hide_devs_btn");
//                      if (btn2 != undefined && btn2 != null) {
//                        btn2.toggleClass("dis", hide);
//                        hide = !hide;
//                        console.log('New state after button press: ' + hide);
//                      }
//                    }
//                  });
//                });
//              }
//              stop = true;
//            }
//          }
//          if (!stop) {
//            setTimeout(waitForUser, 300); // check every 300ms. Because depending on network speed, it may take longer to load user info.
//          }
//        })();
//      }
//    }
//  }
//
//  api.includePostAttributes('hide_devs');
//
//  api.modifyClass('model:composer', {
//    hide_devs: hide,
//
//    @on('init')
//    @observes('post')
//    @observes('model.composeState')
//    setHide() {
//      this.set('hide_devs', hide);
//    },
//  });
//}
//
//export default {
//  name: "toggle-hidedevs",
//  initialize(container) {
//    Composer.serializeOnCreate('hide_devs', 'hide_devs');
//    const siteSettings = container.lookup('site-settings:main');
//    if (siteSettings.hide_devs_enabled) {
//      withPluginApi('0.1', api => initializeHideToggle(api), {
//        noApi: () => priorToApi(container)
//      });
//    }
//  }
//};

import Composer from 'discourse/models/composer';
import {
  withPluginApi
} from 'discourse/lib/plugin-api';

export default {
  name: 'test-initializer',
  initialize() {
    Composer.serializeOnCreate('hide_devs', 'hideDevs');

    withPluginApi('0.8.12', api => {
      const user = api.getCurrentUser();

      user.findDetails().then(function () {
        const groups = user.get('groups');
        const inHideGroup = groups.find((g) => g.name == "hide_devs");

        if (inHideGroup) {
          api.modifyClass('model:composer', {
            hideDevs: false
          })

          api.onToolbarCreate(toolbar => {
            toolbar.addButton({
              id: "toggle-hide-devs-btn",
              group: "extras",
              icon: "user-secret",
              action: "toggleHideDevs"
            });
          });

          api.modifyClass('component:d-editor', {
            actions: {
              toggleHideDevs() {
                this.toggleProperty('outletArgs.composer.hideDevs');
              }
            }
          });
        }
      })
    })
  }
}
