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
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
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

    export class GuideManager {
        public static _init_data:boolean = false;//是否已经初始化节点数据
        //GuideChapter 存储定义
        public static guide_chapter_dict:Object = {};
        //GuideItem 存储定义
        public static guide_item_dict:Object = {};

        public static currentItem:GuideItem = null;//当前播放的节点
        public static currentView:DefaultGuideWin = null;//当前窗口
        private static currentClz:any = null;//当前窗口类

        //上遮幅显示对象
        public static croppingTop:easy.Group = null;
        //下遮幅显示对象
        public static croppingBottom:easy.Group = null;
        //遮幅对象是否已初始化
        private static _initCropping:boolean = false;

        public constructor(){
        }

        /**
         * 播放对话节点
         * @param id 节点id
         * @param clz 所使用的窗口类对象
         */
        public static play(id:string, clz:any = null):void {
            if (GuideManager.guide_item_dict[id]) {
                GuideManager.playItem(GuideManager.guide_item_dict[id], clz);
            }
        }
        /**
         * 播放对话节点
         * @param item 节点对象
         * @param clz 所使用的窗口类对象
         */
        public static playItem(item:GuideItem, clz:any = null):void {
            if (!item) return;
            var guideView:any = DefaultGuideWin;
            if (GuideManager.currentClz) guideView = GuideManager.currentClz;
            if (clz)guideView = clz;

            var instView:DefaultGuideWin = PopupManager.show(guideView, item);
            if (instView && GuideManager.currentItem) {
                instView.data = item;
                instView.enter();
            }
            //判断遮幅显示
            GuideManager.showCropping();
            //保存数据
            GuideManager.currentItem = item;
            GuideManager.currentClz = guideView;
        }


        /**
         * 显示遮幅
         * @param textureName 自定义遮幅材质
         */
        public static showCropping(textureName:string = null):void {
            //初始化遮幅显示对象
            if (!GuideManager.croppingTop) GuideManager.croppingTop = new easy.Group();
            if (!GuideManager.croppingBottom) GuideManager.croppingBottom = new easy.Group();
            if (!GuideManager.croppingTop.parent) {
                GlobalSetting.STAGE.addChild(GuideManager.croppingTop);
                GlobalSetting.STAGE.addChild(GuideManager.croppingBottom);
                GuideManager.initCropping(textureName);
                GuideManager.croppingTop.y = -GuideManager.croppingTop.height;
                GuideManager.croppingBottom.y = GlobalSetting.STAGE.stageHeight;
                //首次显示,做缓动
                egret.Tween.get(GuideManager.croppingTop).to({y:0}, 500);
                egret.Tween.get(GuideManager.croppingBottom).to({y:GlobalSetting.STAGE.stageHeight - GuideManager.croppingBottom.height}, 500);
            } else {
                //再添加一次,把次序调到最后面,主要是保证遮幅是放置在最前面的
                GlobalSetting.STAGE.addChild(GuideManager.croppingTop);
                GlobalSetting.STAGE.addChild(GuideManager.croppingBottom);
                GuideManager.initCropping(textureName);
            }
        }

        /**
         * 关闭遮幅
         */
        public static hiddenCropping():void{
            if (GuideManager.croppingTop.parent) {
                egret.Tween.get(GuideManager.croppingTop).to({y:-GuideManager.croppingTop.height}, 500).call(GuideManager.onCompleteOutCropping, GuideManager);
                egret.Tween.get(GuideManager.croppingBottom).to({y:GlobalSetting.STAGE.height}, 500);
            }
        }

        /**
         * 遮幅退出动画完成
         */
        private static onCompleteOutCropping():void {
            GuideManager.croppingTop.removeFromParent();
            GuideManager.croppingBottom.removeFromParent();
        }

        /**
         * 初始化遮幅显示数据
         * @param textureName
         */
        public static initCropping(textureName:string = null):void {
            if (!GuideManager._initCropping){
                GuideManager._initCropping = true;

                //设置宽
                GuideManager.croppingTop.width = GlobalSetting.STAGE.stageWidth;
                GuideManager.croppingTop.border = false;
                GuideManager.croppingBottom.width = GlobalSetting.STAGE.stageWidth;
                GuideManager.croppingBottom.border = false;
                //设置默认高
                GuideManager.croppingTop.height = 100;
                GuideManager.croppingTop.bgColor = 0x000000;
                GuideManager.croppingTop.alpha = 0.6;
                GuideManager.croppingBottom.height = 100;
                GuideManager.croppingBottom.bgColor = 0x000000;
                GuideManager.croppingBottom.alpha = 0.6;
            }
            //设置材质
            if (textureName) {
                GuideManager.croppingTop.bgTexture = RES.getRes(textureName);
                GuideManager.croppingTop.alpha = 1;
                GuideManager.croppingBottom.bgTexture = RES.getRes(textureName);
                GuideManager.croppingBottom.alpha = 1;
                if (GuideManager.croppingTop.bgTexture) {//材质有效,设置材质的高
                    GuideManager.croppingTop.height = GuideManager.croppingTop.bgTexture.textureHeight;
                    GuideManager.croppingBottom.height = GuideManager.croppingBottom.bgTexture.textureHeight;
                }
            }
        }
    }
}