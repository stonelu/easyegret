/**
 * Copyright (c) 2012 www.2ren.cn
 */
module easy.rpg {
	/**
	 * 受击动画 
	 * @author Administrator
	 * 
	 */
	export class HitAnimate extends BaseAnimate {
		public skillId:number = 0;//技能id
		public actorSrc:Actor = null;//技能起始人
		public actorDes:Actor = null;//技能目标
		public constructor(){
			super();
		}
		/**
		* 播放动画
		*/
		public play():void {
			if (this.skillId > 0 ){
				this._resJsonId = "skill_json_" + this.skillId;
				this._resImgId = "skill_img_" + this.skillId;
				this.jsonData = RES.getRes(this._resJsonId);
			}
			super.play();//设置runing标志
			this._imgDisplay.x = this.actorDes._ctrl.gameData._screenXY.x;
			this._imgDisplay.y = this.actorDes._ctrl.gameData._screenXY.y;
		}
		//
		///**
		// * 心跳,呼吸, 运动的之类要覆盖该方法,做动作
		// */
		//public onHeartBeat():void {
		//	super.onHeartBeat();
         //   //if (_effectMovieClip)trace("MovieClip width=" + _effectMovieClip.width + ", height=" + _effectMovieClip.height + ", pivotX=" + this._effectMovieClip.pivotX + ", pivotY=" + this._effectMovieClip.pivotY)
		//	if((this.runing && this._effectMovieClip && this._effectMovieClip.parent == null) || this._effectMovieClip == null){
		//		this.stop();
		//	}
		//}
        /**
         * 销毁数据
         */  
        public destroy():void {
            super.destroy();
        }
	}
}