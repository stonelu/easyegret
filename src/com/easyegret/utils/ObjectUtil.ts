/**
 * Copyright (c) 2012 www.2ren.cn
 */
module easy {

	export class ObjectUtil {
        /**
         * 拷贝src的属性值->target的属性中 
         * @param src 属性值来源
         * @param target 即将被赋值的对象
         */        
        public static copyValueToTarget(src:any, target:any):void {
            console.log("src=" + egret.getQualifiedClassName(src) + ", target=" + egret.getQualifiedClassName(target));

            if (src && target) {
                for (var key in src){
                    //console.log("000key=" + key + ", value=" + src[key]);
                    if (target.hasOwnProperty(key)) {
                        target[key] = src[key];
                        console.log("1111key=" + key + ", value=" + src[key]);
                    }
                }
            }
        }

        public static functionExist(thisArg:any, functionName:string):boolean{
            if (thisArg && typeof(thisArg[functionName]) == "function"){
                return true;
            }
            return false;
        }
    }
}