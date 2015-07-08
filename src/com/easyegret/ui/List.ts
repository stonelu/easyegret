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
        private _itemRenderer:any = DefaultRenderer;
        private _itemContainer:BaseGroup = null;
        private _gap:number = 2;
        private _direction:string = Style.VERTICAL;//朝向
        private _dataIndexBegin:number = 0;//显示数据起始索引
        private _dataIndexEnd:number = 0;//显示数据结束索引

        private _itemDatas:Array<any> = null;
        private _dataIndexToRender:any = null;
        private _autoSize:boolean = false;
        private _marginTop:number = 4;
        private _marginBottom:number = 4;
        private _marginLeft:number = 4;
        private _marginRight:number = 4;
        private _line:number = 1;//设置排数
        private _lineGap:number = 2;//设置排间距

        private _effect:string = null;//效果选择
        private _isDragBegin:boolean = false;//点击开始
        private _dragBeginPoint:egret.Point = null;
        private _dragLastTime:number = 0;

        private _autoScrollGap:number = 0;//自动滚动的间距
        private _lastTimeNum:number = 0;//

        private _selectedItem:any = null;//选择的对象
        private _labelField:string = "";

		public constructor(drawDelay:boolean = false){
			super(drawDelay);
		}

		public createChildren():void{
			super.createChildren();
			this.setSize(100, 300);
            this.touchEnabled = true;
            this._itemContainer = new BaseGroup();
            this.addChild(this._itemContainer);
            this._itemContainer.touchEnabled = true;
            this._itemContainer.setSize(this.width, this.height);
            this._itemContainer.scrollRect = new egret.Rectangle(0, 0, this.width, this.height);
            //this._itemContainer.showBg = false;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginEvent, this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveEvent, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndEvent, this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapEvent, this);
            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchReleaseOutsideEvent, this)
            this._dragBeginPoint = new egret.Point();
		}

        /**
         * 点击开始
         * @param event
         */
        public onTouchBeginEvent(event:egret.TouchEvent) : void {
            this._isDragBegin = true;
            this._lastTimeNum = 0;
            this._dragBeginPoint.x = event._stageX;
            this._dragBeginPoint.y = event._stageY;
            this._dragLastTime = egret.getTimer();
            easy.HeartBeat.removeListener(this, this.onAutoScroll);
            //console.log("this._isDragBegin=" + this._isDragBegin + ", x=" + this._dragBeginPoint.x + ", y=" + this._dragBeginPoint.y)
        }

        /**
         * 点击移动
         * @param event
         */
        public onTouchMoveEvent(event:egret.TouchEvent) : void {
            //console.log("onTouchMoveEvent x=" + event.stageX + ", y=" + event.stageY)
            if (this._isDragBegin) {
                this.moveItemUIPosition(event._stageX - this._dragBeginPoint.x, event._stageY - this._dragBeginPoint.y);
            }
            if (this._direction == Style.VERTICAL) {//yv值
                this._autoScrollGap = event.stageY - this._dragBeginPoint.y;
            } else {
                this._autoScrollGap = event.stageX - this._dragBeginPoint.x;
            }
            this._lastTimeNum =  egret.getTimer() - this._dragLastTime;
            this._dragBeginPoint.x = event._stageX;
            this._dragBeginPoint.y = event._stageY;
            this._dragLastTime = egret.getTimer();
        }
        public onTouchReleaseOutsideEvent(event:egret.TouchEvent) : void {
            this._isDragBegin = false;
            this.checkUIFreeback();
        }

        /**
         * 点击结束
         * @param event
         */
        public onTouchEndEvent(event:egret.TouchEvent) : void {
            //console.log("onTouchEndEvent this._dataIndexBegin=" + this._dataIndexBegin + ", this._dataIndexEnd=" + this._dataIndexEnd);
            this._isDragBegin = false;
            //console.log("000timer=" + this._lastTimeNum + ", gap.value=" + this._autoScrollGap);
            //Debug.log = "timer=" + this._lastTimeNum;
            if (this._lastTimeNum < 40 && (this._dataIndexBegin > 0 && this._autoScrollGap > 0 || this._dataIndexEnd < this._itemDatas.length - 1 && this._autoScrollGap < 0)) {
                //console.log("111timer=" + timer);
                //时间越短,倍数越大
                //Debug.log = "_autoScrollGap=" + this._autoScrollGap + ", caculte=" + (this._autoScrollGap / this._lastTimeNum);
                this._autoScrollGap = (this._autoScrollGap / this._lastTimeNum)*10;
                //启用加速滑动的方式
                easy.HeartBeat.addListener(this, this.onAutoScroll);
                return;
            }
            this.checkUIFreeback();
        }

        private onAutoScroll():void {
            if (this._direction == Style.VERTICAL) {//yv值
                this.moveItemUIPosition(0, this._autoScrollGap);
            } else {
                this.moveItemUIPosition(this._autoScrollGap, 0);
            }
            this._autoScrollGap -= this._autoScrollGap/20;
            if (Math.abs(this._autoScrollGap) < 0.5 || this._dataIndexBegin == 0 || this._dataIndexEnd >= this._itemDatas.length - 1){
                easy.HeartBeat.removeListener(this, this.onAutoScroll);
                this.checkUIFreeback();
            }
        }

        /**
         * 检测是否需要回弹
         */
        private checkUIFreeback():void {
            //console.log("checkUIFreeback 000 this._dataIndexEnd=" + this._dataIndexEnd);
            if (this._itemContainer.numChildren > 0 && this._itemDatas && this._itemDatas.length > 0 && (this._dataIndexBegin == 0 || this._dataIndexEnd >= this._itemDatas.length - 1)){
                //console.log("checkUIFreeback 111")
                var pos:number = 0;
                if (this._dataIndexBegin == 0) {
                    if (this._direction == Style.VERTICAL) {//yv值
                        pos = this._itemContainer.getChildAt(0).y;
                    } else {
                        pos = this._itemContainer.getChildAt(0).x;
                    }
                    if (pos < 0 && this._dataIndexEnd < this._itemDatas.length - 1){
                        pos = 0;
                    }
                } else if (this._dataIndexEnd >= this._itemDatas.length - 1) {
                    if (this._direction == Style.VERTICAL) {//yv值
                        pos = this._itemContainer.getChildAt(this._itemContainer.numChildren -1).y +  this._itemContainer.getChildAt(this._itemContainer.numChildren -1).height - this._itemContainer.height;
                    } else {
                        pos = this._itemContainer.getChildAt(this._itemContainer.numChildren -1).x +  this._itemContainer.getChildAt(this._itemContainer.numChildren -1).width - this._itemContainer.width;
                    }
                }
                if (pos != 0) {
                    for (var i:number = 0; i < this._itemContainer.numChildren; i++){
                        if (this._direction == Style.VERTICAL) {//yv值
                            egret.Tween.get(this._itemContainer.getChildAt(i)).to({y: this._itemContainer.getChildAt(i).y - pos}, 100);
                        } else {
                            egret.Tween.get(this._itemContainer.getChildAt(i)).to({x: this._itemContainer.getChildAt(i).x - pos}, 100);
                        }
                    }
                }
            }
        }
        /**
         * 单击
         * @param event
         */
        public onTouchTapEvent(event:egret.TouchEvent) : void {
            //console.log("onTouchTapEvent timer=" + this._lastTimeNum);
            if (this._lastTimeNum == 0){
                var sp:egret.DisplayObject = null;
                for(var i:number = 0; i < this._itemContainer.numChildren;i++){
                    sp = this._itemContainer.getChildAt(i);
                    if (sp.x < event.localX && sp.y < event.localY && sp.x + sp.width > event.localX && sp.y + sp.height > event.localY){
                        try{
                            this.selectedItem = sp["_data"];
                            break;
                        } catch(e) {
                        }
                    }
                }
            }
        }

        /**
         * 移出render显示
         * @param render
         */
        private  removeRender(render:egret.DisplayObject):void {
            if (!render) return;
            for(var key in this._dataIndexToRender){
                if (this._dataIndexToRender[key] == render) {
                    delete this._dataIndexToRender[key]
                    break;
                }
            }
            try{
                render["data"] = null;
            } catch (e){
            }
            if (render && render.parent) render.parent.removeChild(render);
            easy.ObjectPool.recycleClass(render);
            return;
        }
        /**
         * 对整体render进行位移,并补足空出的位置
         * @param xv
         * @param yv
         */
        private moveItemUIPosition(xv:number, yv:number):void {
            //console.log("moveItemUIPosition this._dataIndexBegin=" + this._dataIndexBegin + ", this._dataIndexEnd=" + this._dataIndexEnd + ", x=" + xv + ", y=" + yv)
            var itemRederer:egret.Sprite = null;
            var optNum:number = 0;
            for(var i:number = this._itemContainer.numChildren - 1; i >= 0; i--){
                itemRederer = <egret.Sprite>this._itemContainer.getChildAt(i);
                if (this._direction == Style.VERTICAL){//yv值
                    itemRederer.y += yv;
                    if (this._dataIndexBegin == 0 && yv >= 0 || this._dataIndexEnd == this._itemDatas.length - 1 && yv < 0) {
                        continue;
                    }
                    //补充一个
                    if (yv < 0 && this._dataIndexEnd < this._itemDatas.length - 1) {//^向上
                        if (this._itemContainer.getChildAt(this._itemContainer.numChildren - 1).y + itemRederer.height + this._gap < this._itemContainer.height) {
                            optNum = this.addUIItem(this._dataIndexEnd, false);
                            this._dataIndexEnd += optNum;
                            //console.log("moveItemUIPosition 00000 this._dataIndexBegin=" + this._dataIndexBegin + ", this._dataIndexEnd=" + this._dataIndexEnd)
                        }
                        if ((itemRederer.y + itemRederer.height) < 0) {
                            this.removeRender(this._itemContainer.getChildAt(i));
                            //console.log("remove 000 index.value=" + this._dataIndexBegin);
                            this._dataIndexBegin ++;
                            //console.log("moveItemUIPosition 11111 this._dataIndexBegin=" + this._dataIndexBegin + ", this._dataIndexEnd=" + this._dataIndexEnd)
                        }
                    } else if (this._dataIndexBegin > 0){//v向下
                        if (this._itemContainer.getChildAt(0).y - this._gap > 0) {
                            optNum = this.addUIItem(this._dataIndexBegin - this._line, true);
                            this._dataIndexBegin -= optNum;
                            //console.log("moveItemUIPosition 22222 this._dataIndexBegin=" + this._dataIndexBegin + ", this._dataIndexEnd=" + this._dataIndexEnd)
                        }
                        if (itemRederer.y > this._itemContainer.height) {
                            this.removeRender(this._itemContainer.getChildAt(i));
                            //console.log("remove 111 index.value=" + this._dataIndexEnd);
                            this._dataIndexEnd --;
                            //console.log("moveItemUIPosition 33333 this._dataIndexBegin=" + this._dataIndexBegin + ", this._dataIndexEnd=" + this._dataIndexEnd)
                        }
                    }
                } else {//xv值
                    itemRederer.x += xv;
                    if (this._dataIndexBegin == 0 && xv >= 0 || this._dataIndexEnd == this._itemDatas.length - 1 && xv < 0) {
                        continue;
                    }
                    //补充一个
                    if (xv < 0 && this._dataIndexEnd < this._itemDatas.length - 1) {//^向左
                        if (this._itemContainer.getChildAt(this._itemContainer.numChildren - 1).x + itemRederer.width + this._gap < this._itemContainer.width) {
                            optNum = this.addUIItem(this._dataIndexEnd, false);
                            this._dataIndexEnd += optNum;
                        }
                        if ((itemRederer.x + itemRederer.width) < 0) {
                            this.removeRender(this._itemContainer.getChildAt(i));
                            this._dataIndexBegin ++;
                        }
                    } else if (this._dataIndexBegin > 0){//v向右
                        if (this._itemContainer.getChildAt(0).x - this._gap > 0) {
                            optNum = this.addUIItem(this._dataIndexBegin - this.line, true);
                            this._dataIndexBegin -= optNum;
                        }
                        if (itemRederer.x > this._itemContainer.width) {
                            this.removeRender(this._itemContainer.getChildAt(i));
                            this._dataIndexEnd --;
                        }
                    }
                }
            }
        }

        /**
         * 添加一个节点
         * @param dataIndex 数据的下标
         * @param topPlace true:添加在最前面,添加在最后面
         */
        private addUIItem(dataIndex:number, topPlace:boolean):number {
            //console.log("addUIItem dataIndex=" + dataIndex + ", topPlace=" + topPlace);
            if (!this._itemDatas || dataIndex < 0 || dataIndex >= this._itemDatas.length) return 0;
            //console.log("addUIItem 000");
            if (this._dataIndexToRender["" + dataIndex]) return;
            //console.log("addUIItem 1111");
            var indexAdd:number = 0;
            var yPos:number = 0;
            var xPos:number = 0;
            while(indexAdd < this._line) {
                if (!this._itemDatas || dataIndex < 0 || dataIndex >= this._itemDatas.length) return indexAdd;
                var displayItemUI:egret.Sprite = easy.ObjectPool.getByClass(this._itemRenderer);
                if (!displayItemUI["isAddedToStage"]){
                    this._itemContainer.addChild(displayItemUI);
                    this._itemContainer.removeChild(displayItemUI);
                }
                try{
                    displayItemUI["labelField"] = this._labelField;
                }catch(e){
                }
                try{
                    displayItemUI["data"] = this._itemDatas[dataIndex];
                }catch(e){
                }
                if (this._autoSize){
                    if (this._direction == Style.VERTICAL){
                        displayItemUI.width = (this._itemContainer.width - (this._line-1)*this._gap)/this._line;
                    } else {
                        displayItemUI.height = (this._itemContainer.height - (this._line-1)*this._gap)/this._line;
                    }
                }
                if (this._direction == Style.VERTICAL){
                    xPos = (displayItemUI.width + this._lineGap)*indexAdd;
                    if (this._itemContainer.numChildren > 0 && indexAdd == 0) {
                        if (topPlace){
                            yPos = this._itemContainer.getChildAt(0).y;
                            yPos = yPos - (this._gap + displayItemUI.height);
                            //console.log("000=" + yPos + ", indexAdd=" + indexAdd);
                        } else {
                            yPos = this._itemContainer.getChildAt(this._itemContainer.numChildren - 1).y;
                            yPos += (this._gap + this._itemContainer.getChildAt(this._itemContainer.numChildren - 1).height)*(indexAdd+1);
                            //console.log("111=" + yPos + ", indexAdd=" + indexAdd);
                        }
                    }
                    if (yPos > this._itemContainer.height || yPos < - displayItemUI.height){
                        this.removeRender(displayItemUI);
                        return indexAdd;
                    }
                    displayItemUI.y = yPos;
                    displayItemUI.x = xPos;
                } else {
                    yPos = (displayItemUI.height + this._lineGap)*indexAdd;
                    //console.log("yPos=" + yPos + ", indexAdd=" + indexAdd);
                    if (this._itemContainer.numChildren > 0 && indexAdd == 0) {
                        if (topPlace){
                            xPos = this._itemContainer.getChildAt(0).x;
                            xPos = xPos - (this._gap + displayItemUI.width);
                            //console.log("000=" + xPos + ", indexAdd=" + indexAdd);
                        } else {
                            xPos = this._itemContainer.getChildAt(this._itemContainer.numChildren - 1).x;
                            xPos += (this._gap + this._itemContainer.getChildAt(this._itemContainer.numChildren - 1).width)*(indexAdd+1);
                            //console.log("111=" + xPos + ", indexAdd=" + indexAdd);
                        }
                    }
                    if (xPos > this._itemContainer.width || xPos < - displayItemUI.width){
                        this.removeRender(displayItemUI);
                        return indexAdd;
                    }
                    displayItemUI.x = xPos;
                    displayItemUI.y = yPos;
                }
                if (topPlace) {
                    this._itemContainer.addChildAt(displayItemUI, 0);
                } else {
                    this._itemContainer.addChild(displayItemUI);
                }
                if (displayItemUI["ui"] && displayItemUI["ui"]["validateNow"]) displayItemUI["ui"]["validateNow"]();

                this._dataIndexToRender["" + dataIndex] = displayItemUI;
                indexAdd ++;
                //console.log("addUIItem indexAdd=" + indexAdd + ", dataIndex=" + dataIndex);
                dataIndex ++;
            }
            return indexAdd;
        }

        public set data(value:any){
            this._data = value;
            this._itemDatas = null;
            this._dataIndexToRender = {};
            this.setItemContainerSize();
            //清空显示
            var displayItemUI:egret.Sprite = null;
            while(this._itemContainer.numChildren > 0) {
                displayItemUI = <egret.Sprite>this._itemContainer.removeChildAt(0);
                if (displayItemUI["data"])displayItemUI["data"] = null;
                easy.ObjectPool.recycleClass(displayItemUI);
            }
            if (this._data instanceof Array){
                //进行首次填充
                this._itemDatas = <Array<any>>this._data;
                this._dataIndexBegin = 0;
                var placeValue:number = 0;//占据的位置
                var addNum:number = this.addUIItem(this._dataIndexBegin, false);
                this._dataIndexEnd = addNum;
                while(addNum != 0) {
                    addNum = this.addUIItem(this._dataIndexEnd, false);
                    this._dataIndexEnd += addNum;
                }
                //console.log("setData dataIndexBegin=" + this._dataIndexBegin + ", dataIndexEnd=" + this._dataIndexEnd)
            }
        }
        /**
         * Draws the visual ui of the component.
         */
        public draw():void{
            super.draw();
            this.setItemContainerSize();
        }
        private setItemContainerSize():void {
            this._itemContainer.x = this._marginLeft;
            this._itemContainer.y = this._marginTop;
            this._itemContainer.width = this.width - this._marginLeft - this._marginRight;
            this._itemContainer.height = this.height - this._marginTop - this._marginBottom;
            this._itemContainer.scrollRect.width = this._itemContainer.width;
            this._itemContainer.scrollRect.height = this._itemContainer.height;
        }
        public setHorizontalLayout(){
            this.layout = Style.HORIZONTAL;
        }
        public setVerticalLayout(){
            this.layout = Style.VERTICAL;
        }

        public set layout(direct:string) {
            this._direction = direct;
            this.invalidate();
        }

        public get layout():string {
            return this._direction;
        }
        public set selectedItem(item:any){
            //console.log("selectedItem item=" + item)
            var sp:egret.DisplayObject = null;
            this._selectedItem = item;
            for(var i:number = 0; i < this._itemContainer.numChildren;i++){
                sp = this._itemContainer.getChildAt(i);
                sp["selected"] = false;
                try{
                    if (sp["_data"] == item ){
                        sp["selected"] = true;
                    }
                } catch(e) {
                }
            }
        }
        public get selectedItem():any {
            return this._selectedItem;
        }
        public get labelField():string{
            return this._labelField;
        }

        /**
         * 设置label field
         * @param value
         */
        public set labelField(value:string){
            if (this._labelField != value) {
                this._labelField = value;
                this.invalidate();
            }
        }
        public get itemRenderer():any{
            return this._itemRenderer;
        }

        /**
         * 设置itemRenderer
         * @param value
         */
        public set itemRenderer(value:any){
            if (this._itemRenderer != value) {
                this._itemRenderer = value;
                this.invalidate();
            }
        }
        public get autoSize():boolean {
            return this._autoSize;
        }

        /**
         * 设置自动大小
         * @param value
         */
        public set autoSize(value:boolean) {
            if (this._autoSize != value) {
                this._autoSize = value;
                this.invalidate();
            }
        }
        public get marginTop():number {
            return this._marginTop;
        }

        /**
         * 设置顶边距
         * @param value
         */
        public set marginTop(value:number) {
            if (this._marginTop != value){
                this._marginTop = value;
                this.invalidate();
            }
        }

        public get marginBottom():number {
            return this._marginBottom;
        }

        /**
         * 设置底边距
         * @param value
         */
        public set marginBottom(value:number) {
            if (this._marginBottom != value) {
                this._marginBottom = value;
                this.invalidate();
            }
        }

        public get marginLeft():number {
            return this._marginLeft;
        }

        /**
         * 设置左边距
         * @param value
         */
        public set marginLeft(value:number) {
            this._marginLeft = value;
            this.invalidate();
        }

        public get marginRight():number {
            return this._marginRight;
        }

        /**
         * 设置右边距
         * @param value
         */
        public set marginRight(value:number) {
            if (this._marginRight = value){
                this._marginRight = value;
                this.invalidate();
            }
        }
        public get gap():number {
            return this._gap;
        }
        /**
         * 设置item render的间距
         */
        public set gap(value:number) {
            this._gap = value;
            this.invalidate();
        }

        public get line():number {
            return this._line;
        }
        /**
         * 设置render的排数,默认是1
         */
        public set line(value:number) {
            this._line = value;
            if (this._line < 1) this._line = 1;
            this.invalidate();
        }

        public get lineGap():number {
            return this._lineGap;
        }
        /**
         * 设置render的排数,默认是1
         */
        public set lineGap(value:number) {
            this._lineGap = value;
            if (this._lineGap < 0) this._lineGap = 0;
            this.invalidate();
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