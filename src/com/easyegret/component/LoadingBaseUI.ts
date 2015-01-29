/**
 * Copyright (c) 2014,Egret-Labs.org
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
    export class LoadingBaseUI extends Group {

        public textField:egret.TextField = null;
        private _numTotalFile:number = 0;//总文件
        private _resFileArr:Array<string> = [];//
        private _resFileArrOrg:Array<string> = [];//
        private _numTotalGroup:number = 0;//总下载组
        private _numTotalItem:number = 0;//总下载item文件
        private _numDownloadedFile:number = 0;//已下载文件数
        private _resGroup:Array<string> = null;

        private _loadingTexture:Array<LoadingItemUI> = [];//loading显示的材质
        private _gridWidth:number = 60;
        private _gridHeight:number = 60;
        private _gridGap:number = 2;
        private _loadingPos:Array<any> = [];//显示坐标
        private _loadingTextureIndex:number = 0;
        private _loadingTextureCount:number = 30;
        private _loadingTextureNum:number = 0;
        private _loadingPosIndex:number = 0;
        private _currentGraphicsItem:LoadingItemUI = null;
        public _currentDisplayObject:easy.ReceiveGroup = null;

        public _loadingTextArr:Array<string> = ["e", "a", "s", "y", "u", "i"];//lenght=6

        public constructor() {
            super();
        }

        public createChildren():void {
            super.createChildren();
            this.showBg = false;
            this.setSize(this._gridWidth + 10, this._gridHeight + 10);

            this.bgColor = 0x7d2688;

            this.textField = new egret.TextField();
            this.addChild(this.textField);
            this.textField.width = 250;
            this.textField.height = 30;
            this.textField.textAlign = "center";
            this.textField.y = this.height + this.textField.height + 20;
            this.textField.x = (this.width - this.textField.width)/2;
            this.anchorX = 0.5;
            this.anchorY = 0.5;

            //创建loadign材质
            this._loadingTexture.push(new LoadingItemUI(0xff333, 0xfff666, this._loadingTextArr[0], this._gridWidth, this._gridHeight));
            this._loadingTexture.push(new LoadingItemUI(0x3f6f4, 0xfff666, this._loadingTextArr[1], this._gridWidth, this._gridHeight));
            this._loadingTexture.push(new LoadingItemUI(0xf3f33, 0xfff666, this._loadingTextArr[2], this._gridWidth, this._gridHeight));
            this._loadingTexture.push(new LoadingItemUI(0xf33f3, 0xfff666, this._loadingTextArr[3], this._gridWidth, this._gridHeight));
            this._loadingTexture.push(new LoadingItemUI(0x3f6f4, 0xfff666, this._loadingTextArr[4], this._gridWidth, this._gridHeight));
            this._loadingTexture.push(new LoadingItemUI(0xf3f33, 0xfff666, this._loadingTextArr[5], this._gridWidth, this._gridHeight));
            //设置坐标
            this._loadingPos = [//显示坐标
                    {x:this.width/2 - this._gridWidth - this._gridGap, y:this.height/2 - this._gridHeight - this._gridGap},
                    {x:this.width/2  + this._gridGap, y:this.height/2 - this._gridHeight - this._gridGap},
                    {x:this.width/2 + this._gridGap, y:this.height/2 + this._gridGap},
                    {x:this.width/2 - this._gridWidth - this._gridGap, y:this.height/2 + this._gridGap}
                ];
        }
        private getShapeTexture(colorBg:number, colorLine:number):egret.Shape{
            var shape:egret.Shape = new egret.Shape();
            shape.graphics.beginFill(colorBg);
            shape.graphics.drawRoundRect(0, 0 , this._gridWidth, this._gridHeight, 4, 4);
            shape.graphics.endFill();
            shape.graphics.lineStyle(2, colorLine);
            shape.graphics.drawRoundRect(0, 0 , this._gridWidth, this._gridHeight, 4, 4);
            return shape;
        }

        public setProgress(current, total):void {
            this.textField.text = "加载中..." + current + "/" + total;
        }

        /**
         * 根据waitview的ui数据,进行下载控制
         */
        public enter():void {
            if (GlobalSetting.STAGE){
                GlobalSetting.STAGE.addChild(this);
                //this.visible = false;
                this.x = GlobalSetting.STAGE_WIDTH/2;
                this.y = GlobalSetting.STAGE_HEIGHT/2;
            }
            this._numDownloadedFile = 0;
            this._numTotalFile = 0;
            this._numTotalGroup = 0;
            this._numTotalItem = 0;
            this._resGroup = null;
            //console.log("@@LoadingBaseUI Enter current=" + egret.getQualifiedClassName(this._currentDisplayObject))
            if(this._currentDisplayObject && this._currentDisplayObject._ui && this._currentDisplayObject._ui.hasOwnProperty("resSpriteSheet") && this._currentDisplayObject._ui.hasOwnProperty("resFiles")){
                //console.log("@@LoadingBaseUI Enter current.ui=" + this._currentDisplayObject._ui + ", resArr=" + this._currentDisplayObject._ui["resFiles"])
                //loader文件,个数下载
                this._resFileArr = [].concat(this._currentDisplayObject._ui["resFiles"]);
                this._resFileArrOrg = [].concat(this._currentDisplayObject._ui["resFiles"]);
                if (this._resFileArr && this._resFileArr.length > 0){
                    this._numTotalFile = this._resFileArr.length;
                    //初始化Resource资源加载库
                    //console.log("@@LoadingBaseUI Enter resFileArr=" + this._resFileArr)
                    RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
                    RES.loadConfig("resource/assets/ui/" + this._resFileArr.pop(),"resource/");
                }
                if (this._currentDisplayObject._ui.hasOwnProperty("resGroup")){
                    this._resGroup = [].concat(this._currentDisplayObject._ui["resGroup"]);
                    //console.log("@@LoadingBaseUI Enter _resGroup=" + this._resGroup)
                }
            }

            //显示loading图像
            this._loadingTextureIndex = 0;
            this._loadingPosIndex = 0;
            this._loadingTextureNum = 0;
            HeartBeat.addListener(this, this.onShowLoadingGraphics);
        }

        /**
         * 完成下载,回调加载view
         */
        public outer():void {
            //console.log("@@LoadingBaseUI outer!")
            this.removeFromParent();
            HeartBeat.removeListener(this, this.onShowLoadingGraphics);
            if(this._currentDisplayObject){
                this._currentDisplayObject.validateNow();
            }
            this._currentDisplayObject = null;
        }

        /**
         * 显示下载进度的图形
         */
        public onShowLoadingGraphics():void {
            this._loadingTextureNum ++;
            //console.log("onShowLoadingGraphics=" + this._loadingTextureNum)
            if (this._loadingTextureNum == this._loadingTextureCount){
                this._loadingTextureNum = 0;
                if (this._currentGraphicsItem) {
                    this._currentGraphicsItem.removeFromParent();
                }
                this._currentGraphicsItem = this._loadingTexture[this._loadingTextureIndex];
                this._currentGraphicsItem.x = this._loadingPos[this._loadingPosIndex].x;
                this._currentGraphicsItem.y = this._loadingPos[this._loadingPosIndex].y;
                this.addChild(this._currentGraphicsItem);
                //console.log("this._currentGraphicsItem=" + this._currentGraphicsItem)

                this._loadingTextureIndex ++;
                if (this._loadingTextureIndex == this._loadingTexture.length){
                    this._loadingTextureIndex = 0;
                }
                this._loadingPosIndex ++;
                if (this._loadingPosIndex == this._loadingPos.length){
                    this._loadingPosIndex = 0;
                }
            }
        }

        /**
         * 配置文件加载完成,开始预加载preload资源组。
         */
        private onConfigComplete(event:RES.ResourceEvent):void{
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete,this);
            RES.addEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, this.onResourceLoadGroupError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
            //RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onResourceError, this)
            //console.log("res event.down=" + event.itemsTotal + ", load=" + event.itemsLoaded + ", groupName=" + event.groupName + ", item=" + event.resItem)
            this._numDownloadedFile ++;
            //console.log("res.need.total=" + this._numTotalFile + ", load=" + this._numDownloadedFile + ", this._resFileArr=" + this._resFileArr)
            if (this._resFileArr && this._resFileArr.length > 0){
                //初始化Resource资源加载库
                //console.log("@@LoadingBaseUI Enter file=" + this._resFileArr[i])
                RES.loadConfig("resource/assets/ui/" + this._resFileArr.pop(),"resource/");
            }
            if (this._numDownloadedFile >= this._numTotalFile) {//有可能存在别的load file干扰,所以要>检测
                //json文件中的group下载
                if (this._resGroup && this._resGroup.length > 0 ){
                    for(var i = 0; i < this._resGroup.length; i++){
                        if (!RES.isGroupLoaded(this._resGroup[i])) RES.loadGroup(this._resGroup[i]);
                    }
                }
            }
        }
        /**
         * 资源组加载完成
         */
        private onResourceLoadComplete(event:RES.ResourceEvent):void {
            //console.log("00res.group.down=" + event.groupName + ", this._resGroupOrg=" + this._resGroupOrg)
            if (this._resGroup.indexOf(event.groupName) >= 0) {
                //console.log("111res.group.down=" + event.groupName + ", _numGroupDownloaded=" + this._numGroupDownloaded)
                var allLoaded:boolean = true;
                for (var i = 0;i < this._resGroup.length; i++){
                    if (!RES.isGroupLoaded(this._resGroup[i])) {
                        allLoaded = false;
                        break;
                    }
                }
                if (allLoaded) {
                    RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
                    //console.log("222res.group.down=" + event.groupName + ", _numGroupDownloaded=" + this._numGroupDownloaded)
                    RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                    this.outer();
                }
            }
        }

        /**
         * group下载失败
         * @param event
         */
        private onResourceLoadGroupError(event:RES.ResourceEvent):void {
            RES.loadGroup(event.groupName);
        }
        /**
         * preload资源组加载进度
         */
        private onResourceProgress(event:RES.ResourceEvent):void {
            if (this.textField)this.textField.text = "加载中..." + event.itemsLoaded + "/" + event.itemsTotal;
        }
    }
    export class LoadingItemUI extends BaseGroup {
        private _colorBg:number = 0;
        private _colorLine:number = 0;
        private _title:string = null;
        private _w:number = 0;
        private _h:number = 0;
        private _shape:egret.Shape = null;
        private _lableTitle:easy.Label = null;
        public constructor(colorBg:number, colorLine:number, str:string, w:number, h:number) {
            super();
            this._colorBg = colorBg;
            this._colorLine = colorLine;
            this._title = str;
            this._w = w;
            this._h = h;
        }

        public createChildren():void {
            super.createChildren();
            this.setSize(this._w, this._h);
            this._shape = new egret.Shape();
            this._shape.graphics.beginFill(this._colorBg);
            this._shape.graphics.drawRoundRect(0, 0 , this._w, this._h, 4, 4);
            this._shape.graphics.endFill();
            this._shape.graphics.lineStyle(2, this._colorLine);
            this._shape.graphics.drawRoundRect(0, 0 , this._w, this._h, 4, 4);
            this.addChild(this._shape);

            this._lableTitle = new easy.Label();
            this._lableTitle.autoSize = true;
            //this._lableTitle.setSize(this._w, this._h);
            this._lableTitle.hAlign = egret.HorizontalAlign.CENTER;
            //this._lableTitle.vAlign = egret.VerticalAlign.MIDDLE;
            this._lableTitle.text = this._title;
            this._lableTitle.color = 0xffffff;
            this._lableTitle.stroke = 1;
            this._lableTitle.strokeColor = 0x000000;
            this._lableTitle.fontSize = 60;
            this._lableTitle.x = 15;
            this._lableTitle.y = -8;
            this._lableTitle.showBg = false;
            this.addChild(this._lableTitle);
        }
    }
}
