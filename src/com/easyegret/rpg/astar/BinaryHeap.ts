/**
 * Copyright (c) 2012 www.2ren.cn
 */
module easy.rpg {

	export class BinaryHeap {
        public a:Array<Object> = new Array<Object>();
        public justMinFun:Function = function(x:any, y:any):boolean {
            return this.x < this.y;
        };
        
        public constructor(justMinFun:Function = null){
            this.a.push(-1);
            if (justMinFun != null)
                this.justMinFun = justMinFun;
        }
        
        public ins(value:any):void {
            var p:number = this.a.length;
            this.a[p] = value;
            var pp:number = p >> 1;
            while (p > 1 && this.justMinFun(this.a[p], this.a[pp])){
                var temp:any = this.a[p];
                this.a[p] = this.a[pp];
                this.a[pp] = temp;
                p = pp;
                pp = p >> 1;
            }
        }
        
        public pop():any {
            var min:any = this.a[1];
            this.a[1] = this.a[this.a.length - 1];
            this.a.pop();
            var p:number = 1;
            var l:number = this.a.length;
            var sp1:number = p << 1;
            var sp2:number = sp1 + 1;
            while (sp1 < l){
                if (sp2 < l){
                    var minp:number = this.justMinFun(this.a[sp2], this.a[sp1]) ? sp2 : sp1;
                } else {
                    minp = sp1;
                }
                if (this.justMinFun(this.a[minp], this.a[p])){
                    var temp:any = this.a[p];
                    this.a[p] = this.a[minp];
                    this.a[minp] = temp;
                    p = minp;
                    sp1 = p << 1;
                    sp2 = sp1 + 1;
                } else {
                    break;
                }
            }
            return min;
        }
    }
}