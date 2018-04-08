// import { currentUser } from 'discourse/helpers/qunit-helpers';
import { withPluginApi, decorateCooked } from 'discourse/lib/plugin-api';
import ComposerController from 'discourse/controllers/composer';

function initializeHideToggle(api) {

  Discourse.User.current().groups.forEach((g) => { console.log(g.name); });
  // currentUser().groups.forEach((g) => { console.log(g.name); });
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
          this.get("toolbarEvent").addText("<show>\n");
          Discourse.User.current().groups.forEach((g) => { console.log(g.name); });
          // currentUser().groups.forEach((g) => { console.log(g.name); });
        // this.get("toolbarEvent").applySurround(
          // "<",
          // ">",
          // "show",
          // { multiline: false }
        // );
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
