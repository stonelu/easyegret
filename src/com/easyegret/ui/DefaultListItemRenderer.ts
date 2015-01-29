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

	export class DefaultListItemRenderer extends Group implements IListItemRenderer{
		public _label:Label;
		public _defaultColor:number = Style.BACKGROUND;
		public _selectedColor:number = 0xdddddd;
		public _rolloverColor:number = Style.BUTTON_DOWN;
		public _selected:boolean;
		public _mouseOver:boolean = false;
        public _index:number = 0;
		public _labelField:string = "label";
		public constructor(){
			super();
		}
		
		public createChildren():void{
			super.createChildren();
            this.setSize(100, 20);
			this._label = new Label();
			this._label.x = 5;
			this._label.y = 0;
			this.addChild(this._label);
			this._label.showBg = false;
			this._label.draw();
//			showDefaultSkin = false;
		}
		///////////////////////////////////
		// public methods
		///////////////////////////////////
		
		/**
		 * Draws the visual ui of the component.
		 */
		public draw() : void{
			if(this._data == null) return;
			
			if(typeof(this._data) == "string"){
				this._label.text = <string><any> (this._data);
			}else if(this._data.hasOwnProperty(this._labelField)){
				this._label.text = this._data[this._labelField];
			}else{
				this._label.text = this._data.toString();
			}
//            if (this._selected) {
//    			setSize(100, 40);
//            } else {
//    			setSize(100, 20);
//            }
            if (this._mouseOver) {
                this.bgColor = 0xffffff;
                this._label.color = Style.BUTTON_FACE;
            } else {
                this._label.color = Style.LIST_ROLLOVER;
                this.bgColor = this._defaultColor;
            }
            //trace(this._mouseOver);
			super.draw();
		}
		
		
		///////////////////////////////////
		// getter/setters
		///////////////////////////////////
		
		/**
		 * Sets/gets the string that appears in this item.
		 */
		public set data(value:any){
			this._data = value;
			this.invalidate();
		}
		/**
		 * Sets/gets whether or not this item is selected.
		 */
		public set selected(value:boolean){
            if (this._selected != value) {
    			this._selected = value;
    			this.invalidate();
            }
		}
		public get selected():boolean{
			return this._selected;
		}
		public get labelField():string{
			return this._labelField;
		}
		
		public set labelField(value:string){
            if (this._labelField != value) {
    			this._labelField = value;
    			this.invalidate();
            }
		}
        
        public set rollover(value:boolean) {
            if (this._mouseOver != value) {
                this._mouseOver = value;
                this.invalidate();
            }
        }
	}
}