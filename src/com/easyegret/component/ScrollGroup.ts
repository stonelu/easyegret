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
     * 卷轴容器
     */
    export class ScrollGroup extends BaseGroup {
        public static SCROLL_UP:string = "up";
        public static SCROLL_DOWN:string = "down";
        public static SCROLL_LEFT:string = "left";
        public static SCROLL_RIGHT:string = "right";

        public static STATE_START:string = "start";
        public static STATE_STOP:string = "stop";


        private _scrollItemArr:Array<ScrollItemGroup> = [];

        /**
         * 是否将子代剪切到视区的边界,
         * 默认为true,剪切.
         */
        private _clip:boolean = false;

        /**
         * 运行状态
         * @type {boolean}
         * @private
         */
        private _runing:boolean = false;

        public constructor(delay:boolean=false) {
            super(delay);
        }

        /**
         * 初始化主场景的组件
         * 这个方法在对象new的时候就调用,因为有些ui必须在加入stage之前就准备好
         * 子类覆写该方法,添加UI逻辑
         */
        public createChildren():void {
            super.createChildren();
            this.clip = true;
        }

        /**
         * 设置卷轴数据
         * @param textures
         * @param speed
         */
        public setScrollData(textures:Array<egret.Texture>, speed:number = 3, direction:string = ScrollGroup.SCROLL_DOWN, width:number = 0, height:number = 0, offset:number = 0):void {
            var item:ScrollItemGroup = ObjectPool.getByClass(ScrollItemGroup);
            this.addChild(item);
            if (direction == ScrollGroup.SCROLL_DOWN || direction == ScrollGroup.SCROLL_UP ){
                item.x = offset;
            } else {
                item.y = offset;
            }
            this._scrollItemArr.push(item);
            item.setScrollData(textures, speed);
            item.direction = direction;
            if (width > 0) {
                item.width = width;
            }
            if (height > 0) {
                item.height = height;
            }
            this.invalidate();
        }

        /**
         * 开始卷轴
         */
        public start(index:number = -1):void {
            this._runing = true;
            this.setItemState(ScrollGroup.STATE_START, index);
            //初始数据
            HeartBeat.addListener(this, this.onHeartBeat);
        }

        /**
         * 停止卷轴
         */
        public stop(index:number = -1):void {
            this.setItemState(ScrollGroup.STATE_STOP, index);
            if (!this._runing)HeartBeat.removeListener(this, this.onHeartBeat);
        }
        /**
         * 暂停卷轴
         */
        public pause(index:number = -1):void {
            this.setItemState(ScrollGroup.STATE_STOP, index);
            if (!this._runing)HeartBeat.removeListener(this, this.onHeartBeat);
        }

        /**
         * 重新卷轴卷轴
         */
        public restart(index:number = -1):void {
            this.setItemState(ScrollGroup.STATE_START, index);
            HeartBeat.addListener(this, this.onHeartBeat);
        }

        /**
         * 设置速度
         */
        public setSpeed(speed:number, index:number = -1):void {
            if (index <= -1) {
                for(var i:number = 0; i < this._scrollItemArr.length; i++){
                    this._scrollItemArr[i].speed = speed;
                }
            } else {
                if (index >= 0 && index <= this._scrollItemArr.length -1){
                    this._scrollItemArr[index].speed = speed;
                }
            }
        }

        /**
         * 设置滚动item的state
         * @param state
         */
        private setItemState(state:string, index:number = -1):void {
            if (index <= -1) {
                for(var i:number = 0; i < this._scrollItemArr.length; i++){
                    this._scrollItemArr[i]._state = state;
                }
            } else if (index >= 0 && index <= this._scrollItemArr.length -1) {
                this._scrollItemArr[index]._state = state;
            }
            if (state == ScrollGroup.STATE_START) {
                this._runing = true;
            } else {
                this._runing = false;
                for(var i:number = 0; i < this._scrollItemArr.length; i++){
                    if (this._scrollItemArr[i]._state = ScrollGroup.STATE_START) {
                        this._runing = true;
                        break;
                    }
                }
            }
        }


        /**
         * 呼吸计数
         */
        private onHeartBeat():void {
            for(var i:number = 0; i < this._scrollItemArr.length; i++){
                this._scrollItemArr[i].onHeartBeat();
            }
        }

        /**
         * 重绘
         */
        public draw():void{
            if (this.width == 0 || this.height == 0) return;
            if(this._clip){//剪裁
                if (this.scrollRect == null){
                    this.scrollRect = new egret.Rectangle(0, 0, this.width, this.height);
                } else {
                    this.scrollRect.width = this.width;
                    this.scrollRect.height = this.height;
                }
            }else{
                this.scrollRect = null;
            }
            if (this.width != 100 || this.height != 100) {
                for(var i:number = 0; i < this._scrollItemArr.length; i++){
                    if (this._scrollItemArr[i].width == 100 || this._scrollItemArr[i].width == 0) {
                        this._scrollItemArr[i].width = this.width;
                    }
                    if (this._scrollItemArr[i].height == 100 || this._scrollItemArr[i].height == 0) {
                        this._scrollItemArr[i].height = this.height;
                    }
                    this._scrollItemArr[i]._initData = false;
                }
            }
        }
        /**
         * 设置剪裁
         * @param value
         */
        public set clip(value:boolean){
            if(value != this._clip){
                this._clip = value;
                this.invalidate();
            }
        }
        public get clip():boolean{
            return this._clip;
        }
    }
    class ScrollItemGroup extends BaseGroup {
        public speed:number = 0;//帧速度
        public direction:string = ScrollGroup.SCROLL_DOWN;//卷轴的方向
        private _textures:Array<egret.Texture> = null;//卷轴的背景材料

        private _scrollTextureIndex:number = 0;///卷轴的下标

        private _scrollBitmapArr:Array<egret.Bitmap> = null;//卷轴图像

        public _state:String = easy.ScrollGroup.STATE_STOP;

        public _initData:boolean = false;//初始化数据
        /**
         * 是否将子代剪切到视区的边界,
         * 默认为true,剪切.
         */
        private _clip:boolean = false;


        public constructor(delay:boolean=false) {
            super(delay);
        }
        /**
         * 初始化主场景的组件
         * 这个方法在对象new的时候就调用,因为有些ui必须在加入stage之前就准备好
         * 子类覆写该方法,添加UI逻辑
         */
        public createChildren():void {
            super.createChildren();
            this._scrollBitmapArr = [new egret.Bitmap(), new egret.Bitmap(), new egret.Bitmap()];
            for(var i:number = 0; i < this._scrollBitmapArr.length; i++){
                this.addChild(this._scrollBitmapArr[i]);
            }
        }

        /**
         * 设置卷轴数据
         * @param textures
         * @param speed
         */
        public setScrollData(textures:Array<egret.Texture>, speed:number = 3):void {
            this._textures = textures;
            this.speed = speed;
        }

        /**
         * 初始化初始卷轴数据
         */
        private initScrollBitmapData():void{
            if (this._initData || this._state == easy.ScrollGroup.STATE_STOP) return;
            this._initData = true;
            if (this.direction == ScrollGroup.SCROLL_UP) {
                this._scrollBitmapArr[0].x = 0;
                this._scrollBitmapArr[1].x = 0;
                this._scrollBitmapArr[2].x = 0;

                this._scrollBitmapArr[0].y = 0;
                this._scrollBitmapArr[1].y = this.height;
                this._scrollBitmapArr[2].y = 2*this.height;

                this._scrollBitmapArr[0].texture = this.getTexture();
                this._scrollBitmapArr[1].texture = this.getTexture();
                this._scrollBitmapArr[2].texture = this.getTexture();
            } else if (this.direction == ScrollGroup.SCROLL_DOWN){
                this._scrollBitmapArr[0].x = 0;
                this._scrollBitmapArr[1].x = 0;
                this._scrollBitmapArr[2].x = 0;

                this._scrollBitmapArr[0].y = -2*this.height;
                this._scrollBitmapArr[1].y = -this.height;
                this._scrollBitmapArr[2].y = 0;

                this._scrollBitmapArr[2].texture = this.getTexture();
                this._scrollBitmapArr[1].texture = this.getTexture();
                this._scrollBitmapArr[0].texture = this.getTexture();
            } else if (this.direction == ScrollGroup.SCROLL_LEFT){
                this._scrollBitmapArr[0].x = 0;
                this._scrollBitmapArr[1].x = this.width;
                this._scrollBitmapArr[2].x = 2*this.width;

                this._scrollBitmapArr[0].y = 0;
                this._scrollBitmapArr[1].y = 0;
                this._scrollBitmapArr[2].y = 0;

                this._scrollBitmapArr[0].texture = this.getTexture();
                this._scrollBitmapArr[1].texture = this.getTexture();
                this._scrollBitmapArr[2].texture = this.getTexture();
            } else if (this.direction == ScrollGroup.SCROLL_RIGHT){
                this._scrollBitmapArr[0].x = -2*this.width;
                this._scrollBitmapArr[1].x = -this.width;
                this._scrollBitmapArr[2].x = 0;

                this._scrollBitmapArr[0].y = 0;
                this._scrollBitmapArr[1].y = 0;
                this._scrollBitmapArr[2].y = 0;

                this._scrollBitmapArr[2].texture = this.getTexture();
                this._scrollBitmapArr[1].texture = this.getTexture();
                this._scrollBitmapArr[0].texture = this.getTexture();
            }
        }

        /**
         * 获取当前卷轴材质
         * @returns {egret.Texture}
         */
        private getTexture():egret.Texture {
            var texture:egret.Texture =  this._textures[this._scrollTextureIndex];
            this._scrollTextureIndex++;
            if (this._scrollTextureIndex >= this._textures.length){
                this._scrollTextureIndex = 0;
            }
            return texture;
        }

        /**
         * 呼吸计数
         */
        public onHeartBeat():void {
            if (this._state == easy.ScrollGroup.STATE_STOP) return;
            if (!this._initData) this.initScrollBitmapData();
            if (this.direction == ScrollGroup.SCROLL_UP) {
                this._scrollBitmapArr[0].y -= this.speed;
                this._scrollBitmapArr[1].y -= this.speed;
                this._scrollBitmapArr[2].y -= this.speed;
                if (this._scrollBitmapArr[0].y + this.height <= 0) {//已经移出届
                    this._scrollBitmapArr[0].y = this._scrollBitmapArr[2].y + this.height;
                    this._scrollBitmapArr[0].texture = this.getTexture();
                    this._scrollBitmapArr.push(this._scrollBitmapArr.splice(0,1)[0])
                }
            } else if (this.direction == ScrollGroup.SCROLL_DOWN){
                this._scrollBitmapArr[0].y += this.speed;
                this._scrollBitmapArr[1].y += this.speed;
                this._scrollBitmapArr[2].y += this.speed;
                if (this._scrollBitmapArr[2].y >= this.height) {//已经移出届
                    this._scrollBitmapArr[2].y = this._scrollBitmapArr[0].y - this.height;
                    var bmp:egret.Bitmap = this._scrollBitmapArr[2];
                    bmp.texture = this.getTexture();
                    this._scrollBitmapArr[2] = this._scrollBitmapArr[1];
                    this._scrollBitmapArr[1] = this._scrollBitmapArr[0];
                    this._scrollBitmapArr[0] = bmp
                }
            } else if (this.direction == ScrollGroup.SCROLL_LEFT){
                this._scrollBitmapArr[0].x -= this.speed;
                this._scrollBitmapArr[1].x -= this.speed;
                this._scrollBitmapArr[2].x -= this.speed;
                if (this._scrollBitmapArr[0].x + this.width <= 0) {//已经移出届
                    this._scrollBitmapArr[0].x = this._scrollBitmapArr[2].x + this.width;
                    this._scrollBitmapArr[0].texture = this.getTexture();
                    this._scrollBitmapArr.push(this._scrollBitmapArr.splice(0,1)[0])
                }
            } else if (this.direction == ScrollGroup.SCROLL_RIGHT){
                this._scrollBitmapArr[0].x += this.speed;
                this._scrollBitmapArr[1].x += this.speed;
                this._scrollBitmapArr[2].x += this.speed;
                if (this._scrollBitmapArr[2].x >= this.width) {//已经移出届
                    this._scrollBitmapArr[2].x = this._scrollBitmapArr[0].x - this.width;
                    var bmp:egret.Bitmap = this._scrollBitmapArr[2];
                    bmp.texture = this.getTexture();
                    this._scrollBitmapArr[2] = this._scrollBitmapArr[1];
                    this._scrollBitmapArr[1] = this._scrollBitmapArr[0];
                    this._scrollBitmapArr[0] = bmp
                }
            }
        }

        /**
         * 重绘
         */
        public draw():void{
            if (this.width == 0 || this.height == 0) return;
            if(this._clip){//剪裁
                if (this.scrollRect == null){
                    this.scrollRect = new egret.Rectangle(0, 0, this.width, this.height);
                } else {
                    this.scrollRect.width = this.width;
                    this.scrollRect.height = this.height;
                }
            }else{
                this.scrollRect = null;
            }
        }
        /**
         * 设置剪裁
         * @param value
         */
        public set clip(value:boolean){
            if(value != this._clip){
                this._clip = value;
                this.invalidate();
            }
        }
        public get clip():boolean{
            return this._clip;
        }
    }
}