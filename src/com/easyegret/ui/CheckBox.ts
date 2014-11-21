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

	export class CheckBox extends Group{
		public _btnNormal:Button = null;
		public _btnSelected:Button = null;
		public _label:Label = null;
		public _selected:boolean = false;
        
		public _textureNormal:Texture = null;
		public _textureSelected:Texture = null;
        
        private _initTextureData:boolean = false;//是否初始化过材质
        
        private _useDefaultSource:boolean = true;//采用默认素材
        
        public _labelOffsetX:number = 21;
        public _labelOffsetY:number = 0;
        
		public _locked:boolean = false;//锁定,不允许改变默认的勾选状态
        
		public constructor(){
			super();
		}
		public createChildren():void{
			super.createChildren();
            this.setSize(100, 25);
			this.showDefaultSkin = false;
            this.touchNonePixel = true;
            this._btnNormal = new Button();
            this.addChild(this._btnNormal);
            this._btnSelected = new Button();
            this.addChild(this._btnSelected);
            this._label = new Label();
            this.addChild(this._label);
            this._label.showDefaultSkin = false;

			this.addEventListener(TouchEvent.TOUCH, this.onTouchEvent, this);
		}
        public onTouchEvent(event : TouchEvent) : void {
            var touch : Touch = event.getTouch(this);
            if(!this.enabled){
                event.stopImmediatePropagation();
                return;
            }
            if (touch == null){
                this.invalidate();
                return;
            }
            
            if(touch.phase == TouchPhase.BEGAN) {
            } else if(touch.phase==TouchPhase.HOVER){
            } else if(touch.phase == TouchPhase.MOVED) {
            } else if(touch.phase == TouchPhase.ENDED) {
                this.selected = !this._selected;
            }
            this.invalidate();
        }
        private initTextureData():void {
            if (this._textureNormal == null && this._useDefaultSource) {
                this._textureNormal = Texture.fromBitmap(new DefaultNormalSource());
            }
            if (this._textureNormal){
                this._btnNormal.texture = this._textureNormal;
            }
            if (this._textureSelected == null && this._useDefaultSource) {
                this._textureSelected = Texture.fromBitmap(new DefaultSelectedSource());
            }
            if (this._textureSelected){
                this._btnSelected.texture = this._textureSelected;
            }
        }
		/**
		 * Draws the visual ui of the component.
		 */
		public draw():void{
            if (!this._initTextureData){
                this.initTextureData();
                this._initTextureData = true;
            }
            if (this._selected){
                this._btnSelected.visible = true;
                this._btnNormal.visible = false;
            } else {
                this._btnSelected.visible = false;
                this._btnNormal.visible = true;
            }
            this._label.x = this._labelOffsetX;
            this._label.y = this._labelOffsetY;
			super.draw();
		}
		
		///////////////////////////////////
		// event handler
		///////////////////////////////////
		/**
		 * Sets / gets the label text shown on this CheckBox.
		 */
		public set label(str:string){
            this._label.text = str;
		}
		
		public get label():string{
			return this._label.text;
		}
		/**
		 * Sets the label fontSize.
		 */		
		public set fontSize(size:number = 0){
			this._label.fontSize = size;
		}
		public get fontSize():number{
			return this._label.fontSize;
		}
		/**
		 * 当前显示Item的字体颜色
		 */
		public set labelColor(value:number = 0){
            this._label.color = value;
		}
		public get labelColor():number{
			return this._label.color;
		}
		/**
		 * Sets / gets the selected state of this CheckBox.
		 */
		public set selected(s:boolean){
            if (this._locked) return;
            if (this._selected != s) {
    			this._selected = s;
    			this.invalidate();                
            }
		}
		public get selected():boolean{
			return this._selected;
		}
		
		/**
		 * Sets/gets whether this component will be enabled or not.
		 */
		public set enabled(value:boolean){
			super.enabled = value;
		}
		
        public get labelOffsetX():number {
            return this._labelOffsetX;
        }

        public set labelOffsetX(value:number = 0){
            if (this._labelOffsetX != value) {
                this._labelOffsetX = value;
                this.invalidate();
            }
        }

        public get labelOffsetY():number {
            return this._labelOffsetY;
        }

        public set labelOffsetY(value:number = 0){
            if (this._labelOffsetY != value) {
                this._labelOffsetY = value;
                this.invalidate();
            }
        }

        /**
         * 是否锁定,不可切换状态.
         * @return 
         * 
         */		
        public get locked():boolean{
            return this._locked;
        }
        
        public set locked(value:boolean){
            this._locked = value;
        }
	}
}