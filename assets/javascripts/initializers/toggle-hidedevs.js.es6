// import { currentUser } from 'discourse/helpers/qunit-helpers';
import { withPluginApi, decorateCooked } from 'discourse/lib/plugin-api';
import ComposerController from 'discourse/controllers/composer';

function initializeHideToggle(api) {
  var usr = Discourse.User.findByUsername(Discourse.User.current().username);
  setTimeout(function(){
    if (usr != undefined){
      console.log(usr);
      var groupHide = usr._result.groups.find((g) => g.name == "hide");
      if (groupHide != undefined) {
        api.addToolbarPopupMenuOptionsCallback(() => {
          return {
            action: 'toggleHideDevs',
            icon: 'magic',
            label: 'toggle.buttontitle'
          };
        });
      }
    }else{
        console.log("undefined usr var.");
    }
  }, 1000);
  
  
  
  ComposerController.reopen({
    actions: {
      toggleHideDevs() {
        this.get("toolbarEvent").addText("<show>\n");
        // if ()
        // Discourse.User.current().groups.forEach((g) => { console.log(g.name); });
        
        this.get("toolbarEvent").applySurround(
          "<",
          ">",
          "show",
          { multiline: false }
        );
        
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
