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
     * 一个文字提示显示
     */
    export class MessageTips extends BaseGroup {
        private static _instance:MessageTips = null;//
        private _dulation:number = 30;//停留时间
        private _mssageArr:Array<any> = [];//消息内容

        private _labelArr:Array<ui.Label> = [];//当前正在显示的label

        private _showNext:boolean = false;//可以显示下一条

        public constructor() {
            super();
        }
        public static getInstance():MessageTips{
            if (MessageTips._instance == null) MessageTips._instance = new component.MessageTips();
            return MessageTips._instance;
        }

        /**
         * 显示弹出的文字内容
         * @param msg
         */
        public static showMessage(msg:string):void {
            MessageTips.getInstance().showMsg(msg);
        }

        /**
         * 显示message提示信息
         * @param msg
         * @param color
         */
        public showMsg(msg:string, color:number = 0xfff666, x:number = 65535, y:number= 65535):void {
            HeartBeat.addListener(this, this.onHeartBeat);
            if (this._labelArr.length == 0) this._showNext = true;
            this._mssageArr.push({msg:msg, color:color, x:x, y:y});
        }
        /**
         * 呼吸计算位移
         */
        private onHeartBeat():void {
            if (this._labelArr.length == 0 && this._mssageArr.length == 0) {
                HeartBeat.removeListener(this, this.onHeartBeat);
                return;
            }
            var label:ui.Label = null;
            if(this._showNext && this._mssageArr.length > 0){//新文字,加入上浮
                var item:Object = this._mssageArr.shift();
                label =ObjectPool.getByClass(ui.Label);//从缓存中拿一个label
                label.text = item["msg"];
                label.color = item["color"];
                label._alpha = 0;
                label.fontSize = 38;
                label.stroke = 1;
                label.autoSize = true;
                label.setData(0);//计数停留时间帧
                label.strokeColor = 0x000000;
                framework.ViewManager.currentView.addChild(label);
                label.getTextField()._setTextDirty();
                label.draw();
                if (item["x"] == 65535){
                    label._x = GlobalSetting.STAGE_WIDTH/2 - label.cx;
                } else {
                    label._x = item["x"];
                }
                if (item["y"] == 65535){
                    label._y = GlobalSetting.STAGE_HEIGHT/2;
                } else {
                    label._y = item["y"];
                }
                this._labelArr.push(label);
                //console.log("x=" + label._x + ", y=" + label._y + ", ix=" + item["x"] + ",iy=" + item["y"])
            }
            for (var i = 0; i< this._labelArr.length; i++){
                label = this._labelArr[i];
                if (label._y ==  framework.ViewManager.currentView.cy/2 && label.getData() < this._dulation) {//停留
                    label.setData(label.getData() + 1);
                } else {
                    if (label.getData() < this._dulation) {
                        label._y -= 3;
                        label._alpha += 0.1;
                    } else {
                        label._y -= 5;
                        label._alpha -= 0.1;
                    }
                }
                if (label._y < 0){//回收
                    this._labelArr.splice(i,1);
                    label.removeFromParent();
                    ObjectPool.recycleClass(label);
                }
                if (i == (this._labelArr.length - 1) && (framework.ViewManager.currentView.cy - this._labelArr[i]._y) > 5){
                    this._showNext = true;
                }
            }

        }
    }
}