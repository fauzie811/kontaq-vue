import{b as i}from"./vue-router-CDk-xkD6.js";import{C as p}from"./index-D8O8KXoR.js";import{_ as l}from"./Breadcrumbs-D30_HYsy.js";import{_ as u}from"./PageHeader-DHqEJvXM.js";import{r as n,v as c,G as r,y as o,x as d}from"./@vue-CmeWuSD3.js";import"./axios-DW_MHI2K.js";import"./@headlessui-0xYe8XqW.js";import"./@heroicons-BoQYUCLx.js";import"./vee-validate-Bj-Mx_ql.js";import"./@vee-validate-Dp5Eofi2.js";import"./zod-CAEFwTIS.js";import"./vue-sonner-D4V0y7TK.js";import"./clsx-B-dksMZM.js";import"./tailwind-merge-n5GtVHHT.js";import"./radix-vue-CtCK4Iz_.js";import"./@floating-ui-CN3CcqHw.js";import"./class-variance-authority-Dp3B9jqt.js";import"./@vueuse-CrFSdR1N.js";import"./lucide-vue-next-CAHwnPek.js";import"./@radix-icons-D7BaxYRN.js";import"./sweetalert2-CumHaNCI.js";import"./date-fns-BFy15OHH.js";import"./@babel-QjJsDpFa.js";const _={class:"max-w-3xl overflow-hidden bg-white rounded-lg shadow"},v={class:"px-4 py-5 sm:p-6"},f=["innerHTML"],z={__name:"Show",setup(g){const s=i(),e=n(),t=n([{name:"Pengumuman",route:"/announcements",current:!1}]);async function m(){const a=await p(s.params.id);e.value=a.data,t.value=[...t.value,{name:e.value.title,route:`/announcements/${e.value.id}`,current:!0}]}return m(),(a,h)=>(d(),c("div",null,[r(l,{class:"mb-4",pages:t.value},null,8,["pages"]),r(u,{class:"mb-8","page-title":e.value?e.value.title:"..."},null,8,["page-title"]),o("div",_,[o("div",v,[o("div",{class:"prose max-w-none",innerHTML:e.value?e.value.content:""},null,8,f)])])]))}};export{z as default};
