import {
  withPluginApi,
  decorateCooked
} from 'discourse/lib/plugin-api';
import ComposerController from 'discourse/controllers/composer';
import {
  onToolbarCreate
} from 'discourse/components/d-editor';


var stop = false;
var hide = true;

//function toggleHideDevs(test) {
//  //  var btn = document.getElementById("toggle_hide_devs_btn");
//  //  if (btn != undefined) {
//  //    if (hide) {
//  //      btn.style.fontWeight = "bold";
//  //    } else {
//  //      btn.style.fontWeight = "normal";
//  //    }
//  //    hide = !hide;
//  //  }
//
//  //  console.log(hide);
//  //  console.log(btn);
//  console.log("executed");
//  console.log(test);
//}

function initializeHideToggle(api) {
  var usr = Discourse.User.findByUsername(Discourse.User.current().username);
  (function waitForUser() {
    if (usr != undefined) {
      if (usr._result != undefined) {
        var groupHide = usr._result.groups.find((g) => g.name == "hide");
        if (groupHide != undefined) {
          console.log("Enabling hide plugin because user is allowed.");
          //          api.addToolbarPopupMenuOptionsCallback(() => {
          //            return {
          //              action: 'toggleHideDevs',
          //              icon: 'user-secret',
          //              label: 'toggle.buttontitle'
          //            };
          //          });
          api.onToolbarCreate(toolbar => {
            toolbar.addButton({
              id: "toggle_hide_devs_btn",
              group: "extras",
              icon: "user-secret",
              //              label: 'toggle.buttontitle',
              perform: function () {
                console.log('executed');
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
                  console.log(hide);
                  console.log(btn);
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

  //  ComposerController.reopen({
  //    actions: {
  //      toggleHideDevs() {
  //        //  var btn = document.getElementById("toggle_hide_devs_btn");
  //        //  if (btn != undefined) {
  //        //    if (hide) {
  //        //      btn.style.fontWeight = "bold";
  //        //    } else {
  //        //      btn.style.fontWeight = "normal";
  //        //    }
  //        //    hide = !hide;
  //        //  }
  //
  //        //  console.log(hide);
  //        //  console.log(btn);
  //        console.log("executed");
  //      }
  //    }
  //  });
  //  ComposerController.reopen({
  //    actions: {
  //      toggleHideDevs() {
  //        var btn = document.getElementById("toggle_hide_devs_btn");
  //        if (hide) {
  //          btn.style.fontWeight = "bold";
  //        } else {
  //          btn.style.fontWeight = "normal";
  //        }
  //        console.log(hide);
  //        console.log(btn);
  //
  //        /*
  //        var status_bar_div = document.getElementsByClassName("composer-action-title")[0];
  //        var text = document.getElementsByClassName("d-editor-input")[0].value;
  //        if (status_bar_div.getElementsByClassName("post-hide-status")[0] == undefined) {
  //          //          if (text.indexOf("<NoHideDevs>") == -1) {
  //          //            status_bar_div.innerHTML = status_bar_div.innerHTML + "<span class=\"post-hide-status\"></span>";
  //          //          } else {
  //          status_bar_div.innerHTML = status_bar_div.innerHTML + "<span class=\"post-hide-status\">(Hide developers disabled)</span>";
  //          //          }
  //        }
  //        var hide_devs_status = document.getElementsByClassName("post-hide-status")[0];
  //
  //        if (text.indexOf("<NoHideDevs>") == -1) {
  //          hide_devs_status.style.visibility = "hidden";
  //        }
  //
  //        if (text.indexOf("<NoHideDevs>") == -1) {
  //          document.getElementsByClassName("d-editor-input")[0].value = "<NoHideDevs>\n" + text.toString();
  //          //          hide_devs_status.innerHTML = "(Hide developers disabled)";
  //          hide_devs_status.style.visibility = "visible";
  //        } else {
  //          document.getElementsByClassName("d-editor-input")[0].value = text.replace(/\<NoHideDevs\>\n/g, "").replace(/\<NoHideDevs\>/g, "");
  //          //          hide_devs_status.innerHTML = "";
  //          hide_devs_status.style.visibility = "hidden";
  //        }
  //        */
  //      }
  //    }
  //  });

  //  var status_bar_div = document.getElementsByClassName("composer-action-title")[0];
  //  var text = document.getElementsByClassName("d-editor-input")[0].value;
  //  if (status_bar_div.getElementsByClassName("post-hide-status")[0] == undefined) {
  //    //          if (text.indexOf("<NoHideDevs>") == -1) {
  //    //            status_bar_div.innerHTML = status_bar_div.innerHTML + "<span class=\"post-hide-status\"></span>";
  //    //          } else {
  //    status_bar_div.innerHTML = status_bar_div.innerHTML + "<span class=\"post-hide-status\">(Hide developers disabled)</span>";
  //    //          }
  //  }
  //  var hide_devs_status = document.getElementsByClassName("post-hide-status")[0];
  //
  //  if (text.indexOf("<NoHideDevs>") == -1) {
  //    hide_devs_status.style.visibility = "hidden";
  //  }
}

export default {
  name: "toggle-hidedevs",
  initialize(container) {
    //    const siteSettings = container.lookup('site-settings:main');
    //    if (siteSettings.hide_devs_enabled) {
    withPluginApi('0.1', api => initializeHideToggle(api), {
      noApi: () => priorToApi(container)
    });
    //    }
  }
};
