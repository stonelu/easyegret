/**
 * Copyright (c) 2014,www.easyegret.com
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
    export class HitTestUtil {
        //碰撞检测
        public static testHitBitmap(b1:egret.Bitmap, b2:egret.Bitmap):boolean {
            var b1Rect:egret.Rectangle = b1.getBounds();
            var b2Rect:egret.Rectangle = b2.getBounds();
            return b1Rect.intersects(b2Rect) || b2Rect.intersects(b1Rect);
        }
        public static testHitRect(b1Rect:egret.Rectangle, b2Rect:egret.Rectangle):boolean {
            return b1Rect.intersects(b2Rect) || b2Rect.intersects(b1Rect);
        }

        private static _shape:egret.Shape = null;

        public static testHit(obj1:egret.DisplayObject, obj2:egret.DisplayObject):boolean {
            //console.log("p1=" + obj1.parent + ", p2=" + obj2.parent)
            if (!obj1.parent || !obj2.parent) {
                return false;
            }
            var x:number = obj1.x;
            var y:number = obj1.y ;
            var b1Rect:egret.Rectangle = obj1.getBounds();
            //对象1的数据准备
            if (obj1.anchorX != 0){
                x -= b1Rect.width * obj1.anchorX;
            }
            if (obj1.anchorY != 0){
                y -= b1Rect.height * obj1.anchorY;
            }
            var tempPoint:egret.Point = new egret.Point();
            obj1.parent.localToGlobal(x, y, tempPoint);
            b1Rect.x = tempPoint.x;
            b1Rect.y = tempPoint.y;
            //console.log("x1=" + x + ", x2=" + tempPoint.x + ", y1=" + y + ", y2=" + tempPoint.y + ", w="+ b1Rect.width + ", h=" + b1Rect.height);
            //对象2的数据准备
            x = obj2._x;
            y = obj2._y ;
            //对象1的数据准备
            var b2Rect:egret.Rectangle = obj2.getBounds();
            if (obj2.anchorX != 0){
                x -= b2Rect.width * obj2.anchorX;
            }
            if (obj2.anchorY != 0){
                y -= b2Rect.height * obj2.anchorY;
            }
            obj2.parent.localToGlobal(x, y, tempPoint);
            b2Rect.x = tempPoint.x;
            b2Rect.y = tempPoint.y;
            //console.log("x1=" + x + ", x2=" + tempPoint.x + ", y1=" + y + ", y2=" + tempPoint.y + ", w="+ b2Rect.width + ", h=" + b2Rect.height);

            //if (HitTestUtil._shape == null) {
            //    HitTestUtil._shape = new egret.Shape();
            //}
            //GlobalSetting.STAGE.addChild(HitTestUtil._shape);
            //HitTestUtil._shape.graphics.clear();
            //HitTestUtil._shape.graphics.lineStyle(1, 0xff0f0f);
            //HitTestUtil._shape.graphics.drawRect(b1Rect.x, b1Rect.y , b1Rect.width, b1Rect.height);
            //HitTestUtil._shape.graphics.lineStyle(1, 0xff0f0f);
            //HitTestUtil._shape.graphics.drawRect(b2Rect.x, b2Rect.y , b2Rect.width, b2Rect.height);
            //HitTestUtil._shape.graphics.endFill();

            if (HitTestUtil.testHitRect(b1Rect, b2Rect)){//矩形相交
                //计算出相交部分的矩形
                var intersection:egret.Rectangle = new egret.Rectangle();
                intersection.x = Math.max( b1Rect.x, b2Rect.x);
                intersection.y = Math.max( b1Rect.y, b2Rect.y);
                intersection.width    = Math.min( ( b1Rect.x + b1Rect.width ) - intersection.x, ( b2Rect.x + b2Rect.width ) - intersection.x );
                intersection.height = Math.min( ( b1Rect.y + b1Rect.height ) - intersection.y, ( b2Rect.y + b2Rect.height ) - intersection.y );
                //console.log("intersection x=" + intersection.x + ", y=" + intersection.y + ", w=" + intersection.width + ", h=" + intersection.height);

                //if (HitTestUtil._shape == null) {
                //    HitTestUtil._shape = new egret.Shape();
                //}
                //GlobalSetting.STAGE.addChild(HitTestUtil._shape);
                //HitTestUtil._shape.graphics.clear();
                //HitTestUtil._shape.graphics.lineStyle(2, 0x00ffff);
                //HitTestUtil._shape.graphics.drawRect(intersection.x, intersection.y, intersection.width, intersection.height);

                //var objTexture2:egret.RenderTexture = new egret.RenderTexture();
                //objTexture2.drawToTexture(obj2);
                //var objBitmap2:egret.Bitmap = new egret.Bitmap();
                //objBitmap2.texture = objTexture2;
                //objBitmap2.x = b2Rect.x;
                //objBitmap2.y = b2Rect.y;
                //objBitmap2._anchorX = obj2._anchorX;
                //objBitmap2._anchorY = obj2._anchorY;
                //objBitmap2.width = objTexture2.textureWidth;
                //objBitmap2.height = objTexture2.textureHeight;
                //console.log("obj2 x=" + obj2.x + ", y=" + obj2.y + ", w=" + obj2.width + ", h=" + obj2.height);
                //console.log("objBitmap2 x=" + objBitmap2.x + ", y=" + objBitmap2.y + ", w=" + objBitmap2.width + ", h=" + objBitmap2.height);
                //var objTexture1:egret.RenderTexture = new egret.RenderTexture();
                //objTexture1.drawToTexture(obj1);
                //var objBitmap1:egret.Bitmap = new egret.Bitmap();
                //objBitmap1.texture = objTexture1;
                //objBitmap1.scaleX = b1Rect.width/objTexture1.textureWidth;
                //objBitmap1.scaleY = b1Rect.height/objTexture1.textureHeight;
                //objBitmap1.x = b1Rect.x;
                //objBitmap1.y = b1Rect.y;
                //objBitmap1._anchorX = obj1._anchorX;
                //objBitmap1._anchorY = obj1._anchorY;
                //objBitmap1.width = objTexture1.textureWidth;
                //objBitmap1.height = objTexture1.textureHeight;
                //for (var i = 0; i <= objTexture1.textureWidth; i++){
                //    for (var j = 0; j <= objTexture1.textureHeight; j++){
                //        if (objTexture1.getPixel32(i,j))
                //        for (var k = 0; k < objTexture1.getPixel32(i,j).length; k++){
                //            if (objTexture1.getPixel32(i,j)[k] != 0)console.log(k +"=" + objTexture1.getPixel32(i,j)[k]);
                //        }
                //    }
                //}
                //console.log("objTexture1 x=" + objTexture1._offsetX + ", y=" + objTexture1._offsetY + ", w=" + objTexture1.textureWidth + ", h=" + objTexture1.textureHeight);
                //console.log("objBitmap1 x=" + objBitmap1.x + ", y=" + objBitmap1.y + ", w=" + objBitmap1.width + ", h=" + objBitmap1.height);
                //GlobalSetting.STAGE.addChild(objBitmap1);
                //只对相交部分的矩形进行像素检测
                //var v1:Array<number> = null;
                //var v2:Array<number> = null;
                //for (var i = intersection.x; i <= intersection.x + intersection.width; i++){
                //    for (var j = intersection.y; j <= intersection.y + intersection.height; j++){
                //        v1 = objBitmap1.texture.getPixel32(i,j);
                //        v2 = objBitmap2.texture.getPixel32(i,j);
                //        console.log("v1.lenght=" + v1[3] + ", v2.lenght=" + v2[3]);
                //        if (v1 != null && v1.length > 0 && v1[3] != 0 && v2 != null && v2.length > 0 && v2[3] != 0 ){
                //            return true;
                //        }
                //    }
                //}
                return true;
            } else {
                if (HitTestUtil._shape != null && HitTestUtil._shape.parent){
                    HitTestUtil._shape.parent.removeChild(HitTestUtil._shape);
                }
            }
            return false;
        }
    }
}