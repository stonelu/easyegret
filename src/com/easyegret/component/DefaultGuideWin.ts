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
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
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

    export class DefaultGuideWin extends Win{
        public constructor(){
            super();
        }

        /**
         * 创建对象
         */
        public createChildren():void {
            super.createChildren();
        }

        public get guideItem():GuideItem{
            if (this._data) return this._data;
            return null;
        }
        /**
         * 进入的逻辑
         * 可以再次根据外部数据情况做一些逻辑处理
         */
        public enter():void {
            super.enter();
            if (this._data){
                easy.HeartBeat.addListener(this, this.applyClickModel, 2,1);
            }
        }

        /**
         * 应用点击方式
         */
        public applyClickModel():void {
            if (this._data && this.guideItem.click_stage == 1){//全局点击,触发下一个节点
                GlobalSetting.STAGE.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickStage, this);
            }
        }

        /**
         * 点击舞台动作,播放下一个节点
         * @param event
         */
        private onClickStage(event:egret.TouchEvent):void {
            if (event._currentTarget != GlobalSetting.STAGE) return;
            GlobalSetting.STAGE.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickStage, this);
            if (!GuideManager.playNextItem()) {
                PopupManager.hidden(this);
            }
        }
    }
}