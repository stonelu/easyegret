/**
 * Copyright (c) 2014,www.easyegret.com
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EASYEGRET.COM AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
module easy {
    /**
     * 动画数据
     */
    export class AnimateManager {
        private static _animiateDataDict:any = {};

        /**
         * 获取动画数据
         */
        public static getAnimateData(name:string):AnimateData{
            if (AnimateManager._animiateDataDict[name]) {
                return AnimateManager._animiateDataDict[name];
            }
            if (RES.isGroupLoaded(name + "_animate_group")) {
                AnimateManager._animiateDataDict[name] = new AnimateData(name);
                return AnimateManager._animiateDataDict[name];
            } else {
                AnimateManager.loadAnimate(name);
            }
            return null;
        }

        private static waiting_gtoups:Array<string> = [];//等待下载的group列表
        /**
         * url加载json data数据到RES中
         */
        public static loadAnimate(name:string):void {
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, AnimateManager.onLoadingConfigComplete, AnimateManager);
            RES.loadConfig("resource/assets/animate/" + name + "_loader.json","resource/");
            AnimateManager.waiting_gtoups.push(name + "_animate_group");
        }
        /**
         * loading Json文件的加载
         * @param event
         */
        private static onLoadingConfigComplete(event:RES.ResourceEvent):void{
            //console.log("onLoadingConfigComplete event.name=" + event.resItem.name + ", url=" + event.resItem.url)
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, AnimateManager.onLoadingConfigComplete, AnimateManager);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, AnimateManager.onLoadingGroupJosnFileComplete, AnimateManager);
            //console.log("add  load complete!!!")
            for(var i = AnimateManager.waiting_gtoups.length; i >=0; i--) {
                if (RES.getGroupByName(AnimateManager.waiting_gtoups[i]).length > 0) {
                    RES.loadGroup(AnimateManager.waiting_gtoups[i]);
                    //console.log("loading group=" + AnimateManager.waiting_gtoups[i]);
                    AnimateManager.waiting_gtoups.splice(i,1);
                }
            }
        }
        /**
         * loading配置文件的Group加载完成
         * @param event
         */
        private static onLoadingGroupJosnFileComplete(event:RES.ResourceEvent):void{
            if(AnimateManager.waiting_gtoups.length == 0){
                //console.log("load complete!!!")
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,AnimateManager.onLoadingGroupJosnFileComplete, AnimateManager);
            }
        }
    }
}