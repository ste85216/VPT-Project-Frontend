import{_ as B,i as j,r as l,ad as _,l as F,n as i,w as o,o as s,d as c,j as w,t as M,aJ as N,e as A,v as L,b as y,F as V,f as R,z as b,C as U,m as z,p as D,h as G}from"./index-BYEAN4sm.js";import{P as J}from"./ProductCard-DxM4GYQ4.js";import{b as k}from"./route-block-B_A1xBdJ.js";import{V as Q}from"./VContainer-CofdrKV5.js";import{a as d,V as q}from"./VRow-DZHmcDMg.js";import{V as H}from"./VPagination-CbuJXevQ.js";import"./VHover-BWsD3CIt.js";const K=p=>(D("data-v-6b876265"),p=p(),G(),p),O=K(()=>w("p",null,"沒有找到相關商品",-1)),x=18,P={__name:"bestsellers",setup(p){const{api:C}=U(),S=j(),t=l(1),m=l(1),u=l(""),v=l("球鞋"),f=l([]),g=l(!1),h=l(!1),r=async()=>{g.value=!0;try{const e={itemsPerPage:x,page:t.value,category:v.value,search:u.value},{data:a}=await C.get("/product",{params:e});if(a.success)f.value=a.result.data,m.value=Math.ceil(a.result.total/x);else throw new Error(a.message||"載入商品失敗")}catch(e){console.error("載入商品時發生錯誤:",e),S({text:e.message||"載入商品時發生錯誤",snackbarProps:{color:"red-lighten-1"}}),f.value=[],m.value=1}finally{g.value=!1}},I=(()=>{let e;return()=>{h.value=!0,clearTimeout(e),e=setTimeout(()=>{t.value=1,r(),h.value=!1},300)}})(),E=()=>{u.value="",t.value=1,r()},T=()=>{window.scrollTo({top:0,behavior:"smooth"}),r()};return _(v,()=>{t.value=1,r()}),_(u,e=>{e===""&&(t.value=1,r())}),F(()=>{r()}),(e,a)=>(s(),i(Q,{class:"pa-0 h-100"},{default:o(()=>[c(q,{class:"d-flex justify-start align-start"},{default:o(()=>[c(d,{cols:"12",class:"d-flex justify-space-between pb-0"},{default:o(()=>[w("h2",null,M(v.value),1),c(N,{modelValue:u.value,"onUpdate:modelValue":a[0]||(a[0]=n=>u.value=n),variant:"outlined",density:"compact","max-width":"240",clearable:"","append-inner-icon":"mdi-magnify",placeholder:"搜尋商品",loading:h.value,onInput:A(I),"onClick:clear":E},null,8,["modelValue","loading","onInput"])]),_:1}),g.value?(s(),i(d,{key:0,cols:"12",class:"text-center"},{default:o(()=>[c(L,{indeterminate:"",color:"primary"})]),_:1})):(s(),y(V,{key:1},[(s(!0),y(V,null,R(f.value,n=>(s(),i(d,{key:n._id,cols:"auto",class:"px-0"},{default:o(()=>[c(J,z({ref_for:!0},n),null,16)]),_:2},1024))),128)),f.value.length===0?(s(),i(d,{key:0,cols:"12",class:"text-center"},{default:o(()=>[O]),_:1})):b("",!0)],64)),m.value>1?(s(),i(d,{key:2,cols:"12"},{default:o(()=>[c(H,{modelValue:t.value,"onUpdate:modelValue":[a[1]||(a[1]=n=>t.value=n),T],length:m.value,rounded:"circle",density:"compact","next-icon":"mdi-menu-right","prev-icon":"mdi-menu-left",color:"teal-darken-1"},null,8,["modelValue","length"])]),_:1})):b("",!0)]),_:1})]),_:1}))}};typeof k=="function"&&k(P);const te=B(P,[["__scopeId","data-v-6b876265"]]);export{te as default};
