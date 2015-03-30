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
    export class MovieClip extends BaseGroup {
        private _imgDisplay:Image = null;
        //序列帧播放间隔时长
        private _fps:number = 1;
        private _textures:Array<egret.Texture> = null;
        //当前播放帧的下标
        private _numFrameIndex:number = 0;
        //播放计数
        //private _numFrammeCount:number = 0;
        //是否在播放
        private _isPlaying:boolean = false;
        //是否循环播放
        private _loop:boolean = false;
        //声音播放
        private _soundName:string = null;
        private _sound:egret.Sound = null;
        public constructor() {
            super();
        }
        /**
         * 初始化主场景的组件
         * 这个方法在对象new的时候就调用,因为有些ui必须在加入stage之前就准备好
         * 子类覆写该方法,添加UI逻辑
         */
        public createChildren():void {
            super.createChildren();
            this._imgDisplay = new easy.Image();
            this.addChild(this._imgDisplay);
            this._imgDisplay.autoSize = false;
        }

        /**
         * 从指定帧开始播放
         * @param fps 帧间隔时间
         * @param frame  从第几帧开始播放
         */
        public play(fps:number = 0, frame:number = 0):void {
            if (fps > 0 ) this._fps = fps;
            this._numFrameIndex = frame;
            //this._numFrammeCount = 0;
            HeartBeat.addListener(this, this.onChangeTexture, this._fps);
            this._isPlaying = true;
            this.onPlaySound();
        }
        public pause():void {
            this._isPlaying = false;
            HeartBeat.removeListener(this, this.onChangeTexture);
            if (this._sound) this._sound.pause();
        }
        public stop():void {
            this._isPlaying = false;
            this._numFrameIndex = 0;
            //this._numFrammeCount = 0;
            HeartBeat.removeListener(this, this.onChangeTexture);
            if (this._sound) this._sound.pause();
        }
        public replay():void {
            this._isPlaying = true;
            HeartBeat.addListener(this, this.onChangeTexture, this._fps);
            if (this._sound) this._sound.play(this._loop);
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
         * 变更材质
         */
        private onChangeTexture():void {
            if (!this.parent) {
                this.stop();
                return;
            }
            //this._numFrammeCount ++;
            if (this._textures){
                this._imgDisplay.texture = this._textures[this._numFrameIndex];
                //this._numFrammeCount = 0;
                this._numFrameIndex ++;
                if (this._numFrameIndex >= this._textures.length){
                    if (!this._loop){
                        this.stop();
                        return;
                    }
                    this._numFrameIndex = 0;
                }
            }
        }
        /**
         * 初始化声音对象,并播放声音
         */
        private onPlaySound():void {
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
    }
}