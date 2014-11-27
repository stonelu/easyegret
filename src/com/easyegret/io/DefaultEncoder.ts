/**
 * Copyright (c) 2012 www.2ren.cn
 */
module easy {

	export class DefaultEncoder implements IEncoder{
		public static MATH_POW_2_32:number = 4294967296;// 2^32.
        public encoder(packet:Packet):ByteArray{
            //回写包体长度
            var bodyBytes:ByteArray = this.encodeBody(packet);
            packet.header.length = bodyBytes.length;
            var headBytes:ByteArray = this.encodeHeader(packet);
            headBytes.writeBytes(bodyBytes);
            bodyBytes.clear();
            ObjectPool.releaseClass(bodyBytes);
            return headBytes;
        }
        public encodeHeader(packet:Packet):ByteArray {
            var headBytes:ByteArray = ObjectPool.getObjectClass(ByteArray);
            headBytes.clear();
            headBytes.endian = SocketManager.ENDIAN;
            headBytes.writeShort(packet.header.length);//WORD pack_size;//包体长度,不包含协议头
            headBytes.writeShort(packet.header.messageId);//WORD  cmd_index;//命令
            headBytes.writeShort(packet.header.code);//WORD   check_code;//校验位
            return headBytes;
        }
        public encodeBody(packet:Packet):ByteArray {
            var outBytes:ByteArray = ObjectPool.getObjectClass(ByteArray);
            outBytes.clear();
            outBytes.endian = SocketManager.ENDIAN;
            var i:number = 0;
            var count:number = packet.define.length;
            for (i = 0; i < count; i++){
                if (Packet.TYPE_ENTITY == packet.define[i].type) {
                    this.encodeItem(packet.define[i], outBytes, packet[packet.define[i].id]);
                } else {
                    this.encodeItem(packet.define[i], outBytes, packet);
                }
            }
            return outBytes;
        }
        //CHAR	1	单字节字符
        public writeByte(defItem:any, outByteArray:ByteArray, target:any):void {
            outByteArray.writeByte(target[defItem.id]);
        }
        //UBYTE	1	1个字节无符合整型
        public writeUByte(defItem:any, outByteArray:ByteArray, target:any):void {
            outByteArray.writeByte(target[defItem.id]);
        }
        //UBYTE	1	1个字节无符合整型
        public writeBoolean(defItem:any, outByteArray:ByteArray, target:any):void {
            if (target[defItem.id]){
                outByteArray.writeByte(1);
            } else {
                outByteArray.writeByte(0);
            }
        }
        //WORD	2	2个字节短整型
        public writeShort(defItem:any, outByteArray:ByteArray, target:any):void {
            outByteArray.writeShort(target[defItem.id]);
        }
        //WORD	2	2个字节短整型
        public writeUShort(defItem:any, outByteArray:ByteArray, target:any):void {
            outByteArray.writeShort(target[defItem.id]);
        }
        //DWORD	4	4个字节整型
        public writeInt(defItem:any, outByteArray:ByteArray, target:any):void {
            outByteArray.writeInt(target[defItem.id]);
        }
        //DWORD	4	4个字节无符号整型
        public writeUInt(defItem:any, outByteArray:ByteArray, target:any):void {
            outByteArray.writeUnsignedInt(target[defItem.id]);
        }
        //WORD	8	8个字节数值
        public writeUInt64(defItem:any, outByteArray:ByteArray, target:any):void {
            var double:number = target[defItem.id];
            var long_l:number = parseInt(double);
            var long_h:number = (double-long_l)/MATH_POW_2_32;
            outByteArray.writeUnsignedInt(long_h);
            outByteArray.writeUnsignedInt(long_l);
//            var bytes:ByteArray = ObjectPool.getObjectClass(ByteArray);
//            bytes.clear();
//            bytes.endian = SocketManager.ENDIAN;
//            bytes.writeUnsignedInt(long_h);
//            bytes.writeUnsignedInt(long_l);
//            outByteArray.writeBytes(bytes,0,bytes.bytesAvailable);
//            ObjectPool.releaseClass(bytes);
        }
        //WORD	8	8个字节数值
        public writeInt64(defItem:any, outByteArray:ByteArray, target:any):void {
            var double:number = target[defItem.id];
            var long_l:number = parseInt(double);
            var long_h:number = parseInt((double-long_l)/MATH_POW_2_32);
            outByteArray.writeInt(long_h);
            outByteArray.writeUnsignedInt(long_l);
//            var bytes:ByteArray = ObjectPool.getObjectClass(ByteArray);
//            bytes.clear();
//            bytes.endian = SocketManager.ENDIAN;
//            bytes.writeInt(long_h);
//            bytes.writeUnsignedInt(long_l);
//            outByteArray.writeBytes(bytes,0,bytes.bytesAvailable);
//            ObjectPool.releaseClass(bytes);
            
        }
        //WORD	2	4个字节无符号
        public writeUFloat(defItem:any, outByteArray:ByteArray, target:any):void {
            outByteArray.writeFloat(target[defItem.id]);
        }
        //WORD	2	4个字节
        public writeFloat(defItem:any, outByteArray:ByteArray, target:any):void {
            outByteArray.writeFloat(target[defItem.id]);
        }
        //WORD	8	8个字节数值
        public writeUDouble(defItem:any, outByteArray:ByteArray, target:any):void {
            var double:number = target[defItem.id];
            var long_l:number = parseInt(double);
            var long_h:number = (double - long_l)/MATH_POW_2_32;
            var bytes:ByteArray = ObjectPool.getObjectClass(ByteArray);
            bytes.clear();
            bytes.endian = SocketManager.ENDIAN;
            bytes.writeUnsignedInt(long_l);
            bytes.writeUnsignedInt(long_h);
            outByteArray.writeBytes(bytes,0,bytes.bytesAvailable);
            ObjectPool.releaseClass(bytes);
        }
        //WORD	8	8个字节数值
        public writeDouble(defItem:any, outByteArray:ByteArray, target:any):void {
            var double:number = target[defItem.id];
            var long_l:number = parseInt(double);
            var long_h:number = (double - long_l)/MATH_POW_2_32;
            var bytes:ByteArray = ObjectPool.getObjectClass(ByteArray);
            bytes.clear();
            bytes.endian = SocketManager.ENDIAN;
            bytes.writeUnsignedInt(long_l);
            bytes.writeInt(long_h);
            outByteArray.writeBytes(bytes,0,bytes.bytesAvailable);
            ObjectPool.releaseClass(bytes);
        }
        //WCHAR(N)	N*2	双字节变长字符串	字符串以\0为结束符
        public writeString(defItem:any, outByteArray:ByteArray, target:any):void {
            outByteArray.writeUTF(target[defItem.id]==null?"":target[defItem.id]);
        }
        //数据流
        public writeByteArray(defItem:any, outByteArray:ByteArray, target:any):void {
            outByteArray.writeShort(target[defItem.id].length);
            if (target[defItem.id].length > 0)outByteArray.writeBytes(target[defItem.id]);
        }
        //数组
        public writeArray(defItem:any, outByteArray:ByteArray, target:any):void {
            var vectorData:any = target[defItem.id];
            var count:number = vectorData.length;
            if (Packet.TYPE_ARRAY_CONST == defItem.type) {
                count = defItem["length"];
            }
            outByteArray.writeShort(count);
            var i:number = 0;
            var isEntity:boolean = false;
            var tempObj:any = null;
            if (typeof(defItem.entity) == "string"){
                isEntity = false;
            } else {
                isEntity = true;
            }
            for (i = 0; i < count; i++) {
                if (isEntity) {
                    this.writeEntity(defItem, outByteArray, vectorData[i]);
                } else {
                    tempObj = {};
                    tempObj["value"] = vectorData[i];
                    this.encodeItem({id:"value", type:Packet[defItem.entity]}, outByteArray, tempObj);
                }
            }
        }
        //写实体
        public writeEntity(defItem:any, outByteArray:ByteArray, target:any):void {
            if (!target) return;
            var define:Array<any> = target.define;
            var i:number = 0;
            for (i = 0; i < define.length; i++)  {
                this.encodeItem(define[i], outByteArray, target);
            }
        }
        public encodeItem(defItem:any, outByteArray:ByteArray, target:any):void{
            switch(defItem.type) {
                case Packet.TYPE_BYTE://CHAR	1	单字节字符
                    this.writeByte(defItem, outByteArray, target);
                    break;
//                case Packet.TYPE_UBYTE://UBYTE	1	1个字节无符合整型
//                    this.writeUByte(defItem, outByteArray, target);
//                    break;
                case Packet.TYPE_SHORT://WORD	2	2个字节无符合整型
                    this.writeShort(defItem, outByteArray, target);
                    break;
                case Packet.TYPE_USHORT://WORD	2	2个字节无符合整型
                    this.writeUShort(defItem, outByteArray, target);
                    break;
                case Packet.TYPE_UINT://DWORD	4	4个字节无符合整型
                    this.writeUInt(defItem, outByteArray, target);
                    break;
                case Packet.TYPE_INT://DWORD	4	4个字节无符合整型
                    this.writeInt(defItem, outByteArray, target);
                    break;
                case Packet.TYPE_INT64://DWORD	8	8个字节无符合整型
                    this.writeInt64(defItem, outByteArray, target);
                    break;
                case Packet.TYPE_UINT64://DWORD	8	8个字节无符合整型
                    this.writeUInt64(defItem, outByteArray, target);
                    break;
				case Packet.TYPE_FLOAT:
                    this.writeFloat(defItem, outByteArray, target);
					break;
				case Packet.TYPE_UFLOAT:
                    this.writeUFloat(defItem, outByteArray, target);
					break;
				case Packet.TYPE_UDOUBLE:
                    this.writeUDouble(defItem, outByteArray, target);
					break;
				case Packet.TYPE_DOUBLE:
                    this.writeDouble(defItem, outByteArray, target);
					break;
				case Packet.TYPE_BOOLEAN:
                    this.writeBoolean(defItem, outByteArray, target);
					break;
                case Packet.TYPE_BYTEARRAY://数据流
                    this.writeByteArray(defItem, outByteArray, target);
                    break
                case Packet.TYPE_STRING://WCHAR(N)	N*2	双字节变长字符串	字符串以\0为结束符
                    this.writeString(defItem, outByteArray, target);
                    break;
                case Packet.TYPE_ARRAY://ARRAY	变长	某种数据结构的数组
                case Packet.TYPE_ARRAY_CONST://ARRAY	定长	某种数据结构的数组
                    this.writeArray(defItem, outByteArray, target);
                    break;
                case Packet.TYPE_ENTITY:
                    this.writeEntity(defItem, outByteArray, target);
                    break;
            }
        }
    }
}