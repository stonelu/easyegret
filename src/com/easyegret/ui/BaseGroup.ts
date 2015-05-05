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
	 * 简单的对DisplayObjectContainer进行扩展
	 * 加入基础布局的算法
	 */
	export class BaseGroup extends egret.DisplayObjectContainer {
		//private _width:number = 0;
		//private _height:number = 0;
		private _top:number = 0;
		private _topEnabled:boolean = false;
		private _left:number = 0;
		private _leftEnabled:boolean = false;
		private _bottom:number = 0;
		private _bottomEnabled:boolean = false;
		private _right:number = 0;
		private _rightEnabled:boolean = false;
		private _horizontalEnabled:boolean = false;
		private _horizontalCenter:number = 0;
		private _verticalEnabled:boolean = false;
		private _verticalCenter:number = 0;
		public _data:any;//可携带的数据
		private _enabled:boolean = true;//不可用状态

		private _hasInvalidatePosition:boolean = false;//是否已经标记重新计算位置布局
        /**
         * 延迟绘制,使用在easy ui生成的代码,等待到材质validation后,再进行绘制渲染
         */
        private _drawDelay:boolean = false;
        private _hasInvalidate:boolean = false;//是否下一帧重绘

        public constructor(drawDelay:boolean = false) {
			super();
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this._drawDelay = drawDelay;
            //console.log("this._drawDelay=" + this._drawDelay)
		}
		/**
		 * 第一次加入场景的时候会运行该方法
		 */
		public onAddToStage(event:Event):void {
			this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
			this.createChildren();//先创建
			this.initData();
            //console.log("222222this._drawDelay=" + this._drawDelay)
		}

		/**
		 * 初始化一些必要的逻辑数据
		 * 这个方法是在第一次加入stage的时候,做调用
		 */
		public initData():void {
			this.resetPosition();
		}
        /**
         * 初始化主场景的组件
		 * 这个方法在对象new的时候就调用,因为有些ui必须在加入stage之前就准备好
         * 子类覆写该方法,添加UI逻辑
         */
        public createChildren():void {
			this.touchEnabled = false;//默认不接受事件
            this.width = 100;
            this.height = 100;
        }
		private invalidatePosition():void{
			//SystemHeartBeat.addEventListener(this.onHeartBeatInvalidate, 1, 1);
			if(!this._hasInvalidatePosition)this.addEventListener(egret.Event.ENTER_FRAME, this.onInvalidatePosition, this);
			this._hasInvalidatePosition = true;
		}
		private onInvalidatePosition():void {
			this.resetPosition();//重新计算布局位置
		}
		public set width(w:number){
			if(w > 0){
				this._setWidth(w);
                this.invalidate();
			}
		}
        public get width():number {
			//console.log("@@@BaseGroup =" + this._explicitWidth);
			if (this._explicitWidth == NaN || this._explicitWidth == undefined) return 0;
            return this._explicitWidth;
		}
		public set height(h:number){
			if(h > 0){
				this._setHeight(h);
                this.invalidate();
			}
		}
		public get height():number {
			if (this._explicitHeight == NaN || this._explicitHeight == undefined) return 0;
			return this._explicitHeight;
        }

        /**
         * Moves the component to the specified position.
         * @param xpos the x position to move the component
         * @param ypos the y position to move the component
         */
        public move(xpos:number, ypos:number):void {
            this.x = xpos;;
            this.y = ypos;;
        }
        /**
         * Sets the size of the component.
         * @param w The width of the component.
         * @param h The height of the component.
         */
        public setSize(w:number, h:number):void {
			if(this.width != w || this.height != h) {
				this._setWidth(w);
				this._setHeight(h);
				//this._width = w;
				//this._height = h;
				//console.log("BaseGroup.setSize this.width=" + this.width + ", this.height=" + this.height);
				//调整所有组件的相对位置
				for (var i:number = 0; i < this.numChildren; i++) {
					if (this.getChildAt(i) instanceof BaseGroup)(<BaseGroup><any> (this.getChildAt(i))).resetPosition();
				}
			}
        }

		///////////////////////////////////
		// 组件相对布局设置
		///////////////////////////////////
		public get top():number{
			return this._top;
		}
		/**
		 * 设置顶距
		 */
		public set top(value:number){
			if(this._top != value){
				this._top = value;
				if (this._topEnabled)this.invalidatePosition();
			}
		}

		public get topEnabled():boolean{
			return this._topEnabled;
		}
		/**
		 * 顶距可用设置
		 */
		public set topEnabled(value:boolean){
			this._topEnabled = value;
			this.invalidatePosition();
		}
		/**
		 * 设置左距
		 */
		public get left():number{
			return this._left;
		}

		public set left(value:number){
			if(this._left != value){
				this._left = value;
				if (this._leftEnabled)this.invalidatePosition();
			}
		}

		public get leftEnabled():boolean{
			return this._leftEnabled;
		}
		/**
		 * 设置左距可用
		 */
		public set leftEnabled(value:boolean){
			this._leftEnabled = value;
			this.invalidatePosition();
		}

		public get bottom():number{
			return this._bottom;
		}
		/**
		 * 设置底距
		 */
		public set bottom(value:number){
			if(this._bottom != value){
				this._bottom = value;
				if (this._bottomEnabled)this.invalidatePosition();
			}
		}

		public get bottomEnabled():boolean{
			return this._bottomEnabled;
		}
		/**
		 * 设置底距可用
		 */
		public set bottomEnabled(value:boolean){
			this._bottomEnabled = value;
			this.invalidatePosition();
		}

		public get right():number{
			return this._right;
		}
		/**
		 * 设置右距
		 */
		public set right(value:number){
			if(this._right != value){
				this._right = value;
				if (this._rightEnabled)this.invalidatePosition();
			}
		}

		public get rightEnabled():boolean{
			return this._rightEnabled;
		}
		/**
		 * 设置右距可用 
		 */
		public set rightEnabled(value:boolean){
			this._rightEnabled = value;
			this.invalidatePosition();
		}
		public get horizontalEnabled():boolean{
			return this._horizontalEnabled;
		}
		/**
		 * 设置水平居中可用
		 */
		public set horizontalEnabled(value:boolean){
			this._horizontalEnabled = value;
			this.invalidatePosition();
		}

		public get horizontalCenter():number{
			return this._horizontalCenter;
		}
		/**
		 * 设置水平居中相对位置
		 */		
		public set horizontalCenter(value:number){
			if(this._horizontalCenter != value){
				this._horizontalCenter = value;
				this.invalidatePosition();
			}
		}

		public get verticalEnabled():boolean{
			return this._verticalEnabled;
		}
		/**
		 * 设置竖直居中可用 
		 */
		public set verticalEnabled(value:boolean){
			if (this._verticalEnabled != value){
				this._verticalEnabled = value;
				this.invalidatePosition();
			}
		}

		public get verticalCenter():number{
			return this._verticalCenter;
		}
		/**
		 * 设置竖直居中相对位置 
		 */
		public set verticalCenter(value:number){
			if(this._verticalCenter != value){
				this._verticalCenter = value;
				this.invalidatePosition();
			}
		}
		/**
		 * 容器相对位置刷新
		 */		
		public resetPosition():void{
			var p:egret.DisplayObject = this.parent;
			if(p != null){
				var parentWidth:number = p.width;
				var parentHeight:number = p.height;
				var thisWidth:number = this.width;
				var thisHeight:number = this.height;
				//为了保证得到的宽高是数值型,这里进行了严格的检测
				if (parentWidth == NaN || parentWidth == undefined){
					parentWidth = p._explicitWidth;
					if (parentWidth == NaN || parentWidth == undefined){
						parentWidth = p.measuredWidth;
					}
					if (parentWidth == NaN || parentWidth == undefined){
						parentWidth = 0;
					}
				}
				if (parentHeight == NaN || parentHeight == undefined){
					parentHeight = p._explicitHeight;
					if (parentHeight == NaN || parentHeight == undefined){
						parentHeight = p.measuredHeight;
					}
					if (parentHeight == NaN || parentHeight == undefined){
						parentHeight = 0;
					}
				}
				if (thisWidth == NaN || thisWidth == undefined){
					thisWidth = this._explicitWidth;
					if (thisWidth == NaN || thisWidth == undefined){
						thisWidth = this.measuredWidth;
					}
					if (thisWidth == NaN || thisWidth == undefined){
						thisWidth = 0;
					}
				}
				if (thisHeight == NaN || thisHeight == undefined){
					thisHeight = this._explicitHeight;
					if (thisHeight == NaN || thisHeight == undefined){
						thisHeight = this.measuredHeight;
					}
					if (thisHeight == NaN || thisHeight == undefined){
						thisWidth = 0;
					}
				}

				if(this._topEnabled && !this._bottomEnabled){
					this.y = this._top;
				}else if(this._bottomEnabled && !this._topEnabled){
					this.y = parentHeight - this._bottom - thisHeight;
				}else if(this._topEnabled && this._bottomEnabled){
					this.y = this._top;
					thisHeight = parentHeight - this._top - this._bottom;
				}
				if(this._leftEnabled && !this._rightEnabled){
					this.x = this._left;
				}else if(this._rightEnabled && !this._leftEnabled){
					this.x = parentWidth - this._right - thisWidth;
				}else if(this._leftEnabled && this._rightEnabled){
					this.x = this._left;
					thisWidth = parentWidth - this._left - this._right;
				}
				if(this._horizontalEnabled){
					this.x = (parentWidth - thisWidth)/2 + this._horizontalCenter;
				}
				if(this._verticalEnabled){
					this.y = (parentHeight - thisHeight)/2 + this._verticalCenter;
				}
			}
		}
        
        /**
         * 可设置的携带数据
         */  
        public getData():any {
            return this._data;
        }

        public setData(value:any) {
            this._data = value;
        }

		public get data():any {
			return this._data;
		}

		public set data(value:any) {
			this._data = value;
		}
        
        /**
         * 清理数据
         */  
        public clean():void {
            
        }
		public set x(value:number){
			super._setX(value);
		}
		public get x():number {
			return this._x;
		}
		public set y(value:number){
			super._setY(value);
		}
		public get y():number{
			return this._y;
		}
        /**
        * 设置enabled状态
        * @return
        */
        public get enabled():boolean {
            return this._enabled;
        }

        public set enabled(value:boolean) {
            this._enabled = value;
        }

		/**
		 * 中心x位置
		 * @returns {number}
		 */
		public get cx():number {
			if (this._explicitWidth == NaN) return 0
			return this._explicitWidth/2;
		}
		/**
		 * 中心y位置
		 * @returns {number}
		 */
		public get cy():number {
			if (this._explicitHeight == NaN) return 0
			return this._explicitHeight/2;
		}
		/**
		 * 从场景中移除改对象
		 */
		public removeFromParent():void {
			if (this.parent) this.parent.removeChild(this);
		}

		/**
		 * 返回全局x,y值
		 * @returns {egret.Point}
		 */
		public getGlobalXY():egret.Point{
			var point:egret.Point = new egret.Point(0,0);
			this.localToGlobal(point.x, point.y, point);
			return point;
		}

		/**
		 * 返回实际宽度
		 * @returns {number}
		 */
		public getActualWidth():number{
			return this.width * this.scaleX;
		}
		/**
		 * 返回实际高度
		 * @returns {number}
		 */
		public getActualHeight():number{
			return this.height * this.scaleX;
		}
		
		/**
		 * 获取注册点相对的偏移像素值
		 * 官方很奇葩,修改了注册点后,子组件竟然不是以改注册点的值作为起始xy的0值
		 * 这里计算出实际的偏移值,供大家使用
		 */
		public getRegPoint():egret.Point{
			var regPoint:egret.Point = new egret.Point();
			if (this._anchorX != 0){
				regPoint.x = this.width*this._anchorX;
			} else if (this._anchorOffsetX != 0) {
				regPoint.x = this._anchorOffsetX;
			}
			if (this._anchorY != 0){
				regPoint.y = this.height*this._anchorY;
			} else if (this._anchorOffsetX != 0) {
				regPoint.y = this._anchorOffsetY;
			}
			return regPoint;
		}
        public invalidate():void{
            if(!this._hasInvalidate && !this._drawDelay){
                //console.log("add invalidate draw")
                this.addEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
                this._hasInvalidate = true;
            }
        }
        /**
         * 重绘通知
         */
        public onInvalidate(event:egret.Event):void{
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
            this._hasInvalidate = false;
            this.draw();
        }
        public draw():void{
            //console.log("draw name=" + this.name);
        }

        public _setDrawDelay(delay:boolean) {
            this._drawDelay = delay;
            if (this._drawDelay ) {
                this.removeEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
                this._hasInvalidate = false;
            } else {
                this.invalidate();
            }
        }
        /**
         * 设置延迟draw
         * @param delay
         */
        public set drawDelay(delay:boolean) {
            //console.log("drawDelay=" + delay)
            this._drawDelay = delay;
            if (this._drawDelay ) {
                this.removeEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
                this._hasInvalidate = false;
            } else {
                this.invalidate();
            }
        }
        public get drawDelay():boolean {
            return this._drawDelay;
        }
    }
}