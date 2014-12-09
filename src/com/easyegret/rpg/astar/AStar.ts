/**
 * Copyright (c) 2012 www.2ren.cn
 */
module easy.rpg {

	export class AStar {
        private _open:BinaryHeap;
        private _grid:Grid;
        private _endNode:Node;
        private _startNode:Node;
        public path:Array<Node>;
        public heuristic:Function;
        private _straightCost:number = 1.0;
        private _diagCost:number = Math.SQRT2;
        private nowversion:number = 1;
        
        public constructor(){
            this.heuristic = this.euclidian2;
            
        }
        public get grid():Grid{
            return this._grid;
        }
        private justMin(x:any, y:any):boolean {
            return x.f < y.f;
        }
        
        public findPath(grid:Grid):boolean {
            this._grid = grid;
            this._endNode = this._grid.endNode;
            this.nowversion++;
            this._startNode = this._grid.startNode;
            //_open = [];
            this._open = new BinaryHeap(this.justMin);
            this._startNode.g = 0;
            return this.search();
        }
        
        public search():boolean {
            var node:Node = this._startNode;
            node.version = this.nowversion;
            while (node != this._endNode){
                var len:number = node.links.length;
                for (var i:number = 0; i < len; i++){
                    var test:Node = node.links[i].node;
                    var cost:number = node.links[i].cost;
                    var g:number = node.g + cost;
                    var h:number = this.heuristic(test);
                    var f:number = g + h;
                    if (test.version == this.nowversion){
                        if (test.f > f){
                            test.f = f;
                            test.g = g;
                            test.h = h;
                            test.parent = node;
                        }
                    } else {
                        test.f = f;
                        test.g = g;
                        test.h = h;
                        test.parent = node;
                        this._open.ins(test);
                        test.version = this.nowversion;
                    }
                    
                }
                if (this._open.a.length == 1){
                    return false;
                }
                node = <Node><any> (this._open.pop());
            }
            this.buildPath();
            return true;
        }
        
        private buildPath():void {
            this.path = new Array<Node>();
            var node:Node = this._endNode;
            this.path.push(node);
            while (node != this._startNode){
                node = node.parent;
                this.path.unshift(node);
            }
        }
        
        public manhattan(node:Node):number {
            return Math.abs(node.row - this._endNode.row) + Math.abs(node.column - this._endNode.column);
        }
        
        public manhattan2(node:Node):number {
            var dx:number = Math.abs(node.row - this._endNode.row);
            var dy:number = Math.abs(node.column - this._endNode.column);
            return dx + dy + Math.abs(dx - dy) / 1000;
        }
        
        public euclidian(node:Node):number {
            var dx:number = node.row - this._endNode.row;
            var dy:number = node.column - this._endNode.column;
            return Math.sqrt(dx * dx + dy * dy);
        }
        
        private TwoOneTwoZero:number = 2 * Math.cos(Math.PI / 3);
        
        public chineseCheckersEuclidian2(node:Node):number {
            var y:number = node.column / this.TwoOneTwoZero;
            var x:number = node.row + node.column / 2;
            var dx:number = x - this._endNode.row - this._endNode.column / 2;
            var dy:number = y - this._endNode.column / this.TwoOneTwoZero;
            return this.sqrt(dx * dx + dy * dy);
        }
        
        private sqrt(x:number):number {
            return Math.sqrt(x);
        }
        
        public euclidian2(node:Node):number {
            var dx:number = node.row - this._endNode.row;
            var dy:number = node.column - this._endNode.column;
            return dx * dx + dy * dy;
        }
        
        public diagonal(node:Node):number {
            var dx:number = Math.abs(node.row - this._endNode.row);
            var dy:number = Math.abs(node.column - this._endNode.column);
            var diag:number = Math.min(dx, dy);
            var straight:number = dx + dy;
            return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
        }
    }
}