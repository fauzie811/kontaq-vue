import{r as _,o as w,c as h,a as t,b as e,w as f,i,ax as o,u as d,aS as k,d as n,v as r,G as g,p as c,H as x,n as v,I as V,aT as P,aU as U,aV as q,aW as S}from"./index-bd172f29.js";import{u as N}from"./localStorage-88f294c5.js";import{_ as M}from"./PageHeader-e6a8431a.js";const T={class:"divide-y divide-black/5"},j={class:"grid grid-cols-1 py-16 gap-x-8 gap-y-10 md:grid-cols-3"},B=e("div",null,[e("h2",{class:"text-base font-semibold leading-7"},"Informasi Pribadi")],-1),E=["onSubmit"],I={class:"grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6"},L={class:"grid grid-cols-2 gap-2"},A=e("div",{class:"flex mt-8"},[e("button",{type:"submit",class:"px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-lime-500 hover:bg-lime-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500"},"Simpan")],-1),C={class:"grid grid-cols-1 py-16 gap-x-8 gap-y-10 md:grid-cols-3"},H=e("div",null,[e("h2",{class:"text-base font-semibold leading-7"},"Pengaturan")],-1),K={class:"grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6"},R=e("option",{value:"sans"},"Sans Serif",-1),$=e("option",{value:"arial"},"Arial",-1),z=e("option",{value:"times"},"Times New Roman",-1),D=[R,$,z],W={__name:"Profile",setup(F){const s=_({}),m=N("font-family","sans");async function b(){const u=await k();s.value=u.data}b();async function y(){await q(s.value),S()}return(u,l)=>(w(),h("div",null,[t(M,{"page-title":"Profil"}),e("div",T,[e("div",j,[B,e("form",{onSubmit:f(y,["prevent"]),class:"md:col-span-2"},[e("div",I,[t(o,{class:"sm:col-span-4",label:"Nama Lengkap"},{default:i(()=>[n(e("input",{"onUpdate:modelValue":l[0]||(l[0]=a=>s.value.name=a),id:"name",name:"name",type:"text",autocomplete:"name",required:"",class:"block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"},null,512),[[r,s.value.name]])]),_:1}),t(o,{class:"sm:col-span-2",label:"Panggilan"},{default:i(()=>[n(e("input",{"onUpdate:modelValue":l[1]||(l[1]=a=>s.value.nickname=a),id:"nickname",name:"nickname",type:"text",required:"",class:"block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"},null,512),[[r,s.value.nickname]])]),_:1}),t(d(V),{class:"bg-white rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-lime-600 sm:col-span-4",modelValue:s.value.gender,"onUpdate:modelValue":l[2]||(l[2]=a=>s.value.gender=a)},{default:i(()=>[t(d(g),{class:"block text-xs font-medium text-gray-900"},{default:i(()=>[c("Jenis Kelamin")]),_:1}),e("div",L,[t(d(x),{as:"template",value:"m"},{default:i(({active:a,checked:p})=>[e("div",{class:v(["cursor-pointer focus:outline-none",a?"ring-2 ring-lime-600 ring-offset-2":"",p?"bg-lime-600 text-white hover:bg-lime-500":"ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50","flex items-center justify-center rounded-md py-1 px-3 text-xs sm:flex-1"])},[t(d(g),{as:"span"},{default:i(()=>[c("Laki-laki")]),_:1})],2)]),_:1}),t(d(x),{as:"template",value:"f"},{default:i(({active:a,checked:p})=>[e("div",{class:v(["cursor-pointer focus:outline-none",a?"ring-2 ring-lime-600 ring-offset-2":"",p?"bg-lime-600 text-white hover:bg-lime-500":"ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50","flex items-center justify-center rounded-md py-1 px-3 text-xs sm:flex-1"])},[t(d(g),{as:"span"},{default:i(()=>[c("Perempuan")]),_:1})],2)]),_:1})])]),_:1},8,["modelValue"]),t(o,{class:"sm:col-span-2",label:"Usia"},{default:i(()=>[n(e("input",{"onUpdate:modelValue":l[3]||(l[3]=a=>s.value.age=a),id:"age",name:"age",type:"number",required:"",class:"block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"},null,512),[[r,s.value.age]])]),_:1}),t(o,{class:"col-span-full",label:"Alamat"},{default:i(()=>[n(e("input",{"onUpdate:modelValue":l[4]||(l[4]=a=>s.value.address=a),id:"address",name:"address",type:"text",required:"",class:"block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"},null,512),[[r,s.value.address]])]),_:1}),t(o,{class:"col-span-full",label:"Pekerjaan"},{default:i(()=>[n(e("input",{"onUpdate:modelValue":l[5]||(l[5]=a=>s.value.occupation=a),id:"occupation",name:"occupation",type:"text",required:"",class:"block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"},null,512),[[r,s.value.occupation]])]),_:1}),t(o,{class:"sm:col-span-3",label:"Nomor HP"},{default:i(()=>[n(e("input",{"onUpdate:modelValue":l[6]||(l[6]=a=>s.value.phone=a),id:"phone",name:"phone",type:"tel",required:"",class:"block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"},null,512),[[r,s.value.phone]])]),_:1}),t(o,{class:"sm:col-span-3",label:"Email"},{default:i(()=>[n(e("input",{"onUpdate:modelValue":l[7]||(l[7]=a=>s.value.email=a),id:"email",name:"email",type:"email",required:"",class:"block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"},null,512),[[r,s.value.email]])]),_:1}),t(o,{class:"col-span-full",label:"Motivasi Ikut KontaQ"},{default:i(()=>[n(e("input",{"onUpdate:modelValue":l[8]||(l[8]=a=>s.value.motivation=a),id:"motivation",name:"motivation",type:"text",required:"",class:"block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"},null,512),[[r,s.value.motivation]])]),_:1})]),A],40,E)]),e("div",C,[H,e("form",{onSubmit:l[10]||(l[10]=f((...a)=>u.savePrefs&&u.savePrefs(...a),["prevent"])),class:"md:col-span-2"},[e("div",K,[t(o,{class:"sm:col-span-4",label:"Font"},{default:i(()=>[n(e("select",{"onUpdate:modelValue":l[9]||(l[9]=a=>U(m)?m.value=a:null),id:"font",name:"font",required:"",class:"block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"},D,512),[[P,d(m)]])]),_:1})])],32)])])]))}};export{W as default};