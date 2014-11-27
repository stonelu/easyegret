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
         * 如果没有对应的的类型在此出现,则改Handle对Event事件到此为止,不再派发,防止造成事件死循环
         * @param type MyEvent事件的类型
         * @param func  对应的call back function,不包含onEvent前缀
         */
        public addHandleEvent(type:string, funcName:string):void {
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

        public receivePacket(packet:Packet):void {
            if (this.METHOD_DEF.hasOwnProperty("" + packet.header.messageId))this["onPacket" + this.METHOD_DEF[packet.header.messageId]].call(this, packet);
        }
        public receiveEvent(event:MyEvent):void {
            if (this.METHOD_DEF.hasOwnProperty(event.type)) this["onEvent" + this.METHOD_DEF[event.type]].call(this, event);
        }
        /**
         * 进入的逻辑
         * 可以再次根据外部数据情况做一些逻辑处理
         */
        public enter():void {

        }

        /**
         * 退出的逻辑
         * 做一些数据的销毁或者初始化,保证下次进入的时候,不会残留
         */
        public outer():void {

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
            this.showDefaultSkin = false;
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
    }
}