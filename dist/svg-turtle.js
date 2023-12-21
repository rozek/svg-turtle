!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):(t="undefined"!=typeof globalThis?globalThis:t||self,function(){var n=t.SVGTurtle,e=t.SVGTurtle={};r(e),e.noConflict=function(){return t.SVGTurtle=n,e}}())}(this,(function(t){"use strict";function r(t){var r=/^([$a-zA-Z][$a-zA-Z0-9]*):\s*(\S.+)\s*$/.exec(t);if(null==r)throw new Error(t);var n=new Error(r[2]);throw n.name=r[1],n}function n(t){return("number"==typeof t||t instanceof Number)&&isFinite(t.valueOf())}function e(t,r,e,i,a){if(void 0===i&&(i=!0),void 0===a&&(a=!0),!function(t){return"number"==typeof t||t instanceof Number}(t)||isNaN(t))return!1;if(n(r)){if(n(e)){if(t<r||!i&&t===r||t>e||!a&&t===e)return!1}else if(t<r||!i&&t===r)return!1}else if(n(e)&&(t>e||!a&&t===e))return!1;return!0}function i(t){return null!=t&&"object"==typeof t&&Object.getPrototypeOf(t)===Object.prototype}function a(t,r){return r.indexOf(t)>=0}function u(t){return function(t){return"string"==typeof t||t instanceof String}(t)&&(d.hasOwnProperty(t)||/^#[a-fA-F0-9]{6}$/.test(t)||/^#[a-fA-F0-9]{8}$/.test(t)||/^rgb\([0-9]+,\s*[0-9]+,\s*[0-9]+\)$/.test(t)||/^rgba\([0-9]+,\s*[0-9]+,\s*[0-9]+,([01]|[0]?[.][0-9]+)\)$/.test(t))}var o=!1,s=!0;function h(t,n,e){var i=function(i,a){return function(t,n,e,i,a){if(null==n){if(i)return n;r("MissingArgument: no ".concat(b(t)," given"))}else if(e(n))switch(!0){case n instanceof Boolean:case n instanceof Number:case n instanceof String:return n.valueOf();default:return n}else r("InvalidArgument: the given ".concat(b(t)," is no valid ").concat(b(a)))}(i,a,t,n,e)},a=t.name;return null!=a&&/^ValueIs/.test(a)?function(t,n){null==t&&r("MissingArgument: no function given");"function"!=typeof t&&r("InvalidArgument: the given 1st Argument is not a JavaScript function");null==n&&r("MissingArgument: no desired name given");"string"==typeof n||n instanceof String||r("InvalidArgument: the given desired name is not a string");if(t.name===n)return t;try{if(Object.defineProperty(t,"name",{value:n}),t.name===n)return t}catch(t){}return new Function("originalFunction","return function "+n+" () {return originalFunction.apply(this,Array.prototype.slice.apply(arguments))}")(t)}(i,a.replace(/^ValueIs/,n?"allow":"expect")):i}var l=h(n,s,"finite numeric value"),c=h(n,o,"finite numeric value");var g=function(t,n,e){if(null==n&&r("MissingArgument: no ".concat(b(t)," given")),a(n,e))return null==n||"function"!=typeof n.valueOf?n:n.valueOf();r("InvalidArgument: the given ".concat(b(t)," is not among the supported values"))};function b(t){return t.replace(/\\x[0-9a-zA-Z]{2}|\\u[0-9a-zA-Z]{4}|\\[0bfnrtv'"\\\/]?/g,(function(t){return"\\"===t?"\\\\":t})).replace(/[\x00-\x1f\x7f-\x9f]/g,(function(t){switch(t){case"\0":return"\\0";case"\b":return"\\b";case"\f":return"\\f";case"\n":return"\\n";case"\r":return"\\r";case"\t":return"\\t";case"\v":return"\\v";default:var r=t.charCodeAt(0).toString(16);return"\\x"+"00".slice(r.length)+r}}))}var d={transparent:"rgba(0,0,0,0,0.0)",aliceblue:"rgba(240,248,255,1.0)",lightpink:"rgba(255,182,193,1.0)",antiquewhite:"rgba(250,235,215,1.0)",lightsalmon:"rgba(255,160,122,1.0)",aqua:"rgba(0,255,255,1.0)",lightseagreen:"rgba(32,178,170,1.0)",aquamarine:"rgba(127,255,212,1.0)",lightskyblue:"rgba(135,206,250,1.0)",azure:"rgba(240,255,255,1.0)",lightslategray:"rgba(119,136,153,1.0)",beige:"rgba(245,245,220,1.0)",lightslategrey:"rgba(119,136,153,1.0)",bisque:"rgba(255,228,196,1.0)",lightsteelblue:"rgba(176,196,222,1.0)",black:"rgba(0,0,0,1.0)",lightyellow:"rgba(255,255,224,1.0)",blanchedalmond:"rgba(255,235,205,1.0)",lime:"rgba(0,255,0,1.0)",blue:"rgba(0,0,255,1.0)",limegreen:"rgba(50,205,50,1.0)",blueviolet:"rgba(138,43,226,1.0)",linen:"rgba(250,240,230,1.0)",brown:"rgba(165,42,42,1.0)",magenta:"rgba(255,0,255,1.0)",burlywood:"rgba(222,184,135,1.0)",maroon:"rgba(128,0,0,1.0)",cadetblue:"rgba(95,158,160,1.0)",mediumaquamarine:"rgba(102,205,170,1.0)",chartreuse:"rgba(127,255,0,1.0)",mediumblue:"rgba(0,0,205,1.0)",chocolate:"rgba(210,105,30,1.0)",mediumorchid:"rgba(186,85,211,1.0)",coral:"rgba(255,127,80,1.0)",mediumpurple:"rgba(147,112,219,1.0)",cornflowerblue:"rgba(100,149,237,1.0)",mediumseagreen:"rgba(60,179,113,1.0)",cornsilk:"rgba(255,248,220,1.0)",mediumslateblue:"rgba(123,104,238,1.0)",crimson:"rgba(220,20,60,1.0)",mediumspringgreen:"rgba(0,250,154,1.0)",cyan:"rgba(0,255,255,1.0)",mediumturquoise:"rgba(72,209,204,1.0)",darkblue:"rgba(0,0,139,1.0)",mediumvioletred:"rgba(199,21,133,1.0)",darkcyan:"rgba(0,139,139,1.0)",midnightblue:"rgba(25,25,112,1.0)",darkgoldenrod:"rgba(184,134,11,1.0)",mintcream:"rgba(245,255,250,1.0)",darkgray:"rgba(169,169,169,1.0)",mistyrose:"rgba(255,228,225,1.0)",darkgreen:"rgba(0,100,0,1.0)",moccasin:"rgba(255,228,181,1.0)",darkgrey:"rgba(169,169,169,1.0)",navajowhite:"rgba(255,222,173,1.0)",darkkhaki:"rgba(189,183,107,1.0)",navy:"rgba(0,0,128,1.0)",darkmagenta:"rgba(139,0,139,1.0)",oldlace:"rgba(253,245,230,1.0)",darkolivegreen:"rgba(85,107,47,1.0)",olive:"rgba(128,128,0,1.0)",darkorange:"rgba(255,140,0,1.0)",olivedrab:"rgba(107,142,35,1.0)",darkorchid:"rgba(153,50,204,1.0)",orange:"rgba(255,165,0,1.0)",darkred:"rgba(139,0,0,1.0)",orangered:"rgba(255,69,0,1.0)",darksalmon:"rgba(233,150,122,1.0)",orchid:"rgba(218,112,214,1.0)",darkseagreen:"rgba(143,188,143,1.0)",palegoldenrod:"rgba(238,232,170,1.0)",darkslateblue:"rgba(72,61,139,1.0)",palegreen:"rgba(152,251,152,1.0)",darkslategray:"rgba(47,79,79,1.0)",paleturquoise:"rgba(175,238,238,1.0)",darkslategrey:"rgba(47,79,79,1.0)",palevioletred:"rgba(219,112,147,1.0)",darkturquoise:"rgba(0,206,209,1.0)",papayawhip:"rgba(255,239,213,1.0)",darkviolet:"rgba(148,0,211,1.0)",peachpuff:"rgba(255,218,185,1.0)",deeppink:"rgba(255,20,147,1.0)",peru:"rgba(205,133,63,1.0)",deepskyblue:"rgba(0,191,255,1.0)",pink:"rgba(255,192,203,1.0)",dimgray:"rgba(105,105,105,1.0)",plum:"rgba(221,160,221,1.0)",dimgrey:"rgba(105,105,105,1.0)",powderblue:"rgba(176,224,230,1.0)",dodgerblue:"rgba(30,144,255,1.0)",purple:"rgba(128,0,128,1.0)",firebrick:"rgba(178,34,34,1.0)",red:"rgba(255,0,0,1.0)",floralwhite:"rgba(255,250,240,1.0)",rosybrown:"rgba(188,143,143,1.0)",forestgreen:"rgba(34,139,34,1.0)",royalblue:"rgba(65,105,225,1.0)",fuchsia:"rgba(255,0,255,1.0)",saddlebrown:"rgba(139,69,19,1.0)",gainsboro:"rgba(220,220,220,1.0)",salmon:"rgba(250,128,114,1.0)",ghostwhite:"rgba(248,248,255,1.0)",sandybrown:"rgba(244,164,96,1.0)",gold:"rgba(255,215,0,1.0)",seagreen:"rgba(46,139,87,1.0)",goldenrod:"rgba(218,165,32,1.0)",seashell:"rgba(255,245,238,1.0)",gray:"rgba(128,128,128,1.0)",sienna:"rgba(160,82,45,1.0)",green:"rgba(0,128,0,1.0)",silver:"rgba(192,192,192,1.0)",greenyellow:"rgba(173,255,47,1.0)",skyblue:"rgba(135,206,235,1.0)",grey:"rgba(128,128,128,1.0)",slateblue:"rgba(106,90,205,1.0)",honeydew:"rgba(240,255,240,1.0)",slategray:"rgba(112,128,144,1.0)",hotpink:"rgba(255,105,180,1.0)",slategrey:"rgba(112,128,144,1.0)",indianred:"rgba(205,92,92,1.0)",snow:"rgba(255,250,250,1.0)",indigo:"rgba(75,0,130,1.0)",springgreen:"rgba(0,255,127,1.0)",ivory:"rgba(255,255,240,1.0)",steelblue:"rgba(70,130,180,1.0)",khaki:"rgba(240,230,140,1.0)",tan:"rgba(210,180,140,1.0)",lavender:"rgba(230,230,250,1.0)",teal:"rgba(0,128,128,1.0)",lavenderblush:"rgba(255,240,245,1.0)",thistle:"rgba(216,191,216,1.0)",lawngreen:"rgba(124,252,0,1.0)",tomato:"rgba(255,99,71,1.0)",lemonchiffon:"rgba(255,250,205,1.0)",turquoise:"rgba(64,224,208,1.0)",lightblue:"rgba(173,216,230,1.0)",violet:"rgba(238,130,238,1.0)",lightcoral:"rgba(240,128,128,1.0)",wheat:"rgba(245,222,179,1.0)",lightcyan:"rgba(224,255,255,1.0)",white:"rgba(255,255,255,1.0)",lightgoldenrodyellow:"rgba(250,250,210,1.0)",whitesmoke:"rgba(245,245,245,1.0)",lightgray:"rgba(211,211,211,1.0)",yellow:"rgba(255,255,0,1.0)",lightgreen:"rgba(144,238,144,1.0)",yellowgreen:"rgba(154,205,50,1.0)",lightgrey:"rgba(211,211,211,1.0)"},p=["solid","dotted","dashed"],m=["bevel","miter","round"],f=["butt","round","square"];function y(t){return i(t)&&n(t.x)&&n(t.y)}var v=h(y,s,"turtle position"),x=v,w=h(y,o,"turtle position"),P=w;function k(t){return i(t)&&n(t.x)&&n(t.y)&&n(t.Direction)}var X=h(k,s,"turtle alignment"),M=X,Y=h(k,o,"turtle alignment"),A=Y;function W(t){return i(t)&&(null==t.x||n(t.x))&&(null==t.y||n(t.y))&&(null==t.Direction||n(t.Direction))&&(null==t.Width||e(t.Width,0))&&(null==t.Color||u(t.Color))&&(null==t.Fill||u(t.Fill))&&(null==t.Lineature||a(t.Lineature,p))&&(null==t.Join||a(t.Join,m))&&(null==t.Cap||a(t.Cap,f))}var C=h(W,s,"turtle path option set"),D=C,S=h(W,o,"turtle path option set"),F=S,O=function(){function t(){this.SVGContent="",this.currentPath=void 0,this.currentX=0,this.currentY=0,this.currentDirection=0,this.currentWidth=1,this.currentColor="#000000",this.currentFill="none",this.currentLineature="solid",this.currentJoin="round",this.currentCap="round"}return t.prototype._initialize=function(){null==this.currentX&&(this.currentX=0),null==this.currentY&&(this.currentY=0),null==this.currentDirection&&(this.currentDirection=0),null==this.currentWidth&&(this.currentWidth=1),null==this.currentColor&&(this.currentColor="#000000"),null==this.currentFill&&(this.currentFill="none"),null==this.currentLineature&&(this.currentLineature="solid"),null==this.currentJoin&&(this.currentJoin="round"),null==this.currentCap&&(this.currentCap="round")},t.prototype.reset=function(){return this.currentX=0,this.currentY=0,this.currentDirection=0,this.currentWidth=1,this.currentColor="#000000",this.currentFill="none",this.currentLineature="solid",this.currentJoin="round",this.currentCap="round",this},t.prototype.beginPath=function(t){switch(C("option set",t),null!=this.currentPath&&this.endPath(),this._initialize(),null!=t&&(null!=t.x&&(this.currentX=t.x),null!=t.y&&(this.currentY=t.y),null!=t.Direction&&(this.currentDirection=t.Direction),null!=t.Width&&(this.currentWidth=t.Width),null!=t.Color&&(this.currentColor=t.Color),null!=t.Fill&&(this.currentFill=t.Fill),null!=t.Lineature&&(this.currentLineature=t.Lineature),null!=t.Join&&(this.currentJoin=t.Join),null!=t.Cap&&(this.currentCap=t.Cap)),null==this.minX&&(this.minX=this.maxX=this.currentX,this.minY=this.maxY=this.currentY),this.currentPath='<path fill="'+this.currentFill+'" stroke="'+this.currentColor+'" stroke-width="'+this.currentWidth+'" stroke-linejoin="'+this.currentJoin+'" stroke-linecap="'+this.currentCap+'" ',this.currentLineature){case"dotted":this.currentPath+='stroke-dasharray="1" ';break;case"dashed":this.currentPath+='stroke-dasharray="3 1" ';break;default:this.currentPath+='stroke-dasharray="none" '}return this.currentPath+='d="',this.moveTo(this.currentX,this.currentY),this},t.prototype.turn=function(t){return c("direction change",t),this.currentDirection+=t,this},t.prototype.turnTo=function(t){return c("direction",t),this.currentDirection=t,this},t.prototype.turnLeft=function(t){return c("direction change",t),this.currentDirection-=t,this},t.prototype.turnRight=function(t){return c("direction change",t),this.currentDirection+=t,this},t.prototype.move=function(t){c("distance",t);var r=this.currentDirection*Math.PI/180;return this.moveTo((this.currentX||0)+t*Math.cos(r),(this.currentY||0)+t*Math.sin(r)),this},t.prototype.moveTo=function(t,r){return c("x coordinate",t),c("y coordinate",r),this.currentX=t,this.currentY=r,null!=this.currentPath&&(this.currentPath+="M "+T(t)+","+T(r)+" "),this},t.prototype.draw=function(t){c("distance",t);var r=this.currentDirection*Math.PI/180;return this.drawTo((this.currentX||0)+t*Math.cos(r),(this.currentY||0)+t*Math.sin(r)),this},t.prototype.drawTo=function(t,r){return c("x coordinate",t),c("y coordinate",r),null==this.currentPath&&this.beginPath(),this._updateBoundingBox(this.currentX-this.currentWidth/2,this.currentX+this.currentWidth/2,this.currentY-this.currentWidth/2,this.currentY+this.currentWidth/2),this.currentX=t,this.currentY=r,this.currentPath+="L "+T(t)+","+T(r)+" ",this._updateBoundingBox(this.currentX-this.currentWidth/2,this.currentX+this.currentWidth/2,this.currentY-this.currentWidth/2,this.currentY+this.currentWidth/2),this},t.prototype.curveLeft=function(t,r,n){return this._curve(t,r,n,!1)},t.prototype.curveRight=function(t,r,n){return this._curve(t,r,n,!0)},t.prototype._curve=function(t,r,n,e){c("turn angle",t),c("x radius",r),l("y radius",n),null==n&&(n=r);var i=Math.abs(t);if(i<1e-6)return this;var a=Math.PI,u=Math.sin,o=a/180,s=Math.cos;null==this.currentPath&&this.beginPath();var h=this.currentX,g=this.currentY;this._updateBoundingBox(h-this.currentWidth/2,h+this.currentWidth/2,g-this.currentWidth/2,g+this.currentWidth/2);var b=this.currentDirection,d=b*o,p=d+(e?a/2:-a/2),m=h+n*s(p),f=g+n*u(p),y=e?-a/2+t*o:a/2-t*o,v=r*s(y),x=n*u(y),w=m+v*s(d)-x*u(d),P=f+v*u(d)+x*s(d),k=i>=360,X=i>=180?1:0,M=e?t>=0?1:0:t>=0?0:1;k?(v=m+(m-h),x=f+(f-g),this.currentPath+="A "+T(r)+" "+T(n)+" "+T(b)+" 1 "+M+" "+T(v)+" "+T(x)+" A "+T(r)+" "+T(n)+" "+T(b)+" 1 "+M+" "+T(h)+" "+T(g)+" M "+T(w)+" "+T(P)+" "):this.currentPath+="A "+T(r)+" "+T(n)+" "+T(b)+" "+X+" "+M+" "+T(w)+" "+T(P)+" ";for(var Y=Math.sqrt(r*r*Math.pow(s(d),2)+n*n*Math.pow(u(d),2)),A=Math.sqrt(r*r*Math.pow(u(d),2)+n*n*Math.pow(s(d),2)),W=0;W<4;W++){var C=(W%2==0?1:-1)*Y,D=(W<2?1:-1)*A,S=void 0;if(k)S=!0;else{var F=C*s(-d)-D*u(-d),O=C*u(-d)+D*s(-d);F/=r,O/=n;var _=Math.atan2(O,F),B=e?-a/2:a/2,L=y;if((B<-a||L<-a)&&(B+=2*a,L+=2*a),B>L){var V=B;B=L,L=V}S=B<=_&&_<=L||_<0&&B<=_+2*a&&_+2*a<=L}S&&this._updateBoundingBox(m+C-this.currentWidth/2,m+C+this.currentWidth/2,f+D-this.currentWidth/2,f+D+this.currentWidth/2)}return this.currentDirection+=(t>=0?t:180+t)*(e?1:-1),this.currentX=w,this.currentY=P,this._updateBoundingBox(w-this.currentWidth/2,w+this.currentWidth/2,P-this.currentWidth/2,P+this.currentWidth/2),this},t.prototype.endPath=function(){return null!=this.currentPath&&(this.currentPath+='"/>',this.SVGContent+=this.currentPath,this.currentPath=void 0),this},t.prototype.closePath=function(){return null!=this.currentPath&&(this.currentPath+="Z",this.endPath()),this},t.prototype.currentPosition=function(){return{x:this.currentX,y:this.currentY}},t.prototype.positionAt=function(t){return v("turtle position",t),null==this.currentPath?(this.currentX=t.x,this.currentY=t.y):this.moveTo(t.x,t.y),this},t.prototype.currentAlignment=function(){return{x:this.currentX,y:this.currentY,Direction:this.currentDirection}},t.prototype.alignAt=function(t){return X("turtle alignment",t),this.currentDirection=t.Direction,null==this.currentPath?(this.currentX=t.x,this.currentY=t.y):this.moveTo(t.x,t.y),this},t.prototype.Limits=function(){return{xMin:this.minX||0,yMin:this.minY||0,xMax:this.maxX||0,yMax:this.maxY||0}},t.prototype.asSVG=function(t,n,e,i,a){var u,o,s;u="SVG unit",s=["px","mm","cm","in"],null==(o=t)||g(u,o,s),l("minimal x",n),l("maximal x",i),l("minimal y",e),l("maximal y",a),null==this.minX&&(this.minX=this.maxX=this.minY=this.maxY=0),null==t&&(t="px"),null==n&&(n=this.minX),null==i&&(i=this.maxX),null==e&&(e=this.minY),null==a&&(a=this.maxY);var h=i-n,c=a-e;return h<0&&r("InvalidArgument: invalid x range given"),c<0&&r("InvalidArgument: invalid y range given"),null!=this.currentPath&&this.endPath(),'<svg xmlns="http://www.w3.org/2000/svg" width="'+T(h)+t+'" height="'+T(c)+t+'" viewBox="'+B(n)+" "+B(e)+" "+_(h)+" "+_(c)+'" vector-effect="non-scaling-stroke">'+this.SVGContent+"</svg>"},t.prototype.asSVGwith72dpi=function(t,r,n,e,i){var a=this.asSVG(t,r,n,e,i),u=72/{px:25.4,mm:25.4,cm:2.54,in:1}[t||"mm"];return null==r&&(r=this.minX),null==e&&(e=this.maxX),null==n&&(n=this.minY),null==i&&(i=this.maxY),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+B(u*r)+" "+B(u*n)+" "+_(u*(e-r))+" "+_(u*(i-n))+'" vector-effect="non-scaling-stroke"><g transform="scale('+u+","+u+')">'+a+"</g></svg>"},t.prototype._updateBoundingBox=function(t,r,n,e){this.minX=Math.min(this.minX,t),this.maxX=Math.max(this.maxX,r),this.minY=Math.min(this.minY,n),this.maxY=Math.max(this.maxY,e)},t}();function T(t){return Math.round(100*t)/100}function _(t){return Math.ceil(100*t)/100}function B(t){return Math.floor(100*t)/100}t.Graphic=O,t.TUR_Caps=f,t.TUR_Joins=m,t.TUR_Lineatures=p,t.ValueIsAlignment=k,t.ValueIsPathOptionSet=W,t.ValueIsPosition=y,t.allowAlignment=X,t.allowPathOptionSet=C,t.allowPosition=v,t.allowedAlignment=M,t.allowedPathOptionSet=D,t.allowedPosition=x,t.expectAlignment=Y,t.expectPathOptionSet=S,t.expectPosition=w,t.expectedAlignment=A,t.expectedPathOptionSet=F,t.expectedPosition=P,Object.defineProperty(t,"__esModule",{value:!0})}));
//# sourceMappingURL=svg-turtle.js.map
