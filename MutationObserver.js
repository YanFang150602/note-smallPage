var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
var element = document.getElementsByTagName("textarea")[0];
var recordOldValue = {};
let observer = new MutationObserver((mutationList) => {
  var width = getComputedStyle(element).getPropertyValue('width')
  var height = getComputedStyle(element).getPropertyValue('height')
  if (width === this.recordOldValue.width && height === this.recordOldValue.height){
    return;
  }
  recordOldValue = {
    width,
    height
  }
});
observer.observe(element, { attributes: true, attributeFilter: ['style'], attributeOldValue: true });
