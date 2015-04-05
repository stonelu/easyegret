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
    export class Image extends BaseGroup{
        private _bitmap:egret.Bitmap = null;
        private _texture:egret.Texture = null;
        private _autoSize:boolean = true;
        private _scale9GridEnable:boolean = false;
        private _scale9GridRect:egret.Rectangle = null;//九宫拉伸的尺寸
        private _fillMode:string = "scale";//scale, repeat.
        private _smoothing:boolean = false;
        public constructor(drawDelay:boolean = false) {
            super(drawDelay);
        }
        public createChildren():void {
            super.createChildren();
            this._bitmap = new egret.Bitmap();
            this.addChild(this._bitmap);
        }
        /**
         * Sets/gets the fillMode of the scale9Grid bitmap.(scale|repeat)
         */
        public get fillMode():string{
            return this._fillMode;
        }

        public set fillMode(value:string){
            if (this._fillMode != value){
                this._fillMode = value;
                this.invalidate();
            }
        }

        /**
         *  Sets/gets the common scaleEnable of the bitmap.
         */
        public get autoSize():boolean{
            return this._autoSize;
        }

        public set autoSize(value:boolean){
            if (this._autoSize != value) {
                this._autoSize = value;
                if (!this._autoSize) {
                    this.scaleX = 1;
                    this.scaleY = 1;
                }
                this.invalidate();
            }
        }

        /**
         * Sets/gets the bitmapData of the bitmap.
         */
        public get texture():egret.Texture{
            return this._texture;
        }

        public set texture(value:egret.Texture){
            if (this._texture != value) {
                this._texture = value;
                this.invalidate();
            }
        }
        /**
         * 默认背景texture的九宫格拉伸设定
         * 只有showDefaultSkin并且设置了defaultSkinTexture,才有效
         * 默认绘制的背景是纯色的,所以不需要进行九宫拉伸设定
         */
        public get scale9GridEnable():boolean{
            return this._scale9GridEnable;
        }

        public set scale9GridEnable(value:boolean){
            if (this._scale9GridEnable != value) {
                this._scale9GridEnable = value;
                if (this._scale9GridEnable && this._scale9GridRect == null) this._scale9GridRect = new egret.Rectangle();
                this.invalidate();
            }
        }
        /**
         * Sets the x of the bitmap's scale9Grid.
         */
        public set scale9GridX(value:number){
            if (this._scale9GridRect == null) this._scale9GridRect = new egret.Rectangle();
            if(this._scale9GridRect.x != value){
                this._scale9GridRect.x = value;
                this.invalidate();
            }
        }
        public get scale9GridX():number{
            if (this._scale9GridRect)return this._scale9GridRect.x;
            return 0;
        }
        /**
         * Sets the y of the bitmap's scale9Grid.
         */
        public set scale9GridY(value:number){
            if (this._scale9GridRect == null) this._scale9GridRect = new egret.Rectangle();
            if(this._scale9GridRect.y != value){
                this._scale9GridRect.y = value;
                this.invalidate();
            }
        }
        public get scale9GridY():number{
            if (this._scale9GridRect)return this._scale9GridRect.y;
            return 0;
        }
        /**
         * Sets the width of the bitmap's scale9Grid.
         */
        public set scale9GridWidth(value:number){
            if (this._scale9GridRect == null) this._scale9GridRect = new egret.Rectangle();
            if(this._scale9GridRect.width != value){
                this._scale9GridRect.width = value;
                this.invalidate();
            }
        }
        public get scale9GridWidth():number{
            if (this._scale9GridRect)return this._scale9GridRect.width;
            return 0;
        }
        /**
         * Sets the height of the bitmap's scale9Grid.
         */
        public set scale9GridHeight(value:number){
            if (this._scale9GridRect == null) this._scale9GridRect = new egret.Rectangle();
            if(this._scale9GridRect.height != value){
                this._scale9GridRect.height = value;
                this.invalidate();
            }
        }
        public get scale9GridHeight():number{
            if (this._scale9GridRect)return this._scale9GridRect.height;
            return 0;
        }

        /**
         * 九宫设置的区域
         * @returns {egret.Rectangle}
         */
        public get scale9GridRect():egret.Rectangle{
            return this._scale9GridRect;
        }

        public set scale9GridRect(rect:egret.Rectangle) {
            this._scale9GridRect = rect;
        }

        /**
         * 图片平滑设置，优化图片拉伸.
         * @param value
         *
         */
        public set smoothing(value:boolean){
            if (this._smoothing != value) {
                this._smoothing = value;
                this.invalidate();
            }
        }
        public get smoothing():boolean{
            return this._smoothing;
        }
        public set width(w:number){
            if (this.width != w){
                this._setWidth(w)
                this.invalidate();
            }
        }
        public get width():number {
            if (this._explicitWidth == NaN) return 0;
            return this._explicitWidth;
        }
        public set height(h:number){
            if (this.height != h){
                this._setHeight(h);
                this.invalidate();
            }
        }
        public get height():number {
            if (this._explicitHeight == NaN) return 0;
            return this._explicitHeight;
        }
        public draw():void{
            if (this._texture == null && this._bitmap.texture == null) return;
            if (this._texture && this._bitmap.texture != this._texture){
                this._bitmap.texture = this._texture;
            }
            if (this._scale9GridEnable && this._scale9GridRect) {
                this._bitmap.scale9Grid = this._scale9GridRect;
                this._bitmap.width = this.width;
                this._bitmap.height = this.height;
            } else {
                this._bitmap.scale9Grid = null;
                if (!this._scale9GridEnable && this._autoSize) {
                    this.scaleX = this.width/this._bitmap.texture._bitmapWidth;
                    this.scaleY = this.height/this._bitmap.texture._bitmapHeight;
                } else if (this._texture){
                    this._bitmap.width = this._texture._bitmapWidth;
                    this._bitmap.height = this._texture._bitmapHeight;
                }
            }
            this._bitmap.fillMode = this._fillMode;
        }

        public getBitmap():egret.Bitmap{
            return this._bitmap;
        }
    }
}