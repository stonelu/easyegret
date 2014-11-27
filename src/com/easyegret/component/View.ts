/**
 * Created by Administrator on 2014/11/5.
 */
module easy{
    /**
     * view的基本类
     * 所有的ui组件都应该放置在ui层中
     * 在view中只处理view相关的逻辑,对ui成层的组件进行操作
     */
    export class View extends ReceiveGroup {
        public constructor() {
            super();
        }

        /**
         * view进入的逻辑
         * 可以再次根据外部数据情况做一些逻辑处理
         */
        public enter():void {
            super.enter();
            this.checkViewSize();
        }
        /**
         * 设置ui层的显示对象
         * @param myui
         */
        public setUI(myui:egret.DisplayObject) {
            super.setUI(myui);
            this._ui = myui;
            if (this._ui) {
                this.addChild(this._ui);
            }
            this.showDefaultSkin = false;
        }
        /**
         * 检测view的尺寸要求是否达到设定
         */
        public checkViewSize():void {
            if (GlobalSetting.DISPLAY_MODEL == GlobalSetting.DISPLAY_VIEW_FULL){
                this.setSize(GlobalSetting.STAGE_WIDTH, GlobalSetting.STAGE_HEIGHT);
                var ui:BaseGroup = this.getUI();
                if (ui){
                    ui.setSize(this.width, this.height);
                    console.log("view checkViewSize widht=" + ui.width + ", height=" + ui.height)
                }
            }
        }

        /**
         * view退出的逻辑
         * 做一些数据的销毁或者初始化,保证下次进入的时候,不会残留
         */
        public outer():void {
            super.outer();
        }

    }
}