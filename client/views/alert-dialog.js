// AlertDialogView shows a message box which can be dismissed by pressing esc.
// Optionally, it may also show a prompt for the clerk to press enter, which is
// used to prompt for yes/no answers---esc means no and enter means yes.
function AlertDialogView(args) {
  DialogView.call(this, args);
  this.message = new TextView(args.message);
  this.enterPrompt = args.enterPrompt;
}
AlertDialogView.prototype = Object.create(DialogView.prototype);

AlertDialogView.prototype.setMessage = function(text) {
  this.message.set(text);
};

AlertDialogView.prototype.showPrompt = function() {
  this.enterPrompt.classList.remove('hidden');
};

AlertDialogView.prototype.hidePrompt = function() {
  this.enterPrompt.classList.add('hidden');
};
