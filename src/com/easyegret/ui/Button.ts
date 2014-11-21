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
	export class Button extends Group {
        public static TOGGLE_PREFIX:string = "ui#button#toggle_";//toggle事件的前缀,尽量避免受到其他事件名称的混淆

        public static STATE_UP:string = "up";
        public static STATE_OVER:string = "over";
        public static STATE_DOWN:string = "down";
        public static STATE_DISABLE:string = "disable";
        
		private _textureLabel:egret.Texture = null;//文字图片
		private _textureIcon:egret.Texture = null;//图标
		private _label:Label = null;//文本
		private _text:string = "";
        
        private _texture:egret.Texture = null;//外设的纹理
        private _imgDisplay:egret.Bitmap = null;//显示按钮up用的image

        private _imgLabel:egret.Bitmap = null;//显示文字图片的image
        private _imgIcon:egret.Bitmap = null;//显示图标用的image
        
        private _initDisplayData:boolean = false;//时候初始化显示对象
        public _selected:boolean = false;//选择时为ture
        private _toggleGroup:string = null;//toggle分组名称
        public stateArray:Array<any> = [Button.STATE_UP, Button.STATE_OVER, Button.STATE_DOWN];//正常的按钮,只有三态,第四态是禁用态,其他的态可以自己加入
        private _currentState:string = Button.STATE_UP;//当前态
        public _textureDict:any = {};//各材质的映射,在给予img之前,保存在这个映射中
		//private _scaleEnable:boolean = false;// 直接拉伸
        
        private _verticalSplit:boolean = true;//bitmapdata采用竖直切割的方式
        public _gapSplit:number = 0;//3态切割间隔
        public _xOffsetSplit:number = 0;//切割x起始
        public _yOffsetSplit:number = 0;//切割y起始
        //文字部分的设定
        private _labelMarginLeft:number = 0;
        private _setLabelMarginLeft:boolean = false;
        private _iconMarginLeft:number = 0;
        private _setIconMarginLeft:boolean = false;
        private _autoSize:boolean = false;
        private _labelColor:number = Style.BUTTON_TEXT;
        private _buttonMode:boolean = true;

        //labe字体大小
        private _fontSize:number = 12;
        //label字体
        private _fontName:string = null;

        public constructor() {
            super();
        }

        public createChildren():void {
            super.createChildren();
            this.touchEnabled = true;//事件接收
            this.touchChildren = false;
			this._coolDownEabled = Style.allowButtonDefaultCoolDown;
			if(Style.allowButtonDefaultCoolDown){
				this._coolDownFrames = Style.defaultCoolDownFrames;
			}
            this.showDefaultSkin = false;//自有背景,不需要默认背景绘制
            if (this.width == 0) this.width = Style.BUTTON_DEFAULT_WIDTH;
            if (this.height == 0) this.height = Style.BUTTON_DEFAULT_HEIGHT;
            //背景图多态显示
            this._imgDisplay = new egret.Bitmap();
            this._imgDisplay.width = this.width;
            this._imgDisplay.height = this.height;
            this._imgDisplay.fillMode = egret.BitmapFillMode.SCALE;
            this.addChild(this._imgDisplay);

            //文字显示
            this._label = new Label();
            this._label.width = this.width;
            this._label.height = this.height;
            this._label.showDefaultSkin = false;
			this.addChild(this._label);

            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchEvent, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEvent, this);
            //this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEvent, this);
        }
        public onTouchEvent(event:egret.TouchEvent) : void {
            if (!this.enabled){
                event.stopImmediatePropagation();
                return;
            }
            //console.log("Button onTouchEvent=" + event.type);
            if (event.currentTarget == this){
                if(StringUtil.isUsage(this._toggleGroup)) {
                    if (event.type == egret.TouchEvent.TOUCH_BEGIN){
                        this.selected = !this._selected;
                    }
                   // console.log("Button _toggleGroup=" + this._toggleGroup + ", _selected=" + this._selected);
                } else {
                    if (event.type == egret.TouchEvent.TOUCH_BEGIN){
                        this._currentState = Button.STATE_DOWN;
                    } else if (event.type == egret.TouchEvent.TOUCH_END) {
                        this._currentState = Button.STATE_UP;
                    } else if (event.type == egret.TouchEvent.TOUCH_MOVE) {
                        this._currentState = Button.STATE_OVER;
                    }
                }
            }
            this.invalidate();
        }

        //public set enabled(value:boolean){
        //    super.enabled = value;
        //    this._currentState = Button.STATE_DISABLE;
        //    if(!value){
        //        this.touchEnabled = false;
        //        if (!this.isStateExist(Button.STATE_DISABLE)) {
        //            this.stateArray.push(Button.STATE_DISABLE);
        //        }
        //        /*
        //        if (!this._textureDict[Button.STATE_DISABLE]){//不存在disable的材质,使用up的材质变色
        //            this._textureDict[Button.STATE_DISABLE] = this._textureDict[Button.STATE_UP];
        //            //TODO 加滤镜
        //        }
        //        */
        //        if(this.statesLength == 4){
        //            this._label.color = 0x74746e;
        //        }else{
        //            if(Style.allowColorFilterButtonEnabled){
        //                //this.filter = cmf;
        //            }
        //        }
        //    } else {
        //        this.touchEnabled = true;
        //    }
        //    this.invalidate();
        //}

        public get currentState():string{
            return this._currentState;
        }
        
        public set currentState(value:string){
            if (this._currentState != value){
                this._currentState = value;
                this.invalidate();
            }
        }
        /**
         * 是否主动设置为false. true,是; false,否. 
         */		
        private _isInitiativeFalse:boolean = false;//2012-11-26,yuxinli,wangpan.事件处理顺序相关修改.
        
        private _coolDownEabled:boolean = false;
        
        /**
         * 是否应用点击冷却.
         */
        public get coolDownEabled():boolean{
            return this._coolDownEabled;
        }
        
        /**
         * @private
         */
        public set coolDownEabled(value:boolean){
            this._coolDownEabled = value;
        }
        
        
        private _coolDownFrames:number = 2;
        /**
         * 按钮点击后冷却帧数.
         */		
        public get coolDownFrames():number{
            return this._coolDownFrames;
        }
        
        public set coolDownFrames(value:number){
            this._coolDownFrames = value;
        }
        public get texture():egret.Texture{
            return this._texture;
        }

        public set texture(value:egret.Texture){
            if (this._texture != value) {
                //this._initDisplayData = false;
                //this._useSource = false;
                this._texture = value;
                this.invalidate();
            }
        }

        /**
         * 绘制
         */
		public draw():void{
			//super.draw();
            //if (this._data)console.log("@@Button draw _text=" + this._text + ", selected=" + this.selected + ", data=" + this._data.id);
            //初始化显示对象和数据
            if (!this._initDisplayData){
                this._initDisplayData = true;
                if (!this._texture){
                    //没有材质,绘制一个默认的材质背景
                    var shape:egret.Shape = new egret.Shape();
                    shape.width = this.width;
                    shape.height = this.height * 3;
                    shape.graphics.beginFill(Style.BUTTON_FACE);
                    shape.graphics.drawRect(0, 0 , this.width, this.height);
                    shape.graphics.beginFill(0xfff666);
                    shape.graphics.drawRect(0, this.height , this.width, this.height);
                    shape.graphics.beginFill(0x33ff66);
                    shape.graphics.drawRect(0, this.height * 2, this.width, this.height);
                    shape.graphics.endFill();
                    if (this.border){
                        shape.graphics.lineStyle(1, 0x000000);
                        shape.graphics.drawRect(1, 1 , this.width-2, 3* this.height-2);

                        shape.graphics.moveTo(1, this.height-1);
                        shape.graphics.lineTo(this.width-2, this.height-1);
                        shape.graphics.moveTo(1, this.height + 1);
                        shape.graphics.lineTo(this.width-2, this.height + 1);

                        shape.graphics.moveTo(1, 2*this.height-1);
                        shape.graphics.lineTo(this.width-2, 2*this.height-1);
                        shape.graphics.moveTo(1, 2*this.height + 1);
                        shape.graphics.lineTo(this.width-2, 2*this.height + 1);

                    }
                    var renderTexture:egret.RenderTexture = new egret.RenderTexture();
                    renderTexture.drawToTexture(shape);
                    this._texture = renderTexture;
                }
                this.splitTextureSource();//切割成态数对应的材质
            }
            if (this._imgDisplay == null) return;
            this._imgDisplay.texture = this._textureDict[this._currentState];
            this._imgDisplay.width = this.width;
            this._imgDisplay.height = this.height;
            if (this.scale9GridEnable && this.scale9GridRect != null){//九宫拉伸设置
                this._imgDisplay.scale9Grid = this.scale9GridRect;
                this._imgDisplay.fillMode = egret.BitmapFillMode.SCALE;
            } else {
                this._imgDisplay.scale9Grid = null;
            }
            //console.log("Button.draw 1111 this.width=" + this.width + ", this.height=" + this.height);

			if(this._textureLabel != null){//文字图片显示
                if (this._imgLabel == null){
                    this._imgLabel = new egret.Bitmap();
                    this.addChild(this._imgLabel);
                }
                this._imgLabel.texture = this._textureLabel;
				this._imgLabel.x = (this.width - this._imgLabel.width)/2;
				this._imgLabel.y = (this.height - this._imgLabel.height)/2;
			}
			if(this._textureIcon != null){//图标显示
                if (this._imgIcon == null){
                    this._imgIcon = new egret.Bitmap(null);
                    this.addChild(this._imgIcon);
                }
                this._imgIcon.texture = this._textureIcon;
				this._imgIcon.y = (this.height - this._imgIcon.height)/2;
				if(this._setIconMarginLeft){
					this._imgIcon.x = this._iconMarginLeft;
				}
			}
			if(this._label){
                if (!this._label.parent) this.addChild(this._label);
                this._label.text = this._text;
                this._label.fontSize = this._fontSize;
                this._label.fontName = this._fontName;
                this._label.onInvalidate(null);//立即生效,这样下面的数据才准
                if(this._setLabelMarginLeft){
                    this._label.x = this._labelMarginLeft;
                    this._label.width -= this._labelMarginLeft;
                }else{
                    this._label.move((this.width - this._label.width)/2, (this.height - this._label.height)/2);
                    //console.log("Button.draw 222 this.width=" +this.width + ", this._label.width=" + this._label.width);
                }
                this._label.y = (this.height - this._label.height)/2;
            }
		}
		///////////////////////////////////
		// event handlers
		///////////////////////////////////
		
		public onBtnCooldownHdl(endCall:boolean):void{
			if(this._isInitiativeFalse){
				this._isInitiativeFalse = false;
			}else{
				this.enabled = true;
			}
			//SystemHeartBeat.removeEventListener(onBtnCooldownHdl);
		}
		///////////////////////////////////
		// getter/setters
		///////////////////////////////////
        /**
         * 切割Texture材质集
         * @param value
         */
        private splitTextureSource():void {
            if (this._texture){
                var i:number = 0;
                var splietWidth:number = 0;
                var splietHeight:number = 0;
                if (this._verticalSplit){
                    splietWidth = this._texture._sourceWidth;
                    splietHeight = this._texture._sourceHeight/this.stateArray.length;
                } else {
                    splietWidth = this._texture._sourceWidth/this.stateArray.length;
                    splietHeight = this._texture._sourceHeight;
                }
                var spriteSheet:egret.SpriteSheet = new egret.SpriteSheet(this._texture);
                for (i = 0; i < this.stateArray.length; i++)  {
                    if (this._verticalSplit){
                        this._textureDict[this.stateArray[i]] = spriteSheet.createTexture(this.name + Math.round(Math.random()*999999)  + "_" + this.stateArray[i], 0, i*splietHeight, splietWidth, splietHeight);
                    } else {
                        this._textureDict[this.stateArray[i]] = spriteSheet.createTexture(this.name + Math.round(Math.random()*999999) + "_" + this.stateArray[i],i*splietWidth, 0, splietWidth, splietHeight);
                    }
                }
            }
        }
		/**
		 * 设置按钮弹起态皮肤
		 */		
		public set upSkin(value:egret.Texture){
            //this._useSource = false;
			if(!this.isStateExist(Button.STATE_UP)){
				this.stateArray.push(Button.STATE_UP);
			}
			//if(value != null){
			//	this._width = value.width;
			//	this._height = value.height;
			//}
			this._textureDict[Button.STATE_UP] = value;
			this.invalidate();
		}
		public get upSkin():egret.Texture{
			return this._textureDict[Button.STATE_UP];
		}
		/**
		 * 设置按钮悬停态皮肤
		 */		
		public set overSkin(value:egret.Texture){
            //this._useSource = false;
			if(!this.isStateExist(Button.STATE_OVER)){
				this.stateArray.push(Button.STATE_OVER);
			}
            this._textureDict[Button.STATE_OVER] = value;
			this.invalidate();
		}
		public get overSkin():egret.Texture{
			return this._textureDict[Button.STATE_OVER];
		}
		/**
		 * 设置按钮按下态皮肤
		 */	
		public set downSkin(value:egret.Texture){
            //this._useSource = false;
			if(!this.isStateExist(Button.STATE_DOWN)){
				this.stateArray.push(Button.STATE_DOWN);
			}
            this._textureDict[Button.STATE_DOWN] = value;
			this.invalidate();
		}
		public get downSkin():egret.Texture{
			return this._textureDict[Button.STATE_DOWN];
		}
		/**
		 * 设置按钮禁用态皮肤
		 */	
		public set disableSkin(value:egret.Texture){
            //this._useSource = false;
			if(!this.isStateExist(Button.STATE_DISABLE)){
				this.stateArray.push(Button.STATE_DISABLE);
			}
            this._textureDict[Button.STATE_DISABLE] = value;
			this.invalidate();
		}
		public get disableSkin():egret.Texture{
			return this._textureDict[Button.STATE_DISABLE];
		}
		/**
		 * 
		 * @param state
		 * @return false,不存在;true,存在.
		 * 
		 */		
		private isStateExist(state:string):boolean{
			if(this.stateArray.indexOf(state) != -1){
				return true;
			}
			return false;
		}
		/**
		 * 设置按钮文本
		 */		
		public set label(value:string){
			this._text = value;
			if(this._label){
				this._label.text = this._text;
			}
			this.invalidate();
		}
       	public get label():string{
			return this._text;
		}
		
        public set selected(value:boolean) {
            this._selected = value;
            this._currentState = (this._selected?Button.STATE_DOWN:Button.STATE_UP);
            //if (this._data)console.log("button data=" + this._data.id + ", selected=" + this._selected);
            if (this._selected) {
                var myevent:MyEvent = MyEvent.getEvent(Button.TOGGLE_PREFIX + this._toggleGroup);
                myevent.setItem("caller", this);
                myevent.setItem("group", this._toggleGroup);
                myevent.send();
            }
            this.invalidate();
        }
        public get selected():boolean {
            return this._selected;
        }
		/**
		 * 设置按钮可用状态
		 * <p>在预设基础下修改状态数组长度</p>
		 * <p>[STATE_UP, STATE_OVER, STATE_DOWN, STATE_DISABLE, STATE_TOGGLE]</p>
		 * @param value 长度值
		 */		
		public set statesLength(value:number){
			value = value < 0?1:value;
            //if (this.stateArray.length == value) return;
            //this.stateArray.length = 0;
            switch(value) {
                case 1:
        			this.stateArray = [Button.STATE_UP];
                    break;
                case 2:
        			this.stateArray = [Button.STATE_UP, Button.STATE_DOWN];
                    break;
                case 3:
        			this.stateArray = [Button.STATE_UP, Button.STATE_OVER, Button.STATE_DOWN];
                    break;
                case 4:
        			this.stateArray = [Button.STATE_UP, Button.STATE_OVER, Button.STATE_DOWN, Button.STATE_DISABLE];
                    break;
            }
            this._initDisplayData = false;
            this.invalidate();
		}
		public get statesLength():number{
			return this.stateArray.length;
		}
		///**
		// * Sets/gets the enable of the bitmap's scale.
		// */
		//public get scaleEnable():boolean{
		//	return this._scaleEnable;
		//}
		//
		//public set scaleEnable(value:boolean){
         //   if (this._scaleEnable != value) {
    		//	this._scaleEnable = value;
    		//	this.invalidate();
         //   }
		//}
		/**
		 * Sets the bitmapData of the bitmap.
		 */
		public set imgLabel(value:egret.Texture){
            if (this._textureLabel != value) {
                this._textureLabel = value;
    			this.invalidate();
            }
		}
		
		public get imgLabel():egret.Texture{
			return this._textureLabel;
		}
		/**
		 * Sets the bitmapData of the imgIcon.
		 */
        public set imgIcon(value:egret.Texture){
            if (this._textureIcon != value) {
                this._textureIcon = value;
    			this.invalidate();
            }
		}
		public get imgIcon():egret.Texture{
			return this._textureIcon;
		}
        /**
         * 设置文字文本的颜色
         */
        public set labelColor(value:number){
            if (this._labelColor != value) {
    			this._labelColor = value;
                if (this._label)this._label.color = value;
                this.invalidate();
            }
        }
        public get labelColor():number{
			return this._labelColor;
		}
		/**
		 * 设置文本字体 
		 * @param value
		 * 
		 */		
		public set fontName(value:string){
            if (this._fontName != value) {
                this._fontName = value;
    			this.invalidate();
            }
		}
		public get fontName():string{
			return this._fontName;
		}
		/**
		 * 设置文本字体大小 
		 * @param value
		 * 
		 */		
		public set fontSize(value:number){
            if (this._fontSize != value) {
                this._fontSize = value;
    			this.invalidate();				
            }
		}
		public get fontSize():number{
			return this._fontSize;
		}
        /**
        * 是否设置label显示左边距(即label在button中的x坐标)
        */
        public set labelMarginLeft(value:number){
            if (this._labelMarginLeft != value){
                this._setLabelMarginLeft = true;
                this._labelMarginLeft = value;
                this.invalidate();
            }
        }
		public get labelMarginLeft():number{
			return this._labelMarginLeft;
		}
		
		public set iconMarginLeft(value:number){
            if (this._iconMarginLeft != value) {
    			this._setIconMarginLeft = true;
    			this._iconMarginLeft = value;
    			this.invalidate();
            }
		}
		public get iconMarginLeft():number{
			return this._iconMarginLeft;
		}

        public set toggleGroup(value:string){
            if (StringUtil.isUsage(this._toggleGroup)){//旧的group
                EventManager.removeEventListener(Button.TOGGLE_PREFIX + this._toggleGroup, this.onEventToggle, this);
            }
            this._toggleGroup = value;//新的group
            if(StringUtil.isUsage(this._toggleGroup)){
                EventManager.addEventListener(Button.TOGGLE_PREFIX + this._toggleGroup, this.onEventToggle, this);
            }
        }

        public get toggleGroup():string {
            return this._toggleGroup;
        }
        private onEventToggle(event:MyEvent):void {
            if (StringUtil.isUsage(this._toggleGroup) && event.getItem("group") == this._toggleGroup && event.getItem("caller") != this){
                //console.log("0000 onEventToggle group=" + this._toggleGroup + ", data=" + this._data.id);
                this._selected = false;
                this._currentState = Button.STATE_UP;
                this.invalidate();
            }
        }
    }
}