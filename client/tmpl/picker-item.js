// PickerItemTemplate renders an item in the picker pane match list.
function PickerItemTemplate() {
}

PickerItemTemplate.prototype.fill = function(item) {
  return fillTemplate(item, '<li class="picker-item">{{desc}}');
};
