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
 */(()=>{"use strict";class e{constructor(e){this.pingCommand=e,this.basePingListener()}basePingListener(e=null){chrome.runtime.onMessage.addListener(((t,i,s)=>{if(i.id!==chrome.runtime.id)return;const{command:n,...o}=t;this.additionalData=o,n===this.pingCommand&&(s({content:!0}),"function"==typeof e&&e())}))}}class t{constructor(){this.observer=null,this.clientNotified=!1,this.autoplayDetectedFn=null}_recursiveProcess(e){for(let t=0;t<e.childNodes.length;++t){if(this.clientNotified)return;this._recursiveProcess(e.childNodes[t])}if(e instanceof HTMLMediaElement){if(this.clientNotified)return;e.autoplay&&(this.clientNotified=!0,this.autoplayDetectedFn(e))}}init(e){this.autoplayDetectedFn=e,this.observer=new MutationObserver(this.handleMutations.bind(this)),this.observer.observe(document,{childList:!0,subtree:!0});const t=document.querySelectorAll("audio, video");for(let e=0;e<t.length&&!this.clientNotified;++e)t[e].autoplay&&(this.clientNotified=!0,this.autoplayDetectedFn(t[e]))}handleMutations(e){e.forEach((e=>{for(const t of e.addedNodes)this._recursiveProcess(t),this.clientNotified&&this.observer.disconnect()}))}}const i="AUTO_RUN_VIDEO_SITE",s="PING_CONTENT_AUTOPLAY_DETECTION";(new class extends e{constructor(){super(s)}autoRunVideo(e){const t=i;chrome.runtime.sendMessage({command:t,url:e})}main(){(new t).init((e=>this.autoRunVideo(e)))}}).main()})();
//# sourceMappingURL=../sourceMap/chrome/scripts/content_autoplay_detection.js.map