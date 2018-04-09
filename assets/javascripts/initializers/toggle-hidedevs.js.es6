import { withPluginApi, decorateCooked } from 'discourse/lib/plugin-api';
import ComposerController from 'discourse/controllers/composer';

var stop = false;

function initializeHideToggle(api) {
  var usr = Discourse.User.findByUsername(Discourse.User.current().username);
  (function waitForUser(){
    if (usr != undefined) {
      if (usr._result != undefined) {
        var groupHide = usr._result.groups.find((g) => g.name == "hide");
        if (groupHide != undefined) {
          console.log("Enabling hide plugin because user is allowed.");
          api.addToolbarPopupMenuOptionsCallback(() => {
            return {
              action: 'toggleHideDevs',
              icon: 'magic',
              label: 'toggle.buttontitle'
            };
          });
        }
        stop = true;
      }
    }
    if (!stop){
      setTimeout(waitForUser, 300); // check every 300ms. Because depending on network speed, it may take longer to load user info.
    }
  })();
  
  ComposerController.reopen({
    actions: {
      toggleHideDevs() {
        var text = document.getElementsByClassName("d-editor-input")[0].value;
        if (text.indexOf("<NoHideDevs>") == -1) {
          document.getElementsByClassName("d-editor-input")[0].value = "<NoHideDevs>\n" + text.toString();
        } else {
          document.getElementsByClassName("d-editor-input")[0].value = text.replace(/\<NoHideDevs\>\n/g, "").replace(/\<NoHideDevs\>/g, "");
        }
      }
    }
  });
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
