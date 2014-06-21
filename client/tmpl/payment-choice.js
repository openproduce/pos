// PaymentChoiceTemplate renders a payment method in the payment dialog list.
function PaymentChoiceTemplate() {
}

PaymentChoiceTemplate.prototype.fill = function(paymentMethod) {
  return '<li>' + paymentMethod;
}
