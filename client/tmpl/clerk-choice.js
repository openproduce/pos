// ClerkChoiceTemplate renders a clerk in the clerks dialog list.
function ClerkChoiceTemplate() {
}

ClerkChoiceTemplate.prototype.fill = function(clerk) {
  return fillTemplate(clerk, '<li>{{name}}');
};
