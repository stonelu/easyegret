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

	export class VGroup extends Group{
		public _verticalGap:number = 2;
		public constructor(){
			super();
			this.layout = LayoutMode.VERTICAL;
		}
		/**
		 * 设置或获取参与布局元素间垂直像素间隔
		 */
		public get verticalGap():number{
			return this._verticalGap;
		}

		public set verticalGap(value:number){
			if(this._verticalGap != value){
				this._verticalGap = value;
				this.invalidate();
			}
		}
		public _verticalAlign:string = egret.VerticalAlign.TOP;
		/**
		 * 垂直方向布局方式
		 */
		public get verticalAlign():string{
			return this._verticalAlign;
		}

		public set verticalAlign(value:string){
			if(this._verticalAlign != value){
				this._verticalAlign = value;
				this.invalidate();
			}
		}
		/**
		 * 更新容器垂直布局
		 */
		public updateVerticalLayout():void{
			//var i:number = 0;
			//var child:egret.DisplayObject = null;
			//var childLast:egret.DisplayObject = null;
			//var hElements:number = 0;
			//
			//for(i = 0; i < this.numChildren; i++){
			//	hElements += this.getChildAt(i).height;
			//}
			//hElements += (this.numChildren - 1) * this._verticalGap;
			//for(i = 0; i < this.numChildren; i++){
			//	child = this.getChildAt(i);
			//	if(i == 0){
			//		if(this._verticalAlign == egret.VerticalAlign.TOP){
			//			child.y = 0;
			//		}else if(this._verticalAlign == egret.VerticalAlign.BOTTOM){
			//			child.y = this._height - hElements;
			//		}else if(this._verticalAlign == egret.VerticalAlign.MIDDLE){
			//			child.y = (this._height - hElements)/2;
			//		}
			//	}else {
			//		childLast = this.getChildAt(i - 1);
			//		child.y = childLast.y + childLast.height + this._verticalGap;
			//	}
			//	if(this._horizontalAlign == egret.HorizontalAlign.LEFT){
			//		child.x = 0;
			//	}else if(this._horizontalAlign == egret.HorizontalAlign.CENTER){
			//		child.x = (this._width - child.width)/2;
			//	}else if(this._horizontalAlign == egret.HorizontalAlign.RIGHT){
			//		child.x = this._width - child.width;
			//	}
			//}
		}
	}
}