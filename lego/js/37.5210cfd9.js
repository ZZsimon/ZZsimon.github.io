(window.webpackJsonp=window.webpackJsonp||[]).push([[37],{"84":function(t,e,i){"use strict";i.r(e),i.d(e,"taro_slider_core",(function(){return o}));var n=i(26),o=function(){function Slider(t){var e=this;Object(n.g)(this,t),this.min=0,this.max=100,this.step=1,this.disabled=!1,this.value=0,this.activeColor="#1aad19",this.backgroundColor="#e9e9e9",this.blockSize=28,this.blockColor="#ffffff",this.showValue=!1,this.name="",this.totalWidth=0,this.touching=!1,this.ogX=0,this.touchId=null,this.percent=0,this.handleTouchStart=function(t){e.touching||e.disabled||(e.touching=!0,e.touchId=t.targetTouches[0].identifier,e.totalWidth=e.sliderInsRef.clientWidth,e.ogX=t.targetTouches[0].pageX,e.ogPercent=e.percent)},this.handleTouchMove=function(t){var i=e,n=i.disabled,o=i.touching,a=i.touchId,r=i.totalWidth,h=i.max,l=i.min,s=i.ogX,c=i.ogPercent;if(o&&!n&&t.targetTouches[0].identifier===a){t.preventDefault();var d=(t.targetTouches[0].pageX-s)/r*100+c,u=l+.01*(d=Math.max(0,Math.min(d,100)))*(h-l);e.updateByStep(u),e.onChanging.emit({"detail":t.detail,"value":e.val})}},this.handleTouchEnd=function(t){var i=e,n=i.disabled;i.touching&&!n&&(e.percent!==e.ogPercent&&e.onChange.emit({"detail":t.detail,"value":e.val}),e.touching=!1,e.touchId=null,e.ogX=0,e.ogPercent=0)},this.onChange=Object(n.d)(this,"change",7),this.onChanging=Object(n.d)(this,"changing",7)}return Slider.prototype.function=function(t){var e=this.max,i=this.min;if(null!==t&&t!==this.val){var n=Math.max(i,Math.min(t,e));this.updateByStep(n)}},Slider.prototype.componentDidLoad=function(){var t=this;Object.defineProperty(this.el,"value",{"get":function(){return t.val},"set":function(e){return t.value=e},"configurable":!0}),this.handler.addEventListener("touchstart",this.handleTouchStart),this.handler.addEventListener("touchmove",this.handleTouchMove),this.handler.addEventListener("touchend",this.handleTouchEnd)},Slider.prototype.componentDidUpdate=function(){this.value=null},Slider.prototype.componentWillLoad=function(){var t=this.value,e=this.max,i=this.min;if(null!==t){var n=Math.max(i,Math.min(t,e));this.updateByStep(n)}},Slider.prototype.updateByStep=function(t){for(var e=this.max,i=this.min,n=this.step,o=Math.floor((e-i)/n),a=0;a<=o;a++){var r=i+n*a,h=a===o?null:i+n*(a+1);if(t===r)break;if(!h&&t>r&&(t=r),h&&t>r&&t<h){t=t-r<n/2?r:h;break}}var l=(t-i)/(e-i)*100;this.val=t,this.percent=l},Slider.prototype.render=function(){var t=this,e=this,i=e.showValue,o=e.backgroundColor,a=e.activeColor,r=e.blockColor,h=e.name,l=e.percent,s=e.val,c=this.blockSize,d={"backgroundColor":o},u=l>100?100:l,f={"width":u+"%","backgroundColor":a};c<12&&(c=12),c>28&&(c=28);var p={"left":u+"%","width":c+"px","height":c+"px","backgroundColor":r,"marginTop":"-"+Math.floor(c/2)+"px","marginLeft":"-"+Math.floor(c/2)+"px"};return Object(n.f)(n.a,{"class":"weui-slider-box"},Object(n.f)("div",{"class":"weui-slider"},Object(n.f)("div",{"class":"weui-slider__inner","style":d,"ref":function(e){return t.sliderInsRef=e}},Object(n.f)("div",{"style":f,"class":"weui-slider__track"}),Object(n.f)("div",{"class":"weui-slider__handler","ref":function(e){e&&(t.handler=e)},"style":p}),Object(n.f)("input",{"type":"hidden","name":h,"value":s}))),i&&Object(n.f)("div",{"class":"weui-slider-box__value"},s))},Object.defineProperty(Slider.prototype,"el",{"get":function(){return Object(n.e)(this)},"enumerable":!0,"configurable":!0}),Object.defineProperty(Slider,"watchers",{"get":function(){return{"value":["function"]}},"enumerable":!0,"configurable":!0}),Slider}()}}]);