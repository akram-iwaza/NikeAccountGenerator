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
 */(()=>{"use strict";(new class{constructor(){this.pingCommand="PING_IFRAME_FORM_CHECK",this.basePingListener()}basePingListener(e=null){chrome.runtime.onMessage.addListener(((s,t,o)=>{if(t.id!==chrome.runtime.id)return;const{command:a}=s;a===this.pingCommand&&(o({content:!0}),"function"==typeof e&&e())}))}isPossibleFormPage(){let e=[...document.getElementsByTagName("input")];return e=e.filter((e=>!(e.name.toLowerCase().includes("search")||(e.ariaLabel?e.ariaLabel.toLowerCase():"").includes("search")||e.id.toLowerCase().includes("search")||e.className.toLowerCase().includes("search")||e.defaultValue.toLowerCase().includes("search")||e.value.toLowerCase().includes("search")||"hidden"===e.type.toLowerCase()||"checkbox"===e.type.toLowerCase()||"submit"===e.type.toLowerCase()||"search"===e.type.toLowerCase()||"file"===e.type.toLowerCase()||"button"===e.type.toLowerCase()))),e.length>0}async main(){const{frameId:e}=await chrome.runtime.sendMessage({command:"GET_TAB_AND_FRAME_ID"});if(this.isPossibleFormPage())chrome.runtime.sendMessage({command:"FORM_PRE_CHECK_PASSED"});else if(0===e){const e=new MutationObserver((()=>{this.isPossibleFormPage()&&(chrome.runtime.sendMessage({command:"FORM_PRE_CHECK_PASSED"}),e.disconnect())})),s={childList:!0,subtree:!0};e.observe(document,s)}else setTimeout((()=>{this.isPossibleFormPage()&&chrome.runtime.sendMessage({command:"FORM_PRE_CHECK_PASSED"})}),1e3)}}).main()})();
//# sourceMappingURL=../sourceMap/chrome/scripts/iframe_form_check.js.map