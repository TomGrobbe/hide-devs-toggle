import { withPluginApi, decorateCooked } from 'discourse/lib/plugin-api';
import ComposerController from 'discourse/controllers/composer';

function initializeHideToggle(api) {

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
