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
     * view和win的基本类
     * 定义了接收协议packet和event的能力,方便在已经展示的时候,通过packet和event的事件进行驱动刷新显示
     */
    export class ReceiveGroup extends Group {
        /**
         * 消息和方法的映射关系表
         */
        private METHOD_DEF:Object = {};
        /**
         * 对应的ui展现
         */
        public _ui:egret.DisplayObject = null;
        /**
         * ui资源已准备好
         * @type {boolean}
         * @private
         */
        public _uiResReady:boolean = false;
        /**
         * loding的class对象
         * view是LoadingViewUI类
         * win是LoadingWinUI类
         * 这两个值分别在view和win子类中默认赋值
         */
        public _loadingUIClz:any = null;

        public enterCompleted:boolean = false;//进入状态是否完成
        /**
         * 进入的效果
         */
        private _enterEffect:IEffect = null;

        public constructor() {
            super();
            this.initWeekListener();
        }
        /**
         * 初始化弱监听方法,以便分发协议数据包用
         * 不在监听列表的数据包,将被自动过滤掉
         */
        public initWeekListener():void {
        }
        /**
         * 添加事件的处理
         * 注意:必须调用MessageControler.addEvent()注册事件名称,否者不会转发到这里
         * 如果没有对应的的类型在此出现,则改Handle对Event事件到此为止,不再派发,防止造成事件死循环
         * @param type MyEvent事件的类型
         * @param func  对应的call back function,不包含onEvent前缀
         */
        public addHandleEvent(type:string, funcName:string):void {
            //console.log("ReceiveGroup this=" + egret.getQualifiedClassName(this) + ", addHandleEvent=" + type + ", funcName=" + funcName);
            easy.MessageControler.addEvent(type)
            this.METHOD_DEF[type] = funcName;
        }

        /**
         * 添加协议处理的Handle,注意,functName的名称,前缀onPacket不包含
         * @param msgId packet协议号
         * @param func  对应的call back function,不包含onPacket前缀
         */
        public addHandlePacket(msgId:number, funcName:string):void {
            this.METHOD_DEF["" + msgId] = funcName;
        }

        /**
         * 收到弱协议通知
         * @param packet
         */
        public receivePacket(packet:Packet):void {
            if (this.METHOD_DEF["" + packet.header.messageId])this["onPacket" + this.METHOD_DEF[packet.header.messageId]].call(this, packet);
        }

        /**
         * 收到界面弱事件通知
         * @param event
         */
        public receiveEvent(event:MyEvent):void {
            //console.log("ReceiveGroup this=" + egret.getQualifiedClassName(this) + ", receiveEvent=" + event.type + ", isHas=" + this.METHOD_DEF[event.type]);
            if (this.METHOD_DEF[event.type]) this["onEvent" + this.METHOD_DEF[event.type]].call(this, event);
        }
        /**
         * 初始化主场景的组件
         * 这个方法在对象new的时候就调用,因为有些ui必须在加入stage之前就准备好
         * 子类覆写该方法,添加UI逻辑
         */
        public createChildren():void {
            super.createChildren();
            this.touchEnabled = true;//默认不接受事件
            this.showBg = false;
        }
        /**
         * 进入的逻辑
         * 可以再次根据外部数据情况做一些逻辑处理
         */
        public enter():void {
            //console.log("@@enter=" + egret.getQualifiedClassName(this))
            if (this._ui){
                //检测模板的enter
                for (var prop in this._ui){
                    if (this._ui[prop] instanceof Template && this._ui[prop] != this){
                        this._ui[prop].enter();
                    }
                }
            }
            this.enterTransition();
        }

        /**
         * enter的过渡效果
         */
        public enterTransition():void {
            //console.log("@@enterTransition=" + egret.getQualifiedClassName(this))
            this.enterCompleted = false;
            if (this._enterEffect){
                this._enterEffect.play();
            } else {
                this.enterTransitionComplete();
            }
        }

        /**
         * enter的过渡效果结束
         */
        public enterTransitionComplete():void {
            //console.log("@@enterTransitionComplete=" + egret.getQualifiedClassName(this))
        }

        /**
         * 退出的逻辑
         * 做一些数据的销毁或者初始化,保证下次进入的时候,不会残留
         */
        public outer():void {
            //console.log("@@outer=" + egret.getQualifiedClassName(this))
            if (this._ui){
                //检测模板的enter
                for (var prop in this._ui){
                    if (this._ui[prop] instanceof Template && this._ui[prop] != this){
                        this._ui[prop].outer();
                    }
                }
            }
            this.outerTransition();
        }
        /**
         * outer的过渡效果
         */
        public outerTransition():void {
            //console.log("@@outerTransition=" + egret.getQualifiedClassName(this))
        }
        /**
         * outer的过渡效果结束
         */
        public outerTransitionComplete():void {
            //console.log("@@outerTransitionComplete=" + egret.getQualifiedClassName(this))
            this.removeFromParent();
        }
        /**
         * 获取ui层的显示对象
         * @returns {egret.Sprite}
         */
        public getUI():any {
            return this._ui;
        }
        /**
         * 设置ui层的显示对象
         * @param myui
         */
        public setUI(myui:egret.DisplayObject) {
            this._ui = myui;
            //console.log("!!!view set ui!! 000 this._ui=" + egret.getQualifiedClassName(this._ui));
            if (this._ui) {
                this.addChild(this._ui);
                this.setSize(this._ui.width, this._ui.height);
                //console.log("!!!view set ui!! 1111 this._ui=" + egret.getQualifiedClassName(this._ui));
            }
            this.showBg = false;
        }
        /**
         * 做ui的销毁
         * 一般情况下,需要手动调用销毁
         */
        public destroy():void {
            if (this._ui){
                //if (this._ui.hasOwnProperty("destroy"))this._ui.destroy();
                this._ui = null;
            }
        }
        /**
         * 检测资源是否完成
         * @returns {boolean}
         */
        public checkResReady():boolean {
            //检测ui的情况,自动启动loading加载
            //console.log("checkResReady 000 this._ui=" + this._ui + ", resSpriteSheet=" + this._ui.hasOwnProperty("resSpriteSheet") + ", resFiles=" + this._ui.hasOwnProperty("resFiles"))
            //console.log("checkResReady 000 this._ui=" + this._ui)
            if (!this._uiResReady && this._ui && this._ui.hasOwnProperty("resSpriteSheet") && this._ui.hasOwnProperty("resFiles")){
                //console.log("checkResReady 1111")
                if (this._loadingUIClz) {
                    //console.log("checkResReady 2222")
                    var loading:LoadingBaseUI = ObjectPool.getByClass(this._loadingUIClz, false);
                    loading.enter();
                } else {
                    //console.log("checkResReady 3333")
                    //没有对应的loading,为避免一直加载不进去,这里直接return true
                    return true;
                }
                //console.log("checkResReady 4444")
                return false;
            }
            return true;
        }
        /**
         * 首次材质下载完成会调用加载一次,刷新UI皮肤显示
         * 使用了框架的UI机制,单ui的资源下载完成会调用改方法刷新
         * 若view中有逻辑使用到ui的素材,应该在这里做素材的赋值
         */
        public validateNow():void{
            if (this._ui && this._ui["validateNow"]) this._ui["validateNow"]();
        }
    }
}