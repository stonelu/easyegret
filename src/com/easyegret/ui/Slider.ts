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

	export class Slider extends Group{
		[Embed(this.source="scroll_handle_v.png")]
		public DefaultHandleVerticalSource:any;
		[Embed(this.source="scroll_track_v.png")]
		public DefaultTrackVerticalSource:any;
        
		[Embed(this.source="scroll_handle_h.png")]
		public DefaultHandleHorizontalSource:any;
		[Embed(this.source="scroll_track_h.png")]
		public DefaultTrackHorizontalSource:any;
        
        private _textureHandle:Texture = null;
        private _textureTrack:Texture = null;
        private _handle:Button = null;//滑块
        private _track:Button = null;//滑块导轨
        private _useDefaultSource:boolean = true;//采用默认素材
        
        private _handleScale9GridEnable:boolean = false;//滑块9宫格
        private _handleScaleEnable:boolean = false;//时候scale
        private _handleStatesLength:number = 3;//滑块的态数
        private _handleWidth:number = 13;//滑块宽
        private _handleHeight:number = 36;//滑块高
        private _handleOffset:number = 2;//滑块x偏移值
        
        private _trackClick:boolean = false;//导轨是否可以点击滑动滑块到导轨被点击的位置
        private _trackStatesLength:number = 3;//导轨的态数
        private _trackScaleEnable:boolean = false;//时候scale
        private _trackScale9GridEnable:boolean = false;//导轨9宫格
        private _trackVisible:boolean = true;//导轨是否可见
        
        private _initTextureData:boolean = false;//是否初始化过材质
        private _handlePoin:Point = new Point();//滑块坐标位置
        private _touchPoin:Point = new Point();//点击坐标位置
		public _direction:string = Style.VERTICAL;//朝向
        
        private _isDragging:boolean = false;//开始拖拽
        
        private _value:number = 0;//最终值
        private _maxValue:number = 100;//最大值
        private _minValue:number = 0;//最小值
        private _tickValue:number = 0.01;//最小刻度,必须大于0
		
		/**
		 * Constructor
		 */
		public constructor(orientation:string = Style.VERTICAL){
			super();
			this._direction = orientation;
		}

		public createChildren():void{
			super.createChildren();
			this.clip = false;
			if(this._direction == Style.HORIZONTAL){
				this.setSize(Style.SLIDER_WIDTH, Style.SLIDER_HEIGHT);
			}else {
				this.setSize(Style.SLIDER_HEIGHT, Style.SLIDER_WIDTH);
			}
            this._track = new Button();
            this._track.coolDownEabled = false;
            this._track.statesLength = this._trackStatesLength;
            this._track.scaleEnable = this._trackScaleEnable;
            this._track.scale9GridEnable = this._trackScale9GridEnable;
            this._track.useHandCursor = false;
            this._track.showDefaultSkin = false;
            this.trackClick = true;
			this.addChild(this._track);
            this.showDefaultSkin = false;
			
            this._handle = new Button();
            this._handle.coolDownEabled = false;
            this._handle.scaleEnable = this._handleScaleEnable;
            this._handle.statesLength = this._handleStatesLength;
            this._handle.scale9GridEnable = this._handleScale9GridEnable;
            this._handle.useHandCursor = true;
            this._handle.showDefaultSkin = false;
            this.addChild(this._handle);
            this._handle.addEventListener(TouchEvent.TOUCH, this.onTouchHandleEvent, this);
            this.trackClick = true;
            this.showDefaultSkin = false;
		}
        //导轨鼠标事件
        private onTouchTrackEvent(event:TouchEvent):void {
            if(!this.enabled) {
                event.stopImmediatePropagation();
                return;
            }
            var touch : Touch = event.getTouch(this);

            if (touch == null){
                this.invalidate();
                return;
            }
            
            if(touch.phase == TouchPhase.BEGAN) {
                this._handlePoin.x = this._handle.x;
                this._handlePoin.y = this._handle.y;
                this._touchPoin.x = touch.globalX;
                this._touchPoin.y = touch.globalY;
            } else if(touch.phase == TouchPhase.ENDED) {
                var localPoint:Point = this.globalToLocal(new Point(touch.globalX, touch.globalY));
                if(this._direction == Style.HORIZONTAL){//水平,x
                    if (localPoint.x > this._handle.x) {
                        this._handlePoin.x += this._handle.width;
                    } else {
                        this._handlePoin.x -= this._handle.width;
                    }
                }else {//竖直,y
                    if (localPoint.y > this._handle.y) {
                        this._handlePoin.y += this._handle.height;
                    } else {
                        this._handlePoin.y -= this._handle.height;
                    }
                }
                this.setHandlePoint();
                //计算value
                this.correctValue();
            }
        }
        //滑块的鼠标事件
        public onTouchHandleEvent(event:TouchEvent) : void {
            if(!this.enabled) {
                event.stopImmediatePropagation();
                return;
            }
            var touch : Touch = event.getTouch(this);
            if (touch == null){
                this._isDragging = false;
                this.invalidate();
                return;
            }
            
            if(touch.phase == TouchPhase.BEGAN && !this._isDragging) {
                // m_background.textures = new Scale9Textures(m_downState , m_scale9Grid);
                this._isDragging = true;
                this._handlePoin.x = this._handle.x;
                this._handlePoin.y = this._handle.y;
                this._touchPoin.x = touch.globalX;
                this._touchPoin.y = touch.globalY;
            } else if(touch.phase == TouchPhase.MOVED) {
                if(this._direction == Style.HORIZONTAL){//水平,x
                    this._handlePoin.x += touch.globalX - this._touchPoin.x;
                    this._touchPoin.x = touch.globalX;
                }else {//竖直,y
                    this._handlePoin.y += touch.globalY - this._touchPoin.y;
                    this._touchPoin.y = touch.globalY;
                }
                this.setHandlePoint();
                this.correctValue();
            } else if(touch.phase == TouchPhase.ENDED && this._isDragging) {
                this._isDragging = false;
            }
            //this.invalidate();
        }
        private setHandlePoint():void {
            this._handle.x = this._handlePoin.x;
            this._handle.y = this._handlePoin.y;
            if (this._handle.x < 0) this._handle.x = 0;
            if (this._handle.y < 0) this._handle.y = 0;
            if (this._handle.x + this._handle.width > this.width) this._handle.x = this.width - this._handle.width;
            if (this._handle.y + this._handle.height > this.height) this._handle.y = this.height - this._handle.height;
        }
        
        /**
         * 计算正确的value值
         */
        public correctValue():void{
            var nowValue:number = 0;
            if(this._direction == Style.HORIZONTAL){//水平
                nowValue = (this._maxValue - this._minValue)* (this._handle.x/(this.width- this._handle.width));
            }else {//竖直,y
                nowValue = (this._maxValue - this._minValue)* (this._handle.y/(this.height-this._handle.height));
            }
            if(this._maxValue > this._minValue){
                nowValue = Math.min(nowValue, this._maxValue);
                nowValue = Math.max(nowValue, this._minValue);
            }else{
                nowValue = Math.max(nowValue, this._maxValue);
                nowValue = Math.min(nowValue, this._minValue);
            }
            if (nowValue%this._tickValue != 0){
                nowValue -= nowValue%this._tickValue;
            }
            if (this._value != nowValue){
                this._value = nowValue;
                //trace("value=" + this._value);
                this.dispatchEventWith(Event.CHANGE);
            }
        }
        /**
         * 初始化导轨材质
         */        
        private initTrack():void {
            if(this._trackVisible) {
                this._track.visible = true;
                if (this._textureTrack == null && this._useDefaultSource){
                    if (this._direction == Style.HORIZONTAL){
                        this._textureTrack = Texture.fromBitmap(new DefaultTrackHorizontalSource());
                    } else {
                        this._textureTrack = Texture.fromBitmap(new DefaultTrackVerticalSource());
                    }
                }
                if (this._textureTrack){
                    this._track.texture = this._textureTrack;
                } else {
                    this._track.visible = false
                }
            }
        }
        /**
         * 初始化滑块
         */        
        private initHandle():void {
            if (this._textureHandle == null && this._useDefaultSource){
                if (this._direction == Style.HORIZONTAL){
                    this._textureHandle = Texture.fromBitmap(new DefaultHandleHorizontalSource());
                } else {
                    this._textureHandle = Texture.fromBitmap(new DefaultHandleVerticalSource());
                }
            }
            if (this._textureHandle){
                this._handle.texture = this._textureHandle;
            }
        }
        /**
         * Draws the visual ui of the component.
         */
        public draw():void{
            super.draw();
            if (!this._initTextureData){
                this.initTrack();
                this.initHandle();
                this._initTextureData = true;
            }
            if(this._direction == Style.HORIZONTAL){
                this._handle.setSize(this._handleHeight, this._handleWidth);
                this._handle.y = this._handleOffset;
            }else {
                this._handle.setSize(this._handleWidth, this._handleHeight);
                this._handle.x = this._handleOffset;
            }
            this._track.scaleEnable = this._trackScaleEnable;
            this._track.scale9GridEnable = this._trackScale9GridEnable;
            this._track.statesLength = this._trackStatesLength;
            if (this._trackScaleEnable || this._trackScale9GridEnable) {
                this._track.setSize(this.width, this.height);
            } else {
                if(this._direction == Style.HORIZONTAL){
                    this._track.y = (this.width - this._track.width)/2;
                }else {
                    this._track.x = (this.width - this._track.width)/2;
                }
            }
            this._handle.scale9GridEnable = this._handleScale9GridEnable;
            this._handle.statesLength = this._handleStatesLength;
            if (this._handleScaleEnable || this._handleScale9GridEnable) {
                this._handle.setSize(this.width, this.height);
            }
        }

		///////////////////////////////////
		// public methods
		///////////////////////////////////
		public set showDefaultSkin(value:boolean){
            if (this._showDefaultSkin != value) {
    			if (this._track)this._track.showDefaultSkin = value;
                if (this._handle)this._handle.showDefaultSkin = value;
    			super.showDefaultSkin = value;
                this.invalidate();
            }
		}
		///////////////////////////////////
		// getter/setters
		///////////////////////////////////
		/**
		 * Sets / gets whether or not a click on the background of the slider will move the handler to that position.
		 */
		public set trackClick(b:boolean){
            if (this._trackClick != b){
    			this._trackClick = b;
                if (this._trackClick){
                    this._track.addEventListener(TouchEvent.TOUCH, this.onTouchTrackEvent, this);
                } else {
                    this._track.removeEventListener(TouchEvent.TOUCH, this.onTouchTrackEvent, this);
                }
    			this.invalidate();
            }
		}
		public get trackClick():boolean{
			return this._trackClick;
		}

        public get direction():string {
            return this._direction;
        }
        /**
         * 设置方向
         */
        public set direction(value:string) {
            if (this._direction != value) {
                this._direction = value;
                this._initTextureData = false;
                if(this._direction == Style.HORIZONTAL){
                    this.setSize(this.height, this.width);
                }else {
                    this.setSize(this.width, this.height);
                }
                this.invalidate();
            }
        }

        public get textureHandle():Texture {
            return this._textureHandle;
        }
        /**
         * 滑块材质设置 
         * @param value
         * 
         */        
        public set textureHandle(value:Texture) {
            if (this._textureHandle != value) {
                this._textureHandle = value;
                this.invalidate();
            }
        }

        public get textureTrack():Texture {
            return this._textureTrack;
        }
        /**
         * 导轨材质设置 
         * @param value
         * 
         */
        public set textureTrack(value:Texture) {
            if (this._textureTrack != value) {
                this._textureTrack = value;
                this.invalidate();
            }
        }

        public get handle():Button {
            return this._handle;
        }

        public get track():Button {
            return this._track;
        }

        public get handleScale9GridEnable():boolean {
            return this._handleScale9GridEnable;
        }
        /**
         * 设置滑块九宫格开启 
         * @param value
         * 
         */
        public set handleScale9GridEnable(value:boolean) {
            if (this._handleScale9GridEnable != value) {
                this._handleScale9GridEnable = value;
                this.invalidate();
            }
        }

        public get handleScaleEnable():boolean {
            return this._handleScaleEnable;
        }
        /**
         *设置滑块缩放开启 9宫格开启,则该设置无效
         * @param value
         * 
         */
        public set handleScaleEnable(value:boolean) {
            if (this._handleScaleEnable != value) {
                this._handleScaleEnable = value;
                this.invalidate();
            }
        }

        public get handleStatesLength():number {
            return this._handleStatesLength;
        }
        /**
         * 滑块的态数
         * @param value
         * 
         */
        public set handleStatesLength(value:number = 0) {
            if (this._handleStatesLength != value) {
                this._handleStatesLength = value;
                this.invalidate();
            }
        }

        public get handleWidth():number {
            return this._handleWidth;
        }
        /**
         * 滑块宽 
         * @param value
         * 
         */
        public set handleWidth(value:number) {
            if (this._handleWidth != value) {
                this._handleWidth = value;
                this.invalidate();
            }
        }

        public get handleHeight():number {
            return this._handleHeight;
        }
        /**
         * 滑块高 
         * @param value
         * 
         */
        public set handleHeight(value:number) {
            if (this._handleHeight != value) {
                this._handleHeight = value;
                this.invalidate();
            }
        }

        public get handleOffset():number {
            return this._handleOffset;
        }
        /**
         * 滑块偏移量 
         * @param value
         * 
         */
        public set handleOffset(value:number = 0) {
            if (this._handleOffset != value) {
                this._handleOffset = value;
                this.invalidate();
            }
        }

        public get trackStatesLength():number {
            return this._trackStatesLength;
        }
        /**
         *导轨态数 
         * @param value
         * 
         */
        public set trackStatesLength(value:number = 0) {
            if (this._trackStatesLength != value) {
                this._trackStatesLength = value;
                this.invalidate();
            }
        }

        public get trackScaleEnable():boolean {
            return this._trackScaleEnable;
        }
        /**
         * 导轨缩放开启设置 
         * @param value
         * 
         */
        public set trackScaleEnable(value:boolean) {
            if (this._trackScaleEnable != value) {
                this._trackScaleEnable = value;
                this.invalidate();
            }
        }

        public get trackScale9GridEnable():boolean {
            return this._trackScale9GridEnable;
        }
        /**
         * 导轨九宫格开启设置 
         * @param value
         * 
         */
        public set trackScale9GridEnable(value:boolean) {
            if (this._trackScale9GridEnable != value) {
                this._trackScale9GridEnable = value;
                this.invalidate();
            }
        }

        public get trackVisible():boolean {
            return this._trackVisible;
        }
        /**
         * 导轨可见设置 
         * @param value
         * 
         */
        public set trackVisible(value:boolean) {
            if (this._trackVisible != value) {
                this._trackVisible = value;
                this.invalidate();
            }
        }

        public get value():number {
            return this._value;
        }
        /**
         * 设置 
         * @param value
         * 
         */
        public set value(value:number) {
            if (this._value != value) {
                this._value = value;
                if (this._value < this._minValue) this._value = this._minValue;
                if (this._value > this._maxValue) this._value = this._maxValue;
                //反向计算handle的位置
                if(this._direction == Style.HORIZONTAL){//水平,x
                    this._handlePoin.x = this.value/(this._maxValue - this._minValue)* (this.width - this._handle.width);
                    this._handlePoin.y = this.handleOffset;
                }else {//竖直,y
                    this._handlePoin.x = this.handleOffset;
                    this._handlePoin.y = this.value/(this._maxValue - this._minValue)* (this.height - this._handle.height);
                }
                this.setHandlePoint();
            }
        }

        public get maxValue():number {
            return this._maxValue;
        }
        /**
         * 设置最大值,默认100 
         * @param value
         * 
         */
        public set maxValue(value:number) {
            this._maxValue = value;
        }

        public get minValue():number {
            return this._minValue;
        }
        /**
         *设置最小值,默认0 
         * @param value
         * 
         */
        public set minValue(value:number) {
            this._minValue = value;
        }

        public get tickValue():number {
            return this._tickValue;
        }
        /**
         * 步进值 
         * @param value
         * 
         */
        public set tickValue(value:number) {
            this._tickValue = value;
        }
	}
}