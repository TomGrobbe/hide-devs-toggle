// import { currentUser } from 'discourse/helpers/qunit-helpers';
import { withPluginApi, decorateCooked } from 'discourse/lib/plugin-api';
import ComposerController from 'discourse/controllers/composer';

var hide = false;
var stop = false;

function initializeHideToggle(api) {
  var usr = Discourse.User.findByUsername(Discourse.User.current().username);
  (function waitForUser(){
    if (usr != undefined) {
      if (usr._result != undefined) {
        var groupHide = usr._result.groups.find((g) => g.name == "hide");
        // console.log("groupHide var: " + groupHide)
        if (groupHide != undefined) {
          // hide = true;
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
        // return false;
      }
    }
    // console.log("Waiting...");
    if (!stop){
      setTimeout(waitForUser, 300); // check every 300ms. Because depending on network speed, it may take longer to load user info.
    }
  })();
  
  ComposerController.reopen({
    actions: {
      toggleHideDevs() {
        // hide = !hide;
        // var text = this.get("toolbarEvent").getText();
        // var start = text.indexOf("<NoHideDevs>");
        // var end = start + 12;
        // console.log(text + " " + start + " " + end);
        // var text = $('textarea.d-editor-input')[0].value;
        var text = document.getElementsByClassName("d-editor-input")[0].value;
        if (text.indexOf("<NoHideDevs>") === -1) {
          // this.get("toolbarEvent").addText("<NoHideDevs>");
          text = "<NoHideDevs>\n" + text;
        } else {
          // var event = this.get("toolbarEvent");
          // const textarea = $('textarea.d-editor-input')[0];
          text = text.replace(/\<NoHideDevs\>/, "");
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
