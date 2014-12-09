/**
 * Copyright (c) 2012 www.2ren.cn
 */
module easy.rpg {

    /**
     * <p>并行效果</p>
     * @date  :Jun 18, 2012
     * @author:jinyi.lu
     */
    export class ParalleQueue extends easy.rpg.BaseAnimate {
        private animateList:Array<IAnimate> = new Array<IAnimate>();//并行动画的列表

        public constructor(){
            super();
        }
        /**
         * 心跳,呼吸, 运动的之类要覆盖该方法,做动作
         */  
        public onHeartBeat():void {
            super.onHeartBeat();
            if (this.runing){
                if (this.animateList.length > 0) {
                    for (var i = this.animateList.length - 1; i >= 0; i--) {
                        if (this.animateList[i].completed && this.animateList[i].afterFrame <= 0) {
                            this.removeAnimate(this.animateList[i]);
                        }
                    }
                    var item:IAnimate = null;
                    var length1:number = this.animateList.length;
                    for (var i = 0; i < length1; i++) {
                        item = this.animateList[i];
                        item.onHeartBeat();
                        if (!item.runing && item.delayFrame <= 0)item.play();
                    }
                }
                if (this.animateList.length == 0) this.stop();
            }
        }
        /**
         * 添加一个并行动画
         */  
        public addAnimate(animate:IAnimate):void {
            animate.parent = this;
            this.animateList.push(animate);
        }
        /**
         * 删除一个串行动画
         */  
        public removeAnimate(animate:IAnimate):void {
            for (var i = 0; i < this.animateList.length; i++) {
                if (this.animateList[i] == animate) {
                    this.animateList[i].stop();
                    this.animateList[i].destroy();
                    this.animateList.splice(i, 1);
                    break;
                }
            }
        }
        /**
         * 销毁数据
         */  
        public destroy():void{
            super.destroy();
            for (var i = 0; i < this.animateList.length; i++) {
                this.animateList[i].destroy();
            }
            this.animateList.length = 0;
        }
        
        public set frozen(value:boolean){
            super.frozen = value;
            for (var i = 0; i < this.animateList.length; i++) {
                this.animateList[i].frozen = value;
            }
        }
    }
}