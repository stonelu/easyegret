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
module easy{
    /**
     * 这个类是作为win弹出管理类,控制窗口的资源加载,保证资源加载完成后再显示窗口
     * 集中管理的好处,是可以精确控制置顶和窗口组合显示
     * 可以在这个地方加入窗口的弹出效果和隐藏效果
     */
    export class PopupManager {
        private static _instanceDict:Object = {};//win对象的缓存字典

        public static CURRENT_SHOW:Array<Win> = [];//当前显示的窗口

        public static waitShowWin:Win = null;//等待显示的弹出窗口

        private static _mask:egret.Shape = null;//遮罩
        //private static _mask:Group = null;//遮罩

        /**
         * 弹出win显示
         * @param clz
         */
        public static show(clz:any, data:any = null):any {
            var key:string = egret.getQualifiedClassName(clz);
            console.log("Win change clz=" + key);
            if (GlobalSetting.REPORT_UI) Report.send({"name":key, "type":"win", "action":"show", "data":data}, "/ui");
            if (PopupManager._instanceDict.hasOwnProperty(key)){
                PopupManager.waitShowWin = PopupManager._instanceDict[key];
            } else {
                PopupManager.waitShowWin = new clz();
                PopupManager._instanceDict[key] = PopupManager.waitShowWin;//映射缓存
            }
            if (PopupManager._mask == null) {
                PopupManager._mask = new egret.Shape();
                PopupManager._mask.touchEnabled = false;
                PopupManager._mask.graphics.beginFill(0x000000, 0.4);
                PopupManager._mask.graphics.drawRect(0, 0, GlobalSetting.STAGE_WIDTH, GlobalSetting.STAGE_HEIGHT);
                PopupManager._mask.graphics.endFill();
                ////var shape:egret.Shape = new egret.Shape();
                ////shape.graphics.beginFill(0x000000, 0.5);
                ////shape.graphics.drawRect(0, 0, GlobalSetting.STAGE_WIDTH, GlobalSetting.STAGE_HEIGHT);
                ////shape.graphics.endFill();
                ////shape.width = GlobalSetting.STAGE_WIDTH;
                ////shape.height = GlobalSetting.STAGE_HEIGHT;
                //
                ////var textureMask:egret.RenderTexture = new egret.RenderTexture();
                ////textureMask.drawToTexture(shape);
                ////PopupManager._mask = new egret.Bitmap();
                ////PopupManager._mask.touchEnabled = false;
                ////PopupManager._mask.texture = textureMask;
                ////PopupManager._mask.fillMode = egret.BitmapFillMode.SCALE;
                ////PopupManager._mask.width = GlobalSetting.STAGE_WIDTH;
                ////PopupManager._mask.height = GlobalSetting.STAGE_HEIGHT;
                //
                //PopupManager._mask = new easy.Group();
                //PopupManager._mask.touchChildren = false;
                //PopupManager._mask.touchEnabled = false;
                //PopupManager._mask.width = GlobalSetting.STAGE_WIDTH;
                //PopupManager._mask.height = GlobalSetting.STAGE_HEIGHT;
            }
            ViewManager.mainContainer.touchEnabled = false;
            ViewManager.mainContainer.touchChildren = false;
            GlobalSetting.STAGE.addChild(PopupManager._mask);
            if (PopupManager.waitShowWin){//未保证view创建子元素,首先要加入场景中触发创建
                PopupManager.waitShowWin.data = data;
                PopupManager.waitShowWin.visible = false;
                GlobalSetting.STAGE.addChildAt(PopupManager.waitShowWin, 0);
            }
            if (PopupManager.waitShowWin &&PopupManager.waitShowWin.checkResReady()) {
                //检测完成情况,未完成会自动启动loading,已经完成,直接enter
                PopupManager.waitWinDoEnter();
                //未完成下载,则等待Loading回调ViewManager.waitViewDoEnter()方法,完成加载
                return PopupManager.waitShowWin;
            }
            return null;
        }
        /**
         * 等待显示的win已经准备完毕,开始enter
         */
        public static waitWinDoEnter():void {
            console.log("@@PopupManager waitWinDoEnter win=" + egret.getQualifiedClassName(PopupManager.waitShowWin))
            if (PopupManager.waitShowWin) {
                if (!PopupManager.waitShowWin._uiResReady) PopupManager.waitShowWin._uiResReady = true;//ui的res已经准备完成,下次不需要download了
                PopupManager.waitShowWin.removeFromParent();
                PopupManager.waitShowWin.visible = true;
                //PopupManager.waitShowWin.alpha = 1;
                GlobalSetting.STAGE.addChild(PopupManager.waitShowWin);
                PopupManager.waitShowWin.x = ViewManager.currentView.cx - PopupManager.waitShowWin.cx;
                PopupManager.waitShowWin.y = ViewManager.currentView.cy - PopupManager.waitShowWin.cy;
                PopupManager.waitShowWin.enter();
                PopupManager.CURRENT_SHOW.push(PopupManager.waitShowWin);
                //console.log("@@PopupManager 0000 waitWinDoEnter visible=" + PopupManager.waitShowWin.visible + ", alpha=" + PopupManager.waitShowWin.alpha)

                PopupManager.waitShowWin = null;
            }
        }
        /**
         * 隐藏win显示
         * @param instance
         */
        public static hidden(instance:Object):void {
            var key:string = egret.getQualifiedClassName(instance);
            var winInstance:Win = null;
            if (PopupManager._instanceDict.hasOwnProperty(key)){
                winInstance = PopupManager._instanceDict[key];
            }
            if (winInstance){
                winInstance.outer();
                winInstance.removeFromParent();
                PopupManager.CURRENT_SHOW.splice(PopupManager.CURRENT_SHOW.indexOf(winInstance), 1);
            }
            if (PopupManager._mask && PopupManager._mask.parent) PopupManager._mask.parent.removeChild(PopupManager._mask);
            ViewManager.mainContainer.touchEnabled = true;
            ViewManager.mainContainer.touchChildren = true;
        }

        /**
         * 根据类名,获取窗口实例
         * @param clz
         */
        public static getWinInstance(clz:any):any{
            var key:string = egret.getQualifiedClassName(clz);
            if (PopupManager._instanceDict.hasOwnProperty(key)){
                return PopupManager._instanceDict[key];
            }
            return null;
        }

        private static onEventMask(event:egret.TouchEvent){
            event.stopImmediatePropagation();
            event.stopPropagation();
        }
    }
}
