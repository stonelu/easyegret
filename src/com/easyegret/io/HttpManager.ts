/**
 * Copyright (c) 2012 www.2ren.cn
 */
module easy {

	export class HttpManager {
        private static _initListener:boolean = false;
        private static _url:string = null;
        
        public static decodeClass:any = DefaultDecoder;
        public static encodeClass:any = DefaultEncoder;
        public static ENDIAN:string = Endian.BIG_ENDIAN;
        
        //public static const rawByteArrayCache:Vector.<ByteArray> = new Vector.<ByteArray>();//row byte数据包
        public static packcetByteArrayCache:Array<ByteArray> = new Array<ByteArray>();//packet byte数据包
        public static packcetSendCache:Array<Packet> = new Array<Packet>();//packet 发送数据包
        public static streamRawByteArrayCache:any = new Dictionary();//key=URLStream, value=Vector.<ByteArray>
        public static streamIndexArray:Array<URLStream> = new Array<URLStream>();//map中,stream的位置索引
        public static streamCompletedArray:Array<URLStream> = new Array<URLStream>();//已完成的stream
        private static initListener():void {
            if (HttpManager._initListener) return;
        }
        /**
         * @param packet
         * 
         */        
        public static send(packet:Packet):void {
            HttpManager.packcetSendCache.push(packet);
        }
        /**
         * 
         * @param error
         * 
         */        
        private static onEventError(error:Error):void {
            Debug.log = "@@--" + getTimer() + "@@发送错误:" + error;
        }
        
        private static addSteamRawByteArray(stream:URLStream, data:ByteArray):void {
            var result:Array<ByteArray> = HttpManager.streamRawByteArrayCache[stream];
            if (result == null) {
                result = new Array<ByteArray>();
                HttpManager.streamRawByteArrayCache[stream] = result;
            }
            result.push(data);
        }
        
        private static _byteRawBuffer:ByteArray = null;//缓冲的bytebuffer
        private static onEventProgressStreamDataHandler(event:ProgressEvent) :void {
            var stream:URLStream = <URLStream><any> (event.target);
            Debug.log = "@@--" + getTimer() + "@@http接收---bytesAvailable=" + stream.bytesAvailable;
            HttpManager._byteRawBuffer = ObjectPool.getObjectClass(ByteArray);
            HttpManager._byteRawBuffer.clear();
            HttpManager._byteRawBuffer.endian = HttpManager.ENDIAN;
            HttpManager._byteRawBuffer.length = stream.bytesAvailable;
            stream.readBytes(HttpManager._byteRawBuffer);
            
            HttpManager.addSteamRawByteArray(stream, HttpManager._byteRawBuffer)
            
            if (event.type == Event.COMPLETE){
                Debug.log = "@@--" + getTimer() + "@@http结束接收!!";
                stream.removeEventListener(ProgressEvent.PROGRESS, HttpManager.onEventProgressStreamDataHandler, HttpManager);
                stream.removeEventListener(Event.COMPLETE, HttpManager.onEventProgressStreamDataHandler, HttpManager);
                stream.removeEventListener(IOErrorEvent.IO_ERROR, HttpManager.onEventError, HttpManager);
                stream.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, HttpManager.onEventError, HttpManager);
                HttpManager.streamCompletedArray.push(stream);
            }
            //Debug.log = "--@@---socket data=" +_byteRawBuffer.length;
            //Debug.log = HexUtil.dump(_byteRawBuffer);
        }

