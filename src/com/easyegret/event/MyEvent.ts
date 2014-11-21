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
    export class MyEvent {
        public callStack:string = null;
        public type:string = null;
        public datas:Object = {};

        /**
         * <p>事件基类构造函数,包含一个参数</p>
         * @param type 事件类型
         */
        public constructor(typeValue:string) {
            this.type = typeValue;
        }

        /**
         *  <p>添加单个对象到结果集中</p>
         *  @param value 要添加的对象
         */
        public setItem(proprty:string, value:any):void {
            this.datas[proprty] = value;
        }

        public addItem(proprty:string, value:any):void {
            this.setItem(proprty, value);
        }

        public getItem(proprty:string):any {
            if (this.datas.hasOwnProperty(proprty)) return this.datas[proprty];
            return null;
        }

        public hasItem(proprty:string):any {
            return this.datas.hasOwnProperty(proprty);
        }

        public release():void {
            this.callStack = null;
            for (var item in this.datas) {
                delete this.datas[item];
            }
        }

        public send():void {
            easy.EventManager.dispatchEvent(this);
        }

        public static getEvent(type:string):MyEvent {
            return easy.EventManager.getEvent(type);
        }

        public static sendEvent(type:string):void {
            easy.EventManager.dispatch(type);
        }
    }
}