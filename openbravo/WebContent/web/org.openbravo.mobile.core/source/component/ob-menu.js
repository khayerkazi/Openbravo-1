/*
 ************************************************************************************
 * Copyright (C) 2013-2015 Openbravo S.L.U.
 * Licensed under the Openbravo Commercial License version 1.0
 * You may obtain a copy of the License at http://www.openbravo.com/legal/obcl.html
 * or in the legal folder of this module distribution.
 ************************************************************************************
 */
/*global OB, enyo, _, Backbone, console, TestRegistry  */

enyo.kind({
  name: 'OB.UI.ToolbarMenuComponent',
  kind: 'onyx.Menu',
  show: function (args) {
    var me = this;
    if (me.autoDismiss) {
      me.autoDismiss = false;
      this.inherited(arguments);
      setTimeout(function () {
        //The autoDismiss is activated only after a small delay, to prevent issue 24582 from happening
        me.autoDismiss = true;
      }, 100);
    } else {
      this.inherited(arguments);
    }
  }
});

enyo.kind({
  name: 'OB.UI.ToolbarMenu',
  published: {
    disabled: false
  },
  components: [{
    kind: 'onyx.MenuDecorator',
    name: 'btnContextMenu',
    components: [{
      kind: 'OB.UI.ButtonContextMenu',
      name: 'mainMenuButton'
    }, {
      handlers: {
        onDestroyMenu: 'destroyMenu'
      },
      destroyMenu: function () {
        // This function will be called when the window is resized,
        // to avoid a strange problem which happens when a device is rotated
        // while the menu is open (see issue https://issues.openbravo.com/view.php?id=23669)
        this.hide();
        var element = document.getElementById(this.id);
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      },
      kind: 'OB.UI.ToolbarMenuComponent',
      classes: 'dropdown',
      name: 'menu',
      maxHeight: 600,
      scrolling: false,
      floating: true,
      autoDismiss: true,
      components: [{
        name: "menuScroller",
        kind: "enyo.Scroller",
        defaultKind: "onyx.MenuItem",
        vertical: "auto",
        classes: "enyo-unselectable",
        maxHeight: "600px",
        horizontal: 'hidden',
        strategyKind: "TouchScrollStrategy"
      }]
    }]
  }],
  onButtonTap: function () {
    // disable focus keeper while showing the menu
    this.originalSanMode = OB.MobileApp.view.scanMode;

    if (this.$.mainMenuButton.hasClass('btn-over')) {
      this.$.mainMenuButton.removeClass('btn-over');
    }
  },


  disabledChanged: function () {
    this.$.mainMenuButton.setDisabled(this.disabled);
  },

  initComponents: function () {
    this.inherited(arguments);

    if (this.disabled !== undefined) {
      this.$.mainMenuButton.setDisabled(this.disabled);
    }

    enyo.forEach(this.menuEntries, function (entry) {
      this.$.menuScroller.createComponent(entry);
    }, this);
  }
});

