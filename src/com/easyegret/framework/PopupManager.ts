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

        private static _mask:egret.Shape = null;//遮罩

        /**
         * 弹出win显示
         * @param clz
         */
        public static show(clz:any):any {
            var key:string = egret.getQualifiedClassName(clz);
            console.log("Win change clz=" + key);
            var winInstance:Win = null;
            if (PopupManager._instanceDict.hasOwnProperty(key)){
                winInstance = PopupManager._instanceDict[key];
            } else {
                winInstance = new clz();
                PopupManager._instanceDict[key] = winInstance;//映射缓存
            }

            if (PopupManager._mask == null) {
                PopupManager._mask = new egret.Shape();
                PopupManager._mask.touchEnabled = false;
                PopupManager._mask.graphics.beginFill(0x000000, 0.5);
                PopupManager._mask.graphics.drawRect(0, 0, GlobalSetting.STAGE_WIDTH, GlobalSetting.STAGE_HEIGHT);
                PopupManager._mask.graphics.endFill();
            }
            ViewManager.currentView.addChild(PopupManager._mask);
            if (winInstance) {
                ViewManager.currentView.addChild(winInstance);
                winInstance.x = ViewManager.currentView.cx - winInstance.cx;
                winInstance.y = ViewManager.currentView.cy - winInstance.cy;
                winInstance.enter();
                return winInstance;
            }
            return null;
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
            }
            if (PopupManager._mask && PopupManager._mask.parent) PopupManager._mask.parent.removeChild(PopupManager._mask);
        }

        private static onEventMask(event:egret.TouchEvent){
            event.stopImmediatePropagation();
            event.stopPropagation();
        }
    }
}
