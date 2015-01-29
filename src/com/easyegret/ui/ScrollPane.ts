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

	export class ScrollPane extends Group {
        /**
         * 显示所有滚动条 
         */		
        public static DISPLAY_SCROLL_BOTH:string = "both";
        /**
         * 不显示滚动条 
         */		
        public static DISPLAY_SCROLL_NONE:string = "none";
        /**
         * 显示水平滚动条 
         */		
        public static DISPLAY_SCROLL_HORIZONTAL:string = "horizontal";
        /**
         * 显示垂直滚动条 
         */		
        public static DISPLAY_SCROLL_VERTICAL:string = "vertical";
        
        
        public verticalScrollBar:VScrollBar = null;
        public horizontalScrollBar:HScrollBar = null;
        
        private _scrollBarDisplay:string = null;//滚动条显示方式
        public constructor() {
            super();
        }
        /**
         * 创建元素
         */        
        public createChildren():void{
            super.createChildren();
        }
        public set showDefaultSkin(value:boolean){
            super.showBg = value;
        }
        /**
         * Draws the visual ui of the component.
         */
        public draw():void{
            if (!this.verticalScrollBar && this._scrollBarDisplay != ScrollPane.DISPLAY_SCROLL_NONE && this._scrollBarDisplay != ScrollPane.DISPLAY_SCROLL_HORIZONTAL){
                this.verticalScrollBar = new VScrollBar();
            }
            if (!this.horizontalScrollBar && this._scrollBarDisplay != ScrollPane.DISPLAY_SCROLL_NONE && this._scrollBarDisplay != ScrollPane.DISPLAY_SCROLL_VERTICAL){
                this.horizontalScrollBar = new HScrollBar();
            }
            if (this._scrollBarDisplay == ScrollPane.DISPLAY_SCROLL_BOTH && this._scrollBarDisplay == ScrollPane.DISPLAY_SCROLL_VERTICAL) {
                if (!this.verticalScrollBar.parent) {
                    this.addChild(this.verticalScrollBar);
                }
                if (this.horizontalScrollBar.parent) {
                    this.horizontalScrollBar.parent.removeChild(this.horizontalScrollBar);
                }
            }
            if (this._scrollBarDisplay == ScrollPane.DISPLAY_SCROLL_BOTH && this._scrollBarDisplay == ScrollPane.DISPLAY_SCROLL_HORIZONTAL) {
                if (!this.horizontalScrollBar.parent) {
                    this.addChild(this.horizontalScrollBar);
                }
                if (this.verticalScrollBar.parent) {
                    this.verticalScrollBar.parent.removeChild(this.verticalScrollBar);
                }
            }
        }

        public get scrollBarDisplay():string {
            return this._scrollBarDisplay;
        }
        /**
         * 滚动条显示方式
         * @param value
         */
        public set scrollBarDisplay(value:string) {
            if (this._scrollBarDisplay != value) {
                this._scrollBarDisplay = value;
                this.invalidate();
            }
        }

    }
}