// import { currentUser } from 'discourse/helpers/qunit-helpers';
import { withPluginApi, decorateCooked } from 'discourse/lib/plugin-api';
import ComposerController from 'discourse/controllers/composer';

var hide = false;

function initializeHideToggle(api) {
  var usr = Discourse.User.findByUsername(Discourse.User.current().username);
  setTimeout(function(){
    if (usr != undefined){
      // console.log(usr);
      var groupHide = usr._result.groups.find((g) => g.name == "hide");
      if (groupHide != undefined) {
          hide = true;
        api.addToolbarPopupMenuOptionsCallback(() => {
          return {
            action: 'toggleHideDevs',
            icon: 'magic',
            label: 'toggle.buttontitle'
          };
        });
      }
    }
  }, 250);
  
  
  
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

export default {
  name: "toggle-hidedevs",
  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');
    if (siteSettings.hide_devs_enabled) {
      withPluginApi('0.5', initializeHideToggle);
    }
  }
};
