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
//childList：设置为true表示监听指定元素的子元素的变动;
//attributes:设置为true表示监听指定元素的属性的变动；
//characterData：设置为true表示监听指定元素的data变动;
//subtree:设置为true表示不紧监听目标元素也同时监听其子元素变动；
//attributeOldValue：在attributes属性已经设为true的前提下,如果需要将发生变化的属性节点之前的属性值记录下来(记录到下面MutationRecord对象的oldValue属性中),则设置为true；
//characterDataOldValue：在characterData属性已经设为true的前提下,如果需要将发生变化的characterData节点之前的文本内容记录下来(记录到下面MutationRecord对象的oldValue属性中),则设置为true.
//attributeFilter：一个属性名数组(不需要指定命名空间),只有该数组中包含的属性名发生变化时才会被观察到,其他名称的属性发生变化后会被忽略.
var config = { attributes: true, attributeFilter: ['style'], attributeOldValue: true }; 
//配置MutationObserver在DOM更改匹配给定选项时，通过其回调函数开始接收通知。
observer.observe(element, config);
//阻止 MutationObserver 实例继续接收的通知，直到再次调用其observe()方法，该观察者对象包含的回调函数都不会再被调用。
observer.disconnect();
//从MutationObserver的通知队列中删除所有待处理的通知，并将它们返回到MutationRecord对象的新Array中。
observer.takeRecords();
observer = null;

