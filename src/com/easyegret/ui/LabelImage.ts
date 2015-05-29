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
    export class LabelImage extends HGroup{
        private _text:string = "";//文本内容
        private _textureDict:Object = {};//切割好的材质,对应的材质映射表
        private _texture:egret.Texture = null;
        private _shape:egret.Shape = null;
        /**
         * 是否已初始化材质数据
         */
        private _initDisplayData:boolean = false;
        /**
         * 设置材质对应的字符
         * 默认是
         */
        private _chars:string = "0,1,2,3,4,5,6,7,8,9";
        /**
         * 切割符号指定
         * @type {string}
         * @private
         */
        private _charSplit:string = ",";
        /**
         * 横向切割
         */
        private _horizontalSplit:boolean = true;
        /**
         *切割间隔
         */
        private _gapSplit:number = 0;

        //声音播放
        private _soundName:string = null;
        private _sound:egret.Sound = null;

        public _rollingEffect:EffectNumberRolling = null;

        public constructor(drawDelay:boolean = false) {
            super(drawDelay);
        }
        /**
         * 初始化主场景的组件,加入场景时,主动调用一次
         * 子类覆写该方法,添加UI逻辑
         */
        public createChildren():void {
            super.createChildren();
            this.setSize(Style.TEXTINPUT_WIDTH, Style.TEXTINPUT_HEIGHT);
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
                this.onPlaySound();
            }
        }
        public get texture():egret.Texture {
            return this._texture;
        }

        /**
         * 设置材质
         * @param value
         */
        public set texture(value:egret.Texture) {
            if(this._texture != value){
                this._texture = value;
                this._initDisplayData = false;
                this.invalidate();
            }
        }
        public get chars():string {
            return this._chars;
        }

        /**
         * 设置材质对应的字符
         * @param value
         */
        public set chars(value:string) {
            if(this._chars != value){
                this._chars = value;
                this._initDisplayData = false;
                this.invalidate();
            }
        }
        public get horizontalSplit():boolean {
            return this._horizontalSplit;
        }

        /**
         * 材质切割的方向,默认水平切割
         * @param value
         */
        public set horizontalSplit(value:boolean) {
            if(this._horizontalSplit != value){
                this._horizontalSplit = value;
                this._initDisplayData = false;
                this.invalidate();
            }
        }
        public get gapSplit():number {
            return this._gapSplit;
        }

        /**
         * 材质切割的间隔
         * @param value
         */
        public set gapSplit(value:number) {
            if(this._gapSplit != value){
                this._gapSplit = value;
                this._initDisplayData = false;
                this.invalidate();
            }
        }
        public get charSplit():string {
            return this._charSplit;
        }

        /**
         * 切割符号,默认是,
         * @param value
         */
        public set charSplit(value:string) {
            if(this._charSplit != value){
                this._charSplit = value;
                this._initDisplayData = false;
                this.invalidate();
            }
        }
        /**
         * Draws the visual ui of the component.
         */
        public draw():void{
            if (!this._initDisplayData){
                this.splitTextureSource();
            }
            if (this._bgImage && this._bgImage.parent) {
                this._bgImage.parent.removeChild(this._bgImage);
            }
            //回收旧资源
            var bitmap:egret.Bitmap = null;
            for (var i = this.numChildren - 1; i >= 0; i --){
                bitmap = <egret.Bitmap>this.getChildAt(i);
                bitmap.texture = null;
                bitmap.parent.removeChild(bitmap);
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
                        bitmap.visible = true;
                        bitmap.alpha = 1;
                        this.addChild(bitmap);
                    }
                }
            }
            super.draw();
        }
        private  splitTextureSource():void {
            if (this._texture && easy.StringUtil.isUsage(this._chars)) {
                var charArr:Array<string> = easy.StringUtil.spliteStrArr(this._chars, this._charSplit);
                if (charArr.length > 0) {
                    this._initDisplayData = true;
                    var spriteSheet:egret.SpriteSheet = new egret.SpriteSheet(this._texture);
                    var splietWidth:number = 0;
                    var splietHeight:number = 0;
                    var textureWidth:number = this._texture._bitmapWidth;
                    if (textureWidth == 0) textureWidth = this._texture._sourceWidth;
                    var textureHeight:number = this._texture._bitmapHeight;
                    if (textureHeight == 0) textureHeight = this._texture._sourceHeight;
                    if (this._horizontalSplit) {
                        splietWidth = (textureWidth - charArr.length * this._gapSplit) / charArr.length;
                        splietHeight = textureHeight;
                    } else {
                        splietWidth = textureWidth;
                        splietHeight = (textureHeight - charArr.length * this._gapSplit) / charArr.length;
                    }
                    //开始切割;
                    for (var i = 0; i < charArr.length; i++) {
                        if (this._horizontalSplit) {
                            this._textureDict[charArr[i]] = spriteSheet.createTexture(this.name + Math.round(Math.random() * 999999) + "_" + charArr[i], i * splietWidth + i * this._gapSplit, 0, splietWidth, splietHeight);
                        } else {
                            this._textureDict[charArr[i]] = spriteSheet.createTexture(this.name + Math.round(Math.random() * 999999) + "_" + charArr[i], 0, i * splietHeight + i * this._gapSplit, splietWidth, splietHeight);
                        }
                    }
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
                this._sound.play();
            }
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
         * 设置滚动文字
         * @param value
         */
        public setTextRolling(str:any, zoom:boolean = false, scaleX:number = 1.5, scaleY:number = 1.5){
            if (this._rollingEffect == null){
                this._rollingEffect = new EffectNumberRolling(this);
            }
            this._rollingEffect.zoomEnable = zoom;
            this._rollingEffect.zoomX = scaleX;
            this._rollingEffect.zoomY = scaleY;
            //console.log("setTextRolling=" + str)
            this._rollingEffect.setText("" + str);
        }
        public clearTextRolling():void {
            this._rollingEffect = null;
        }
     }
    export class EffectNumberRolling{
        public zoomEnable:boolean = false;
        public zoomX:number = 1;
        public zoomY:number = 1;
        private _isZoom:boolean = false;
        private _zoomXOld:number = 1;
        private _zoomYOld:number = 1;
        private _xOld:number = 1;
        private _yOld:number = 1;
        private _labelImg:LabelImage = null;
        private _rollingText:Array<string> = [];
        //上一次分解好的字符串
        private _isSplitInit:boolean = false;
        private _splitStr:Array<any> = [];
        private _srcStr:string = null;
        private _typeStr:Array<boolean> = [];//记录每个位置的num=true
        public constructor(lableImg:LabelImage) {
            this._labelImg = lableImg;
            this._xOld = this._labelImg.x;
            this._yOld = this._labelImg.y;
            //console.log("x=" + this._xOld + ", y=" + this._yOld)
        }
        public setText(str:string){
            //console.log("目标str=" +str + ", this._srcStr=" + this._srcStr);
            if (this._rollingText.length > 0){
                this._labelImg.text = this._srcStr;
            }
            this._isSplitInit = false;
            this._srcStr = str;
            this._rollingText.length = 0;
            this._typeStr.length = 0;
            var tempSpliteStr:Array<string> = [];
            if (easy.StringUtil.isUsage(str)){
                //分解成可翻滚的字符串
                var isLastNum:boolean = false;
                var temStr:string = "";
                for(var i = 0; i < str.length; i++){
                    //console.log("str.charCodeAt=" + str.charCodeAt(i))
                    if (str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57) {//数字
                        //console.log("000=" + str.charCodeAt(i))
                        if (isLastNum) {
                            //console.log("000--00=" + str.charCodeAt(i))
                            temStr += str.substring(i, i+1);
                        } else {
                            //console.log("000--11=" + str.charCodeAt(i))
                            //console.log("000 temStr=" + temStr)
                            if (easy.StringUtil.isUsage(temStr)) {
                                tempSpliteStr.push(temStr);
                                this._typeStr.push(isLastNum);
                            }
                            temStr = str.substring(i, i+1);
                        }
                        isLastNum = true;
                    } else {//当前是字符
                        if (isLastNum) {
                            //console.log("111--00=" + str.charCodeAt(i))
                            if (easy.StringUtil.isUsage(temStr)) {
                                tempSpliteStr.push(temStr);
                                this._typeStr.push(isLastNum);
                                //console.log("111 temStr=" + temStr)
                            }
                            temStr = str.substring(i, i+1);
                        } else {
                            //console.log("111--11=" + str.charCodeAt(i))
                            temStr += str.substring(i, i+1);
                        }
                        isLastNum = false;
                    }
                    //console.log("temStr=" + temStr);
                }
                tempSpliteStr.push(temStr);//最后一个str
                this._typeStr.push(isLastNum);
            } else {
                //根据旧数据,构造一个字符串
                for(var i = 0; i < this._typeStr.length; i++){
                    if (this._splitStr[i]){
                        tempSpliteStr.push("0");
                    } else {
                        tempSpliteStr.push(this._splitStr[i]);
                    }
                }
            }
            //console.log("分解的 tempSpliteStr=" +tempSpliteStr);
            //把str的数值部分解析成num
            var tempSpliteValue:Array<any> = [];
            for(var i = 0; i < this._typeStr.length; i++){
                if (this._typeStr[i]){
                    tempSpliteValue.push(parseInt(tempSpliteStr[i]));
                    if (!this._isSplitInit) this._splitStr.push(0);
                } else {
                    tempSpliteValue.push(tempSpliteStr[i]);
                    if (!this._isSplitInit) this._splitStr.push(tempSpliteStr[i]);
                }
            }
            //console.log("分解的 _typeStr=" + this._typeStr);
            //console.log("分解的 tempSpliteValue=" +tempSpliteValue);
            //开始生成序列数值
            var tempLastValue:Array<any> = [].concat(this._splitStr);//
            var stepValue:number = 0;
            var stepStr:string = "";
            while(this.isGen(tempSpliteValue, tempLastValue)) {
                stepStr = "";
                //单挑生成
                for (var i = 0; i < this._typeStr.length; i++) {
                    if (this._typeStr[i]) {
                        stepValue = this.getStepValue(tempSpliteValue[i], this._splitStr[i]);
                        if (stepValue > 0) {
                            if (tempLastValue[i] + stepValue > tempSpliteValue[i]) {
                                stepStr += tempSpliteValue[i];
                                tempLastValue[i] = tempSpliteValue[i];
                            } else {
                                stepStr += tempLastValue[i] + stepValue;
                                tempLastValue[i] = tempLastValue[i] + stepValue;
                            }
                        } else {
                            if (tempLastValue[i] + stepValue < tempSpliteValue[i]) {
                                stepStr += tempSpliteValue[i];
                                tempLastValue[i] = tempSpliteValue[i];
                            } else {
                                stepStr += tempLastValue[i] + stepValue;
                                tempLastValue[i] = tempLastValue[i] + stepValue;
                            }
                        }
                    } else {
                        stepStr += tempSpliteValue[i];
                    }
                }
                //console.log("step.str=" + stepStr)
                this._rollingText.push(stepStr);
            }
            //console.log("_rollingText=" + this._rollingText)
            //保存这次的值
            if (this._rollingText && this._rollingText.length > 0){
                this._splitStr = tempSpliteValue;
                this._isSplitInit = true;

                HeartBeat.addListener(this, this.onChangeText, 2);

                if (this.zoomEnable && !this._isZoom && this.zoomX != this._labelImg.scaleX && this.zoomY != this._labelImg.scaleY){
                    this._isZoom = true;
                    this._zoomXOld = this._labelImg.scaleX;
                    this._zoomYOld = this._labelImg.scaleY;
                    var paramObj:Object = {scaleX:this.zoomX, scaleY:this.zoomY};
                    if (this._labelImg.anchorX == 0 && this._labelImg._anchorOffsetX == 0){
                        paramObj["x"] = - Math.round(this._labelImg.cx);
                    }
                    if (this._labelImg.anchorY == 0 && this._labelImg._anchorOffsetY == 0){
                        paramObj["y"] = - Math.round(this._labelImg.cy);
                    }
                    egret.Tween.get(this._labelImg).to(paramObj, 400, egret.Ease.bounceInOut);
                }
            } else {
                this._labelImg.text = this._srcStr;
            }
        }

        private isGen(src:Array<any>, target:Array<any>):boolean {
            //console.log("isGen src=" + src + ", target=" + target);
            for(var i = 0; i < src.length; i++){
                if (src[i] != target[i]) return true;
            }
            return false;
        }

        /**
         * 根据最大和最小值,计算出增量多少合适
         * @param min
         * @param max
         */
        private getStepValue(num1:number, num2:number):number {
            var tempStep = Math.abs(num1 - num2);
            var value:number = 1;
            if (tempStep < 30){//30次
                value = 1;
            } else if (tempStep < 60) {//30次
                value = 2;
            } else if (tempStep < 100) {//30次
                value = 3;
            } else if (tempStep < 200) {//40次
                value = 5;
            } else if (tempStep < 400) {//40次
                value = 10;
            } else if (tempStep < 800) {//40次
                value = 20;
            } else if (tempStep < 1500) {//50次
                value = 30;
            } else if (tempStep < 2500) {//60次
                value = 40;
            } else if (tempStep < 3500) {//70次
                value = 50;
            } else {
                value = Math.floor(tempStep/(Math.round(tempStep/1000)*10 + 90));
            }
            if (num1 < num2){
                value = -value;
            }
            return value;
        }
        private onChangeText():void {
            if (this._rollingText.length > 0) {
                this._labelImg.text = this._rollingText.shift();
            } else {
                HeartBeat.removeListener(this, this.onChangeText);
                if (this._isZoom){
                    var paramObj:Object = {scaleX:this._zoomXOld, scaleY:this._zoomYOld};
                    if (this._labelImg.anchorX == 0 && this._labelImg._anchorOffsetX == 0){
                        paramObj["x"] = -this._xOld;
                    }
                    if (this._labelImg.anchorY == 0 && this._labelImg._anchorOffsetY == 0){
                        paramObj["y"] = -this._yOld;
                    }
                    egret.Tween.get(this._labelImg).to(paramObj, 200);
                }
                this._isZoom = false;
            }
        }
    }
}