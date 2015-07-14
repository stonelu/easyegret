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
    export class MovieClip extends Group {
        private _imgDisplay:egret.Bitmap = null;
        //序列帧播放间隔时长
        private _fps:number = 1;
        private _textures:Array<egret.Texture> = null;
        //当前播放帧的下标
        private _numFrameIndex:number = 0;
        //播放计数
        private _numFrammeCount:number = 0;
        //是否在播放
        private _isPlaying:boolean = false;
        //是否循环播放
        private _loop:boolean = false;
        //声音播放
        private _soundName:string = null;
        private _sound:egret.Sound = null;
        //使用animate data的情况
        private _animateName:string = null;
        private _animateData:AnimateData = null;
        //播放结束回调
        private _callThisArg:any = null;
        private _callFunc:Function = null;
        private _autoDestory:boolean = false;//停止的时候,自动销毁
        public constructor(drawDelay:boolean = false) {
            super(drawDelay);
        }
        /**
         * 初始化主场景的组件
         * 这个方法在对象new的时候就调用,因为有些ui必须在加入stage之前就准备好
         * 子类覆写该方法,添加UI逻辑
         */
        public createChildren():void {
            super.createChildren();
            this._imgDisplay = new egret.Bitmap();
            this.addChild(this._imgDisplay);
            this.showBg = false;
        }

        /**
         * 从指定帧开始播放
         * @param fps 帧间隔时间
         * @param frame  从第几帧开始播放
         */
        public play(fps:number = 0, frame:number = 0):void {
            if (!easy.StringUtil.isUsage(this._animateName) && !this._textures) return;
            if (fps > 0 ) this._fps = fps;
            this._numFrameIndex = frame;
            if (easy.StringUtil.isUsage(this._animateName) || this._textures.length > 1) {
                this.onChangeTexture();//先响应,防止延迟
                HeartBeat.addListener(this, this.onChangeTexture, 1);
            } else {
                this._imgDisplay.texture = this._textures[0];
            }
            //this._numFrammeCount = 0;
            this._isPlaying = true;
            this.onPlaySound();
        }

        /**
         * 暂停播放
         */
        public pause():void {
            this._isPlaying = false;
            HeartBeat.removeListener(this, this.onChangeTexture);
            if (this._sound) this._sound.pause();
        }

        /**
         *停止播放
         */
        public stop():void {
            this._isPlaying = false;
            this._numFrameIndex = 0;
            this._numFrammeCount = 0;
            HeartBeat.removeListener(this, this.onChangeTexture);
            if (this._sound) this._sound.pause();
            if (this._callFunc) this._callFunc.call(this._callThisArg, this);
            if (this._autoDestory) this.destory();
            //console.log("movie.stop=" + this._animateName);
        }

        /**
         * 重新播放
         */
        public replay():void {
            if (!easy.StringUtil.isUsage(this._animateName) && !this._textures) return;
            this._isPlaying = true;
            if (easy.StringUtil.isUsage(this._animateName) || this._textures.length > 1) {
                HeartBeat.addListener(this, this.onChangeTexture, 1);
            } else {
                this._imgDisplay.texture = this._textures[0];
            }
            if (this._sound) this._sound.play(this._loop);
        }

        /**
         * 销毁数据
         */
        public destory():void {
            this._isPlaying = false;
            this._numFrameIndex = 0;
            this._numFrammeCount = 0;
            HeartBeat.removeListener(this, this.onChangeTexture);
            if (this._sound) this._sound.pause();
            this.removeFromParent();
            this._sound = null;
            this._textures = null;
            this._animateData = null;
            this._animateName = null;
            this._callFunc = null;
            this._callThisArg = null;
            this.anchorX = 0;
            this.anchorY = 0;
            this.anchorOffsetX = 0;
            this.anchorOffsetY = 0;
            this.verticalEnabled = false;
            this.horizontalEnabled = false;
            if (this._imgDisplay)this._imgDisplay.texture = null;
        }
        /**
         * 设置播放的材质集合
         * @param value
         */
        public set textures(value:Array<egret.Texture>){
            this._textures = value;
        }
        public get textures():Array<egret.Texture> {
            return this._textures;
        }

        /**
         * 通过设置animate动画数据的名称来设置数据
         * @param name
         */
        public set animateName(name:string) {
            this._animateName = name;
            this.animateData = null;
        }

        /**
         * 设置animate动画数据
         * @param item
         */
        public set animateData(item:AnimateData) {
            this._animateData = item;
            if (this._animateData) {
                this._animateName = item.id;
                this._fps = this._animateData.frame;
                this.setSize(this._animateData.width, this._animateData.height);
            }
        }
        public get animateData():AnimateData {
            return this._animateData;
        }

        /**
         * 设置播放的声音名称
         * @param value
         */
        public set sound(value:string){
            this._soundName = value;
        }
        public get sound():string {
            return this._soundName;
        }
        /**
         * 设置播放的帧频间隔
         * @param value
         */
        public set fps(value:number){
            this._fps = value;
        }
        public get fps():number {
            return this._fps;
        }
        /**
         * 设置播放是否循环
         * @param value
         */
        public set loop(value:boolean){
            this._loop = value;
        }
        public get loop():boolean {
            return this._loop;
        }
        /**
         * 设置stop结束回调
         * @param thisArg func对象
         * @param value func方法
         */
        public setCallFunc(thisArg:any, value:Function){
            this._callThisArg = thisArg;
            this._callFunc = value;
        }
        /**
         * 变更材质
         */
        private onChangeTexture():void {
            if (!this.parent) {
                this.stop();
                return;
            }
            if (!this._imgDisplay) return;
            this._numFrammeCount ++;
            if (this._numFrammeCount >= this._fps) {
                this._numFrammeCount = 0;
            } else {
                return;
            }
            if (this._textures){
                this._imgDisplay.texture = this._textures[this._numFrameIndex];
                this._imgDisplay.x = this.cx - this._imgDisplay.width/2;
                this._imgDisplay.y = this.cy - this._imgDisplay.height/2;
                this._numFrameIndex ++;
                if (this._numFrameIndex >= this._textures.length){
                    if (!this._loop){
                        this.stop();
                        return;
                    }
                    this._numFrameIndex = 0;
                }
            } else {//animate data的情况
                if (this._animateData == null && StringUtil.isUsage(this._animateName)){//确保延迟加载的情况下,尽可能快的获取到动画数据
                    this.animateData = AnimateManager.getAnimateData(this._animateName);
                    //console.log("animateData=" + this.animateData)
                    if (this.animateData) {
                        this.setSize(this.animateData.width, this.animateData.height);
                    }
                }
                if (this._animateData && this._animateData.textures && this._imgDisplay) {
                    var animateTexture:AnimateTexture = this._animateData.getTexture(this._numFrameIndex);
                    //console.log("id=" + animateTexture.id)
                    this._fps = animateTexture.frame;
                    //this._imgDisplay.setSize(animateTexture.width, animateTexture.height);
                    this._imgDisplay.x = this.cx + animateTexture.x;
                    this._imgDisplay.y = this.cy + animateTexture.y;
                    this._imgDisplay.texture = animateTexture.texutre;
                    this._numFrameIndex++;
                    if (this._numFrameIndex >= this._animateData.textures.length) {
                        if (!this._loop) {
                            this.stop();
                            return;
                        }
                        this._numFrameIndex = 0;
                    }
                    if (this._animateData.textures.length == 1){//不需要变换,停止呼吸变换
                        HeartBeat.removeListener(this, this.onChangeTexture);
                    }
                }
            }
        }
        /**
         * 初始化声音对象,并播放声音
         */
        private onPlaySound():void {
            if (!GlobalSetting.VOLUME_OPEN) return;
            if (this._sound == null && easy.StringUtil.isUsage(this._soundName)) {
                this._sound = RES.getRes(this._soundName);
            }
            if (this._sound){
                this._sound.play(this._loop);
            }
        }

        /**
         * 查询当前时候在播放
         * @returns {boolean}
         */
        public get isPlaying():boolean {
            return this._isPlaying;
        }

        /**
         * 当前播放的帧数
         * @returns {number}
         */
        public get currentFrame():number {
            return this._numFrameIndex;
        }
        /**
         * 总的帧数
         * @returns {number}
         */
        public get totalFrame():number {
            if (this._textures) return this._textures.length;
            return 0;
        }
        /**
         * 停止播放的时候,自动销毁
         * @param value
         */
        public set autoDestory(value:boolean){
            this._autoDestory = value;
        }
        public get autoDestory():boolean {
            return this._autoDestory;
        }
    }
}