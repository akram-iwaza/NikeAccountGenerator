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
 */(()=>{"use strict";const e="PING_IFRAME_BLOCK";class t{constructor(e){this.pingCommand=e,this.basePingListener()}basePingListener(e=null){chrome.runtime.onMessage.addListener(((t,n,i)=>{if(n.id!==chrome.runtime.id)return;const{command:o,...s}=t;this.additionalData=s,o===this.pingCommand&&(i({content:!0}),"function"==typeof e&&e())}))}}(new class extends t{constructor(){super(e),this.routeToBP=this.routeToBlockPage.bind(this)}main(){this.basePingListener(this.routeToBP)}getIFrameBlockPageUrl(){return chrome.runtime.getURL("html/iframe_block_page.html")}routeToBlockPage(){const e=this.getIFrameBlockPageUrl();window.location.replace(e)}}).main()})();
//# sourceMappingURL=../sourceMap/chrome/scripts/iframe_block.js.map