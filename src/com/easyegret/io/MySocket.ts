/**
 * Copyright (c) 2012 www.2ren.cn
 */
module easy {

	export class MySocket {
        //是否websocket
        private _isWebSocket:boolean = false;
        public host:string = null;
        public port:number = 0;
        private _webSocket:egret.WebSocket = null;
        //public _socket:egret.Socket = null;
        //private _initListener:boolean = false;
        //public _gatewayStatus:boolean = false;
        private rawByteArrayCache:Array<egret.ByteArray> = new Array<egret.ByteArray>();//row byte数据包
        public packcetByteArrayCache:Array<egret.ByteArray> = new Array<egret.ByteArray>();//packet byte数据包
        public packcetSendCache:Array<Packet> = new Array<Packet>();//packet 发送数据包
        //默认的解析类,外部可以在发送之前设置改变
        public decodeClass:any = DefaultDecoder;
        //默认的编码类,外部可以在发送之前设置改变
        public encodeClass:any = DefaultEncoder;
        //字节序
        public static ENDIAN:string = egret.Endian.BIG_ENDIAN;
        //登陆包缓存,方便自动重新登陆,要主动设置
        public  loginPkt:Packet = null;
        //在自动连接的情况下,connet需要一定的时间来握手,这是等待握手成功的计数,发送延迟计数
        private  autoConnectDuration:number = 0;

        //待发送的协议缓存列表,设置这个的目的是为了解耦同步调用
        private _packetSendCache:Array<Packet> = [];
        private static _instance:MySocket = null;

        /**
         * 单例使用
         * @returns {MySocket}
         */
        public static getInstance():MySocket {
            if (MySocket._instance == null){
                MySocket._instance = new easy.MySocket();
            }
            return MySocket._instance;
        }

        /**
         * 提交发送的协议到列表中,等待发送程序的处理
         * @param pkt
         */
        public send(pkt:Packet):void {
            if(pkt){
                //校验断线的情况下,重连
                this.autoRelogin();
                this._packetSendCache.push(pkt);
                easy.HeartBeat.addListener(this, this.checkPacketByteArray)
            }
        }

        /**
         * 自动重新连接
         */
        private autoRelogin():void {
            //if (this.currentPort > 0 && !this.isConnected() && this.loginPkt != null) {
            //    this.connect(this.currentIp, this.currentPort);
            //    if (this.loginPkt != null) {
            //        //自动发送登录包
            //        var encoder:DefaultEncoder = ObjectPool.getObjectClass(this.encodeClass);
            //        var outBytes:ByteArray = encoder.encoder(this.loginPkt);
            //        ObjectPool.releaseClass(encoder);
            //        this._socket.writeBytes(outBytes, 0, outBytes.length);
            //        this._socket.flush();
            //        Debug.log = HexUtil.dump(outBytes);
            //        outBytes.clear();
            //        ObjectPool.releaseClass(outBytes);
            //        //设置发送延迟
            //        this.autoConnectDuration = 4*30;
            //    }
            //}
        }

        /**
         * 连接
         * @param host 服务器地址
         * @param port 服务器断开
         * @param websocket 是否websocket连接方式
         */
        public connect(host:string, port:number, websocket:boolean = true):void {
            this._isWebSocket = websocket;
            Debug.log = "@连接　host＝" + host + ", port=" + port;
            this.host = host;
            this.port = port;
            if (this.port <=0 || !easy.StringUtil.isUsage(this.host)) {
                Debug.log = "[ERROR] port=" + this.port + ", host=" + this.host + ",不合法,无法连接!";
                return;
            }
            if (this._isWebSocket){
                this.connetWebSockt();
            } else {
                this.connetSockt();
            }
        }

        /**
         * 初始化websocket
         */
        private connetWebSockt():void {
            this.closeWebSocketListener();
            this._webSocket = new egret.WebSocket();
            this._webSocket.type = egret.WebSocket.TYPE_BINARY;
            this._webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onEventWebSocketProgressSocketDataHandler, this );
            this._webSocket.addEventListener(egret.Event.CONNECT, this.onEventWebSocketConnectHandler, this );
            this._webSocket.connect(this.host, this.port);
        }

