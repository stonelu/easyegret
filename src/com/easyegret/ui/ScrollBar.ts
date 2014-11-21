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

	export class ScrollBar extends Group{
        [Embed(this.source="scroll_down.png")]
        public DefaultDownSource:any;
        [Embed(this.source="scroll_up.png")]
        public DefaultUpSource:any;
        [Embed(this.source="scroll_left.png")]
        public DefaultLeftSource:any;
        [Embed(this.source="scroll_right.png")]
        public DefaultRightSource:any;
        
		public _slider:Slider = null;
		public _btnThumbPre:Button = null;
		public _btnThumbNext:Button = null;
        
		public _autoHide:boolean = false;
        public _isHide:boolean = false;//是否隐藏
		public _direction:string = Style.VERTICAL;
        
        //材质设定
        private _textureBtnPre:Texture = null;//向前按钮材质
        private _textureBtnNext:Texture = null;//向后按钮材质
        
        private _initTextureData:boolean = false;//是否初始化过材质
        
        private _useDefaultSource:boolean = true;//采用默认素材
        
        private _thumbOffset:number = 2;
        
		public constructor(){
			super();
		}
        /**
         * Creates and adds the child display objects of this component.
         */
        public createChildren():void{
            super.createChildren();
            this._btnThumbPre = new Button();
            this.addChild(this._btnThumbPre);
            this._btnThumbNext = new Button();
            this.addChild(this._btnThumbNext);
            this._slider = new Slider();
            this.addChild(this._slider);
            this.trackScaleEnable = true;
            //this.showDefaultSkin = false;
            this._btnThumbPre.addEventListener(TouchEvent.TOUCH, this.onTouchEventBtnPre, this);
            this._btnThumbNext.addEventListener(TouchEvent.TOUCH, this.onTouchEventBtnNext, this);
            if(this._direction == Style.HORIZONTAL){
                this.setSize(Style.SCROLLBAR_WIDTH, Style.SCROLLBAR_HEIGHT);
            }else {
                this.setSize(Style.SCROLLBAR_HEIGHT, Style.SCROLLBAR_WIDTH);
            }
        }

        /**
         * 按钮材质初始化
         */        
        private initButtonData():void {
            //pre
            if (this._textureBtnPre == null && this._useDefaultSource) {
                if (this._direction == Style.HORIZONTAL) {
                    this._textureBtnPre = Texture.fromBitmap(new DefaultLeftSource());
                } else {
                    this._textureBtnPre = Texture.fromBitmap(new DefaultUpSource());
                }
            }
            if (this._textureBtnPre){
                this._btnThumbPre.texture = this._textureBtnPre;
            }
            //next
            if (this._textureBtnNext == null && this._useDefaultSource) {
                if (this._direction == Style.HORIZONTAL) {
                    this._textureBtnNext = Texture.fromBitmap(new DefaultRightSource());
                } else {
                    this._textureBtnNext = Texture.fromBitmap(new DefaultDownSource());
                }
            }
            if (this._textureBtnNext){
                this._btnThumbNext.texture = this._textureBtnNext;
            }
        }
        /**
         * 向前按钮点击事件 
         * @param event
         */        
        private onTouchEventBtnPre(event:TouchEvent) : void {
            var touch : Touch = event.getTouch(this);
            if(!this.enabled){
                event.stopImmediatePropagation();
                return;
            }
            if (touch == null){
                return;
            }
            
            if(touch.phase == TouchPhase.ENDED) {
                this._slider.value -= 1;
            }
        }
        /**
         * 先后按钮点击事件 
         * @param event
         */        
        private onTouchEventBtnNext(event:TouchEvent) : void {
            var touch : Touch = event.getTouch(this);
            if(!this.enabled){
                event.stopImmediatePropagation();
                return;
            }
            if (touch == null){
                return;
            }
            
            if(touch.phase == TouchPhase.ENDED) {
                this._slider.value += 1;
            }
        }
        
		public set showDefaultSkin(value:boolean){
            if (this.showDefaultSkin != value) {
    			this._btnThumbNext.showDefaultSkin = value;
                this._btnThumbPre.showDefaultSkin = value;
    			this._slider.showDefaultSkin = value;
    			super.showDefaultSkin = value;
                this.invalidate();
            }
		}
        /**
         * slider材质初始化
         */        
        private initSliderData():void {
            if (this._direction == Style.HORIZONTAL) {
            } else {
            }
        }
		/**
		 * Draws the visual ui of the component.
		 */
		public draw():void{
			super.draw();
            if (!this._initTextureData) {
                this.initButtonData();
                this.initSliderData();
                this._initTextureData  = true;
            }
            if (!this._btnThumbPre.scale9GridEnable && !this._btnThumbPre.scaleEnable){
                this._btnThumbPre.readjustSize();
                this._btnThumbNext.readjustSize();
            }
            //位置
            if (this._direction == Style.HORIZONTAL) {
                this._btnThumbPre.x = 0;
                this._btnThumbPre.y = this._thumbOffset;
                this._btnThumbNext.x = this.width - this._btnThumbNext.width;
                this._btnThumbNext.y = this._thumbOffset;
                this._slider.x = this._btnThumbPre.width;
                this._slider.y = 0;
                this._slider.width = this.width - 2*this._btnThumbPre.width;
                this._slider.height = this.height;
            } else {
                this._btnThumbPre.x = this._thumbOffset;
                this._btnThumbPre.y = 0;
                this._btnThumbNext.x = this._thumbOffset;
                this._btnThumbNext.y = this.height - this._btnThumbNext.height;
                this._slider.x = 0;
                this._slider.y = this._btnThumbPre.height;
                this._slider.width = this.width;
                this._slider.height = this.height - 2*this._btnThumbPre.height;
            }
		}
        public get textureThumbPre():Texture {
            return this._textureBtnPre;
        }

        public set textureThumbPre(value:Texture) {
            if (this._textureBtnPre != value){
                this._useDefaultSource = false;
                this._initTextureData = false;
                this._textureBtnPre = value;
                this.invalidate();
            }
        }

        public get textureThumbNext():Texture {
            return this._textureBtnNext;
        }

        public set textureThumbNext(value:Texture) {
            if (this._textureBtnNext != value){
                this._useDefaultSource = false;
                this._initTextureData = false;
                this._textureBtnNext = value;
                this.invalidate();
            }
        }

        public get thumbScale9GridEnable():boolean {
            return this._btnThumbNext.scale9GridEnable;
        }

        public set thumbScale9GridEnable(value:boolean) {
            this._btnThumbNext.scale9GridEnable = value;
            this._btnThumbPre.scale9GridEnable = value;
        }

        public get thumbScaleEnable():boolean {
            return this._btnThumbNext.scaleEnable;
        }

        public set thumbScaleEnable(value:boolean) {
            this._btnThumbNext.scaleEnable = value;
            this._btnThumbPre.scaleEnable = value;
        }

        public get thumbStatesLength():number {
            return this._btnThumbNext.statesLength;
        }

        public set thumbStatesLength(value:number = 0) {
            this._btnThumbNext.statesLength = value;
            this._btnThumbPre.statesLength = value;
        }

        public get thumbWidth():number {
            return this._btnThumbNext.width;
        }

        public set thumbWidth(value:number) {
            this._btnThumbNext.width = value;
            this._btnThumbPre.width = value;
        }

        public get thumbHeight():number {
            return this._btnThumbNext.height;
        }

        public set thumbHeight(value:number) {
            this._btnThumbNext.height = value;
            this._btnThumbPre.height = value;
        }

        public get thumbOffset():number {
            return this._thumbOffset;
        }

        public set thumbOffset(value:number = 0) {
            if (this._thumbOffset != value){
                this._thumbOffset = value;
                this.invalidate();
            }
        }
        public get handleScale9GridEnable():boolean {
            return this._slider.handleScale9GridEnable ;
        }
        /**
         * 设置滑块九宫格开启 
         * @param value
         * 
         */
        public set handleScale9GridEnable(value:boolean) {
            this._slider.handleScale9GridEnable = value;
        }
        
        public get handleScaleEnable():boolean {
            return this._slider.handleScaleEnable ;
        }
        /**
         *设置滑块缩放开启 9宫格开启,则该设置无效
         * @param value
         */
        public set handleScaleEnable(value:boolean) {
            this._slider.handleScaleEnable = value;
        }
        
        public get handleStatesLength():number {
            return this._slider.handleStatesLength ;
        }
        /**
         * 滑块的态数
         * @param value
         * 
         */
        public set handleStatesLength(value:number = 0) {
            this._slider.handleStatesLength = value;
        }
        
        public get handleWidth():number {
            return this._slider.handleWidth ;
        }
        /**
         * 滑块宽 
         * @param value
         * 
         */
        public set handleWidth(value:number) {
            this._slider.handleWidth = value;
        }
        
        public get handleHeight():number {
            return this._slider.handleHeight ;
        }
        /**
         * 滑块高 
         * @param value
         * 
         */
        public set handleHeight(value:number) {
            this._slider.handleHeight = value;
        }
        
        public get handleOffset():number {
            return this._slider.handleOffset ;
        }
        /**
         * 滑块偏移量 
         * @param value
         * 
         */
        public set handleOffset(value:number = 0) {
            this._slider.handleOffset = value;
        }
        
        public get trackStatesLength():number {
            return this._slider.trackStatesLength ;
        }
        /**
         *导轨态数 
         * @param value
         * 
         */
        public set trackStatesLength(value:number = 0) {
            this._slider.trackStatesLength = value;
        }
        
        public get trackScaleEnable():boolean {
            return this._slider.trackScaleEnable ;
        }
        /**
         * 导轨缩放开启设置 
         * @param value
         * 
         */
        public set trackScaleEnable(value:boolean) {
            this._slider.trackScaleEnable = value;
        }
        
        public get trackScale9GridEnable():boolean {
            return this._slider.trackScale9GridEnable ;
        }
        /**
         * 导轨九宫格开启设置 
         * @param value
         * 
         */
        public set trackScale9GridEnable(value:boolean) {
            this._slider.trackScale9GridEnable = value;
        }
        
        public get trackVisible():boolean {
            return this._slider.trackVisible ;
        }
        /**
         * 导轨可见设置 
         * @param value
         * 
         */
        public set trackVisible(value:boolean) {
            this._slider.trackVisible = value;
        }
        
        public get value():number {
            return this._slider.value ;
        }
        /**
         * 设置 
         * @param value
         * 
         */
        public set value(value:number) {
            this._slider.value = value;
        }
        
        public get maxValue():number {
            return this._slider.maxValue;
        }
        /**
         * 设置最大值,默认100 
         * @param value
         * 
         */
        public set maxValue(value:number) {
            this._slider.maxValue = value;
        }
        
        public get minValue():number {
            return this._slider.minValue;
        }
        /**
         *设置最小值,默认0 
         * @param value
         * 
         */
        public set minValue(value:number) {
            this._slider.minValue = value;
        }
        
        public get tickValue():number {
            return this._slider.tickValue;
        }
        /**
         * 步进值 
         * @param value
         * 
         */
        public set tickValue(value:number) {
            this._slider.tickValue = value;
        }

        public get slider():Slider {
            return this._slider;
        }

        public get btnThumbPre():Button {
            return this._btnThumbPre;
        }

        public get btnThumbNext():Button {
            return this._btnThumbNext;
        }

        public get direction():string {
            return this._direction;
        }

        public set direction(value:string) {
            if (this._direction != value) {
                this._direction = value;
                this._slider.direction = value;
                this._initTextureData = false;
                if(this._direction == Style.HORIZONTAL){
                    this.setSize(this.height, this.width);
                }else {
                    this.setSize(this.width, this.height);
                }
                this.invalidate();
            }
        }

	}
}