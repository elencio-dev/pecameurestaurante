(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[180],{92510:function(e,t,r){Promise.resolve().then(r.bind(r,411))},411:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return f}});var a=r(57437),n=r(16463),s=r(67524),l=r(49321),c=r(56935),i=r(46997),d=r(24258),o=r(99687),u=r(87592),x=r(89896),h=r(79898),m=r(88726);function f(){let e=(0,n.useRouter)(),{user:t,logout:r}=(0,h.tN)(),{getCustomerOrders:f}=(0,h.lS)(),p=t?f(t.id):[],b=[{icon:(0,a.jsx)(s.Z,{size:18}),label:"Meus pedidos",count:p.length,onClick:()=>e.push("/client/orders")},{icon:(0,a.jsx)(l.Z,{size:18}),label:"Meus endere\xe7os",onClick:()=>(0,m.ZP)("Em breve! \uD83D\uDEA7")},{icon:(0,a.jsx)(c.Z,{size:18}),label:"Pagamentos",tag:"Novo",onClick:()=>(0,m.ZP)("Em breve! \uD83D\uDEA7")},{icon:(0,a.jsx)(i.Z,{size:18}),label:"Cupons e promo\xe7\xf5es",onClick:()=>(0,m.ZP)("Em breve! \uD83D\uDEA7")},{icon:(0,a.jsx)(d.Z,{size:18}),label:"Configura\xe7\xf5es",onClick:()=>(0,m.ZP)("Em breve! \uD83D\uDEA7")},{icon:(0,a.jsx)(o.Z,{size:18}),label:"Ajuda e suporte",onClick:()=>(0,m.ZP)("Em breve! \uD83D\uDEA7")}];return(0,a.jsxs)("div",{className:"min-h-screen bg-brand-cream",children:[(0,a.jsx)("div",{className:"bg-brand-brown px-5 pt-5 pb-8",children:(0,a.jsxs)("div",{className:"flex items-center gap-4",children:[(0,a.jsx)("div",{className:"w-16 h-16 bg-brand-red rounded-2xl flex items-center justify-center text-3xl border-2 border-brand-red/30",children:"\uD83D\uDC64"}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h1",{className:"font-display text-2xl font-black text-brand-cream",children:null==t?void 0:t.name}),(0,a.jsx)("p",{className:"text-brand-cream/50 text-sm",children:null==t?void 0:t.email}),(0,a.jsxs)("p",{className:"text-brand-cream/30 text-xs mt-0.5",children:[p.length," pedidos realizados"]})]})]})}),(0,a.jsxs)("div",{className:"px-4 py-5 pb-28 space-y-2",children:[b.map((e,t)=>(0,a.jsxs)("button",{onClick:e.onClick,className:"w-full bg-white rounded-2xl p-4 flex items-center gap-3 hover:shadow-card hover:-translate-y-0.5 transition-all border border-transparent hover:border-brand-cream-dark text-left",children:[(0,a.jsx)("div",{className:"w-10 h-10 bg-brand-cream-dark rounded-xl flex items-center justify-center text-brand-brown",children:e.icon}),(0,a.jsx)("span",{className:"flex-1 font-medium text-brand-brown",children:e.label}),null!=e.count&&e.count>0&&(0,a.jsx)("span",{className:"bg-brand-red text-white text-xs font-bold px-2 py-0.5 rounded-full",children:e.count}),e.tag&&(0,a.jsx)("span",{className:"bg-brand-red text-white text-xs font-bold px-2 py-0.5 rounded-full",children:e.tag}),(0,a.jsx)(u.Z,{size:16,className:"text-brand-gray"})]},t)),(0,a.jsxs)("button",{onClick:()=>{r(),(0,m.ZP)("At\xe9 logo! \uD83D\uDC4B"),e.push("/")},className:"w-full bg-white rounded-2xl p-4 flex items-center gap-3 hover:shadow-card transition-all border border-red-100 text-left mt-4",children:[(0,a.jsx)("div",{className:"w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500",children:(0,a.jsx)(x.Z,{size:18})}),(0,a.jsx)("span",{className:"font-medium text-red-600",children:"Sair da conta"})]}),(0,a.jsxs)("div",{className:"text-center pt-4 pb-2",children:[(0,a.jsxs)("p",{className:"font-display text-lg font-black text-brand-brown",children:["Pe\xe7a",(0,a.jsx)("em",{className:"text-brand-red not-italic",children:"Meu"}),"Restaurante"]}),(0,a.jsx)("p",{className:"text-xs text-brand-gray mt-1",children:"Vers\xe3o 1.0.0 \xb7 Taxa transparente: R$1,00/pedido"}),(0,a.jsx)("p",{className:"text-xs text-brand-gold mt-1",children:"♥ Feito para conectar pessoas e restaurantes"})]})]})]})}},78030:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});var a=r(2265);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let n=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),s=function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return t.filter((e,t,r)=>!!e&&r.indexOf(e)===t).join(" ")};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var l={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let c=(0,a.forwardRef)((e,t)=>{let{color:r="currentColor",size:n=24,strokeWidth:c=2,absoluteStrokeWidth:i,className:d="",children:o,iconNode:u,...x}=e;return(0,a.createElement)("svg",{ref:t,...l,width:n,height:n,stroke:r,strokeWidth:i?24*Number(c)/Number(n):c,className:s("lucide",d),...x},[...u.map(e=>{let[t,r]=e;return(0,a.createElement)(t,r)}),...Array.isArray(o)?o:[o]])}),i=(e,t)=>{let r=(0,a.forwardRef)((r,l)=>{let{className:i,...d}=r;return(0,a.createElement)(c,{ref:l,iconNode:t,className:s("lucide-".concat(n(e)),i),...d})});return r.displayName="".concat(e),r}},87592:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(78030).Z)("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]])},99687:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(78030).Z)("CircleHelp",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]])},56935:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(78030).Z)("CreditCard",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]])},46997:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(78030).Z)("Gift",[["rect",{x:"3",y:"8",width:"18",height:"4",rx:"1",key:"bkv52"}],["path",{d:"M12 8v13",key:"1c76mn"}],["path",{d:"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7",key:"6wjy6b"}],["path",{d:"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",key:"1ihvrl"}]])},89896:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(78030).Z)("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]])},49321:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(78030).Z)("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]])},67524:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(78030).Z)("Package",[["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]])},24258:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(78030).Z)("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]])},16463:function(e,t,r){"use strict";var a=r(71169);r.o(a,"useParams")&&r.d(t,{useParams:function(){return a.useParams}}),r.o(a,"usePathname")&&r.d(t,{usePathname:function(){return a.usePathname}}),r.o(a,"useRouter")&&r.d(t,{useRouter:function(){return a.useRouter}}),r.o(a,"useSearchParams")&&r.d(t,{useSearchParams:function(){return a.useSearchParams}})}},function(e){e.O(0,[77,726,898,971,23,744],function(){return e(e.s=92510)}),_N_E=e.O()}]);