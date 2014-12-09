/**
 * Copyright (c) 2012 www.2ren.cn
 */
module easy.rpg {

	export class DirectionUtil {
        /**
         * 方向定义, valve,保持和动作序列的下标一致
         *          n
         *      wn     ne
         *    w           e
         *      sw     es
         *          s
         *
         *        [1]
         *     [2]    [8]
         *   [3]        [7]
         *     [4]    [6]
         *        [5]
         */
        //8向
        public static directionPoint(src:egret.Point, target:egret.Point):number {
//            Debug.log("src.x=" + source.x + ",src.y=" + source.y + ", target.x=" + target.x + ",target.y=" + target.y + ",angle=" + angleValue);
            if (src.x - target.x > 0) {//向左
                if(src.y - target.y > 0) {//向上
                    return RpgSetting.DIRECTION_2;
                } else if(src.y - target.y < 0){//向下
                    return RpgSetting.DIRECTION_4;
                } else {//横向
                    return RpgSetting.DIRECTION_3;
                }
            } else  if (src.x - target.x < 0) {//向右
                if(src.y - target.y > 0) {//向上
                    return RpgSetting.DIRECTION_8;
                } else if(src.y - target.y < 0){//向下
                    return RpgSetting.DIRECTION_6;
                } else {//横向
                    return RpgSetting.DIRECTION_7;
                }
            } else {//竖向
                if(src.y - target.y > 0) {//向上
                    return RpgSetting.DIRECTION_1;
                } else if(src.y - target.y < 0){//向下
                    return RpgSetting.DIRECTION_5;
                } else {//横向,不可能,除非原地不动
                    return RpgSetting.DIRECTION_0;
                }
            }
        }
        public static directionNode(src:Node, target:Node):number {
            if (src.row - target.row == 1) {//向左
                if(src.column - target.column == 1) {//向上
                    return RpgSetting.DIRECTION_2;
                } else if(src.column - target.column == -1){//向下
                    return RpgSetting.DIRECTION_4;
                } else {//横向
                    return RpgSetting.DIRECTION_3;
                }
            } else  if (src.row - target.row == -1) {//向右
                if(src.column - target.column == 1) {//向上
                    return RpgSetting.DIRECTION_8;
                } else if(src.column - target.column == -1){//向下
                    return RpgSetting.DIRECTION_6;
                } else {//横向
                    return RpgSetting.DIRECTION_7;
                }
            } else {//竖向
                if(src.column - target.column == 1) {//向上
                    return RpgSetting.DIRECTION_1;
                } else if(src.column - target.column == -1){//向下
                    return RpgSetting.DIRECTION_5;
                } else {//横向,不可能,除非原地不动
                    return RpgSetting.DIRECTION_0;
                }
            }
        }
        /**
         *  根据起始位置,和给定的目标位置,判断方向的标号
         *          n
         *      wn     ne
         *    w           e
         *      sw     es
         *          s
         * 
         *        [1]
         *     [2]    [8]
         *   [3]        [7]
         *     [4]    [6]
         *        [5]
         */ 
        public static direction(source:egret.Point, target:egret.Point, directionNumber:number = 0):number {
            var angleValue:number = DirectionUtil.angle(source, target);
            if (directionNumber == 4) {
                //4方向判断
                if (angleValue < 90) {
                    return RpgSetting.DIRECTION_6;//6
                } else if (angleValue < 180) {
                    return RpgSetting.DIRECTION_4;//4
                } else if (angleValue < 270) {
                    return RpgSetting.DIRECTION_2;//2
                }  else {
                    return RpgSetting.DIRECTION_8;//8
                }
            } else if (directionNumber == 6) {
                //6方向判断
                if (angleValue > 337 || angleValue < 23) {
                    return RpgSetting.DIRECTION_7;//7
                } else if (angleValue > 270) {
                    return RpgSetting.DIRECTION_8;//8
                } else if (angleValue > 202) {
                    return RpgSetting.DIRECTION_2;//2
                } else if (angleValue > 157) {//left
                    return RpgSetting.DIRECTION_3;//3
                } else if (angleValue > 90) {
                    return RpgSetting.DIRECTION_4;//4
                } else {
                    return RpgSetting.DIRECTION_6;//6
                }
            } else {
                //8方向判断
                if (angleValue > 337 || angleValue <23) {//right
                    return RpgSetting.DIRECTION_7;
                } else if (angleValue > 292) {//
                    return RpgSetting.DIRECTION_8;
                } else if (angleValue > 247) {//up
                    return RpgSetting.DIRECTION_1;
                } else if (angleValue > 202) {
                    return RpgSetting.DIRECTION_2;
                } else if (angleValue > 157) {//left
                    return RpgSetting.DIRECTION_3;
                } else if (angleValue > 112) {
                    return RpgSetting.DIRECTION_4;
                } else if (angleValue > 67) {//down
                    return RpgSetting.DIRECTION_5;
                } else {
                    return RpgSetting.DIRECTION_6;
                }
            }
            return 0;
        }
        /**
         * 根据两点坐标计算角度
         * @param source 起始坐标
         * @param target 目标坐标
         */  
        public static angle(source:egret.Point, target:egret.Point):number {
            var nx:number = target.x - source.x;
            var ny:number = target.y - source.y;
            var r:number = Math.sqrt(nx*nx + ny*ny);
            var cos:number = nx/r;
            var angle:number = Math.floor(Math.acos(cos) * 180/Math.PI);
            if (ny < 0 ) {
                angle = 360 - angle;
            }
            return angle;
        }
        /**
         * 根据两点距离,获取xy的步进值
         * @source point 起始位置
         * @source point 结束位置
         * @walkSpeed Number 单帧行走的线速度
         */  
        public static speedXY(source:egret.Point, target:egret.Point, walkSpeed:number):egret.Point {
            var diC:number = egret.Point.distance(source, target);
            var frams:number = Math.floor(GlobalSetting.FRAME_RATE *diC/walkSpeed) - 1;
            frams = frams<=0?1:frams;
            var ydC:number =  target.y - source.y;
            var xdC:number =  target.x - source.x;
            //console.log("DirectionUtil.speedXY diC=" + diC + ", xdC/frams=" + xdC + "/" + frams + ", ydC/frams=" + ydC + "/" + frams);
            return new egret.Point(Math.round(xdC/frams*100)/100, Math.round(ydC/frams*100)/100);
        }
    }
}