enyo.kind({
  name: 'OB.UI.MenuAction',
  permission: null,
  published: {
    label: null,
    disabled: false
  },
  handlers: {
    onHideButton: 'doHideButton'
  },
  components: [{
    name: 'lbl',
    allowHtml: true,
    style: 'padding: 12px 5px 12px 15px;',
    classes: 'dropdown-menuitem'
  }],
  tap: function () {
    if (this.disabled) {
      return true;
    }
    // restore focus keeper to its previous status
    OB.MobileApp.view.scanningFocus(this.parent.parent.parent.parent.parent.parent.originalSanMode);
    this.parent.parent.parent.parent.hide(); // Manual dropdown menu closure
    if (this.eventName) {
      this.bubble(this.eventName);
    }
  },
  setDisabled: function (value) {
    // check arguments
    // be sure that the value is always valid
    if (value === undefined) {
      OB.UTIL.Debug.execute(function () {
        throw "The disabled value must be true or false";
      });
      value = false;
    }
    this.disabled = value;
    if (value) {
      this.addClass('disabled');
    } else {
      this.removeClass('disabled');
    }
  },

  labelChanged: function () {
    this.$.lbl.setContent(this.label);
  },

  adjustVisibilityBasedOnPermissions: function () {
    if (this.permission && !OB.MobileApp.model.hasPermission(this.permission)) {
      this.hide();
    }
  },

  doHideButton: function (inSender, inEvent) {
    var isException = false;
    if (this.fixed) {
      // Fixed menu entries cannot be hidden.
      return;
    }
    if (inEvent && inEvent.exceptions) {
      isException = inEvent.exceptions.indexOf(this.name) !== -1;
    }
    if (!isException) {
      this.hide();
    }
  },

  initComponents: function () {
    this.inherited(arguments);
    this.$.lbl.setContent(this.i18nLabel ? OB.I18N.getLabel(this.i18nLabel) : this.label);
    this.adjustVisibilityBasedOnPermissions();
  }
});

enyo.kind({
  kind: 'OB.UI.MenuAction',
  name: 'OB.UI.MenuWindowItem',
  init: function (model) {
    this.model = model;
  },
  tap: function () {
    var me = this;
    if (this.disabled) {
      return true;
    }
    this.parent.parent.parent.parent.hide(); // Manual dropdown menu closure
    if (OB.MobileApp.model.isWindowOnline(this.route) === true) {
      if (!OB.MobileApp.model.get('connectedToERP')) {
        OB.UTIL.showError(OB.I18N.getLabel('OBMOBC_OfflineWindowRequiresOnline'));
        return;
      }
      if (OB.MobileApp.model.get('loggedOffline') === true) {
        OB.UTIL.showError(OB.I18N.getLabel('OBMOBC_OfflineWindowOfflineLogin'));
        return;
      }
    }
    if (!OB.MobileApp.model.hasPermission(this.route)) {
      return;
    }

    OB.UTIL.HookManager.executeHooks('OBMOBC_PreWindowOpen', {
      context: this,
      windows: OB.MobileApp.windowRegistry.registeredWindows
    }, function (args) {
      if (args && args.cancellation && args.cancellation === true) {
        return true;
      }
      if (me.route) {
        OB.MobileApp.model.navigate(me.route);
      }
      if (me.url) {
        window.open(me.url, '_blank');
      }
    });
  }
});

enyo.kind({
  name: 'OB.UI.ButtonContextMenu',
  kind: 'OB.UI.ToolbarButton',
  icon: 'btn-icon-drop btn-icon-menu',
  synchronizingIcon: 'btn-icon-pending btn-icon-synchronizing',
  notSynchronizedIcon: 'btn-icon-pending btn-icon-notsynchronized',
  handlers: {
    onLeftToolbarDisabled: 'disabledButton'
  },
  disabledButton: function (inSender, inEvent) {
    this.isEnabled = !inEvent.status;
    this.setDisabled(inEvent.status);
    if (!this.isEnabled) {
      this.removeClass('btn-icon-menu');
    } else {
      this.addClass('btn-icon-menu');
    }
  },
  components: [{
    name: 'pendingSync'
  }, {
    name: 'leftIcon'
  }, {
    tag: 'span',
    style: 'display: inline-block;'
  }, {
    name: 'rightIcon'
  }],
  ontap: 'onButtonTap',
  initComponents: function () {
    this.inherited(arguments);
    var me = this;
    OB.MobileApp.model.on('modelsSynchronized', function () {
      if (me.$.pendingSync) {
        me.$.pendingSync.removeClass(me.synchronizingIcon);
        me.$.pendingSync.removeClass(me.notSynchronizedIcon);
      }
    });
    OB.MobileApp.model.on('modelsSynchronizing', function () {
      if (me.$.pendingSync) {
        me.$.pendingSync.addClass(me.synchronizingIcon);
      }
    });
    OB.MobileApp.model.on('modelsNotSynchronized', function () {
      if (me.$.pendingSync) {
        me.$.pendingSync.addClass(me.notSynchronizedIcon);
        me.$.pendingSync.removeClass(me.synchronizingIcon);
      }
    });
    if (this.icon) {
      this.$.leftIcon.addClass(this.icon);
    }
    if (this.iconright) {
      this.$.rightIcon.addClass(this.iconright);
    }
  }
});

