import{a1 as l}from"./@vue-CmeWuSD3.js";function c(t,o){return l((r,a)=>({get:()=>{r();const e=localStorage.getItem(t);return e?JSON.parse(e):o},set:e=>{e===null?localStorage.removeItem(t):localStorage.setItem(t,JSON.stringify(e)),a()}}))}export{c as u};
