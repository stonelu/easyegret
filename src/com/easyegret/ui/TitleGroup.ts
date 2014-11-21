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

	export class TitleGroup extends Group{
		public constructor(){
			super();
		}

		public _columnWidth:number = 0;
		/**
		 * tile布局列宽
		 */
		public get columnWidth():number{
			return this._columnWidth;
		}

		public set columnWidth(value:number){
			if(this._columnWidth != value){
				this._columnWidth = value;
				this.invalidate();
			}
		}

		public _rowHeight:number = 0;
		/**
		 * tile布局行高
		 */
		public get rowHeight():number{
			return this._rowHeight;
		}

		public set rowHeight(value:number){
			if(this._rowHeight != value){
				this._rowHeight = value;
				this.invalidate();
			}
		}

		public _requestedColumnCount:number = 1;
		/**
		 * tile布局列数
		 */
		public get requestedColumnCount():number{
			return this._requestedColumnCount;
		}

		public set requestedColumnCount(value:number){
			if(this._requestedColumnCount != value){
				this._requestedColumnCount = value;
				this.invalidate();
			}
		}

		public _requestedRowCount:number = 1;
		/**
		 * tile布局行数
		 */
		public get requestedRowCount():number{
			return this._requestedRowCount;
		}

		public set requestedRowCount(value:number){
			if(this._requestedRowCount != value){
				this._requestedRowCount = value;
				this.invalidate();
			}
		}
		public _tileHDirectionBeginFromLeft:boolean = true;

		/**
		 * tile布局水平流次序.true,左；right,右.
		 */
		public get tileHDirectionBeginFromLeft():boolean{
			return this._tileHDirectionBeginFromLeft;
		}

		/**
		 * @private
		 */
		public set tileHDirectionBeginFromLeft(value:boolean){
			this._tileHDirectionBeginFromLeft = value;
			if(this._layout == LayoutMode.TILE){
				this.invalidate();
			}
		}


		/**
		 * 更新容器布局
		 */
		public updateLayout():void{
			switch(this._layout){
				case LayoutMode.HORIZONTAL:{
					this.updateHorizontalLayout();
					break;
				}
				case LayoutMode.VERTICAL:{
					this.updateVerticalLayout();
					break;
				}
				case LayoutMode.TILE:{
					this.updateTileLayout();
					break;
				}
				default:{
					break;
				}
			}
		}


		/**
		 * 更新容器平铺布局
		 *
		 */
		public updateTileLayout():void{
			var i:number = 0;//循环参数
			var columnCount:number = 0;//列好
			var rowCount:number = 0;//行号
			var child:egret.DisplayObject = null;
			var xOffset:number = 0;//child阵列整体水平偏移
			var yOffset:number = 0;//child阵列整体垂直偏移
//			var childLast:DisplayObject = null;
			var wElements:number = (this.numChildren >= this.requestedColumnCount?this.requestedColumnCount:this.numChildren) * this.columnWidth + ((this.numChildren >= this.requestedColumnCount?this.requestedColumnCount:this.numChildren) - 1)*this.horizontalGap;
			var hElements:number = Math.ceil(this.numChildren/this.requestedColumnCount) * this.rowHeight + Math.floor(this.numChildren/this.requestedColumnCount) * this.verticalGap;
			//if(this._verticalAlign == egret.VerticalAlign.TOP){
			//	yOffset = 0;
			//}else if(this._verticalAlign == egret.VerticalAlign.MIDDLE){
			//	yOffset = (this._height - hElements)/2;
			//}else if(this._verticalAlign == egret.VerticalAlign.BOTTOM){
			//	yOffset = this._height - hElements;
			//}
			//if(this._horizontalAlign == egret.HorizontalAlign.LEFT){
			//	xOffset = 0;
			//}else if(this._horizontalAlign == egret.HorizontalAlign.CENTER){
			//	xOffset = (this._width - wElements)/2;
			//}else if(this._horizontalAlign == egret.HorizontalAlign.RIGHT){
			//	xOffset = this._width - wElements;
			//}
			for(i = 0; i < this.numChildren; i++){+89
				child = this.getChildAt(i);
				columnCount = this.tileHDirectionBeginFromLeft?(i%this.requestedColumnCount):(this.requestedColumnCount - i%this.requestedColumnCount - 1);
				rowCount = Math.floor(i/this.requestedColumnCount);
				child.x = (this.columnWidth - child.width)/2 + columnCount*this.columnWidth + columnCount*this.horizontalGap + xOffset;
				child.y = (this.rowHeight - child.height)/2 + rowCount*this.rowHeight + rowCount*this.verticalGap + yOffset;
			}
		}
	}
}