enyo.kind({
  name: 'OB.UI.PendingSyncButton',
  kind: 'OB.UI.MenuAction',
  style: 'padding-top: 3px;',
  i18nLabel: 'OBMOBC_PendingSynchronization',
  classes: 'menu-connection ',
  modelsToSynchObject: new Backbone.Model(),
  events: {
    onShowPopup: ''
  },
  tap: function () {
    var me = this;
    this.parent.parent.parent.parent.hide(); // Manual dropdown menu closure
    me.doShowPopup({
      popup: 'modalModelsToSynch'
    });
  },
  initComponents: function () {
    this.inherited(arguments);
    var me = this;
    me.hide();
    me.$.lbl.setStyle('padding: 12px 5px 12px 15px; margin-left: 20px;');
    me.addClass('btn-icon-notsynchronized');
    OB.MobileApp.model.on('modelsSynchronized', function () {
      me.hide();
    });
    OB.MobileApp.model.on('modelsSynchronizing', function () {
      me.show();
    });
    OB.MobileApp.model.on('modelsNotSynchronized', function () {
      me.show();
    });
  }
});


/**
 * This is the standard menu showing online and user info.
 * It can be extended to include window's custom entries.
 */
enyo.kind({
  name: 'OB.UI.MainMenu',
  classes: 'span2',

  initComponents: function () {
    this.inherited(arguments);
    this.createComponent({
      kind: 'OB.UI.MainMenuContents',
      name: 'menuHolder',
      style: 'margin-left:5px; margin-right:5px',
      customMenuEntries: this.customMenuEntries,
      showWindowsMenu: this.showWindowsMenu
    });
  }
});

enyo.kind({
  name: 'OB.UI.MenuSeparator',
  classes: 'dropdown-menudivider'
});

