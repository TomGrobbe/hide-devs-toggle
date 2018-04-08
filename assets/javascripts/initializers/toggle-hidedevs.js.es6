// import { currentUser } from 'discourse/helpers/qunit-helpers';
import { withPluginApi, decorateCooked } from 'discourse/lib/plugin-api';
import ComposerController from 'discourse/controllers/composer';

var hide = false;

function initializeHideToggle(api) {
  var usr = Discourse.User.findByUsername(Discourse.User.current().username);
  (function waitForUser(){
    if (usr != undefined) {
      if (usr._result != undefined) {
        var groupHide = usr._result.groups.find((g) => g.name == "hide");
        // console.log("groupHide var: " + groupHide)
        if (groupHide != undefined) {
          hide = true;
          console.log("Enabling plugin, setting hide to true.");
          api.addToolbarPopupMenuOptionsCallback(() => {
            return {
              action: 'toggleHideDevs',
              icon: 'magic',
              label: 'toggle.buttontitle'
            };
          });
          
          ComposerController.reopen({
            actions: {
              toggleHideDevs() {
                if (hide) {
                  this.get("toolbarEvent").addText("<show>\n");
                }else{
                  this.get("toolbarEvent").removeText("<show>");
                }
                hide = !hide;
              }
            }
          });
        }
        return;
      }
    }
    // console.log("Waiting...");
    setTimeout(waitForUser, 300); // check every 300ms. Because depending on network speed, it may take longer to load user info.
  })();
}

export default {
  name: "toggle-hidedevs",
  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');
    if (siteSettings.hide_devs_enabled) {
      withPluginApi('0.5', initializeHideToggle);
    }
  }
};
