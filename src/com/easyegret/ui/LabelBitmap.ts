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
     * 使用材质显示字符
     */
    export class LabelBitmap extends HGroup{
        private _text:string = "";//文本内容
        private _textureDict:Object = {};//切割好的材质,对应的材质映射表
        private _textureNmae:string = null;
        private _shape:egret.Shape = null;
        public constructor() {
            super();
        }

        /**
         * 文本内容
         */
        public get text():string {
            return this._text;
        }

        public set text(value:string) {
            if(this._text != value){
                this._text = value;
                if(this._text == null) this._text = "";
                this.invalidate();
            }
        }
        /**
         * Draws the visual ui of the component.
         */
        public draw():void{
            //回收旧资源
            var bitmap:egret.Bitmap = null;
            for (var i = this.numChildren - 1; i >= 0; i --){
                bitmap = <egret.Bitmap>this.getChildAt(i);
                bitmap.texture = null;
                ObjectPool.recycleClass(bitmap);
            }
            //根据字符显示材质内容
            var texture:egret.Texture = null;
            if (StringUtil.isUsage(this._text)){
                for (var i = 0; i < this._text.length; i ++){
                    texture = this._textureDict[this._text.charAt(i)];
                    if (texture){
                        bitmap = ObjectPool.getByClass(egret.Bitmap);
                        bitmap.texture = texture;
                        bitmap.width = texture._bitmapWidth;
                        bitmap.height = texture._bitmapHeight;
                        this.addChild(bitmap);
                    }
                }
            }
            super.draw();
        }

        /**
         * 设置材质,需要进行切割
         * @param textureName 材质名称
         * @param horizontalSplit 水平切割
         * @param gap 间距
         * @param numArr 切割对应的字符,默认是数字0-9
         */
        public setTextureNmae(textureName:string, horizontalSplit:boolean = true, charArr:Array<string> = ["0","1","2","3","4","5","6","7","8","9"], gap:number = 0):void {
            this._textureNmae = textureName;
            if (StringUtil.isUsage(this._textureNmae)){
                var texture:egret.Texture = RES.getRes(this._textureNmae);
                if (texture){
                    var spriteSheet:egret.SpriteSheet = new egret.SpriteSheet(texture);
                    var splietWidth:number = 0;
                    var splietHeight:number = 0;
                    if (horizontalSplit){
                        splietWidth = (texture._sourceWidth - charArr.length * gap)/charArr.length;
                        splietHeight = texture._sourceHeight;
                    } else {
                        splietWidth = texture._sourceWidth;
                        splietHeight = (texture._sourceHeight - charArr.length * gap)/charArr.length;
                    }
                    //开始切割;
                    for (var i = 0;i < charArr.length; i++){
                        if (horizontalSplit){
                            this._textureDict[charArr[i]] = spriteSheet.createTexture(this.name + Math.round(Math.random()*999999) + "_" + charArr[i], i*splietWidth + i * gap, 0, splietWidth, splietHeight);
                        } else {
                            this._textureDict[charArr[i]] = spriteSheet.createTexture(this.name + Math.round(Math.random()*999999)  + "_" + charArr[i], 0, i*splietHeight + i * gap, splietWidth, splietHeight);
                        }
                    }
                }
            }
        }
     }
}