import{a6 as F,r as k,a7 as x,a8 as le,a9 as oe,aa as g,ab as B,ac as ne,ad as ie,ae as se,af as b,ag as re,ah as ue,ai as H,aj as Z,ak as G,al as de,am as ve,an as pe,ao as ce,ap as _,aq as fe,F as ee,ar as q,as as be,at as me,au as W,av as xe,aw as ge,ax as he,ay as ye,az as we,aA as Oe,aB as R,aC as c,aD as A,aE as N,o as V,c as C,b as D,h as U,i as z,a as M,t as J,u as T,n as E,j as $,e as Se,aF as ke,T as Re,aG as Le}from"./index-cef76ddd.js";function Pe(a,v){return a===v}var Ve=(a=>(a[a.Open=0]="Open",a[a.Closed=1]="Closed",a))(Ve||{}),Te=(a=>(a[a.Single=0]="Single",a[a.Multi=1]="Multi",a))(Te||{}),De=(a=>(a[a.Pointer=0]="Pointer",a[a.Other=1]="Other",a))(De||{});function Be(a){requestAnimationFrame(()=>requestAnimationFrame(a))}let ae=Symbol("ListboxContext");function K(a){let v=we(ae,null);if(v===null){let h=new Error(`<${a} /> is missing a parent <Listbox /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(h,K),h}return v}let Ie=F({name:"Listbox",emits:{"update:modelValue":a=>!0},props:{as:{type:[Object,String],default:"template"},disabled:{type:[Boolean],default:!1},by:{type:[String,Function],default:()=>Pe},horizontal:{type:[Boolean],default:!1},modelValue:{type:[Object,String,Number,Boolean],default:void 0},defaultValue:{type:[Object,String,Number,Boolean],default:void 0},form:{type:String,optional:!0},name:{type:String,optional:!0},multiple:{type:[Boolean],default:!1}},inheritAttrs:!1,setup(a,{slots:v,attrs:h,emit:L}){let e=k(1),p=k(null),f=k(null),r=k(null),u=k([]),t=k(""),l=k(null),y=k(1);function w(o=n=>n){let n=l.value!==null?u.value[l.value]:null,i=Oe(o(u.value.slice()),m=>b(m.dataRef.domRef)),d=n?i.indexOf(n):null;return d===-1&&(d=null),{options:i,activeOptionIndex:d}}let O=x(()=>a.multiple?1:0),[S,j]=le(x(()=>a.modelValue===void 0?B(O.value,{1:[],0:void 0}):a.modelValue),o=>L("update:modelValue",o),x(()=>a.defaultValue)),P={listboxState:e,value:S,mode:O,compare(o,n){if(typeof a.by=="string"){let i=a.by;return(o==null?void 0:o[i])===(n==null?void 0:n[i])}return a.by(o,n)},orientation:x(()=>a.horizontal?"horizontal":"vertical"),labelRef:p,buttonRef:f,optionsRef:r,disabled:x(()=>a.disabled),options:u,searchQuery:t,activeOptionIndex:l,activationTrigger:y,closeListbox(){a.disabled||e.value!==1&&(e.value=1,l.value=null)},openListbox(){a.disabled||e.value!==0&&(e.value=0)},goToOption(o,n,i){if(a.disabled||e.value===1)return;let d=w(),m=oe(o===g.Specific?{focus:g.Specific,id:n}:{focus:o},{resolveItems:()=>d.options,resolveActiveIndex:()=>d.activeOptionIndex,resolveId:I=>I.id,resolveDisabled:I=>I.dataRef.disabled});t.value="",l.value=m,y.value=i??1,u.value=d.options},search(o){if(a.disabled||e.value===1)return;let n=t.value!==""?0:1;t.value+=o.toLowerCase();let i=(l.value!==null?u.value.slice(l.value+n).concat(u.value.slice(0,l.value+n)):u.value).find(m=>m.dataRef.textValue.startsWith(t.value)&&!m.dataRef.disabled),d=i?u.value.indexOf(i):-1;d===-1||d===l.value||(l.value=d,y.value=1)},clearSearch(){a.disabled||e.value!==1&&t.value!==""&&(t.value="")},registerOption(o,n){let i=w(d=>[...d,{id:o,dataRef:n}]);u.value=i.options,l.value=i.activeOptionIndex},unregisterOption(o){let n=w(i=>{let d=i.findIndex(m=>m.id===o);return d!==-1&&i.splice(d,1),i});u.value=n.options,l.value=n.activeOptionIndex,y.value=1},select(o){a.disabled||j(B(O.value,{0:()=>o,1:()=>{let n=R(P.value.value).slice(),i=R(o),d=n.findIndex(m=>P.compare(i,R(m)));return d===-1?n.push(i):n.splice(d,1),n}}))}};ne([f,r],(o,n)=>{var i;P.closeListbox(),ie(n,se.Loose)||(o.preventDefault(),(i=b(f))==null||i.focus())},x(()=>e.value===0)),re(ae,P),ue(x(()=>B(e.value,{0:N.Open,1:N.Closed})));let s=x(()=>{var o;return(o=b(f))==null?void 0:o.closest("form")});return H(()=>{Z([s],()=>{if(!s.value||a.defaultValue===void 0)return;function o(){P.select(a.defaultValue)}return s.value.addEventListener("reset",o),()=>{var n;(n=s.value)==null||n.removeEventListener("reset",o)}},{immediate:!0})}),()=>{let{name:o,modelValue:n,disabled:i,form:d,...m}=a,I={open:e.value===0,disabled:i,value:S.value};return G(ee,[...o!=null&&S.value!=null?de({[o]:S.value}).map(([Q,te])=>G(ve,pe({features:ce.Hidden,key:Q,as:"input",type:"hidden",hidden:!0,readOnly:!0,form:d,name:Q,value:te}))):[],_({ourProps:{},theirProps:{...h,...fe(m,["defaultValue","onUpdate:modelValue","horizontal","multiple","by"])},slot:I,slots:v,attrs:h,name:"Listbox"})])}}}),Ce=F({name:"ListboxButton",props:{as:{type:[Object,String],default:"button"},id:{type:String,default:()=>`headlessui-listbox-button-${q()}`}},setup(a,{attrs:v,slots:h,expose:L}){let e=K("ListboxButton");L({el:e.buttonRef,$el:e.buttonRef});function p(t){switch(t.key){case c.Space:case c.Enter:case c.ArrowDown:t.preventDefault(),e.openListbox(),A(()=>{var l;(l=b(e.optionsRef))==null||l.focus({preventScroll:!0}),e.value.value||e.goToOption(g.First)});break;case c.ArrowUp:t.preventDefault(),e.openListbox(),A(()=>{var l;(l=b(e.optionsRef))==null||l.focus({preventScroll:!0}),e.value.value||e.goToOption(g.Last)});break}}function f(t){switch(t.key){case c.Space:t.preventDefault();break}}function r(t){e.disabled.value||(e.listboxState.value===0?(e.closeListbox(),A(()=>{var l;return(l=b(e.buttonRef))==null?void 0:l.focus({preventScroll:!0})})):(t.preventDefault(),e.openListbox(),Be(()=>{var l;return(l=b(e.optionsRef))==null?void 0:l.focus({preventScroll:!0})})))}let u=be(x(()=>({as:a.as,type:v.type})),e.buttonRef);return()=>{var t,l;let y={open:e.listboxState.value===0,disabled:e.disabled.value,value:e.value.value},{id:w,...O}=a,S={ref:e.buttonRef,id:w,type:u.value,"aria-haspopup":"listbox","aria-controls":(t=b(e.optionsRef))==null?void 0:t.id,"aria-expanded":e.listboxState.value===0,"aria-labelledby":e.labelRef.value?[(l=b(e.labelRef))==null?void 0:l.id,w].join(" "):void 0,disabled:e.disabled.value===!0?!0:void 0,onKeydown:p,onKeyup:f,onClick:r};return _({ourProps:S,theirProps:O,slot:y,attrs:v,slots:h,name:"ListboxButton"})}}}),Ae=F({name:"ListboxOptions",props:{as:{type:[Object,String],default:"ul"},static:{type:Boolean,default:!1},unmount:{type:Boolean,default:!0},id:{type:String,default:()=>`headlessui-listbox-options-${q()}`}},setup(a,{attrs:v,slots:h,expose:L}){let e=K("ListboxOptions"),p=k(null);L({el:e.optionsRef,$el:e.optionsRef});function f(t){switch(p.value&&clearTimeout(p.value),t.key){case c.Space:if(e.searchQuery.value!=="")return t.preventDefault(),t.stopPropagation(),e.search(t.key);case c.Enter:if(t.preventDefault(),t.stopPropagation(),e.activeOptionIndex.value!==null){let l=e.options.value[e.activeOptionIndex.value];e.select(l.dataRef.value)}e.mode.value===0&&(e.closeListbox(),A(()=>{var l;return(l=b(e.buttonRef))==null?void 0:l.focus({preventScroll:!0})}));break;case B(e.orientation.value,{vertical:c.ArrowDown,horizontal:c.ArrowRight}):return t.preventDefault(),t.stopPropagation(),e.goToOption(g.Next);case B(e.orientation.value,{vertical:c.ArrowUp,horizontal:c.ArrowLeft}):return t.preventDefault(),t.stopPropagation(),e.goToOption(g.Previous);case c.Home:case c.PageUp:return t.preventDefault(),t.stopPropagation(),e.goToOption(g.First);case c.End:case c.PageDown:return t.preventDefault(),t.stopPropagation(),e.goToOption(g.Last);case c.Escape:t.preventDefault(),t.stopPropagation(),e.closeListbox(),A(()=>{var l;return(l=b(e.buttonRef))==null?void 0:l.focus({preventScroll:!0})});break;case c.Tab:t.preventDefault(),t.stopPropagation();break;default:t.key.length===1&&(e.search(t.key),p.value=setTimeout(()=>e.clearSearch(),350));break}}let r=me(),u=x(()=>r!==null?(r.value&N.Open)===N.Open:e.listboxState.value===0);return()=>{var t,l,y,w;let O={open:e.listboxState.value===0},{id:S,...j}=a,P={"aria-activedescendant":e.activeOptionIndex.value===null||(t=e.options.value[e.activeOptionIndex.value])==null?void 0:t.id,"aria-multiselectable":e.mode.value===1?!0:void 0,"aria-labelledby":(w=(l=b(e.labelRef))==null?void 0:l.id)!=null?w:(y=b(e.buttonRef))==null?void 0:y.id,"aria-orientation":e.orientation.value,id:S,onKeydown:f,role:"listbox",tabIndex:0,ref:e.optionsRef};return _({ourProps:P,theirProps:j,slot:O,attrs:v,slots:h,features:W.RenderStrategy|W.Static,visible:u.value,name:"ListboxOptions"})}}}),X=F({name:"ListboxOption",props:{as:{type:[Object,String],default:"li"},value:{type:[Object,String,Number,Boolean]},disabled:{type:Boolean,default:!1},id:{type:String,default:()=>`headlessui-listbox.option-${q()}`}},setup(a,{slots:v,attrs:h,expose:L}){let e=K("ListboxOption"),p=k(null);L({el:p,$el:p});let f=x(()=>e.activeOptionIndex.value!==null?e.options.value[e.activeOptionIndex.value].id===a.id:!1),r=x(()=>B(e.mode.value,{0:()=>e.compare(R(e.value.value),R(a.value)),1:()=>R(e.value.value).some(s=>e.compare(R(s),R(a.value)))})),u=x(()=>B(e.mode.value,{1:()=>{var s;let o=R(e.value.value);return((s=e.options.value.find(n=>o.some(i=>e.compare(R(i),R(n.dataRef.value)))))==null?void 0:s.id)===a.id},0:()=>r.value})),t=xe(p),l=x(()=>({disabled:a.disabled,value:a.value,get textValue(){return t()},domRef:p}));H(()=>e.registerOption(a.id,l)),ge(()=>e.unregisterOption(a.id)),H(()=>{Z([e.listboxState,r],()=>{e.listboxState.value===0&&r.value&&B(e.mode.value,{1:()=>{u.value&&e.goToOption(g.Specific,a.id)},0:()=>{e.goToOption(g.Specific,a.id)}})},{immediate:!0})}),he(()=>{e.listboxState.value===0&&f.value&&e.activationTrigger.value!==0&&A(()=>{var s,o;return(o=(s=b(p))==null?void 0:s.scrollIntoView)==null?void 0:o.call(s,{block:"nearest"})})});function y(s){if(a.disabled)return s.preventDefault();e.select(a.value),e.mode.value===0&&(e.closeListbox(),A(()=>{var o;return(o=b(e.buttonRef))==null?void 0:o.focus({preventScroll:!0})}))}function w(){if(a.disabled)return e.goToOption(g.Nothing);e.goToOption(g.Specific,a.id)}let O=ye();function S(s){O.update(s)}function j(s){O.wasMoved(s)&&(a.disabled||f.value||e.goToOption(g.Specific,a.id,0))}function P(s){O.wasMoved(s)&&(a.disabled||f.value&&e.goToOption(g.Nothing))}return()=>{let{disabled:s}=a,o={active:f.value,selected:r.value,disabled:s},{id:n,value:i,disabled:d,...m}=a,I={id:n,ref:p,role:"option",tabIndex:s===!0?void 0:-1,"aria-disabled":s===!0?!0:void 0,"aria-selected":r.value,disabled:void 0,onClick:y,onFocus:w,onPointerenter:S,onMouseenter:S,onPointermove:j,onMousemove:j,onPointerleave:P,onMouseleave:P};return _({ourProps:I,theirProps:m,slot:o,attrs:h,slots:v,name:"ListboxOption"})}}});function Y(a,v){return V(),C("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},[D("path",{"fill-rule":"evenodd",d:"M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z","clip-rule":"evenodd"})])}function je(a,v){return V(),C("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},[D("path",{"fill-rule":"evenodd",d:"M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z","clip-rule":"evenodd"})])}const ze={class:"relative mt-2"},Me={key:0,class:"block truncate"},Ee={key:1,class:"block text-gray-500 truncate"},Ne={class:"absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"},_e={__name:"CategoryPicker",props:{modelValue:Object,rootOnly:Boolean,showAllOption:Boolean},emits:["update:modelValue"],setup(a,{emit:v}){const h=a,L=k([]);return(async()=>{const p=await Le(h.rootOnly);L.value=p.data})(),(p,f)=>(V(),U(T(Ie),{as:"div",modelValue:a.modelValue,"onUpdate:modelValue":f[0]||(f[0]=r=>v("update:modelValue",r)),by:"id"},{default:z(()=>[D("div",ze,[M(T(Ce),{class:"relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6"},{default:z(()=>[a.modelValue||a.showAllOption?(V(),C("span",Me,J(a.modelValue?a.modelValue.name:"Semua Kategori"),1)):(V(),C("span",Ee,"Pilih Kategori")),D("span",Ne,[M(T(je),{class:"w-5 h-5 text-gray-400","aria-hidden":"true"})])]),_:1}),M(Re,{"leave-active-class":"transition duration-100 ease-in","leave-from-class":"opacity-100","leave-to-class":"opacity-0"},{default:z(()=>[M(T(Ae),{class:"absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"},{default:z(()=>[a.showAllOption?(V(),U(T(X),{key:0,as:"template",value:null},{default:z(({active:r,selected:u})=>[D("li",{class:E([r?"bg-lime-600 text-white":"text-gray-900","relative cursor-default select-none py-2 pl-3 pr-9"])},[D("span",{class:E([u?"font-semibold":"font-normal","block truncate"])},"Semua Kategori",2),u?(V(),C("span",{key:0,class:E([r?"text-white":"text-lime-600","absolute inset-y-0 right-0 flex items-center pr-4"])},[M(T(Y),{class:"w-5 h-5","aria-hidden":"true"})],2)):$("",!0)],2)]),_:1})):$("",!0),(V(!0),C(ee,null,Se(L.value,r=>(V(),U(T(X),{as:"template",key:r.id,value:r},{default:z(({active:u,selected:t})=>[D("li",{class:E([u?"bg-lime-600 text-white":"text-gray-900","relative cursor-default select-none py-2 pl-3 pr-9"])},[D("span",{class:E([t?"font-semibold":"font-normal","block truncate"]),style:ke("padding-left: "+.75*r.depth+"rem;")},J(r.name),7),t?(V(),C("span",{key:0,class:E([u?"text-white":"text-lime-600","absolute inset-y-0 right-0 flex items-center pr-4"])},[M(T(Y),{class:"w-5 h-5","aria-hidden":"true"})],2)):$("",!0)],2)]),_:2},1032,["value"]))),128))]),_:1})]),_:1})])]),_:1},8,["modelValue"]))}};export{Ie as F,X as H,Ce as K,Ae as N,_e as _,Y as a,je as r};
