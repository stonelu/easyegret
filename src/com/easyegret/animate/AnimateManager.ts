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

        private static waiting_groups:Array<string> = [];//等待下载的group列表
        private static waiting_names:Array<string> = [];//等待下载的name列表

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
        /**
         * url加载json data数据到RES中
         */
        public static loadAnimate(name:string):void {
            if (!easy.StringUtil.isUsage(name)) return;
            if (AnimateManager.waiting_groups.indexOf(name) >= 0 || AnimateManager.waiting_names.indexOf(name) >= 0 || RES.isGroupLoaded(name + "_animate_group")) return;
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, AnimateManager.onLoadingConfigComplete, AnimateManager);
            RES.addEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, AnimateManager.onLoadingConfigError, AnimateManager);
            RES.loadConfig("resource/assets/animate/" + name + "_loader.json","resource/");
            if (AnimateManager.waiting_groups.indexOf(name) < 0) AnimateManager.waiting_groups.push(name);
            if (AnimateManager.waiting_names.indexOf(name) < 0) AnimateManager.waiting_names.push(name);
            console.log("animate loading url=" + "resource/assets/animate/" + name + "_loader.json");
            easy.HeartBeat.addListener(AnimateManager, AnimateManager.onHeartBeatCheckLoadedFile, 60);
        }
        /**
         * loading Json文件的加载
         * @param event
         */
        private static onLoadingConfigComplete(event:RES.ResourceEvent):void{
            //console.log("onLoadingConfigComplete event.name=" + event.resItem.name + ", url=" + event.resItem.url)
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, AnimateManager.onLoadingGroupJosnFileComplete, AnimateManager);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, AnimateManager.onLoadingGroupJosnFileError, AnimateManager);
            //console.log("add  load complete!!!")
            for(var i = AnimateManager.waiting_groups.length-1; i >= 0; i--) {
                if (RES.getGroupByName(AnimateManager.waiting_groups[i] + "_animate_group").length > 0 && !RES.isGroupLoaded(AnimateManager.waiting_groups[i] + "_animate_group")){
                    RES.loadGroup(AnimateManager.waiting_groups[i] + "_animate_group");
                    console.log("animate loading group=" + AnimateManager.waiting_groups[i]);
                    AnimateManager.waiting_groups.splice(i,1);
                }
                //if (AnimateManager.waiting_names.indexOf(AnimateManager.waiting_groups[i]) >= 0) {
                //    AnimateManager.waiting_names.splice(AnimateManager.waiting_names.indexOf(AnimateManager.waiting_groups[i]),1);
                //}
            }
        }
        /**
         * loading配置文件的Group加载完成
         * @param event
         */
        private static onLoadingGroupJosnFileComplete(event:RES.ResourceEvent):void{
            console.log("animate load complete!!!=" + event.groupName);
            if (easy.StringUtil.isUsage(event.groupName) && event.groupName.indexOf("_animate_group") >=0) {
                var groupName:string = event.groupName.substring(0, event.groupName.indexOf("_animate_group"));
                if (AnimateManager.waiting_names.indexOf(groupName) >= 0) AnimateManager.waiting_names.splice(AnimateManager.waiting_names.indexOf(groupName),1)
            }
            AnimateManager.onHeartBeatCheckLoadedFile();
        }
        /**
         * 加载失败
         * @param event
         */
        public static onLoadingConfigError(event:RES.ResourceEvent):void {
            console.log("animate load file error=" + event)
            //RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, AnimateManager.onLoadingGroupJosnFileComplete, AnimateManager);
            //RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, AnimateManager.onLoadingGroupJosnFileError, AnimateManager)
        }
        /**
         * 加载失败
         * @param event
         */
        public static onLoadingGroupJosnFileError(event:RES.ResourceEvent):void {
            console.log("animate load group error=" + event)
            //RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, AnimateManager.onLoadingGroupJosnFileComplete, AnimateManager);
            //RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, AnimateManager.onLoadingGroupJosnFileError, AnimateManager)
        }

        /**
         * 检测是否有文件没有下载完成,重新加入下载列表中
         */
        private static onHeartBeatCheckLoadedFile():void {
            if (AnimateManager.waiting_groups.length == 0 && AnimateManager.waiting_names.length == 0) {
                RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, AnimateManager.onLoadingConfigComplete, AnimateManager);
                RES.removeEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR,AnimateManager.onLoadingConfigError, AnimateManager);
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,AnimateManager.onLoadingGroupJosnFileComplete, AnimateManager);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR,AnimateManager.onLoadingGroupJosnFileError, AnimateManager);
                easy.HeartBeat.removeListener(AnimateManager, AnimateManager.onHeartBeatCheckLoadedFile);
            }
            if(AnimateManager.waiting_groups.length > 0 && AnimateManager.waiting_names.length > 0){
                var reloadArr:Array<string> = [];
                for(var i = AnimateManager.waiting_names.length-1; i >= 0; i--) {
                    if (AnimateManager.waiting_groups.indexOf(AnimateManager.waiting_names[i]) >= 0) {
                        reloadArr.push(AnimateManager.waiting_names[i]);
                        AnimateManager.waiting_names.splice(i,1);
                        AnimateManager.waiting_groups.splice(AnimateManager.waiting_groups.indexOf(AnimateManager.waiting_names[i]),1);
                    }
                }
                while(reloadArr.length > 0) {
                    AnimateManager.loadAnimate(reloadArr.pop());
                }
            }
        }
    }
}