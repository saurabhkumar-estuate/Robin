"use strict";(()=>{var e={};e.id=240,e.ids=[240],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6544:e=>{e.exports=import("node-fetch")},8533:(e,a,t)=>{t.a(e,async(e,o)=>{try{t.r(a),t.d(a,{config:()=>u,default:()=>c,routeModule:()=>l});var s=t(1802),i=t(7153),n=t(6249),r=t(7436),d=e([r]);r=(d.then?(await d)():d)[0];let c=(0,n.l)(r,"default"),u=(0,n.l)(r,"config"),l=new s.PagesAPIRouteModule({definition:{kind:i.x.PAGES_API,page:"/api/feedback",pathname:"/api/feedback",bundlePath:"",filename:""},userland:r});o()}catch(e){o(e)}})},7436:(e,a,t)=>{t.a(e,async(e,o)=>{try{t.r(a),t.d(a,{default:()=>handler});var s=t(6544),i=e([s]);s=(i.then?(await i)():i)[0];let n=process.env.ZENDESK_URL;async function handler(e,a){try{let t=e.query.ticketid,o=await (0,s.default)(`${n}/api/v2/tickets/${t}`,{method:"GET",headers:{"Content-Type":"application/json",Authorization:e.headers.authorization}}),i=await o.json(),r=i.ticket.custom_fields.filter(e=>0xa37f7b2d391==e.id),d=await (0,s.default)("https://setup34.ameyo.net:8443/ameyowebaccess/command?command=uploadContactAndAddCallback",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded","hash-key":"byjus-customer-manager","policy-name":"token-based-authorization-policy","requesting-host":"byjus-customer-manager"},body:new URLSearchParams({data:JSON.stringify({campaignId:374,customerAndCallbackRecords:[{customerRecord:{phone1:r[0].value,ticket_id:t}}],leadId:43369,status:"NOT_TRIED",properties:{"update.customer":!0,"migrate.customer":!0},attempts:0})}).toString()}),c=await d.json();a.status(200).json({response:c})}catch(e){console.log(e),a.status(500).json({e})}}o()}catch(e){o(e)}})}};var a=require("../../webpack-api-runtime.js");a.C(e);var __webpack_exec__=e=>a(a.s=e),t=a.X(0,[222],()=>__webpack_exec__(8533));module.exports=t})();