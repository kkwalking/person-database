import{u as I,f as Z,g as ee,h as U,i as ae,j as te,t as le,k as se,l as F,m as D,n as re,p as M,q as t,s as $,v as O,R as _,x as ue,y as ie,z as oe,A as ne,B as ce,C as ve,D as he,E as pe,O as de,F as ye,G as me,P as ge,H as fe,I as Ee,J as j}from"./app-QtUpElpL.js";const He=["/home.html","/intro.html","/","/about-the-author/self-introduction.html","/java/about-singleton-pattern.html","/java/deadlock.html","/java/dif-between-transactionlog-and-programlog.html","/life/comeon.html","/404.html","/about-the-author/","/java/","/life/","/category/","/category/%E4%B8%AA%E4%BA%BA/","/category/%E9%A1%B9%E7%9B%AE%E5%AE%9E%E8%B7%B5/","/tag/","/tag/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/","/tag/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/","/tag/%E6%97%A5%E5%BF%97/","/tag/%E7%94%9F%E6%B4%BB/","/article/","/star/","/timeline/"],Ae="SEARCH_PRO_QUERY_HISTORY",d=I(Ae,[]),Re=()=>{const{queryHistoryCount:l}=j,s=l>0;return{enabled:s,queryHistory:d,addQueryHistory:r=>{s&&(d.value.length<l?d.value=Array.from(new Set([r,...d.value])):d.value=Array.from(new Set([r,...d.value.slice(0,l-1)])))},removeQueryHistory:r=>{d.value=[...d.value.slice(0,r),...d.value.slice(r+1)]}}},L=l=>He[l.id]+("anchor"in l?`#${l.anchor}`:""),Be="SEARCH_PRO_RESULT_HISTORY",{resultHistoryCount:q}=j,y=I(Be,[]),ke=()=>{const l=q>0;return{enabled:l,resultHistory:y,addResultHistory:s=>{if(l){const r={link:L(s),display:s.display};"header"in s&&(r.header=s.header),y.value.length<q?y.value=[r,...y.value]:y.value=[r,...y.value.slice(0,q-1)]}},removeResultHistory:s=>{y.value=[...y.value.slice(0,s),...y.value.slice(s+1)]}}},Qe=l=>{const s=ce(),r=U(),x=ve(),i=F(!1),g=he([]);return pe(()=>{const{search:A,terminate:m}=de(),R=()=>{g.value=[],i.value=!1},f=Ee(h=>{i.value=!0,h?A(h,r.value,s.value).then(p=>{var B,E;return((E=(B=s.value).searchFilter)==null?void 0:E.call(B,p,h,r.value,x.value))??p}).then(p=>{g.value=p,i.value=!1}).catch(p=>{console.error(p),R()}):R()},j.searchDelay);M([l,r],()=>f(l.value),{immediate:!0}),ye(()=>{m()})}),{searching:i,results:g}};var Ce=Z({name:"SearchResult",props:{query:{type:String,required:!0},isFocusing:Boolean},emits:["close","updateQuery"],setup(l,{emit:s}){const r=ee(),x=U(),i=ae(te),{enabled:g,addQueryHistory:A,queryHistory:m,removeQueryHistory:R}=Re(),{enabled:f,resultHistory:h,addResultHistory:p,removeResultHistory:B}=ke(),E=g||f,C=le(l,"query"),{results:H,searching:Y}=Qe(C),u=se({isQuery:!0,index:0}),c=F(0),v=F(0),P=D(()=>E&&(m.value.length>0||h.value.length>0)),w=D(()=>H.value.length>0),S=D(()=>H.value[c.value]||null),z=()=>{const{isQuery:e,index:a}=u;a===0?(u.isQuery=!e,u.index=e?h.value.length-1:m.value.length-1):u.index=a-1},G=()=>{const{isQuery:e,index:a}=u;a===(e?m.value.length-1:h.value.length-1)?(u.isQuery=!e,u.index=0):u.index=a+1},J=()=>{c.value=c.value>0?c.value-1:H.value.length-1,v.value=S.value.contents.length-1},V=()=>{c.value=c.value<H.value.length-1?c.value+1:0,v.value=0},K=()=>{v.value<S.value.contents.length-1?v.value+=1:V()},N=()=>{v.value>0?v.value-=1:J()},b=e=>e.map(a=>me(a)?a:t(a[0],a[1])),W=e=>{if(e.type==="customField"){const a=ge[e.index]||"$content",[o,Q=""]=fe(a)?a[x.value].split("$content"):a.split("$content");return e.display.map(n=>t("div",b([o,...n,Q])))}return e.display.map(a=>t("div",b(a)))},k=()=>{c.value=0,v.value=0,s("updateQuery",""),s("close")};return re("keydown",e=>{if(l.isFocusing){if(w.value){if(e.key==="ArrowUp")N();else if(e.key==="ArrowDown")K();else if(e.key==="Enter"){const a=S.value.contents[v.value];A(l.query),p(a),r.push(L(a)),k()}}else if(f){if(e.key==="ArrowUp")z();else if(e.key==="ArrowDown")G();else if(e.key==="Enter"){const{index:a}=u;u.isQuery?(s("updateQuery",m.value[a]),e.preventDefault()):(r.push(h.value[a].link),k())}}}}),M([c,v],()=>{var e;(e=document.querySelector(".search-pro-result-list-item.active .search-pro-result-item.active"))==null||e.scrollIntoView(!1)},{flush:"post"}),()=>t("div",{class:["search-pro-result-wrapper",{empty:C.value?!w.value:!P.value}],id:"search-pro-results"},C.value===""?E?P.value?[g?t("ul",{class:"search-pro-result-list"},t("li",{class:"search-pro-result-list-item"},[t("div",{class:"search-pro-result-title"},i.value.queryHistory),m.value.map((e,a)=>t("div",{class:["search-pro-result-item",{active:u.isQuery&&u.index===a}],onClick:()=>{s("updateQuery",e)}},[t($,{class:"search-pro-result-type"}),t("div",{class:"search-pro-result-content"},e),t("button",{class:"search-pro-remove-icon",innerHTML:O,onClick:o=>{o.preventDefault(),o.stopPropagation(),R(a)}})]))])):null,f?t("ul",{class:"search-pro-result-list"},t("li",{class:"search-pro-result-list-item"},[t("div",{class:"search-pro-result-title"},i.value.resultHistory),h.value.map((e,a)=>t(_,{to:e.link,class:["search-pro-result-item",{active:!u.isQuery&&u.index===a}],onClick:()=>{k()}},()=>[t($,{class:"search-pro-result-type"}),t("div",{class:"search-pro-result-content"},[e.header?t("div",{class:"content-header"},e.header):null,t("div",e.display.map(o=>b(o)).flat())]),t("button",{class:"search-pro-remove-icon",innerHTML:O,onClick:o=>{o.preventDefault(),o.stopPropagation(),B(a)}})]))])):null]:i.value.emptyHistory:i.value.emptyResult:Y.value?t(ue,{hint:i.value.searching}):w.value?t("ul",{class:"search-pro-result-list"},H.value.map(({title:e,contents:a},o)=>{const Q=c.value===o;return t("li",{class:["search-pro-result-list-item",{active:Q}]},[t("div",{class:"search-pro-result-title"},e||i.value.defaultTitle),a.map((n,X)=>{const T=Q&&v.value===X;return t(_,{to:L(n),class:["search-pro-result-item",{active:T,"aria-selected":T}],onClick:()=>{A(l.query),p(n),k()}},()=>[n.type==="text"?null:t(n.type==="title"?ie:n.type==="heading"?oe:ne,{class:"search-pro-result-type"}),t("div",{class:"search-pro-result-content"},[n.type==="text"&&n.header?t("div",{class:"content-header"},n.header):null,t("div",W(n))])])})])})):i.value.emptyResult)}});export{Ce as default};
