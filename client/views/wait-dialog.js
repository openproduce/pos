// WaitDialogView shows a dialog with a message prompting the clerk to wait.
function WaitDialogView(args) {
  DialogView.call(this, args);
  this.message = new TextView(args.message);
}
WaitDialogView.prototype = Object.create(DialogView.prototype);

WaitDialogView.prototype.setMessage = function(text) {
  this.message.set(text);
};
