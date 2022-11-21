(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function i(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerpolicy&&(o.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?o.credentials="include":s.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=i(s);fetch(s.href,o)}})();const N={};function ft(t){N.context=t}const ut=(t,e)=>t===e,K={equals:ut};let V=z;const E=1,O=2,J={owned:null,cleanups:null,context:null,owner:null};var v=null;let _=null,d=null,w=null,S=null,j=0;function ct(t,e){const i=d,n=v,s=t.length===0,o=s?J:{owned:null,cleanups:null,context:null,owner:e||n},r=s?t:()=>t(()=>M(()=>X(o)));v=o,d=null;try{return H(r,!0)}finally{d=i,v=n}}function F(t,e){e=e?Object.assign({},K,e):K;const i={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},n=s=>(typeof s=="function"&&(s=s(i.value)),Z(i,s));return[dt.bind(i),n]}function U(t,e,i){const n=k(t,e,!1,E);q(n)}function at(t,e,i){V=wt;const n=k(t,e,!1,E);n.user=!0,S?S.push(n):q(n)}function M(t){const e=d;d=null;try{return t()}finally{d=e}}function ht(t){at(()=>M(t))}function dt(){const t=_;if(this.sources&&(this.state||t))if(this.state===E||t)q(this);else{const e=w;w=null,H(()=>W(this),!1),w=e}if(d){const e=this.observers?this.observers.length:0;d.sources?(d.sources.push(this),d.sourceSlots.push(e)):(d.sources=[this],d.sourceSlots=[e]),this.observers?(this.observers.push(d),this.observerSlots.push(d.sources.length-1)):(this.observers=[d],this.observerSlots=[d.sources.length-1])}return this.value}function Z(t,e,i){let n=t.value;return(!t.comparator||!t.comparator(n,e))&&(t.value=e,t.observers&&t.observers.length&&H(()=>{for(let s=0;s<t.observers.length;s+=1){const o=t.observers[s],r=_&&_.running;r&&_.disposed.has(o),(r&&!o.tState||!r&&!o.state)&&(o.pure?w.push(o):S.push(o),o.observers&&tt(o)),r||(o.state=E)}if(w.length>1e6)throw w=[],new Error},!1)),e}function q(t){if(!t.fn)return;X(t);const e=v,i=d,n=j;d=v=t,gt(t,t.value,n),d=i,v=e}function gt(t,e,i){let n;try{n=t.fn(e)}catch(s){t.pure&&(t.state=E),et(s)}(!t.updatedAt||t.updatedAt<=i)&&(t.updatedAt!=null&&"observers"in t?Z(t,n):t.value=n,t.updatedAt=i)}function k(t,e,i,n=E,s){const o={fn:t,state:n,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:v,context:null,pure:i};return v===null||v!==J&&(v.owned?v.owned.push(o):v.owned=[o]),o}function D(t){const e=_;if(t.state===0||e)return;if(t.state===O||e)return W(t);if(t.suspense&&M(t.suspense.inFallback))return t.suspense.effects.push(t);const i=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<j);)(t.state||e)&&i.push(t);for(let n=i.length-1;n>=0;n--)if(t=i[n],t.state===E||e)q(t);else if(t.state===O||e){const s=w;w=null,H(()=>W(t,i[0]),!1),w=s}}function H(t,e){if(w)return t();let i=!1;e||(w=[]),S?i=!0:S=[],j++;try{const n=t();return pt(i),n}catch(n){w||(S=null),et(n)}}function pt(t){if(w&&(z(w),w=null),t)return;const e=S;S=null,e.length&&H(()=>V(e),!1)}function z(t){for(let e=0;e<t.length;e++)D(t[e])}function wt(t){let e,i=0;for(e=0;e<t.length;e++){const n=t[e];n.user?t[i++]=n:D(n)}for(N.context&&ft(),e=0;e<i;e++)D(t[e])}function W(t,e){const i=_;t.state=0;for(let n=0;n<t.sources.length;n+=1){const s=t.sources[n];s.sources&&(s.state===E||i?s!==e&&D(s):(s.state===O||i)&&W(s,e))}}function tt(t){const e=_;for(let i=0;i<t.observers.length;i+=1){const n=t.observers[i];(!n.state||e)&&(n.state=O,n.pure?w.push(n):S.push(n),n.observers&&tt(n))}}function X(t){let e;if(t.sources)for(;t.sources.length;){const i=t.sources.pop(),n=t.sourceSlots.pop(),s=i.observers;if(s&&s.length){const o=s.pop(),r=i.observerSlots.pop();n<s.length&&(o.sourceSlots[r]=n,s[n]=o,i.observerSlots[n]=r)}}if(t.owned){for(e=0;e<t.owned.length;e++)X(t.owned[e]);t.owned=null}if(t.cleanups){for(e=0;e<t.cleanups.length;e++)t.cleanups[e]();t.cleanups=null}t.state=0,t.context=null}function yt(t){return t instanceof Error||typeof t=="string"?t:new Error("Unknown error")}function et(t){throw t=yt(t),t}function it(t,e){return M(()=>t(e||{}))}function bt(t,e,i){let n=i.length,s=e.length,o=n,r=0,l=0,g=e[s-1].nextSibling,p=null;for(;r<s||l<o;){if(e[r]===i[l]){r++,l++;continue}for(;e[s-1]===i[o-1];)s--,o--;if(s===r){const A=o<n?l?i[l-1].nextSibling:i[o-l]:g;for(;l<o;)t.insertBefore(i[l++],A)}else if(o===l)for(;r<s;)(!p||!p.has(e[r]))&&e[r].remove(),r++;else if(e[r]===i[o-1]&&i[l]===e[s-1]){const A=e[--s].nextSibling;t.insertBefore(i[l++],e[r++].nextSibling),t.insertBefore(i[--o],A),e[s]=i[o]}else{if(!p){p=new Map;let m=l;for(;m<o;)p.set(i[m],m++)}const A=p.get(e[r]);if(A!=null)if(l<A&&A<o){let m=r,B=1,$;for(;++m<s&&m<o&&!(($=p.get(e[m]))==null||$!==A+B);)B++;if(B>A-l){const T=e[r];for(;l<A;)t.insertBefore(i[l++],T)}else t.replaceChild(i[l++],e[r++])}else r++;else e[r++].remove()}}}function At(t,e,i,n={}){let s;return ct(o=>{s=o,e===document?t():st(e,t(),e.firstChild?null:void 0,i)},n.owner),()=>{s(),e.textContent=""}}function nt(t,e,i){const n=document.createElement("template");n.innerHTML=t;let s=n.content.firstChild;return i&&(s=s.firstChild),s}function L(t,e,i){i==null?t.removeAttribute(e):t.setAttribute(e,i)}function st(t,e,i,n){if(i!==void 0&&!n&&(n=[]),typeof e!="function")return P(t,e,n,i);U(s=>P(t,e(),s,i),n)}function P(t,e,i,n,s){for(N.context&&!i&&(i=[...t.childNodes]);typeof i=="function";)i=i();if(e===i)return i;const o=typeof e,r=n!==void 0;if(t=r&&i[0]&&i[0].parentNode||t,o==="string"||o==="number"){if(N.context)return i;if(o==="number"&&(e=e.toString()),r){let l=i[0];l&&l.nodeType===3?l.data=e:l=document.createTextNode(e),i=R(t,i,n,l)}else i!==""&&typeof i=="string"?i=t.firstChild.data=e:i=t.textContent=e}else if(e==null||o==="boolean"){if(N.context)return i;i=R(t,i,n)}else{if(o==="function")return U(()=>{let l=e();for(;typeof l=="function";)l=l();i=P(t,l,i,n)}),()=>i;if(Array.isArray(e)){const l=[],g=i&&Array.isArray(i);if(Y(l,e,i,s))return U(()=>i=P(t,l,i,n,!0)),()=>i;if(N.context){if(!l.length)return i;for(let p=0;p<l.length;p++)if(l[p].parentNode)return i=l}if(l.length===0){if(i=R(t,i,n),r)return i}else g?i.length===0?Q(t,l,n):bt(t,i,l):(i&&R(t),Q(t,l));i=l}else if(e instanceof Node){if(N.context&&e.parentNode)return i=r?[e]:e;if(Array.isArray(i)){if(r)return i=R(t,i,n,e);R(t,i,null,e)}else i==null||i===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);i=e}}return i}function Y(t,e,i,n){let s=!1;for(let o=0,r=e.length;o<r;o++){let l=e[o],g=i&&i[o];if(l instanceof Node)t.push(l);else if(!(l==null||l===!0||l===!1))if(Array.isArray(l))s=Y(t,l,g)||s;else if(typeof l=="function")if(n){for(;typeof l=="function";)l=l();s=Y(t,Array.isArray(l)?l:[l],Array.isArray(g)?g:[g])||s}else t.push(l),s=!0;else{const p=String(l);g&&g.nodeType===3&&g.data===p?t.push(g):t.push(document.createTextNode(p))}}return s}function Q(t,e,i=null){for(let n=0,s=e.length;n<s;n++)t.insertBefore(e[n],i)}function R(t,e,i,n){if(i===void 0)return t.textContent="";const s=n||document.createTextNode("");if(e.length){let o=!1;for(let r=e.length-1;r>=0;r--){const l=e[r];if(s!==l){const g=l.parentNode===t;!o&&!r?g?t.replaceChild(s,l):t.insertBefore(s,i):g&&l.remove()}else o=!0}}else t.insertBefore(s,i);return[s]}const mt=""+new URL("puppy_1_400x400.c0b71d99.jpg",import.meta.url).href,xt=nt('<div class="dots"><svg><circle></circle></svg><img class="noDisplay"><canvas class="noDisplay"></canvas></div>');function vt({}){let t=0,[e,i]=F("black"),n,s,[o,r]=F(0),[l,g]=F(0),[p,A]=F(0),[m,B]=F(0),$;const T=c=>new Promise(y=>setTimeout(y,c));async function G(c){if(c.getAttribute("r")<1)return;let y=c.parentElement,u=[];for(let f=0;f<4;f++){let x=document.createElementNS("http://www.w3.org/2000/svg","circle");x.setAttribute("cx",c.getAttribute("cx")),x.setAttribute("cy",c.getAttribute("cy")),x.setAttribute("r",c.getAttribute("r")),x.setAttribute("class","circle"),u.push(x)}let b=c.getAttribute("cx"),a=c.getAttribute("cy"),C=c.getAttribute("r"),h=C/2;c.remove();for(let f=0;f<4;f++)await y.appendChild(u[f]);await T(1);for(let f=0;f<4;f++)f===0&&(await u[f].setAttribute("cx",(+b-+h).toString()),await u[f].setAttribute("cy",(+a-+h).toString()),await u[f].setAttribute("r",(C/2).toString()),await u[f].setAttribute("fill",I(+b-+h,+a-+h-m()))),f===1&&(await u[f].setAttribute("cx",(+h+ +b).toString()),await u[f].setAttribute("cy",(+a-+h).toString()),await u[f].setAttribute("r",(C/2).toString()),await u[f].setAttribute("fill",I(+h+ +b,+a-+h-m()))),f===2&&(await u[f].setAttribute("cx",(+b-+h).toString()),await u[f].setAttribute("cy",(+h+ +a).toString()),await u[f].setAttribute("r",(C/2).toString()),await u[f].setAttribute("fill",I(+b-+h,+h+ +a-m()))),f===3&&(await u[f].setAttribute("cx",(+h+ +b).toString()),await u[f].setAttribute("cy",(+h+ +a).toString()),await u[f].setAttribute("r",(C/2).toString()),await u[f].setAttribute("fill",I(+h+ +b,+h+ +a-m())));for(let f=0;f<4;f++)await T(.1),u[f].addEventListener("touchmove",async x=>{let lt=x.touches[0].clientX,ot=x.touches[0].clientY;console.log(x.target);let rt=document.elementFromPoint(lt,ot);await T(10),await G(rt)})}ht(async()=>{await T(100),console.log(innerHeight),console.log(innerWidth);let c=innerWidth>innerHeight?innerHeight/2:innerWidth/2;A(c),B(innerHeight/2-p()),r(innerWidth/2),g(innerHeight/2),n=document.querySelector("canvas"),s=document.querySelector("img"),n.width=c*2,n.height=c*2,$=n.getContext("2d",{willReadFrequently:!0}),$.drawImage(s,0,0,c*2,c*2);let y=$.getImageData(100,100,1,1);i(`rgb(${y.data[0]}, ${y.data[1]}, ${y.data[2]}, ${y.data[3]})`)});function I(c,y){let u=$.getImageData(c,y,1,1),b=`rgb(${u.data[0]}, ${u.data[1]}, ${u.data[2]})`;return console.log(b),b}return(()=>{const c=xt.cloneNode(!0),y=c.firstChild,u=y.firstChild,b=y.nextSibling;return u.addEventListener("pointerenter",a=>G(a.target)),L(u,"id",`dot${t++}`),L(b,"src",mt),U(a=>{const C=o(),h=l(),f=p(),x=e();return C!==a._v$&&L(u,"cx",a._v$=C),h!==a._v$2&&L(u,"cy",a._v$2=h),f!==a._v$3&&L(u,"r",a._v$3=f),x!==a._v$4&&L(u,"fill",a._v$4=x),a},{_v$:void 0,_v$2:void 0,_v$3:void 0,_v$4:void 0}),c})()}const St=nt('<div class="app-container"></div>'),Ct=()=>(()=>{const t=St.cloneNode(!0);return st(t,it(vt,{})),t})();At(()=>it(Ct,{}),document.getElementById("root"));