        /**
         * 关闭websocket
         */
        private closeWebSocketListener():void {
            if (this._webSocket){
                this._webSocket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onEventWebSocketProgressSocketDataHandler, this );
                this._webSocket.removeEventListener(egret.Event.CONNECT, this.onEventWebSocketConnectHandler, this );
                this._webSocket.close();
                this._webSocket = null;
            }
        }
        /**
         * 初始化socket
         */
        private connetSockt():void {

        }
        /**
         * 连接成功
         * @param event
         */
        private onEventWebSocketConnectHandler(event:Event) :void {
            Debug.log = "@@Socket连接完成!";
            var myevent:MyEvent = MyEvent.getEvent(EventType.SOCKET_CONNECT);
            myevent.addItem("host", this.host);
            myevent.addItem("port", this.port);
            myevent.send();
        }
        private  onEventWebSocketProgressSocketDataHandler(event:ProgressEvent) :void {
            Debug.log = "@@--" + egret.getTimer() + "@@接收---ProgressSocketData";
            this._byteRawBuffer = ObjectPool.getByClass(egret.ByteArray);
            this._byteRawBuffer.clear();
            this._byteRawBuffer.endian = MySocket.ENDIAN;
            this._webSocket.readBytes(this._byteRawBuffer);
            this.rawByteArrayCache.push(this._byteRawBuffer);
        }

        /**
         * 查询是否连接
         * @returns {boolean}
         */
        public  isConnected():boolean {
            //if (this._socket) return this._socket.connected;
            if (this._webSocket) return this._webSocket.connected;
            return false;
        }

        /**
         * 关闭连接
         */
        public  close():void {
            if (this._isWebSocket) {
                if (this._webSocket && this._webSocket.connected){
                    this.closeWebSocketListener();
                }
            }
        }

        private  _byteRawBuffer:egret.ByteArray = null;//缓冲的bytebuffer
        private  _byteWaitBuffer:egret.ByteArray = null;//缓冲等待的bytebuffer
        private  _byteWaitReadLength:boolean = false;
        private  splitRawByte():void {
            var i:number = 0;
            var lengthCache:number = this.rawByteArrayCache.length;
            var waiteToSplit:egret.ByteArray = null;
            for (i = 0; i < lengthCache; i++)  {
                waiteToSplit = this.rawByteArrayCache.shift();
                while(waiteToSplit.bytesAvailable > 0) {
                    if(this._byteWaitBuffer == null || !this._byteWaitReadLength) {//读取新的数据
                        if (this._byteWaitBuffer == null){
                            this._byteWaitBuffer = ObjectPool.getByClass(egret.ByteArray);
                            this._byteWaitBuffer.clear();
                            this._byteWaitBuffer.endian = MySocket.ENDIAN;
                            if (waiteToSplit.bytesAvailable >= 2) {
                                //读取长度
                                waiteToSplit.readBytes(this._byteWaitBuffer, 0 , 2);
                                this._byteWaitBuffer.position = 0;
                                this._byteWaitBuffer.length = this._byteWaitBuffer.readUnsignedShort() + PacketFactory.getHeaderLength();
                                this._byteWaitReadLength = true;
                                //Debug.log("@@接收---新包长度=" + _byteWaitBuffer.length);
                            } else {
                                this._byteWaitReadLength = false;
                                waiteToSplit.readBytes(this._byteWaitBuffer, 0 , waiteToSplit.bytesAvailable);
                            }
                        } else {
                            //读取足够扩容的长度
                            waiteToSplit.readBytes(this._byteWaitBuffer, 0 , this._byteWaitBuffer.length - 2);
                            this._byteWaitBuffer.position = 0;
                            this._byteWaitBuffer.length = this._byteWaitBuffer.readUnsignedShort() + PacketFactory.getHeaderLength();
                            this._byteWaitReadLength = true;
                        }
                    } else {
                        var length:number = (this._byteWaitBuffer.bytesAvailable > waiteToSplit.bytesAvailable ? waiteToSplit.bytesAvailable : this._byteWaitBuffer.bytesAvailable);
                        waiteToSplit.readBytes(this._byteWaitBuffer, this._byteWaitBuffer.position , length);
                        this._byteWaitBuffer.position += length;
                        if (this._byteWaitBuffer.bytesAvailable == 0) {
                            this._byteWaitBuffer.position = 2;
                            Debug.log = "--@@---收到数据包---长度=" +this._byteWaitBuffer.length;
                            //Debug.log = HexUtil.dump(this._byteWaitBuffer);
                            this.packcetByteArrayCache.push(this._byteWaitBuffer);
                            this._byteWaitBuffer = null;
                            this._byteWaitReadLength = false;
                        }
                    }
                }
                //清除数据
                waiteToSplit.clear();
                ObjectPool.recycleClass(waiteToSplit);
            }
            
        }
        
        private  checkPacketByteArray():void {
            if (this.autoConnectDuration > 0) {
                this.autoConnectDuration--;
            }
            if (this.isConnected() && this.autoConnectDuration == 0) {//编码发送缓冲区的数据
                while(this.packcetSendCache.length > 0){
                    var packetSend:Packet = this.packcetSendCache.shift();
                    var encoder:DefaultEncoder = ObjectPool.getByClass(this.encodeClass);
                    var outBytes:egret.ByteArray = encoder.encoder(packetSend);
                    ObjectPool.recycleClass(encoder);
                    if (this._isWebSocket){
                        this._webSocket.readBytes(outBytes, 0, outBytes.length)
                        this._webSocket.flush();
                    }
                    Debug.log = "@@--" + egret.getTimer() + "--@@-发送数据 msgid=" + packetSend.header.messageId + ",长度=" +outBytes.length + "," +egret.getQualifiedClassName(packetSend);
                    //Debug.log = HexUtil.dump(outBytes);
                    outBytes.clear();
                    ObjectPool.recycleClass(outBytes);
                    EventManager.releasePacket(packetSend);
                }
            }
            this.splitRawByte();//切割数据包
            //解析缓存的数据并路由
            while (this.packcetByteArrayCache.length > 0) {
                var byteData:egret.ByteArray = this.packcetByteArrayCache.shift();
                var deccoder:DefaultDecoder = ObjectPool.getByClass(this.decodeClass);
                var packet:Packet = deccoder.decode(byteData);
                byteData.clear();
                ObjectPool.recycleClass(byteData);
                ObjectPool.recycleClass(deccoder);
                EventManager.dispactchPacket(packet);
            }

            if (this._packetSendCache.length == 0 && this.packcetSendCache.length == 0) {
                easy.HeartBeat.removeListener(this, this.checkPacketByteArray)
            }
        }
    }
}