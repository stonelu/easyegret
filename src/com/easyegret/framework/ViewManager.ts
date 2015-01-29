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
     * 这个类是作为view页面转换的主入口类
     * view类是比较大的开销,不同的view互相切换显示,复用率非常的高
     */
    export class ViewManager {
        private static _instanceDict:Object = {};//view对象的缓存字典
        public static mainContainer:egret.DisplayObjectContainer = null;//游戏画面容器
        public static currentView:View = null;//当前显示的view
        public static _waitChangeView:View = null;//等待进入的view对象

        /**
         * 切换view显示
         * @param clz
         */
        public static change(clz:any):void {
            if (ViewManager.mainContainer == null){
                ViewManager.mainContainer = new egret.DisplayObjectContainer();
                GlobalSetting.STAGE.addChild(ViewManager.mainContainer);
                ViewManager.mainContainer.x = GlobalSetting.STAGE_WIDTH/2;
                ViewManager.mainContainer.y = GlobalSetting.STAGE_HEIGHT/2;
            }

            var key:string = egret.getQualifiedClassName(clz);
            //console.log("View change clz=" + key);
            if (ViewManager._instanceDict.hasOwnProperty(key)){
                ViewManager._waitChangeView = ViewManager._instanceDict[key];
            } else {
                ViewManager._waitChangeView = new clz();
                ViewManager._instanceDict[key] = ViewManager._waitChangeView;//映射缓存
            }
            if (ViewManager._waitChangeView == ViewManager.currentView){
                ViewManager._waitChangeView = null;
                console.log("相同的View change clz=" + key);
                return;
            }
            //检测素材资源是否准备完成,没完成则等待进入
            //console.log("ViewManager wait.view=" + ViewManager._waitChangeView);
            if (ViewManager._waitChangeView){//未保证view创建子元素,首先要加入场景中触发创建
                ViewManager._waitChangeView.visible = false;
                ViewManager.mainContainer.addChildAt(ViewManager._waitChangeView, 0);
            }
            if (ViewManager._waitChangeView &&ViewManager._waitChangeView.checkResReady()) {
                //检测完成情况,未完成会自动启动loading,已经完成,直接enter
                ViewManager.waitViewDoEnter();
                //未完成下载,则等待Loading回调ViewManager.waitViewDoEnter()方法,完成加载
            }
        }

        /**
         * 等待进入的view已经准备完毕,开始enter
         */
        public static waitViewDoEnter():void {
            //console.log("@@ViewManager waitViewDoEnter view=" + egret.getQualifiedClassName(ViewManager._waitChangeView));
            //if (ViewManager.currentView){
            //    //console.log("@@ViewManager 000 waitViewDoEnter")
            //    ViewManager.currentView.outer();
            //}
            if (ViewManager._waitChangeView) {
                ViewManager._waitChangeView.removeFromParent();
                //新的view
                if (!ViewManager._waitChangeView._uiResReady) ViewManager._waitChangeView._uiResReady = true;//ui的res已经准备完成,下次不需要download了
                ViewManager._waitChangeView.removeFromParent();
                ViewManager.mainContainer.addChild(ViewManager._waitChangeView);
                ViewManager._waitChangeView.visible = true;
                ViewManager._waitChangeView.anchorX = 0.5
                ViewManager._waitChangeView.anchorY = 0.5
                ViewManager._waitChangeView.enter();
                //console.log("@@ViewManager 111 waitViewDoEnter")
            }
        }

        /**
         * 把当前接收到的协议转发到当前显示的view,以便view做刷新
         * @param packet
         */
        public static receivePacket(packet:Packet):void {
            //view层派发
            ViewManager.currentView.receivePacket(packet);
            //弹出窗口派发
            for (var i = 0; i < PopupManager.CURRENT_SHOW.length; i++){//win界面派发
                PopupManager.CURRENT_SHOW[i].receivePacket(packet);
            }
        }

        /**
         * 把当前接收到的event事件转发到当前显示的view,以便view做刷新
         * @param event
         */
        public static receiveEvent(event:MyEvent):void {
            //view层派发
            ViewManager.currentView.receiveEvent(event);
            //弹出窗口派发
            for (var i = 0; i < PopupManager.CURRENT_SHOW.length; i++){//win界面派发
                PopupManager.CURRENT_SHOW[i].receiveEvent(event);
            }
        }
    }
}