        private static _byteWaitBuffer:ByteArray = null;//缓冲等待的bytebuffer
        private static _byteWaitReadLength:boolean = false;
        private static splitRawByte():void {
            if (HttpManager.streamIndexArray.length == 0) return;
            var i:number = 0;
            var rawByteArrayCache:Array<ByteArray> = HttpManager.streamRawByteArrayCache[HttpManager.streamIndexArray[0]];
            var lengthCache:number = rawByteArrayCache.length;
            var waiteToSplit:ByteArray = null;
            for (i = 0; i < lengthCache; i++)  {
                waiteToSplit = rawByteArrayCache.shift();
                while(waiteToSplit.bytesAvailable > 0) {
                    if(HttpManager._byteWaitBuffer == null || !HttpManager._byteWaitReadLength) {//读取新的数据
                        if (HttpManager._byteWaitBuffer == null){
                            HttpManager._byteWaitBuffer = ObjectPool.getObjectClass(ByteArray);
                            HttpManager._byteWaitBuffer.clear();
                            HttpManager._byteWaitBuffer.endian = HttpManager.ENDIAN;
                            if (waiteToSplit.bytesAvailable >= 2) {
                                //读取长度
                                waiteToSplit.readBytes(HttpManager._byteWaitBuffer, 0 , 2);
                                HttpManager._byteWaitBuffer.position = 0;
                                HttpManager._byteWaitBuffer.length = HttpManager._byteWaitBuffer.readUnsignedShort() + PacketFactory.getHeaderLength();
                                HttpManager._byteWaitReadLength = true;
                                //Debug.log("@@接收---新包长度=" + _byteWaitBuffer.length);
                            } else {
                                HttpManager._byteWaitReadLength = false;
                                waiteToSplit.readBytes(HttpManager._byteWaitBuffer, 0 , waiteToSplit.bytesAvailable);
                            }
                        } else {
                            //读取足够扩容的长度
                            waiteToSplit.readBytes(HttpManager._byteWaitBuffer, 0 , HttpManager._byteWaitBuffer.length - 2);
                            HttpManager._byteWaitBuffer.position = 0;
                            HttpManager._byteWaitBuffer.length = HttpManager._byteWaitBuffer.readUnsignedShort() + PacketFactory.getHeaderLength();
                            HttpManager._byteWaitReadLength = true;
                        }
                    } else {
                        var length:number = (HttpManager._byteWaitBuffer.bytesAvailable > waiteToSplit.bytesAvailable ? waiteToSplit.bytesAvailable : HttpManager._byteWaitBuffer.bytesAvailable);
                        waiteToSplit.readBytes(HttpManager._byteWaitBuffer, HttpManager._byteWaitBuffer.position , length);
                        HttpManager._byteWaitBuffer.position += length;
                        if (HttpManager._byteWaitBuffer.bytesAvailable == 0) {
                            HttpManager._byteWaitBuffer.position = 2;
                            Debug.log = "--@@http---收到数据包---长度=" +HttpManager._byteWaitBuffer.length;
                            Debug.log = HexUtil.dump(HttpManager._byteWaitBuffer);
                            HttpManager.packcetByteArrayCache.push(HttpManager._byteWaitBuffer);
                            HttpManager._byteWaitBuffer = null;
                            HttpManager._byteWaitReadLength = false;
                        }
                    }
                }
                waiteToSplit.clear();
                ObjectPool.releaseClass(waiteToSplit);
            }
            if (HttpManager.streamCompletedArray.indexOf(HttpManager.streamIndexArray[0])>=0) {
                //stream的解析和回收已经完成
            }
        }
        public static checkPacketByteArray():void {
            if (HttpManager.packcetSendCache.length > 0) {
                var packetSend:Packet = HttpManager.packcetSendCache.shift();
                var encoder:DefaultEncoder = ObjectPool.getObjectClass(HttpManager.encodeClass);
                var outBytes:ByteArray = encoder.encoder(packetSend);
                ObjectPool.releaseClass(encoder);
                
                var request:URLRequest = ObjectPool.getObjectClass(URLRequest);
                request.method = URLRequestMethod.POST;
                request.url = HttpManager._url;
                var stream:URLStream = ObjectPool.getObjectClass(URLStream);
                var urlVariables:URLVariables = ObjectPool.getObjectClass(URLVariables);
                urlVariables["data"]= outBytes;
                request.data = urlVariables;
                stream.addEventListener(ProgressEvent.PROGRESS, HttpManager.onEventProgressStreamDataHandler, HttpManager);
                stream.addEventListener(Event.COMPLETE, HttpManager.onEventProgressStreamDataHandler, HttpManager);
                stream.addEventListener(IOErrorEvent.IO_ERROR, HttpManager.onEventError, HttpManager)
                stream.addEventListener(SecurityErrorEvent.SECURITY_ERROR, HttpManager.onEventError, HttpManager)
                stream.load(request);
                
                Debug.log = "@@--" + getTimer() + "--@@http-发送数据 msgid=" + packetSend.header.messageId + ",长度=" +outBytes.length + "," +getQualifiedClassName(packetSend);
                Debug.log = HexUtil.dump(outBytes);
                outBytes.clear();
                ObjectPool.releaseClass(outBytes);
                EventManager.releasePacket(packetSend);
                
                ObjectPool.releaseClass(request);
                ObjectPool.releaseClass(urlVariables);
            }
            
            HttpManager.splitRawByte();//切割数据包
            while (HttpManager.packcetByteArrayCache.length > 0) {
                var byteData:ByteArray = HttpManager.packcetByteArrayCache.shift();
                var deccoder:DefaultDecoder = ObjectPool.getObjectClass(HttpManager.decodeClass);
                var packet:Packet = deccoder.decode(byteData);
                byteData.clear();
                ObjectPool.releaseClass(byteData);
                ObjectPool.releaseClass(deccoder);
                EventManager.dispactchPacketToService(packet);
            }
        }

        public static get url():string {
            return HttpManager._url;
        }

        public static set url(value:string) {
            HttpManager._url = value;
        }

    }
}