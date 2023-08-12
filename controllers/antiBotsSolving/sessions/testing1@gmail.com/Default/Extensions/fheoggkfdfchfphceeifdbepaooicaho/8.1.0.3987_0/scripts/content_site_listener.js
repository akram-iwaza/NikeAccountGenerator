/*!
 * 
 *     MCAFEE RESTRICTED CONFIDENTIAL
 *     Copyright (c) 2023 McAfee, LLC
 *
 *     The source code contained or described herein and all documents related
 *     to the source code ("Material") are owned by McAfee or its
 *     suppliers or licensors. Title to the Material remains with McAfee
 *     or its suppliers and licensors. The Material contains trade
 *     secrets and proprietary and confidential information of McAfee or its
 *     suppliers and licensors. The Material is protected by worldwide copyright
 *     and trade secret laws and treaty provisions. No part of the Material may
 *     be used, copied, reproduced, modified, published, uploaded, posted,
 *     transmitted, distributed, or disclosed in any way without McAfee's prior
 *     express written permission.
 *
 *     No license under any patent, copyright, trade secret or other intellectual
 *     property right is granted to or conferred upon you by disclosure or
 *     delivery of the Materials, either expressly, by implication, inducement,
 *     estoppel or otherwise. Any license under such intellectual property rights
 *     must be expressed and approved by McAfee in writing.
 *
 */(()=>{"use strict";const e="LOCAL_STORE",s="SESSION_STORE",t="CONTENT_HANDLER",n="EXECUTE_COMMAND",a="FOCUS_OR_CREATE_TAB",o="GET_BK_GLOBALS",c="GET_EXTENSION_STATUS",i="GET_TAB_DATA",m="TI_REQUEST",r="PLACEHOLDER_TEXT",d="REMOVE_TAB",E="SEND_TELEMETRY",T="SET_VIEWPORT",_="WHITELIST",g="RESET_NATIVE_SETTING",u="UPDATE_BK_NATIVE_SETTINGS",S="SHOW_SIDEBAR_MAIN",l="GET_POPUP_DATA",M="GET_SETTINGS_DATA",A="RESET_SETTINGS",I="GET_TYPOSQUATTING_DATA",h="IS_FRAME_BLOCKED",P="IS_WHITELISTED",O="ANY_BLOCKED_IFRAMES",D="ANY_BLOCKED_CRYPTOSCRIPTS",N="UNBLOCK_ALL_IFRAMES",C="VIEW_SITE_REPORT",L="SEARCH_ANNOTATION",R="UPDATE_ENGINE_STATS",F="SOCIAL_MEDIA_ANNOTATION",p="UPDATE_RAT_DETECTION_SHOWING_FLAG",G="SEARCH_SUGGEST",f="SAVE_FORM_INFO",W="GET_FORM_INFO_CACHE",U="CLEAR_FORM_INFO_CACHE",y="SAVE_MULTISTEP_LOGIN",w="GET_FD_WEIGHTS",B="GET_FD_EXCEPTIONS",H="GET_FD_CRF_PARAMS",b="CLEAR_DWS_INFO",v="GET_CACHED_DWS_INFO",V="UPDATE_DWS_WHITELIST",k="LAUNCH_IDPS_LOGIN",x="UPDATE_DWS_SHOWN",Y="GET_APS_DETAILS",K="SIGN_UP_FORM_DETECTED",q="SET_FF_POLICY_COLLECTION",X="SET_FF_POLICY_LAST_SHOWN",Q="PING_CONTENT_SITE_LISTENER",J="BROADCAST_TO_FOREGROUND",j=0,z=23,Z=24,$=0;class ee{constructor(e){this.pingCommand=e,this.basePingListener()}basePingListener(e=null){chrome.runtime.onMessage.addListener(((s,t,n)=>{if(t.id!==chrome.runtime.id)return;const{command:a,...o}=s;this.additionalData=o,a===this.pingCommand&&(n({content:!0}),"function"==typeof e&&e())}))}}const se=chrome;class te{static handlePromiseMessage(e,s=null){return new Promise(((t,n)=>{chrome.runtime.sendMessage(e,(e=>{"function"==typeof s?s(t,n,e):((e,s,t)=>{chrome.runtime.lastError&&s(chrome.runtime.lastError.message),e(t)})(t,n,e)}))}))}}class ne{static localStore(s,t){const n=e;return te.handlePromiseMessage({command:n,action:s,data:t})}static sessionStore(e,t){const n=s;return te.handlePromiseMessage({command:n,action:e,data:t})}static isFrameBlocked(e){const s=h;return te.handlePromiseMessage({command:s,url:e})}static makeMTIRequest(e,s){const t={command:m,requestData:e,referer:s};return te.handlePromiseMessage(t)}static executeCommand(e,s){const t=n;se.runtime.sendMessage({command:t,commandId:e,params:s})}static focusOrCreateTab(e){const s=a;se.runtime.sendMessage({command:s,url:e})}static closeTab(){const e=d;se.runtime.sendMessage({command:e})}static whitelist(e,s,t){const n=_;return te.handlePromiseMessage({action:e,command:n,type:s,data:t})}static getPopupData(){const e=l;return te.handlePromiseMessage({command:e})}static getSettingsData(){const e=M;return te.handlePromiseMessage({command:e})}static searchAnnotation(e,s){const t=L;return te.handlePromiseMessage({action:e,data:s,command:t})}static socialMediaAnnotation(e,s){const t=F;return te.handlePromiseMessage({action:e,data:s,command:t})}static getBkGlobals(e=!1){return new Promise((s=>{const t=o;te.handlePromiseMessage({command:t,bIncludeSearchEngines:e}).then((e=>{s(JSON.parse(e))}))}))}static viewSiteReport(e=null,s=!1){const t=C;se.runtime.sendMessage({command:t,url:e,showInNewTab:s})}static getTypoSquattingData(e){const s=I;return te.handlePromiseMessage({command:s,domain:e})}static getPlaceholderText(e){const s=r;return te.handlePromiseMessage({command:s,id:e})}static setViewPort(e,s){const t=T;se.runtime.sendMessage({command:t,x:e,y:s})}static sendTelemetry(e){const s=E;se.runtime.sendMessage({command:s,telemetry:e})}static anyBlockedIframes(e){const s=O;return te.handlePromiseMessage({command:s,frameUrls:e})}static anyBlockedCryptoScripts(){const e=D;return te.handlePromiseMessage({command:e})}static resetSettings(){const e=A;se.runtime.sendMessage({command:e})}static sendEngineStat(e){se.runtime.sendMessage({command:R,engine:e})}static contentHandler(e){const s=t;se.runtime.sendMessage({command:s,message:e})}static getTabData(e={}){const s={command:i,...e};return te.handlePromiseMessage(s)}static isWhitelisted(e){const s={command:P,url:e};return te.handlePromiseMessage(s)}static getExtensionStatus(e){return te.handlePromiseMessage({command:c,extension_id:e})}static unblockAllIframes(){const e=N;se.runtime.sendMessage({command:e})}static updateRatDetectionShowingFlag(e){const s=p;se.runtime.sendMessage({command:s,showed:e})}static getSearchSuggest(e){const s={command:G,searchTerm:e};return te.handlePromiseMessage(s)}static resetNativeSetting(e){const s=g;se.runtime.sendMessage({command:s,setting:e})}static saveFormInfo(e,s){const t=f;se.runtime.sendMessage({command:t,username:e,hostname:s})}static saveMultiStepLogin(e,s){const t=y;se.runtime.sendMessage({command:t,data:e,completeLogin:s})}static getFormInfoCache(){const e=W;return te.handlePromiseMessage({command:e})}static clearFormInfoCache(){const e=U;se.runtime.sendMessage({command:e})}static updateDWSWhitelist(e){const s=V;se.runtime.sendMessage({command:s,email:e})}static getCachedDWSInfo(e){const s={command:v,email:e};return te.handlePromiseMessage(s)}static clearCachedDWSInfo(e){const s=b;se.runtime.sendMessage({command:s,email:e})}static updateDWSShown(e){const s=x;se.runtime.sendMessage({command:s,email:e})}static getAPSDetails(){const e=Y;return te.handlePromiseMessage({command:e})}static signUpFormDetected(){const e=K;se.runtime.sendMessage({command:e})}static updateBkNativeSettings(e,s){const t=u;se.runtime.sendMessage({command:t,name:e,value:s})}static launchIDPSLogin(){const e=k;se.runtime.sendMessage({command:e})}static showSidebarMain(){const e=S;se.runtime.sendMessage({command:e})}static setFFPolicyCollection({personal:e,activity:s,permissions:t}){const n=q;se.runtime.sendMessage({command:n,personal:e,activity:s,permissions:t})}static setFFPolicyLastShown(){const e=X;se.runtime.sendMessage({command:e})}static broadcastToForeground(e){const s=J;se.runtime.sendMessage({command:s,payload:e})}static getFDWeights(){const e=w;return te.handlePromiseMessage({command:e})}static getFDExceptions(){const e=B;return te.handlePromiseMessage({command:e})}static getFDCrfParams(){const e=H;return te.handlePromiseMessage({command:e})}}(new class extends ee{constructor(){super(Q)}main(){window.addEventListener("message",(e=>{if(!e)return;const{data:s}=e;if(!s)return;const{request_type:t,payload:n}=s;if(void 0!==t&&void 0!==n){if(t!==j||n.done||window.postMessage({request_type:$,payload:{done:!0}},e.origin),t===z){const e=chrome.runtime.getURL("html/settings.html");ne.focusOrCreateTab(e)}t===Z&&ne.showSidebarMain()}}),!1)}}).main()})();
//# sourceMappingURL=../sourceMap/chrome/scripts/content_site_listener.js.map