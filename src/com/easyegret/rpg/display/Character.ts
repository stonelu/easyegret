/** * Copyright (c) 2012 www.2ren.cn */
module ui {

	export class Character extends MovieDisplay {
        public hitRect:DisplayObjectContainer = new DisplayObjectContainer();//战斗攻击碰撞使用的矩形
        public displayBack:Bitmap = new Bitmap();//图像前图形容器
        public displayFront:Bitmap = new Bitmap();//图像后图形容器
        public constructor() {
            super();
        }
        public initData():void {
            super.initData();
        }
        /**
         * 初始化主场景的组件,加入场景时,主动调用一次
         * 子类覆写该方法,添加UI逻辑
         */  
        public createChildren():void {
            super.createChildren();
            this.hitRect.graphics.clear();
            this.hitRect.graphics.beginFill(0xeeeeee, 0);
            this.hitRect.graphics.drawRect(-5, -20, 10, 40);
            this.hitRect.graphics.endFill();
            this.hitRect.width = 10;
            this.hitRect.height = 40;
            this.hitRect.y = -60;
            this.addChildAt(this.hitRect, 0);
            this.addChildAt(this.displayBack, 0);
            this.addChild(this.displayFront);
        }
        public get characterControl():CharacterControl {
            return <CharacterControl><any> (this.control);
        }
        
        public get direction():number {
            return this.characterControl.characterData.direction;
        }
        
        public set direction(value:number = 0) {
            this.characterControl.characterData.direction = value;
        }
        
        public get action():string {
            return this.characterControl.action;
        }
        
        /**
         * 设置状态
         */ 
        public set action(value:string) {
            this.characterControl.action = value;
        }
        /**
         * 设置人物行走状态
         */ 
        public setStateWalk():void {
            this.action = Const.PLAYER_MOV;
        }
        /**
         * 设置人物站立状态
         */ 
        public setStateStand():void {
            this.action = Const.PLAYER_STD;
        }
        /**
         * 设置人物进入攻击状态
         */ 
        public setStateAck():void {
            this.action = Const.PLAYER_ATK;
        }
        /**
         * 设置人物进入被攻击状态
         */ 
        public setStateBak():void {
            this.action = Const.PLAYER_BAK;
        }
		
		/**
		 * 对象销毁 
		 * 
		 */		
		public destroy():void{
			super.destroy();
			if(this.display != null){
				this.display.bitmapData = null;
				this.display = null;
			}
		}
		
		public set visible(value:boolean){
			super.visible = value;
		}
    }
}