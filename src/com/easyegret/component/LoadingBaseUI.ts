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
    export class LoadingBaseUI extends BaseGroup {
        private _numTotalFile:number = 0;//总文件
        private _resFileArr:Array<string> = [];//
        private _resFileArrOrg:Array<string> = [];//
        private _numTotalGroup:number = 0;//总下载组
        private _numTotalItem:number = 0;//总下载item文件
        private _numDownloadedFile:number = 0;//已下载文件数
        private _resGroup:Array<string> = null;

        private _gridWidth:number = 256;
        private _gridHeight:number = 256;

        public _currentDisplayObject:easy.ReceiveGroup = null;

        public _loadingTextArr:Array<string> = ["e", "a", "s", "y", "u", "i"];//lenght=6

        private _bmpBg:egret.Bitmap = null;//bg
        private _bmpLogo:egret.Bitmap = null;//logo

        public constructor() {
            super();
        }

        public createChildren():void {
            super.createChildren();
            this.setSize(this._gridWidth, this._gridHeight);

            this._bmpBg = new egret.Bitmap();
            this._bmpBg.anchorX = 0.5;
            this._bmpBg.anchorY = 0.5;
            this._bmpBg.texture = RES.getRes("loading_view_bg");
            this.addChild(this._bmpBg);

            this._bmpLogo = new egret.Bitmap();
            this._bmpLogo.anchorX = 0.5;
            this._bmpLogo.anchorY = 0.5;
            this._bmpLogo.texture = RES.getRes("loading_view");
            this.addChild(this._bmpLogo);
        }

        public setProgress(current, total):void {
            //this.textField.text = "加载中..." + current + "/" + total;
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
            //this._bmpLogo.rotation = 0;
            this._bmpBg.rotation = 0;
            this.alpha = 0;
            //显示loading图像
            HeartBeat.addListener(this, this.onShowLoadingGraphics);
        }

        /**
         * 完成下载,回调加载view
         */
        public outer():void {
            //console.log("@@LoadingBaseUI outer!")
            HeartBeat.removeListener(this, this.onShowLoadingGraphics);
            HeartBeat.addListener(this, this.onOuterEffect);
            if(this._currentDisplayObject){
                this._currentDisplayObject.validateNow();
            }
            this._currentDisplayObject = null;
        }
        private onOuterEffect():void {
            //console.log("this.alpha=" + this.alpha)
            if (this.alpha > 0){
                this.alpha -= 0.05;
                if (this.alpha < 0) this.alpha = 0;
            } else {
                this.removeFromParent();
                HeartBeat.removeListener(this, this.onOuterEffect);
            }
        }

        /**
         * 显示下载进度的图形
         */
        public onShowLoadingGraphics():void {
            if (this.alpha < 1) this.alpha += 0.05;
            this._bmpBg.rotation += 2;
            //this._bmpLogo.rotation -= 2;
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
            //if (this.textField)this.textField.text = "加载中..." + event.itemsLoaded + "/" + event.itemsTotal;
        }
    }
}
