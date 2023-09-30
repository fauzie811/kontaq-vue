import{o as l,h as S,i as d,b as e,a as s,t as u,u as i,n as m,c as n,j as p,e as V,F as B,T as N,r as f,k as C,m as J,p as M}from"./index-507ca392.js";import{_ as T}from"./PageHeader-dd3ae66c.js";import{_ as U}from"./Breadcrumbs-1b24cb7f.js";import{_ as j}from"./Pagination-d161465f.js";import{r as P,N as D,H as F,U as w,a as k,B as H,_ as L}from"./CategoryPicker-11b8db18.js";const E={class:"relative mt-2"},O={class:"block truncate"},q={class:"absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"},A={__name:"PartPicker",props:{modelValue:Object},emits:["update:modelValue"],setup(x,{emit:h}){return(y,c)=>(l(),S(i(H),{as:"div",modelValue:x.modelValue,"onUpdate:modelValue":c[0]||(c[0]=a=>h("update:modelValue",a))},{default:d(()=>[e("div",E,[s(i(D),{class:"relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-600 sm:text-sm sm:leading-6"},{default:d(()=>[e("span",O,u(x.modelValue?"Juz "+x.modelValue:"Semua Juz"),1),e("span",q,[s(i(P),{class:"w-5 h-5 text-gray-400","aria-hidden":"true"})])]),_:1}),s(N,{"leave-active-class":"transition duration-100 ease-in","leave-from-class":"opacity-100","leave-to-class":"opacity-0"},{default:d(()=>[s(i(F),{class:"absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"},{default:d(()=>[s(i(w),{as:"template",value:null},{default:d(({active:a,selected:o})=>[e("li",{class:m([a?"bg-lime-600 text-white":"text-gray-900","relative cursor-default select-none py-2 pl-3 pr-9"])},[e("span",{class:m([o?"font-semibold":"font-normal","block truncate"])},"Semua Juz",2),o?(l(),n("span",{key:0,class:m([a?"text-white":"text-lime-600","absolute inset-y-0 right-0 flex items-center pr-4"])},[s(i(k),{class:"w-5 h-5","aria-hidden":"true"})],2)):p("",!0)],2)]),_:1}),(l(),n(B,null,V(30,a=>s(i(w),{as:"template",key:a,value:a},{default:d(({active:o,selected:g})=>[e("li",{class:m([o?"bg-lime-600 text-white":"text-gray-900","relative cursor-default select-none py-2 pl-3 pr-9"])},[e("span",{class:m([g?"font-semibold":"font-normal","block truncate"])},"Juz "+u(a),3),g?(l(),n("span",{key:0,class:m([o?"text-white":"text-lime-600","absolute inset-y-0 right-0 flex items-center pr-4"])},[s(i(k),{class:"w-5 h-5","aria-hidden":"true"})],2)):p("",!0)],2)]),_:2},1032,["value"])),64))]),_:1})]),_:1})])]),_:1},8,["modelValue"]))}},G={class:"max-w-3xl"},I={class:"flex justify-end gap-4 mb-4"},K={class:"overflow-hidden bg-white rounded-md shadow"},Q={role:"list",class:"divide-y divide-gray-200"},R={class:"min-w-0"},W={class:"flex items-start gap-x-3"},X={class:"text-sm font-semibold leading-6 text-gray-900"},Y={class:"flex items-center mt-1 text-xs leading-5 text-gray-500 gap-x-2"},Z={key:0,class:"truncate"},ee={key:1,viewBox:"0 0 2 2",class:"h-0.5 w-0.5 fill-current"},te=e("circle",{cx:"1",cy:"1",r:"1"},null,-1),se=[te],ae={key:2,class:"truncate"},le={key:3,viewBox:"0 0 2 2",class:"h-0.5 w-0.5 fill-current"},ne=e("circle",{cx:"1",cy:"1",r:"1"},null,-1),oe=[ne],re={key:4,class:"truncate"},ie={class:"flex items-center flex-none gap-x-4"},ue={class:"sr-only"},ge={__name:"Materials",setup(x){const h=f([{name:"Materi Tadabbur",route:{name:"materials"},current:!0}]),y=f(1),c=f(null),a=f(null),o=f({data:[]});async function g(){const{data:_}=await J({page:y.value,category:c.value?c.value.id:null,part_number:a.value});o.value=_}g();function v(_){y.value=_,g()}function b(_){return _.read_at?"Selesai":"Belum dibaca"}const $={Selesai:"text-success-700 bg-success-50 ring-success-600/20","Belum dibaca":"text-gray-600 bg-gray-50 ring-gray-500/10"};return(_,r)=>{const z=C("router-link");return l(),n("div",null,[s(U,{class:"mb-4",pages:h.value},null,8,["pages"]),s(T,{class:"mb-8","page-title":"Materi Tadabbur"}),e("div",G,[e("div",I,[s(A,{class:"w-full sm:w-40",modelValue:a.value,"onUpdate:modelValue":[r[0]||(r[0]=t=>a.value=t),r[1]||(r[1]=()=>v(1))]},null,8,["modelValue"]),s(L,{"show-all-option":"",class:"w-full sm:w-56",modelValue:c.value,"onUpdate:modelValue":[r[2]||(r[2]=t=>c.value=t),r[3]||(r[3]=()=>v(1))]},null,8,["modelValue"])]),e("div",K,[e("ul",Q,[(l(!0),n(B,null,V(o.value.data,t=>(l(),n("li",{key:t.id,class:"flex items-center justify-between px-6 py-4 gap-x-6"},[e("div",R,[e("div",W,[e("p",X,u(t.title),1),e("p",{class:m([$[b(t)],"rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"])},u(b(t)),3)]),e("div",Y,[t.category?(l(),n("p",Z,u(t.category.name),1)):p("",!0),t.category?(l(),n("svg",ee,se)):p("",!0),t.part_number?(l(),n("p",ae,"Juz "+u(t.part_number),1)):p("",!0),t.part_number?(l(),n("svg",le,oe)):p("",!0),t.chapter?(l(),n("p",re,"Surah "+u(t.chapter),1)):p("",!0)])]),e("div",ie,[s(z,{to:{name:"materials.show",params:{id:t.id}},class:"hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"},{default:d(()=>[M("Lihat materi"),e("span",ue,", "+u(t.name),1)]),_:2},1032,["to"])])]))),128))]),s(j,{meta:o.value,onChange:v},null,8,["meta"])])])])}}};export{ge as default};
