import {
  withPluginApi,
  decorateCooked
} from 'discourse/lib/plugin-api';
import ComposerController from 'discourse/controllers/composer';
import {
  onToolbarCreate
} from 'discourse/components/d-editor';
import Composer from 'discourse/models/composer';
import {
  default as computed,
  on,
  observes
} from 'ember-addons/ember-computed-decorators';



var stop = false;
var hide = true;

function initializeHideToggle(api) {
  var btn = document.getElementsByClassName("toggle_hide_devs_btn")[0];
  if (btn) {
    if (hide) {
      btn.style.backgroundColor = "rgb(221, 93, 93)";
      btn.style.color = "white";
    } else {
      btn.style.backgroundColor = "transparent";
      btn.style.color = "";
    }
  }
  if (Discourse != undefined) {
    if (Discourse.User != undefined) {
      if (Discourse.User.current() != undefined) {
        var usr = Discourse.User.findByUsername(Discourse.User.current().username);
        (function waitForUser() {
          if (usr != undefined) {
            if (usr._result != undefined) {
              var groupHide = usr._result.groups.find((g) => g.name == "hide_devs");
              if (groupHide != undefined) {
                console.log("Enabling hide plugin because user is allowed.");


                api.onToolbarCreate(toolbar => {
                  toolbar.addButton({
                    id: "toggle_hide_devs_btn",
                    group: "extras",
                    icon: "user-secret",
                    perform: function () {
                      var btn2 = document.getElementsByClassName("toggle_hide_devs_btn")[0];
                      if (btn2 != undefined && btn2 != null) {
                        if (hide) {
                          btn2.style.backgroundColor = "rgb(221, 93, 93)";
                          btn2.style.color = "white";
                        } else {
                          btn2.style.backgroundColor = "transparent";
                          btn2.style.color = "";
                        }
                        hide = !hide;
                        console.log('New state after button press: ' + hide);
                      }
                    }
                  });
                });
              }
              stop = true;
            }
          }
          if (!stop) {
            setTimeout(waitForUser, 300); // check every 300ms. Because depending on network speed, it may take longer to load user info.
          }
        })();
      }
    }
  }

  //  api.includePostAttributes('hide_devs');

  api.modifyClass('model:composer', {
    hide_devs: hide,

    //    @on('init')
    //    @observes('post')
    @observes('composeState')
    setHide() {
      const post = this.get('post');
      //      if (post) {

      //      console.log("1:");
      //      console.log(this);
      this.set('hide_devs', hide);
      //      console.log("hide_post is now set to: " + hide);
      //      console.log(this.get('hide_devs'));
      //      } else {
      //        console.log("no post?! " + hide);
      //      }
      //      console.log("2:");
      console.log(this);
    },
  });
}

export default {
  name: "toggle-hidedevs",
  initialize(container) {
    Composer.serializeOnCreate('hide_devs', 'hide_devs');
    const siteSettings = container.lookup('site-settings:main');
    if (siteSettings.hide_devs_enabled) {
      withPluginApi('0.1', api => initializeHideToggle(api), {
        noApi: () => priorToApi(container)
      });
    }
  }
};
