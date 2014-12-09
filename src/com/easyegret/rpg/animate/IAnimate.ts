/**
 * Copyright (c) 2012 www.2ren.cn
 */
module easy.rpg {

	export interface IAnimate {
        onHeartBeat():void;
        play():void;
        stop():void;
        destroy():void;
        getDisplay():egret.DisplayObject;
        runing:boolean;
        completed:boolean;
        parent:IAnimate;
        afterFrame:number;
		delayFrame:number;
        frozen:boolean;
    }
}