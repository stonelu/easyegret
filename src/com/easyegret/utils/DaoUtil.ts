module easy {
    export class DaoUtil {
        /**
         * 保存一条数据
         * @param moduleName 模块的名称
         * @param key 数据的标示
         * @param value 要存储的数据
         */
        public static write(moduleName:string, key:string, value:string):void {
            egret.localStorage.setItem(moduleName+""+key,value);
        }
        /**
         * 保存一条数据
         * @param moduleName 模块的名称
         * @param key 数据的标示
         */
        public static read(moduleName:string, key:string):string {
           return egret.localStorage.getItem(moduleName+""+key);
        }
        /**
         * 删除一条数据
         * @param moduleName 模块的名称
         * @param key 数据的标示
         */
        public static delete(moduleName:string, key:string):void {
            egret.localStorage.removeItem(moduleName+""+key);
        }
    }
}