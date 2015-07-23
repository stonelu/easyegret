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
    export class ResManager {
        //---- for project texture manager---
        private static _isInit:boolean = false;//是否已初始化
        private static _canSplite:boolean = false;//是否可以切割
        private static _projectGroup:string = "";
        private static _projectName:string = "";
        private static _projectNameSprite:Array<string> = [];
        private static _spriteSheet:egret.SpriteSheet = null;

        //--- for Dynamic loaded texture manager ----
        private static _urlDataDict:Object = {};
        private static _urlDownloading:Array<string> = [];//已进入下载的url

        /**
         * 获取Texture材质
         */
        public static getTexture(name:string):egret.Texture {
            //判断是项目公用素材,还是独立下载资源
            if (!this._isInit && ResManager._canSplite){
                ResManager.spliteSpriteSheet();
            }
            if (ResManager._projectNameSprite.indexOf(name) >= 0){//项目公用的材质
                if (!this._isInit){
                    return null;
                }
                return ResManager._spriteSheet.getTexture(name);
            } else {//动态下载的资源
                return ResManager.getRes(name);
            }
            return null;
        }

        /**
         * 非材质或者材质,请通过这个方法获取
         * 内容请自行解析
         */
        public static getRes(name:string):any {
            if (ResManager._urlDataDict[name]) {
                return ResManager._urlDataDict[name];
            } else if (ResManager._urlDownloading.indexOf(name) < 0){//启动下载
                ResManager._urlDownloading.push(name);
                RES.getResByUrl(name, ResManager.onloadedCompleteDynamicTexture, this);
            }
            return null;
        }

        /**
         * 动态加载的数据完成
         * @param data
         * @param url
         */
        private static onloadedCompleteDynamicTexture(data, url){
            //console.log("loaded.url=" + url);
            //console.log("loaded.data=" + RES.getRes(url));
            if (data){
                if (ResManager._urlDownloading.indexOf(url) >= 0)ResManager._urlDownloading.splice(ResManager._urlDownloading.indexOf(url),1);
                ResManager._urlDataDict[url] = data;
                var myEvent:MyEvent = MyEvent.getEvent(EventType.RESOURCE_DOWNLOADED);
                myEvent.addItem("url", url);
                myEvent.addItem("data", data);
                myEvent.send();
            }
        }

        /**
         * 初始化加载报表信息
         */
        public static loadResFile(projectName:string):void {
            ResManager._projectName = projectName;
            ResManager._projectGroup = projectName + "_common";

            //初始化Resource资源加载库
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,ResManager.onLoadingConfigComplet,this);
            RES.loadConfig("resource/assets/ui/" + ResManager._projectName + "/" + ResManager._projectGroup + "_loader.json","resource/");
        }

        /**
         * loading配置文件的加载
         * @param event
         */
        private static onLoadingConfigComplet(event:RES.ResourceEvent):void{
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, ResManager.onLoadingConfigComplet,this);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, ResManager.onLoadingGroupJosnFileComplete,this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, ResManager.onLoadingGroupJosnFileError, this);
            RES.loadGroup(ResManager._projectGroup + "_group");
        }

        /**
         * 加载失败
         * @param event
         */
        private static onLoadingGroupJosnFileError(event:RES.ResourceEvent):void {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, ResManager.onLoadingGroupJosnFileComplete, ResManager);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, ResManager.onLoadingGroupJosnFileError, ResManager)
        }
        /**
         * loading配置文件的Group加载完成
         * @param event
         */
        private static onLoadingGroupJosnFileComplete(event:RES.ResourceEvent):void{
            if(event.groupName == ResManager._projectGroup + "_group"){
                //console.log("ResManager init!!")
                ResManager._canSplite = true;
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, ResManager.onLoadingGroupJosnFileComplete, ResManager);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, ResManager.onLoadingGroupJosnFileError, ResManager)
            }
        }
        /**
         * 切割材质
         */
        private static spliteSpriteSheet():void {
            if (!ResManager._isInit && ResManager._canSplite) {
                ResManager._isInit = true;
                var jsonData:any = RES.getRes(ResManager._projectGroup + "_json");
                if (jsonData) {
                    ResManager._spriteSheet = new egret.SpriteSheet(RES.getRes(ResManager._projectGroup + "_img"));
                    for (var key in jsonData.texture) {
                        ResManager._projectNameSprite.push(key);
                        ResManager._spriteSheet.createTexture(key, jsonData.texture[key].x, jsonData.texture[key].y, jsonData.texture[key].w, jsonData.texture[key].h);
                    }
                }
            }
        }
    }
}