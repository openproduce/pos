// KeyController globally traps function and control keys. It tracks and moves
// focus between the item picker, sale list, and modal dialog, forwarding
// keystrokes to the currently focused controller.
function KeyController(args) {
  this.pickerController = args.pickerController;
  this.saleController = args.saleController;
  this.dialogController = args.dialogController;
  this.magstripeReader = args.magstripeReader;
  this.focused = this.pickerController;

  document.addEventListener('keydown', this.keydown.bind(this));
  // In case the body gets focused somehow while the picker is supposed to be
  // focused, restore focus in the picker. This can happen if you click on the
  // body. Without this hack, the clerk has no good way to refocus the picker
  // using the keyboard.
  setInterval(this.refocusPicker.bind(this), 1000);
}

KeyController.prototype.keydown = function(e) {
  if (this.magstripeReader.keydown(e))
    return;
  var key = decodeKey(e); 
  if (key.fkey) {
    this.dispatchFunctionKeys(e, key.fkey);
  } else if (key.tab) {
    if (this.focused == this.saleController) {
      // If the sale is focused, tab re-focuses the picker.
      this.focusPicker(e);
    } else if (this.focused == this.pickerController) {
      // Prevent focus from cycling to the location bar.
      this.pickerController.tab(e);
    } else if (this.focused == this.dialogController) {
      this.dialogController.tab(e);
    }
    e.preventDefault();
  } else if (key.esc) {
    if (this.focused.esc) {
      var done = this.focused.esc();
      if (this.focused == this.dialogController && done)
        this.focusPicker(e);
    }
  } else if (key.up) {
    if (this.focused.up)
      this.focused.up();
    e.preventDefault();
  } else if (key.down) {
    if (this.focused.down)
      this.focused.down();
    e.preventDefault();
  } else if (key.enter) {
    if (this.focused.enter) {
      var done = this.focused.enter();
      if (this.focused == this.dialogController && done)
        this.focusPicker(e);
    }
    e.preventDefault();
  } else if (key.right) {
    if (this.focused == this.pickerController &&
        this.pickerController.atEndOfText()) {
      this.focusSale(e);
    } else if (this.focused == this.dialogController) {
      this.focused.right(e);
    }
  } else if (key.left) {
    if (this.focused == this.saleController) {
      this.focusPicker(e);
    } else if (this.focused == this.dialogController) {
      this.focused.left(e);
    }
  } else if (key.backspace || key.del) {
    if (this.focused == this.saleController) {
      this.saleController.deleteSelectedItem();
      if (!this.saleController.hasItems())
        this.focusPicker(e);
      e.preventDefault();
    }
  }
}

KeyController.prototype.dispatchFunctionKeys = function(e, n) {
  if (n == 3) {
    // F3 is reserved for focusing the sale view.
    if (this.focused == this.pickerController)
      this.focusSale(e);
    else if (this.focused == this.saleController)
      this.focusPicker(e);
  } else if (this.focused == this.pickerController &&
             this.pickerController.isQuantityFocused()) {
    // Don't allow pressing F5 to pay a sale without having accepted the
    // quantity of the current item to buy.
  } else {
    if (this.dialogController.fkey(n)) {
      this.focusDialog();
    }
  }
  e.preventDefault();
};

KeyController.prototype.refocusPicker = function() {
  if (this.focused == this.pickerController &&
      document.activeElement == document.body) {
    this.pickerController.focus();
  }
};

KeyController.prototype.focusPicker = function(e) {
  if (this.focused == this.saleController ||
      this.focused == this.dialogController) {
    this.saleController.blur();
    this.pickerController.focus();
    this.focused = this.pickerController;
    if (e) e.preventDefault();
  }
};

KeyController.prototype.focusSale = function(e) {
  if (this.focused == this.pickerController &&
      this.saleController.hasItems()) {
    this.pickerController.blur();
    this.saleController.focus();
    this.focused = this.saleController;
    if (e) e.preventDefault();
  }
};

KeyController.prototype.focusDialog = function() {
  this.saleController.blur();
  this.pickerController.blur();
  this.focused = this.dialogController;
};
