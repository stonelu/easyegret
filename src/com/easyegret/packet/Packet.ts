/**
 * Copyright (c) 2014,Egret-Labs.org
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
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
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

	export class Packet{
        //--------------常量定义区域--------------
        public static TYPE_BOOLEAN:string = "boolean";//CHAR	1	单字节字符
        public static TYPE_BYTE:string = "byte";//CHAR	1	单字节字符
        public static TYPE_USHORT:string = "ushort";//WORD	2	2个字节无符号整型
        public static TYPE_SHORT:string = "short";//WORD	2	2个字节整型
        public static TYPE_UINT:string = "uint";//DWORD	4	4个字节无符号整型
        public static TYPE_INT:string = "int";//DWORD 4 4个字节带符号整形
        public static TYPE_UINT64:string = "uint64";//DWORD	4	4个字节无符号整型
        public static TYPE_INT64:string = "int64";//DWORD 4 4个字节带符号整形
        public static TYPE_FLOAT:string = "float";//long	4	32位双精度
        public static TYPE_UFLOAT:string = "ufloat";//long	4	32位无符号双精度
        public static TYPE_DOUBLE:string = "double";//long	8	64位双精度
        public static TYPE_UDOUBLE:string = "udouble";//long	8	64位无符号双精度
        public static TYPE_STRING:string = "string";//String  字符串
        public static TYPE_ARRAY:string = "array";//ARRAY	变长	某种数据结构的数组
        public static TYPE_ARRAY_CONST:string = "array_const";//ARRAY	定长	某种数据结构的数组
        public static TYPE_BYTEARRAY:string = "bytearray";
        public static TYPE_ENTITY:string = "entity";//实体类

        public static CHARSET_ASCII : string = "ASCII";
        public static CHARSET_UNICODE : string = "Unicode";
        public static CHARSET: string = Packet.CHARSET_UNICODE;
        public static MATH_POW_2_32:number = 4294967296;// 2^32.


        public header:IHeader = null;//包头
        public define:Array<any> = new Array<any>();//包体 item定义数据

        public clientSide:boolean = true;//cleint 端协议
        public constructor(messageId:number = 0) {
			this.header = new PacketFactory.headerClz();
            this.header.messageId = messageId;
        }
        /**
         * 内容成功与否标识
         * @return true,对应请求成功;false,对应请求失败
         * 
         */        
        public get isSuccess():boolean{
			return this.header.code == 0?true:false;
        }
        public send():void {
            if (this.clientSide){
                MySocket.getInstance().send(this);
            } else {
                EventManager.dispactchPacket(this);
            }
        }

        public destory():void {
            this.header.code = 0;
            this.header.length = 0;
        }
    }
}