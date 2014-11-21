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
	 * 水平放置的容器
	 */
	export class HGroup extends BaseGroup{
		public _gap:number = 2;
		public _horizontalAlign:string = egret.HorizontalAlign.LEFT;
		public _verticalAlign:string = egret.VerticalAlign.MIDDLE;
		private _hasInvalidate:boolean = false;//是否下一帧重绘
		public constructor(){
			super();
		}

		/**
		 * 初始化主场景的组件
		 * 这个方法在对象new的时候就调用,因为有些ui必须在加入stage之前就准备好
		 * 子类覆写该方法,添加UI逻辑
		 */
		public createChildren():void {
			super.createChildren();
			this.invalidate();
		}

		/**
		 * 设置或获取参与布局元素间水平像素间隔
		 */
		public get gap():number{
			return this._gap;
		}

		public set gap(value:number){
			if(this._gap != value){
				this._gap = value;
				this.invalidate();
			}
		}

		/**
		 * 水平方向布局方式
		 */
		public get horizontalAlign():string{
			return this._horizontalAlign;
		}

		public set horizontalAlign(value:string){
			if(this._horizontalAlign != value){
				this._horizontalAlign = value;
				this.invalidate();
			}
		}
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
		 * 设置宽
		 * @param value
		 */
		public set width(value:number){
			if (this.width != value) {
				//this.width = value;
				this._setWidth(value);
				this.invalidate();
			}
		}
		/**
		 * 设置高
		 * @param value
		 */
		public set height(value:number){
			if (this.height != value) {
				//this.height = value;
				this._setHeight(value);
				this.invalidate();
			}
		}

		/**
		 * 属性失效,需要下一帧重新绘制更新
		 */
		public invalidate():void{
			if(!this._hasInvalidate)this.addEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
			this._hasInvalidate = true;
		}
		/**
		 * 重绘通知
		 */
		public onInvalidate(event:Event):void{
			this.removeEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
			this._hasInvalidate = false;
			this.draw();
		}
		/**
		 * 更新显示组件的各项属性,重新绘制显示
		 */
		public draw():void{
			this.updateLayout();
		}
		/**
		 * 更新容器水平布局
		 */
		public updateLayout():void{
			var i:number = 0;
			var child:egret.DisplayObject = null;
			var childLast:egret.DisplayObject = null;
			var wElements:number = 0;

			for(i = 0; i < this.numChildren; i++){
				wElements += this.getChildAt(i)._explicitWidth;
			}
			wElements += (this.numChildren - 1) * this._gap;
			for(i = 0; i < this.numChildren; i++){
				child = this.getChildAt(i);
				if(i == 0){
					if(this._horizontalAlign == egret.HorizontalAlign.LEFT){
						child.x = 0;
					}else if(this._horizontalAlign == egret.HorizontalAlign.CENTER){
						child.x = (this._explicitWidth - wElements)/2;
					}else if(this._horizontalAlign == egret.HorizontalAlign.RIGHT){
						child.x = this._explicitWidth - wElements;
					}
				}else {
					childLast = this.getChildAt(i - 1);
					child.x = childLast.x + childLast._explicitWidth + this.gap;
				}
				if(this._verticalAlign == egret.VerticalAlign.TOP){
					child.y = 0;
				}else if(this._verticalAlign == egret.VerticalAlign.MIDDLE){
					child.y = (this._explicitHeight - child._explicitHeight)/2;
				}else if(this._verticalAlign == egret.VerticalAlign.BOTTOM){
					child.y = this._explicitHeight - child._explicitHeight;
				}
			}
		}
	}
}