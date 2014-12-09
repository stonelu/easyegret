/**
 * Copyright (c) 2012 www.2ren.cn
 */
module easy.rpg {
    /**
     * 战斗伤害控制
     * @author jinyi.lu
     * 
     */
	export class DamageAnimate extends BaseAnimate {

		public constructor(){
			super();
		}
		public hp:Array<number> = null;
		public atk:Array<number> = null;
		public des:Array<number> = null;
		public target:string = "left";//被动接受进攻方的君主ID定义为-1,挑起战斗的玩家君主ID定义为-2
		public isSkill:boolean = false;//是否是技能攻击伤害，用来定位数字位置用
		
		private _damageGroupCurrY = 150;//当前的y
		private _damageGroupToY = -150;//移动后的y
			
			
        /**
         * 播放动画,做动画前的各项资料准备
         */  
        public play():void {
            super.play();//设置runing标志
            this.console.log("DamageAnimate play.offset=" + this.offsetFrame + ", this.des=" + this.des);
			//播放伤害背景动画
			this._effectMovieClip = this.view.ui.fightShowAreaAnimateItem.getMovieClip(this.effectId, this.target);
			//血槽 和攻击力槽的 变化
			if(this.des[0] > 0){
				var battleCardData:BattleCardData = this.battleData.getCardData(this.des[0]);
				//血量
				if(this.hp && this.hp[0] != 0){
					//更新场上的
					if(this.target == "left"){
						this.view.ui.playerCardInfoLeftItem.updateHp(this.hp[0]);
					}else if(this.target == "right"){
						this.view.ui.playerCardInfoRightItem.updateHp(this.hp[0]);
					}
					//更新左右两侧的血槽
					(<FightHeroIconItem><any> (battleCardData.cardItem)).updateHp(this.hp[0]);
				}
				//攻击
				if(this.atk && this.atk[0] != 0){
					//更新场上的
					if(this.target == "left"){
						this.view.ui.playerCardInfoLeftItem.updateAtk(this.atk[0]);
					}else if(this.target == "right"){
						this.view.ui.playerCardInfoRightItem.updateAtk(this.atk[0]);
					}
				}
			}else if(this.des[0] == -2 && this.hp && this.hp[0] != 0){
				//我方君主
				this.view.ui.playerHeadLeftItem.updateHp(this.hp[0]);
			}else if(this.des[0] == -1 && this.hp && this.hp[0] != 0){
				//敌方
				this.view.ui.playerHeadRightItem.updateHp(this.hp[0]);
			}
			//播放伤害数字的上浮
			this.view.ui.fightShowAreaAnimateItem.setDamageValue(this.hp, this.atk, this.target, this.isSkill);
			this.view.ui.fightShowAreaAnimateItem.damageGroup.visible = true;
			this.view.ui.fightShowAreaAnimateItem.damageGroup.alpha = 1;
			this.view.ui.fightShowAreaAnimateItem.damageNameGroup.visible = true;
			this.view.ui.fightShowAreaAnimateItem.damageNameGroup.alpha = 1;
			if(this.isSkill){
				//技能攻击上浮
				this.view.ui.fightShowAreaAnimateItem.damageGroup.y = this._damageGroupCurrY;
				TweenLite.to(this.view.ui.fightShowAreaAnimateItem.damageGroup, 0.8, {y:this._damageGroupToY, alpha:0.3, ease:Circ.easeIn});
				this.view.ui.fightShowAreaAnimateItem.damageNameGroup.y = this._damageGroupCurrY;
				TweenLite.to(this.view.ui.fightShowAreaAnimateItem.damageNameGroup, 0.8, {y:this._damageGroupToY, alpha:0.3, delay:0.2, ease:Circ.easeIn});
			}else{
				//物理攻击不动
				this.view.ui.fightShowAreaAnimateItem.damageGroup.y = this._damageGroupCurrY;
				TweenLite.to(this.view.ui.fightShowAreaAnimateItem.damageGroup, 0.8, {y:this._damageGroupToY, alpha:0.3, ease:Circ.easeIn});
				this.view.ui.fightShowAreaAnimateItem.damageNameGroup.y = this._damageGroupCurrY;
				TweenLite.to(this.view.ui.fightShowAreaAnimateItem.damageNameGroup, 0.8, {y:this._damageGroupToY, alpha:0.3, delay:0.2, ease:Circ.easeIn});
				
//				//物理攻击不动
//				this.view.ui.fightShowAreaAnimateItem.damageGroup.y = _damageGroupCurrY + 120;
//				this.view.ui.fightShowAreaAnimateItem.damageGroup.scaleX = 1.5;
//				this.view.ui.fightShowAreaAnimateItem.damageGroup.scaleY = 1.5;
//				TweenLite.to(this.view.ui.fightShowAreaAnimateItem.damageGroup, 0.3, {scaleX:1, scaleY:1, ease:Quad.easeIn});
//				TweenLite.to(this.view.ui.fightShowAreaAnimateItem, 0.6, {onComplete:playDamageComplete});
			}
            SystemHeartBeat.addEventListener(this.playDamageComplete, 10,this, 1);
        }
		/**
		 * 数字上浮完毕 
		 * 
		 */		
		private playDamageComplete(endCall:boolean = false):void {
			this.view.ui.fightShowAreaAnimateItem.damageGroup.visible = false;
			this.view.ui.fightShowAreaAnimateItem.damageNameGroup.visible = false;
			this.stop();
			this.console.log("DamageAnimate stop this.des=" + this.des);
		}
        /**
         * 销毁数据
         */  
        public destroy():void {
            super.destroy();
            this.des = null;
            this.hp = null;
            this.atk = null;
        }
    }
}