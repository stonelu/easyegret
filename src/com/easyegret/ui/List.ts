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

	export class List extends Group{
        private _itemRenderer:any = DefaultListItemRenderer;
        private _itemContainer:Group = null;
        private _gap:number = 4;
        private _direction:string = Style.VERTICAL;//朝向
        private _dataIndexBegin:number = 0;//显示数据起始索引
        private _dataIndexEnd:number = 0;//显示数据结束索引
        private _clickBegin:boolean = false;//点击开始
        private _effect:string = null;//效果选择
        private _dragBeginPoint:Point = new Point();
        private _dragEndPoint:Point = new Point();

		public constructor(){
			super();
		}

		public createChildren():void{
			super.createChildren();
			this.setSize(100, 300);
            this._itemContainer = new Group();
            this.addChild(this._itemContainer);
            this._itemContainer.setSize(this.width, this.height);
            this._defaultSkinColor = 0xe5f63f;
            this._itemContainer.showBg = false;
            this._itemContainer.addEventListener(TouchEvent.TOUCH, this.onTouchEvent, this);
		}
        public onTouchEvent(event:TouchEvent) : void {
            var touch : Touch = event.getTouch(this);
            if(!this.enabled){
                event.stopImmediatePropagation();
                return;
            }
            if (touch == null){
                this._clickBegin = false;
                //trace("out");
                this.invalidate();
                return;
            }
            
            if(touch.phase == TouchPhase.BEGAN) {
                this._clickBegin = true;
                //trace("begin")
                this._dragBeginPoint.x = touch.globalX;
                this._dragBeginPoint.y = touch.globalY;
            } else if(touch.phase==TouchPhase.HOVER){
                this.setTouchItemRenderOver(event);
                //trace("over");
            } else if(touch.phase == TouchPhase.MOVED && this._clickBegin) {
                //trace("move");
                this._dragEndPoint.x = touch.globalX;
                this._dragEndPoint.y = touch.globalY;
                this.onDragItem();
            } else if(touch.phase == TouchPhase.ENDED && this._clickBegin) {
                //trace("end")
                this._clickBegin = false;
                this.setTouchItemRenderSelected(event);
            }
            this.invalidate();
        }
        /**
         * 拖拽事件
         */        
        private onDragItem():void {
            this.console.log("begin=" + this._dataIndexBegin + ", end=" + this._dataIndexEnd);
            if (this._direction == Style.HORIZONTAL) {
                
            } else {
                var step:number = this._dragEndPoint.y - this._dragBeginPoint.y;
                var item:Group = null;
                var length:number = this._itemContainer.numChildren;
                if (this._dataIndexBegin == 0 && step > 0 && this._itemContainer.getChildAt(0).y >= 0) return;
                if (this._dataIndexEnd == (this.data.length-1) && step < 0 && (this._itemContainer.getChildAt(length-1).y + this._itemContainer.getChildAt(length-1).height) >= this._itemContainer.height) return;
                for (var i:number = 0; i < length; i++)  {
                    item = <Group><any> (this._itemContainer.getChildAt(i));
                    item.y += step;
                } 
                //消失一个,就补充一个
                item = <Group><any> (this._itemContainer.getChildAt(0));
                if ((item.y + item.height) < 0) {
                    this._dataIndexBegin ++;
                    this._dataIndexEnd ++;
                    this.console.log("0000 begin=" + this._dataIndexBegin + ", end=" + this._dataIndexEnd);
                    item.data = null;
                    //加一个节点在最后
                    item.data = this.data[this._dataIndexEnd];
                    item.y = this._itemContainer.getChildAt(length-1).y + item.height + this._gap;
                    item.parent.removeChild(item);
                    this._itemContainer.addChild(item);
                }
                item = this._itemContainer.getChildAt(length - <Group><any> (1));
                if (item.y > this._itemContainer.height) {
                    this._dataIndexBegin --;
                    this._dataIndexEnd --;
                    this.console.log("11111 begin=" + this._dataIndexBegin + ", end=" + this._dataIndexEnd);
                    item.data = null;
                    //加一个节点在第一个
                    item.data = this.data[this._dataIndexBegin];
                    item.y = this._itemContainer.getChildAt(0).y - item.height - this._gap;
                    item.parent.removeChild(item);
                    this._itemContainer.addChildAt(item, 0);
                }
            }
            this._dragBeginPoint.y = this._dragEndPoint.y;
            this._dragBeginPoint.x = this._dragEndPoint.x;
        }
        /**
         * 设置item的经过态 
         * @param event
         * @return 
         */        
        private setTouchItemRenderOver(event:TouchEvent):IListItemRenderer {
            var touch : Touch = null;
            for (var i:number = 0; i < this._itemContainer.numChildren; i++)  {
                touch = event.getTouch(this._itemContainer.getChildAt(i));
                if (touch) {
                    (<IListItemRenderer><any> (this._itemContainer.getChildAt(i))).rollover = true;
                } else {
                    (<IListItemRenderer><any> (this._itemContainer.getChildAt(i))).rollover = false;
                }
            }
            return null;
        }
        /**
         * 设置item的经过态 
         * @param event
         * @return 
         * 
         */        
        private setTouchItemRenderSelected(event:TouchEvent):IListItemRenderer {
            var touch : Touch = null;
            for (var i:number = 0; i < this._itemContainer.numChildren; i++)  {
                touch = event.getTouch(this._itemContainer.getChildAt(i));
                if (touch) {
                    (<IListItemRenderer><any> (this._itemContainer.getChildAt(i))).selected = true;
                } else {
                    (<IListItemRenderer><any> (this._itemContainer.getChildAt(i))).selected = false;
                }
            }
            return null;
        }
        /**
         * 
         * @param event
         * @return 
         */        
        private getTouchItemRender(event:TouchEvent):IListItemRenderer {
            var touch : Touch = null;
            for (var i:number = 0; i < this._itemContainer.numChildren; i++)  {
                touch = event.getTouch(this._itemContainer.getChildAt(i));
                if (touch) return <IListItemRenderer><any> (this._itemContainer.getChildAt(i));
            }
            return null;
        }
        public set data(value:any){
            super.data = value;
            if (this._data && value instanceof Array<any>) {
                this.fillItems();
            } else {
                this.emptyItems();
            }
        }
        /**
         * 清空显示对象 
         */        
        private emptyItems():void {
            while(this._itemContainer.numChildren > 0) {
                ObjectPool.releaseClass(this._itemContainer.removeChildAt(0));
            }
        }
        /**
         * 填充显示render的数据和对象
         */        
        private fillItems():void {
            this.emptyItems();
            var i:number = 0;
            var itemRender:BaseGroup = null;
            this._dataIndexBegin = 0;
            var w:number = 0;
            var h:number = 0;
            for (i = 0; i < this._data.length; i++)  {
                itemRender = ObjectPool.getObjectClass(this._itemRenderer);
                itemRender.data = this._data[i];
                this._itemContainer.addChild(itemRender);
                if (this._direction == Style.VERTICAL) {
                    itemRender.y = h;
                    if (itemRender.y + itemRender.height > this._itemContainer.height) {
                        this._dataIndexEnd = i;
                        break;
                    }
                } else {
                    itemRender.x = w;
                    if (itemRender.x + itemRender.width > this._itemContainer.width) {
                        this._dataIndexEnd = i;
                        break;
                    }
                }
                w += itemRender.width + this._gap;
                h += itemRender.height + this._gap;
            }
        }
        /**
         * Draws the visual ui of the component.
         */
        public draw():void{
            super.draw();
        }
        //鱼眼效果
        private onEffectFisheye():void {
            var i:number = 0;
            var w:number = 0;
            var h:number = 0;
            var itemRender:BaseGroup = null;
            for (i = this._dataIndexBegin; i < this._dataIndexEnd; i++)  {
                itemRender =  <Group><any> (this._itemContainer.getChildAt(i));
                this._itemContainer.addChild(itemRender);
                if (this._direction == Style.VERTICAL) {
                    itemRender.y = h;
                    if (itemRender.y + itemRender.height > this._itemContainer.height) {
                        this._dataIndexEnd = i;
                        break;
                    }
                } else {
                    itemRender.x = w;
                    if (itemRender.x + itemRender.width > this._itemContainer.width) {
                        this._dataIndexEnd = i;
                        break;
                    }
                }
                w += itemRender.width + this._gap;
                h += itemRender.height + this._gap;
            }
        }
	}
}