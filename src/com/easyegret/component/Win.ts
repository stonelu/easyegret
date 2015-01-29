/**
 * Created by Administrator on 2014/11/5.
 */
module easy{
    /**
     * win的基本类
     * 所有的ui组件都应该放置在ui层中
     * 在win中只处理view相关的逻辑,对ui成层的组件进行操作
     */
    export class Win extends ReceiveGroup {
        /**
         * 进入的效果
         */
        private _outerEffect:IEffect = null;
        /**
         * win成对应的ui展现
         * @type {null}
         * @private
         */
        public constructor() {
            super();
            this._loadingUIClz = LoadingWinUI;
        }
        public createChildren():void {
            super.createChildren();
        }
        /**
         * enter的过渡效果
         */
        public enterTransition():void {
            super.enterTransition();
        }
        /**
         * enter的过渡效果结束
         */
        public enterTransitionComplete():void {
            super.enterTransitionComplete();
        }
        /**
         * view进入的逻辑
         * 可以再次根据外部数据情况做一些逻辑处理
         */
        public enter():void {
            super.enter();
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