enyo.kind({
  name: 'OB.UI.MainMenuContents',
  kind: 'OB.UI.ToolbarMenu',
  menuEntries: [],
  init: function (model) {
    this.model = model;
  },
  handlers: {
    onSessionInfo: 'showSession',
    onUserInfo: 'showUser',
    onDisableMenuEntry: 'disableMenuEntry',
    onHideButtons: 'doHideButtons'
  },

  events: {
    onShowPopup: ''
  },

  showSession: function () {
    this.doShowPopup({
      popup: 'profileSessionInfo',
      args: {
        model: this.model
      }
    });
  },

  showUser: function () {
    this.doShowPopup({
      popup: 'profileUserInfo'
    });
  },

  setConnected: function () {
    var menuEntry, connected;

    if (!this.$.menu) {
      // menu is not already built...
      return;
    }

    menuEntry = this.$.menuScroller.$.connStatusButton;
    connected = OB.MobileApp.model.get('connectedToERP');
    menuEntry.$.lbl.setStyle('padding: 12px 5px 12px 15px; margin-left: 20px;');
    menuEntry.setLabel(OB.I18N.getLabel(connected ? 'OBMOBC_Online' : 'OBMOBC_Offline'));
    menuEntry.addRemoveClass('onlineicon', connected);
    menuEntry.addRemoveClass('offlineicon', !connected);
  },

  disableMenuEntry: function (inSender, inEvent) {
    var entry = this.$.menu.$[inEvent.entryName],
        disable;
    if (!entry) {
      return true;
    }

    disable = inEvent.disable !== false;
    entry.setDisabled(disable);
    return true;
  },

  doHideButtons: function (inSender, inEvent) {
    this.waterfall('onHideButton', inEvent);
  },

  getMenuComponent: function (componentName) {
    var objComp;
    objComp = _.find(this.$.menuScroller.controls, function (item) {
      if (!OB.UTIL.isNullOrUndefined(item.$.lbl) && !OB.UTIL.isNullOrUndefined(item.$.lbl.content) && item.$.lbl.content === componentName) {
        return true;
      }
    });
    return objComp;
  },

  initComponents: function () {
    this.menuEntries = [];

    this.menuEntries.push({
      kind: 'OB.UI.PendingSyncButton'
    });

    this.menuEntries.push({
      kind: 'OB.UI.MenuAction',
      name: 'connStatusButton',
      classes: 'menu-connection',
      eventName: 'onSessionInfo'
    });

    if (this.customMenuEntries && this.customMenuEntries.length > 0) {
      this.menuEntries.push({
        kind: 'OB.UI.MenuSeparator'
      });

      _.forEach(this.customMenuEntries, function (entry) {
        this.menuEntries.push(entry);
      }, this);
    }

    if (this.showWindowsMenu) {
      // show entries for all registered windows
      this.menuEntries.push({
        kind: 'OB.UI.MenuSeparator'
      });

      enyo.forEach(OB.MobileApp.model.windows.filter(function (window) {
        // show in menu only the ones with menuPosition
        return window.get('menuPosition');
      }), function (window) {
        this.menuEntries.push({
          name: 'OB.UI.MenuWindowItem.' + window.get('menuI18NLabel'),
          kind: 'OB.UI.MenuWindowItem',
          label: window.get('menuLabel'),
          i18nLabel: window.get('menuI18NLabel'),
          route: window.get('route'),
          permission: window.get('permission')
        });
      }, this);
    }

    this.menuEntries.push({
      kind: 'OB.UI.MenuSeparator'
    });

    this.menuEntries.push({
      name: 'OB.UI.MenuUserInfo',
      kind: 'OB.UI.MenuAction',
      classes: 'dropdown-menuitem',
      i18nLabel: 'OBMOBC_User',
      eventName: 'onUserInfo'
    });

    // start menu recording entry
    enyo.kind({
      name: 'OBMOBC.UI.MenuRecording',
      kind: 'OB.UI.MenuAction',
      i18nLabel: 'OBMOBC_LblMenuStartRecording',
      tap: function () {
        var i;
        if (this.disabled) {
          return true;
        }
        this.parent.parent.parent.parent.hide(); // Manual dropdown menu closure
        if (TestRegistry.writingTest === true) {
          TestRegistry.writingTest = false;
          this.$.lbl.setContent(OB.I18N.getLabel('OBMOBC_LblMenuStartRecording'));
          console.log("======================= RECORDING START =================================");
          var stringSteps = '';
          for (i = 0; i < TestRegistry.testSteps.length; i++) {
            stringSteps = stringSteps + TestRegistry.testSteps[i] + '\n';
          }
          console.log(stringSteps);
          console.log("=======================  RECORDING END  =================================");
          TestRegistry.testSteps = [];
        } else {
          TestRegistry.appendIdTestToDOM();
          TestRegistry.writingTest = true;
          this.$.lbl.setContent(OB.I18N.getLabel('OBMOBC_LblMenuFinishRecording'));
        }
      }
    });

    // add the menu entry if the 'Mobile Activate Recording Menu' preference is set to 'Y' and while in Development
    if (OB.MobileApp.model.get('permissions').OBMOBC_MenuRecording || OB.UTIL.Debug.isDebug()) {
      this.menuEntries.push({
        kind: 'OBMOBC.UI.MenuRecording'
      });
    }

    // finish menu recording entry
    this.inherited(arguments);

    OB.MobileApp.model.on('change:connectedToERP', function () {
      this.setConnected();
    }, this);
    this.setConnected();
  }
});