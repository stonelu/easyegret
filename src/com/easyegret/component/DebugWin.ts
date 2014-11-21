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
     * view的基本类
     * 所有的ui组件都应该放置在ui层中
     * 在view中只处理view相关的逻辑,对ui成层的组件进行操作
     */
    export class DebugWin extends Win {
        //操作按钮容器
        private _bottomContainer:Group = null;
        //顶部信息容器
        private _topContainer:Group = null;
        private _labelTitle:Label = null;

        //内容显示
        private _textInfo:egret.TextField = null;
        //关闭按钮
        private _btnClose:Button = null;
        //刷新按钮
        private _btnRefresh:Button = null;
        /**
         * view成对应的ui展现
         * @type {null}
         * @private
         */

        public constructor() {
            super();
        }
        /**
         * 初始化ui数据
         * 这个方法在对象new的时候就调用,因为有些ui必须在加入stage之前就准备好
         */
        public createChildren():void{
            super.createChildren();
            //窗口宽高
            this.width = 300;
            this.height = 400;
            //顶部信息设置
            this._topContainer = new Group();
            this._topContainer.height = 15;
            this._topContainer.width = this.width;
            this._topContainer.y = 0;
            this.addChild(this._topContainer);

            this._labelTitle = new Label();
            this._labelTitle.text = "Debug窗口";
            this._topContainer.addChild(this._labelTitle);

            //底部按钮设置
            //按钮容器
            this._bottomContainer = new Group();
            this._bottomContainer.height = 30;
            this._bottomContainer.width = this.width;
            this._bottomContainer.y = this.height - this._bottomContainer.height;
            this.addChild(this._bottomContainer);
            //刷新按钮
            this._btnRefresh = new Button();
            this._btnRefresh.label = "刷新";
            this._btnRefresh.setSize(50, 25);
            this._btnRefresh.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRegresh, this);
            this._bottomContainer.addChild(this._btnRefresh);

            //关闭按钮
            this._btnClose = new Button();
            this._btnClose.x = this._btnRefresh.width + 2;
            this._btnClose.label = "关闭";
            this._btnClose.setSize(50, 25);
            this._bottomContainer.addChild(this._btnClose);
            this._btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchClose, this);

            //内容显示设置
            this._textInfo = new egret.TextField();
            this._textInfo.multiline = true;
            this._textInfo.textColor = 0x000000;
            this._textInfo.size = 12;
            this._textInfo.lineSpacing = 6;
            this._textInfo.x = 1;
            this._textInfo.y = this._topContainer.height + 1;
            this._textInfo.width = this.width;
            this._textInfo.height = this.height - this._topContainer.height - this._bottomContainer.height - 2;
            this.addChild(this._textInfo);

        }

        /**
         * 刷新内容事件
         * @param event
         */
        private onTouchRegresh(event:egret.TouchEvent):void {
            this._textInfo.text = Logger.log;
        }
        /**
         * 关闭窗口事件
         * @param event
         */
        private onTouchClose(event:egret.TouchEvent):void {
            DebugWin.hidden();
        }


        //单例调用
        private static _instance:DebugWin = null;

        /**
         * 显示
         */
        public static show():void {
            if (DebugWin._instance == null) {
                DebugWin._instance = new DebugWin();
            }
            GlobalSetting.STAGE.addChild(DebugWin._instance);
        }

        /**
         * 隐藏
         */
        public static hidden():void {
            if (DebugWin._instance && DebugWin._instance.parent) {
                DebugWin._instance.parent.removeChild(this._instance);
            }
        }
    }
}