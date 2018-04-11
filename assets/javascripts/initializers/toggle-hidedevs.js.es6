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
var hide = false;

function initializeHideToggle(api) {

  var usr = Discourse.User.findByUsername(Discourse.User.current().username);
  (function waitForUser() {
    if (usr != undefined) {
      if (usr._result != undefined) {
        var groupHide = usr._result.groups.find((g) => g.name == "hide");
        if (groupHide != undefined) {
          console.log("Enabling hide plugin because user is allowed.");

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
          api.onToolbarCreate(toolbar => {
            toolbar.addButton({
              id: "toggle_hide_devs_btn",
              group: "extras",
              icon: "user-secret",
              perform: function () {
                console.log('before change: ' + hide);
                var btn = document.getElementsByClassName("toggle_hide_devs_btn")[0];
                if (btn != undefined && btn != null) {
                  if (hide) {
                    btn.style.backgroundColor = "rgb(221, 93, 93)";
                    btn.style.color = "white";
                  } else {
                    btn.style.backgroundColor = "transparent";
                    btn.style.color = "";
                  }
                  hide = !hide;
                  console.log('after change: ' + hide);
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
  api.includePostAttributes('hide_devs');
  api.modifyClass('model:composer', {
    hide_devs: hide,

    @on('init')
    @observes('post')
    setHide() {
      const post = this.get('post');
      //      if (post) {

      console.log("1:");
      console.log(this);
      this.set('hide_devs', hide);
      console.log("hide_post is now set to: " + hide);
      console.log(this.get('hide_devs'));
      //      } else {
      //        console.log("no post?! " + hide);
      //      }
      console.log("2:");
      console.log(this);
    },
  });
}

export default {
  name: "toggle-hidedevs",
  initialize(container) {
    Composer.serializeOnCreate('hide_devs');
    const siteSettings = container.lookup('site-settings:main');
    if (siteSettings.hide_devs_enabled) {
      withPluginApi('0.1', api => initializeHideToggle(api), {
        noApi: () => priorToApi(container)
      });
    }
  }
};
