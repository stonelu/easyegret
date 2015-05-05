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

        public speed:number = 0;//帧速度
        public direction:string = ScrollGroup.SCROLL_DOWN;//卷轴的方向
        private _textures:Array<egret.Texture> = null;//卷轴的背景材料

        private _scrollTextureIndex:number = 0;///卷轴的下标

        private _scrollBitmapArr:Array<egret.Bitmap> = null;//卷轴图像


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
         * 开始卷轴
         */
        public start():void {
            //初始数据
            this.initScrollBitmapData();
            HeartBeat.addListener(this, this.onHeartBeat);
        }

        /**
         * 停止卷轴
         */
        public stop():void {
            HeartBeat.removeListener(this, this.onHeartBeat);
        }
        /**
         * 暂停卷轴
         */
        public pause():void {
            HeartBeat.removeListener(this, this.onHeartBeat);
        }

        /**
         * 重新卷轴卷轴
         */
        public restart():void {
            HeartBeat.addListener(this, this.onHeartBeat);
        }

        /**
         * 初始化初始卷轴数据
         */
        private initScrollBitmapData():void{
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
        private onHeartBeat():void {
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
   }
}