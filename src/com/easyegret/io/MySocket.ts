/**
 * Copyright (c) 2012 www.2ren.cn
 */
module easy {

	export class MySocket {
        //public _socket:Socket = null;
        //private _initListener:boolean = false;
        //public currentIp:string = null;
        //public currentPort:number = 0;
        //public _gatewayStatus:boolean = false;
        //public rawByteArrayCache:Array<ByteArray> = new Array<ByteArray>();//row byte数据包
        //public packcetByteArrayCache:Array<ByteArray> = new Array<ByteArray>();//packet byte数据包
        //public packcetSendCache:Array<Packet> = new Array<Packet>();//packet 发送数据包
        //public decodeClass:any = DefaultDecoder;
        //public encodeClass:any = DefaultEncoder;
        //public ENDIAN:string = Endian.BIG_ENDIAN;
        //public isAuthorized:boolean = false;//是否已经通过授权,连接完成后要侧重检查一下第一个包是否是授权文件
        //public  AUTHORIZED_LENGTH:number = 162;//授权文件的长度,现在默认是162
        //public  loginPkt:Packet = null;
        //private  pktDuration:number = 0;//发送延迟计数

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
                this._packetSendCache.push(pkt);
                easy.HeartBeat.addListener(this, this.onFireSendPacket)
            }
        }
        //发送协议
        private onFireSendPacket():void {
            if(this._packetSendCache.length > 0 ) {
                var pkt:Packet = this._packetSendCache.shift();
                //暂时转到control处理
                var myEvent:MyEvent = MyEvent.getEvent("server_pkt");
                myEvent.addItem("pkt", pkt);
                myEvent.send();
            }
            if (this._packetSendCache.length == 0) {
                easy.HeartBeat.removeListener(this, this.onFireSendPacket)
            }
        }

        /*
        public  initListener(newSocket:Socket = null):void {
            if (this._initListener) return;
            Debug.log = "@initListener,新建socket!";
            this.isAuthorized = false;
            this.authorize_remain_length = this.AUTHORIZED_LENGTH;
            if (newSocket ==  null){
                this._socket = new Socket();
            } else {
                this._socket = newSocket;
            }
            this._socket.timeout = 30000;
            this._socket.endian = this.ENDIAN;
            this._socket.addEventListener(Event.CLOSE, this.onEventCloseHandler, this);
            this._socket.addEventListener(Event.CONNECT, this.onEventConnectHandler, this);
            this._socket.addEventListener(IOErrorEvent.IO_ERROR, this.onEventIoErrorHandler, this);
            this._socket.addEventListener(SecurityErrorEvent.SECURITY_ERROR, this.onEventSecurityErrorHandler, this);
            this._socket.addEventListener(ProgressEvent.SOCKET_DATA, this.onEventProgressSocketDataHandler, this);
            SystemHeartBeat.addEventListener(this.checkPacketByteArray, 10,this);
            this._initListener = true;
        }
        private removeListener():void {
            if (this._socket) {
                this._socket.removeEventListener(Event.CONNECT, this.onEventConnectHandler, this);
                this._socket.removeEventListener(IOErrorEvent.IO_ERROR, this.onEventIoErrorHandler, this);
                this._socket.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, this.onEventSecurityErrorHandler, this);
                this._socket.removeEventListener(ProgressEvent.SOCKET_DATA, this.onEventProgressSocketDataHandler, this);
            }
        }
        public connect(host:string, port:number = 0):void {
            Debug.log = "@连接　host＝" + host + ", port=" + port;
            if (this._socket == null){
                this._initListener = false;
            }
            this.initListener();
            this.currentIp = host;
            this.currentPort = port;
            this._socket.connect(host, port);
        }
        public  isConnected():boolean {
            if (this._socket) return this._socket.connected;
            return false;
        }
        public  disConnect():void {
            if (this._socket != null && this._socket.connected) {
                Debug.log = "@主动断开 socket";
                this.removeListener();
                this._socket.close();
            }
            this.authorize_remain_length = this.AUTHORIZED_LENGTH;
            this.isAuthorized = false;
            this._socket = null;
            this._initListener = false;
            //            EventManager.dispatch(EventType.SOCKET_DISCONNECT);
        }
        public  send(packet:Packet):void {
            if (this.currentPort > 0 && !this.isConnected() && this.loginPkt != null) {
                this.connect(this.currentIp, this.currentPort);
                if (this.loginPkt != null) {
                    //自动发送登录包
                    var encoder:DefaultEncoder = ObjectPool.getObjectClass(this.encodeClass);
                    var outBytes:ByteArray = encoder.encoder(this.loginPkt);
                    ObjectPool.releaseClass(encoder);
                    this._socket.writeBytes(outBytes, 0, outBytes.length);
                    this._socket.flush();
                    Debug.log = HexUtil.dump(outBytes);
                    outBytes.clear();
                    ObjectPool.releaseClass(outBytes);
                    //设置发送延迟
                    this.pktDuration = 4*30;
                }
            }
            this.packcetSendCache.push(packet);
        }
        private  onEventCloseHandler(event:Event) :void {
            Debug.log = "@@Socket连接CloseHandler";
            this.removeListener();
            this._socket = null;
            var myevent:MyEvent = MyEvent.getEvent(EventType.SOCKET_DISCONNECT);
            myevent.addItem("host", this.currentIp);
            myevent.addItem("port", this.currentPort);
            myevent.send();
        }
        private  onEventConnectHandler(event:Event) :void {
            Debug.log = "@@Socket连接完成!";
            var myevent:MyEvent = MyEvent.getEvent(EventType.SOCKET_CONNECT);
            myevent.addItem("host", this.currentIp);
            myevent.addItem("port", this.currentPort);
            myevent.send();
        }
        private  onEventIoErrorHandler(event:IOErrorEvent) :void {
            Debug.log = "@@Socket连接IoErrorHandler";
            this.removeListener();
            this.packcetSendCache.length = 0;
            Debug.log = event.text;
            var myevent:MyEvent = MyEvent.getEvent(EventType.SOCKET_DISCONNECT_ERROR);
            myevent.addItem("host", this.currentIp);
            myevent.addItem("port", this.currentPort);
            myevent.send();
        }
        private onEventSecurityErrorHandler(event:SecurityErrorEvent) :void {
            Debug.log = "@@Socket连接SecurityErrorHandler";
            this.removeListener();
            this.packcetSendCache.length = 0;
            Debug.log = event.text;
            var myevent:MyEvent = MyEvent.getEvent(EventType.SOCKET_DISCONNECT_ERROR);
            myevent.addItem("host", this.currentIp);
            myevent.addItem("port", this.currentPort);
            myevent.send();
        }
        private  _byteRawBuffer:ByteArray = null;//缓冲的bytebuffer
        private  onEventProgressSocketDataHandler(event:ProgressEvent) :void {
            Debug.log = "@@--" + getTimer() + "@@接收---bytesAvailable=" + this._socket.bytesAvailable;
            this._byteRawBuffer = ObjectPool.getObjectClass(ByteArray);
            this._byteRawBuffer.clear();
            this._byteRawBuffer.endian = this.ENDIAN;
            this._byteRawBuffer.length = this._socket.bytesAvailable;
            this._socket.readBytes(this._byteRawBuffer);
            this.rawByteArrayCache.push(this._byteRawBuffer);
            //Debug.log = "--@@---socket data=" +_byteRawBuffer.length;
            //Debug.log = HexUtil.dump(_byteRawBuffer);
        }
        private  checkAuthorizedXml(byteDatas:ByteArray):boolean {
            var length:number = this.authorXmlHeaderBytes.length > byteDatas.length?byteDatas.length:this.authorXmlHeaderBytes.length;
            for (var i:number = 0; i < this.authorXmlHeaderBytes.length; i++)  {
                if (this.authorXmlHeaderBytes[i] != byteDatas[i]) {
                    return false;
                }
            }
            return true
        }
        private  _byteWaitBuffer:ByteArray = null;//缓冲等待的bytebuffer
        private  _byteWaitReadLength:boolean = false;
        private  splitRawByte():void {
            var i:number = 0;
            var lengthCache:number = this.rawByteArrayCache.length;
            var waiteToSplit:ByteArray = null;
            for (i = 0; i < lengthCache; i++)  {
                waiteToSplit = this.rawByteArrayCache.shift();
                while(waiteToSplit.bytesAvailable > 0) {
                    if(this._byteWaitBuffer == null || !this._byteWaitReadLength) {//读取新的数据
                        if (this._byteWaitBuffer == null){
                            this._byteWaitBuffer = ObjectPool.getObjectClass(ByteArray);
                            this._byteWaitBuffer.clear();
                            this._byteWaitBuffer.endian = this.ENDIAN;
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
                            Debug.log = HexUtil.dump(this._byteWaitBuffer);
                            this.packcetByteArrayCache.push(this._byteWaitBuffer);
                            this._byteWaitBuffer = null;
                            this._byteWaitReadLength = false;
                        }
                    }
                }
                waiteToSplit.clear();
                ObjectPool.releaseClass(waiteToSplit);
            }
            
        }
        
        private  checkPacketByteArray(endCall:boolean):void {
            if (this._socket && this._socket.connected) {
                if (this.pktDuration > 0)this.pktDuration --;
                while(this.packcetSendCache.length > 0 && this.pktDuration == 0){
                    var packetSend:Packet = this.packcetSendCache.shift();
                    var encoder:DefaultEncoder = ObjectPool.getObjectClass(this.encodeClass);
                    var outBytes:ByteArray = encoder.encoder(packetSend);
                    ObjectPool.releaseClass(encoder);
                    this._socket.writeBytes(outBytes, 0, outBytes.length);
                    this._socket.flush();
                    Debug.log = "@@--" + getTimer() + "--@@-发送数据 msgid=" + packetSend.header.messageId + ",长度=" +outBytes.length + "," +getQualifiedClassName(packetSend);
                    Debug.log = HexUtil.dump(outBytes);
                    outBytes.clear();
                    ObjectPool.releaseClass(outBytes);
                    EventManager.releasePacket(packetSend);
                }
            }
            this.splitRawByte();//切割数据包
            while (this.packcetByteArrayCache.length > 0) {
                var byteData:ByteArray = this.packcetByteArrayCache.shift();
                var deccoder:DefaultDecoder = ObjectPool.getObjectClass(this.decodeClass);
                var packet:Packet = deccoder.decode(byteData);
                byteData.clear();
                ObjectPool.releaseClass(byteData);
                ObjectPool.releaseClass(deccoder);
                EventManager.dispactchPacketToService(packet);
            }
        }
        */
    }
}