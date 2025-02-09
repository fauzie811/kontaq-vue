import{r as w,c as k,a as t,b as l,w as c,i,u as d,aL as P,o as V,e as o,v as r,p as g,n as x,aM as U,aN as q,aO as N,aP as S}from"./index-CjDoOErh.js";import{u as h}from"./localStorage-DgIc5r7-.js";import{_ as M}from"./PageHeader-HICBj2w1.js";import{_ as n}from"./InputFrame-x5_bMi6U.js";import{h as L,k as f,O as v}from"./radio-group-Du7c1_4u.js";import"./form-vbyPtqas.js";import"./description-NOXvPw-3.js";const j={class:"divide-y divide-black/5"},B={class:"grid grid-cols-1 py-16 gap-x-8 gap-y-10 md:grid-cols-3"},O={class:"grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6"},T={class:"grid grid-cols-2 gap-2"},_={class:"grid grid-cols-1 py-16 gap-x-8 gap-y-10 md:grid-cols-3"},A={class:"grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6"},F={__name:"Profile",setup(C){const s=w({}),u=h("font-family","sans");async function b(){const m=await P();s.value=m.data}b();async function y(){await N(s.value),S()}return(m,e)=>(V(),k("div",null,[t(M,{"page-title":"Profil"}),l("div",j,[l("div",B,[e[15]||(e[15]=l("div",null,[l("h2",{class:"text-base font-semibold leading-7"},"Informasi Pribadi")],-1)),l("form",{onSubmit:c(y,["prevent"]),class:"md:col-span-2"},[l("div",O,[t(n,{class:"sm:col-span-4",label:"Nama Lengkap"},{default:i(()=>[o(l("input",{"onUpdate:modelValue":e[0]||(e[0]=a=>s.value.name=a),id:"name",name:"name",type:"text",autocomplete:"name",required:"",class:"block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"},null,512),[[r,s.value.name]])]),_:1}),t(n,{class:"sm:col-span-2",label:"Panggilan"},{default:i(()=>[o(l("input",{"onUpdate:modelValue":e[1]||(e[1]=a=>s.value.nickname=a),id:"nickname",name:"nickname",type:"text",required:"",class:"block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"},null,512),[[r,s.value.nickname]])]),_:1}),t(d(L),{class:"bg-white rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-lime-600 sm:col-span-4",modelValue:s.value.gender,"onUpdate:modelValue":e[2]||(e[2]=a=>s.value.gender=a)},{default:i(()=>[t(d(f),{class:"block text-xs font-medium text-gray-900"},{default:i(()=>e[11]||(e[11]=[g("Jenis Kelamin")])),_:1}),l("div",T,[t(d(v),{as:"template",value:"m"},{default:i(({active:a,checked:p})=>[l("div",{class:x(["cursor-pointer focus:outline-none",a?"ring-2 ring-lime-600 ring-offset-2":"",p?"bg-lime-600 text-white hover:bg-lime-500":"ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50","flex items-center justify-center rounded-md py-1 px-3 text-xs sm:flex-1"])},[t(d(f),{as:"span"},{default:i(()=>e[12]||(e[12]=[g("Laki-laki")])),_:1})],2)]),_:1}),t(d(v),{as:"template",value:"f"},{default:i(({active:a,checked:p})=>[l("div",{class:x(["cursor-pointer focus:outline-none",a?"ring-2 ring-lime-600 ring-offset-2":"",p?"bg-lime-600 text-white hover:bg-lime-500":"ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50","flex items-center justify-center rounded-md py-1 px-3 text-xs sm:flex-1"])},[t(d(f),{as:"span"},{default:i(()=>e[13]||(e[13]=[g("Perempuan")])),_:1})],2)]),_:1})])]),_:1},8,["modelValue"]),t(n,{class:"sm:col-span-2",label:"Usia"},{default:i(()=>[o(l("input",{"onUpdate:modelValue":e[3]||(e[3]=a=>s.value.age=a),id:"age",name:"age",type:"number",required:"",class:"block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"},null,512),[[r,s.value.age]])]),_:1}),t(n,{class:"col-span-full",label:"Alamat"},{default:i(()=>[o(l("input",{"onUpdate:modelValue":e[4]||(e[4]=a=>s.value.address=a),id:"address",name:"address",type:"text",required:"",class:"block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"},null,512),[[r,s.value.address]])]),_:1}),t(n,{class:"col-span-full",label:"Pekerjaan"},{default:i(()=>[o(l("input",{"onUpdate:modelValue":e[5]||(e[5]=a=>s.value.occupation=a),id:"occupation",name:"occupation",type:"text",required:"",class:"block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"},null,512),[[r,s.value.occupation]])]),_:1}),t(n,{class:"sm:col-span-3",label:"Nomor HP"},{default:i(()=>[o(l("input",{"onUpdate:modelValue":e[6]||(e[6]=a=>s.value.phone=a),id:"phone",name:"phone",type:"tel",required:"",class:"block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"},null,512),[[r,s.value.phone]])]),_:1}),t(n,{class:"sm:col-span-3",label:"Email"},{default:i(()=>[o(l("input",{"onUpdate:modelValue":e[7]||(e[7]=a=>s.value.email=a),id:"email",name:"email",type:"email",required:"",class:"block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"},null,512),[[r,s.value.email]])]),_:1}),t(n,{class:"col-span-full",label:"Motivasi Ikut KontaQ"},{default:i(()=>[o(l("input",{"onUpdate:modelValue":e[8]||(e[8]=a=>s.value.motivation=a),id:"motivation",name:"motivation",type:"text",required:"",class:"block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"},null,512),[[r,s.value.motivation]])]),_:1})]),e[14]||(e[14]=l("div",{class:"flex mt-8"},[l("button",{type:"submit",class:"px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-lime-500 hover:bg-lime-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500"},"Simpan")],-1))],32)]),l("div",_,[e[17]||(e[17]=l("div",null,[l("h2",{class:"text-base font-semibold leading-7"},"Pengaturan")],-1)),l("form",{onSubmit:e[10]||(e[10]=c((...a)=>m.savePrefs&&m.savePrefs(...a),["prevent"])),class:"md:col-span-2"},[l("div",A,[t(n,{class:"sm:col-span-4",label:"Font"},{default:i(()=>[o(l("select",{"onUpdate:modelValue":e[9]||(e[9]=a=>U(u)?u.value=a:null),id:"font",name:"font",required:"",class:"block w-full p-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"},e[16]||(e[16]=[l("option",{value:"sans"},"Sans Serif",-1),l("option",{value:"arial"},"Arial",-1),l("option",{value:"times"},"Times New Roman",-1)]),512),[[q,d(u)]])]),_:1})])],32)])])]))}};export{F as default};
