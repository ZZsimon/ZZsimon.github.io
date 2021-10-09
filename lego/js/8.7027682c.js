/*! For license information please see 8.7027682c.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{"112":function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var r=function createCommonjsModule(e,t){return e(t={"exports":{}},t.exports),t.exports}((function(e){!function(){var t={}.hasOwnProperty;function classNames(){for(var e=[],a=0;a<arguments.length;a++){var r=arguments[a];if(r){var s=typeof r;if("string"===s||"number"===s)e.push(r);else if(Array.isArray(r)&&r.length){var i=classNames.apply(null,r);i&&e.push(i)}else if("object"===s)for(var n in r)t.call(r,n)&&r[n]&&e.push(n)}}return e.join(" ")}e.exports?(classNames.default=classNames,e.exports=classNames):window.classNames=classNames}()}))},"74":function(e,t,a){"use strict";a.r(t),a.d(t,"taro_navigator_core",(function(){return n}));var r=a(26),s=a(112),i=a(30),n=function(){function Navigator(e){Object(r.g)(this,e),this.openType="navigate",this.isHover=!1,this.delta=0,this.onSuccess=Object(r.d)(this,"cuccess",7),this.onFail=Object(r.d)(this,"fail",7),this.onComplete=Object(r.d)(this,"Complete",7)}return Navigator.prototype.onClick=function(){var e=this.openType,t=this.onSuccess,a=this.onFail,r=this.onComplete,s=Promise.resolve();switch(e){case"navigate":s=i.navigateTo({"url":this.url});break;case"redirect":s=i.redirectTo({"url":this.url});break;case"switchTab":s=i.switchTab({"url":this.url});break;case"reLaunch":s=i.reLaunch({"url":this.url});break;case"navigateBack":s=i.navigateBack({"delta":this.delta});break;case"exit":s=Promise.reject(new Error('navigator:fail 暂不支持"openType: exit"'))}s&&s.then((function(e){t.emit(e)})).catch((function(e){a.emit(e)})).finally((function(){r.emit()}))},Navigator.prototype.render=function(){var e,t=this.isHover,a=this.hoverClass;return Object(r.f)(r.a,{"class":Object(s.a)((e={},e[a]=t,e))})},Object.defineProperty(Navigator,"style",{"get":function(){return".navigator-hover{background:#efefef}"},"enumerable":!0,"configurable":!0}),Navigator}()}}]);