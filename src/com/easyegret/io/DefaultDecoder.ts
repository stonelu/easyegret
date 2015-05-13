/**
 * Copyright (c) 2012 www.2ren.cn
 */
module easy {

	export class DefaultDecoder implements IDecoder{
		public static MATH_POW_2_32:number = 4294967296;// 2^32.
//        public static const headersCache:Array = [];//packet header缓冲包
        public decode(bytePacket:egret.ByteArray):Packet{
            var header:IHeader = this.decodeHeader(bytePacket);
            var packet:Packet = PacketFactory.createPacket(header.messageId, false);
            if (packet && bytePacket.bytesAvailable > 0)this.decodeBody(bytePacket, packet);
            return packet;
        }
        //不包含长度,长度已经在接受数据的时候,进行分包解析掉了
        public decodeHeader(bytePacket:egret.ByteArray):IHeader {
            var header:IHeader = PacketFactory.getHeader();
            header.messageId = bytePacket.readUnsignedShort();//WORD  cmd_index;//命令
            header.code = bytePacket.readUnsignedShort();//WORD   check_code;//校验位
            return header;
        }
        private defIndex:number = 0;
        public decodeBody(bytePacket:egret.ByteArray, packet:Packet):void {
            try{
                var i:number = 0;
                var count:number = packet.define.length;
                for (i = 0; i < count; i++){
                    this.decodeItem(packet.define[i], bytePacket, packet);
                }
            }catch(e){
                Debug.log = "@--decodeError" + e.message;
            }
        }
        //CHAR	1	单字节字符
        public readByte(defItem:any, bytePacket:egret.ByteArray, target:any):void {
            target[defItem.id] = bytePacket.readByte();
        }
        ////UBYTE	1	1个字节无符合整型
        public readUByte(defItem:any, bytePacket:egret.ByteArray, target:any):void {
            target[defItem.id] = bytePacket.readUnsignedByte();
        }
        ////UBYTE	1	1个字节无符合整型
        public readBoolean(defItem:any, bytePacket:egret.ByteArray, target:any):void {
            var value:number = bytePacket.readUnsignedByte();
            target[defItem.id] = false;
            if (value == 1)target[defItem.id] = true;
        }
        //WORD	2	2个字节无符合整型
        public readUShort(defItem:any, bytePacket:egret.ByteArray, target:any):void {
            target[defItem.id] = bytePacket.readUnsignedShort();
        }
        //2字节有符号整数
        public readShort(defItem:any, bytePacket:egret.ByteArray, target:any):void {
            target[defItem.id] = bytePacket.readShort();
        }
        //DWORD	4	4个字节无符合整型
        public readUInt(defItem:any, bytePacket:egret.ByteArray, target:any):void {
            target[defItem.id] = bytePacket.readUnsignedInt();
        }
        //DWORD	4	4个字节有符合整型
        public readInt(defItem:any, bytePacket:egret.ByteArray, target:any):void {
            target[defItem.id] = bytePacket.readInt();
        }
        //long	8	64位无符号双精度
        public readUInt64(defItem:any, bytePacket:egret.ByteArray, target:any):void {
            var long_l:number = 0;
            var long_h:number = 0;
            long_h  = bytePacket.readUnsignedInt();
            long_l = bytePacket.readUnsignedInt();
            target[defItem.id] =  (<number><any> long_h * DefaultDecoder.MATH_POW_2_32) + long_l;
        }
        //8字节
        public readInt64(defItem:any, bytePacket:egret.ByteArray, target:any):void {
            var long_l:number = 0;
            var long_h:number = 0;
            long_h  = bytePacket.readInt();
            long_l = bytePacket.readUnsignedInt();
            target[defItem.id] =  (<number><any> long_h * DefaultDecoder.MATH_POW_2_32) + long_l;
        }
        //long	4	32位双精度
        public readFloat(defItem:any, bytePacket:egret.ByteArray, target:any):void {
            target[defItem.id] = bytePacket.readFloat();
        }
        //long	4	32位无符号双精度
        public readUFloat(defItem:any, bytePacket:egret.ByteArray, target:any):void {
            target[defItem.id] = bytePacket.readFloat();
        }
        //long	8	64位无符号双精度
        public readUDouble(defItem:any, bytePacket:egret.ByteArray, target:any):void {
            var long_l:number = 0;
            var long_h:number = 0;
            long_l = bytePacket.readUnsignedInt();
            long_h  = bytePacket.readUnsignedInt();
            target[defItem.id] =  (<number><any> long_h * DefaultDecoder.MATH_POW_2_32) + long_l;
        }
        //8字节
        public readDouble(defItem:any, bytePacket:egret.ByteArray, target:any):void {
            var long_l:number = 0;
            var long_h:number = 0;
            long_l = bytePacket.readUnsignedInt();
            long_h  = bytePacket.readInt();
            target[defItem.id] =  (<number><any> long_h * DefaultDecoder.MATH_POW_2_32) + long_l;
        }
        //数据流
        public readByteArray(defItem:any, bytePacket:egret.ByteArray, target:any):void {
            var length:number = bytePacket.readUnsignedShort();//数据流长度
            var ba:egret.ByteArray = ObjectPool.getByClass(egret.ByteArray);
            if (length > 0) {
                bytePacket.readBytes(ba, 0, length);
            }
            target[defItem.id] = ba;
        }
        //字符串读取
        public readString(defItem:any, bytePacket:egret.ByteArray, target:any):void {
            target[defItem.id] = bytePacket.readUTF();
        }
        //数组读取
        public readArray(defItem:any, bytePacket:egret.ByteArray, target:any):void{
            var count:number = 0;
            if (Packet.TYPE_ARRAY_CONST == defItem.type) {
                count = defItem["length"];
            } else if (Packet.TYPE_ARRAY == defItem.type){
                count = bytePacket.readUnsignedShort();
            }
            target[defItem.id].length = 0;
            var isEntity:boolean = false;
            if (typeof(defItem.entity) == "string"){
                isEntity = false;
            } else {
                isEntity = true;
            }
            var i:number = 0;
            if (isEntity) {
                for (i = 0; i < count; i++) {
                    this.readEntityToArray(defItem, bytePacket, target[defItem.id]);
                }
            } else {
                var tempObj:any = null;
                for (i = 0; i < count; i++) {
                    tempObj = {};
                    this.decodeItem({id:"value", type:Packet[defItem.entity]}, bytePacket, tempObj);
                    target[defItem.id].push(tempObj["value"]);
                }
            }
        }
        //实体读取
        public readEntity(defItem:any, bytePacket:egret.ByteArray, target:any):void {
            var entity:any = ObjectPool.getByClass(defItem.entity);
            var define:Array<any> = entity.define;
            var i:number = 0;
            for (i = 0; i < define.length; i++)  {
                this.decodeItem(define[i], bytePacket, entity);
            }
            target[defItem.id] = entity;
        }
        //往数组实体读取
        public readEntityToArray(defItem:any, bytePacket:egret.ByteArray, target:any):void {
            var entity:any = ObjectPool.getByClass(defItem.entity);
            var define:Array<any> = entity.define;
            var i:number = 0;
            for (i = 0; i < define.length; i++)  {
                this.decodeItem(define[i], bytePacket, entity);
            }
            target.push(entity);
        }
        public decodeItem(defItem:any, bytePacket:egret.ByteArray, target:any):void {
            switch(defItem.type) {
                case Packet.TYPE_BYTE://CHAR	1	单字节字符
                    this.readByte(defItem, bytePacket, target);
                    break;
//                case Packet.TYPE_UBYTE://UBYTE	1	1个字节无符合整型
//                    this.readUByte(defItem, bytePacket, target);
//                    break;
                case Packet.TYPE_USHORT://WORD	2	2个字节无符合整型
                    this.readUShort(defItem, bytePacket, target);
                    break;
                case Packet.TYPE_SHORT://2字节有符号整数
                    this.readShort(defItem, bytePacket, target);
                    break;
                case Packet.TYPE_UINT://DWORD	4	4个字节无符合整型
                    this.readUInt(defItem, bytePacket, target);
                    break;
				case Packet.TYPE_INT://DWORD	4	4个字节有符合整型
					this.readInt(defItem, bytePacket, target);
					break;
				case Packet.TYPE_INT64://DWORD	8	8个字节有符合整型
					this.readInt64(defItem, bytePacket, target);
					break;
				case Packet.TYPE_UINT64://DWORD	8	8个字节有符合整型
					this.readUInt64(defItem, bytePacket, target);
					break;
				case Packet.TYPE_FLOAT://8字节
                    this.readFloat(defItem, bytePacket, target);
					break;
				case Packet.TYPE_UFLOAT://8字节
                    this.readUFloat(defItem, bytePacket, target);
					break;
				case Packet.TYPE_DOUBLE://8字节
                    this.readDouble(defItem, bytePacket, target);
					break;
				case Packet.TYPE_UDOUBLE://8字节
                    this.readUDouble(defItem, bytePacket, target);
					break;
                case Packet.TYPE_BYTEARRAY://数据流
                    this.readByteArray(defItem, bytePacket, target);
                    break;
                case Packet.TYPE_STRING://WCHAR(N)	N*2	双字节变长字符串	字符串以\0为结束符
                    this.readString(defItem, bytePacket, target);
                    break;
                case Packet.TYPE_BOOLEAN://布尔值
                    this.readBoolean(defItem, bytePacket, target);
                    break;
                case Packet.TYPE_ARRAY://ARRAY	变长	某种数据结构的数组
                case Packet.TYPE_ARRAY_CONST://ARRAY	定长	某种数据结构的数组
                    this.readArray(defItem, bytePacket, target);
                    break;
                case Packet.TYPE_ENTITY:
                    this.readEntity(defItem, bytePacket, target);
                    break;
            }
            Debug.log = defItem.id + "=" + target[defItem.id];
        }
    }
}