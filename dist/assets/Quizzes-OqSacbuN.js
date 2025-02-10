import{r as o,c as l,d,b as a,D as v,E as k,R as b,a as B,q as j,v as n,H as i,M as C,l as M,A as S,w as V,h as $,S as L}from"./index-BKFwgYGj.js";import{_ as T}from"./PageHeader-BjBIvRHJ.js";import{_ as A}from"./Breadcrumbs-iX88iyfR.js";import{_ as D}from"./Pagination-BwPOgS48.js";import{_ as N}from"./CategoryPicker-C1uxgK4j.js";import"./form-DBM8_knK.js";const E={class:"max-w-3xl"},K={class:"flex justify-end mb-4"},Q={class:"overflow-hidden bg-white rounded-md shadow"},R={role:"list",class:"divide-y divide-gray-200"},F={class:"min-w-0"},H={class:"flex items-start gap-x-3"},P={class:"text-sm font-semibold leading-6 text-gray-900"},U={class:"flex items-center text-xs leading-5 text-gray-500 gap-x-2"},z={class:"whitespace-nowrap"},G={class:"flex items-center flex-none gap-x-4"},I=["onClick"],te={__name:"Quizzes",setup(J){const p=B(),x=o([{name:"Kuis",route:"/quizzes",current:!0}]),u=o(1),r=o(),c=o({data:[]});async function m(){const{data:e}=await b({page:u.value,category:r.value?r.value.id:null});c.value=e}m();function g(e){u.value=e,m()}function _(e){return e.finished_at?"Selesai":e.started_at?"Sedang dikerjakan":"Belum dikerjakan"}function f(e){return e.finished_at?"Lihat hasil":e.started_at?"Lanjukan":"Mulai"}async function h(e){(await L({icon:"warning",title:"Mohon Maaf",text:"Anda harus menyelesaikan materi terkait untuk mengerjakan kuis ini.",confirmButtonText:"Baca Materi",cancelButtonText:"Tutup"})).isConfirmed&&e&&p.push(`/materials/${e}`)}const w={Selesai:"text-success-700 bg-success-50 ring-success-600/20","Sedang dikerjakan":"text-warning-800 bg-warning-50 ring-warning-600/20","Belum dikerjakan":"text-gray-600 bg-gray-50 ring-gray-500/10"};return(e,s)=>{const y=j("router-link");return n(),l("div",null,[d(A,{class:"mb-4",pages:x.value},null,8,["pages"]),d(T,{class:"mb-8","page-title":"Kuis"}),a("div",E,[a("div",K,[d(N,{"show-all-option":"",class:"w-full sm:w-56",modelValue:r.value,"onUpdate:modelValue":[s[0]||(s[0]=t=>r.value=t),s[1]||(s[1]=()=>g(1))]},null,8,["modelValue"])]),a("div",Q,[a("ul",R,[(n(!0),l(v,null,k(c.value.data,t=>(n(),l("li",{key:t.id,class:"flex items-center justify-between px-6 py-4 gap-x-6"},[a("div",F,[a("div",H,[a("p",P,i(t.title),1),a("p",{class:C([w[_(t)],"rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"])},i(_(t)),3)]),a("div",U,[a("p",z,i(t.duration)+" menit ",1)])]),a("div",G,[t.material_read?(n(),M(y,{key:1,to:{name:"quizzes.show",params:{id:t.id}},class:"block rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"},{default:V(()=>[$(i(f(t)),1)]),_:2},1032,["to"])):(n(),l("button",{key:0,onClick:S(O=>h(t.material_id),["prevent"]),class:"block rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"},i(f(t)),9,I))])]))),128))]),d(D,{meta:c.value,onChange:g},null,8,["meta"])])])])}}};export{te as default};
