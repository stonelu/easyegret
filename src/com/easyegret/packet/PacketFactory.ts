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

	export class PacketFactory {
        public static TYPE_BOOLEAN:string = "boolean";//CHAR	1	单字节字符
        public static TYPE_NUMBER:string = "number";//数字
        public static TYPE_STRING:string = "string";//String  字符串
        public static TYPE_ARRAY:string = "array";//ARRAY	变长	某种数据结构的数组
        public static TYPE_ARRAY_CONST:string = "array_const";//ARRAY	定长	某种数据结构的数组
        public static TYPE_BYTEARRAY:string = "bytearray";
        public static TYPE_ENTITY:string = "entity";//实体类

        public static CHARSET: string = PacketFactory.CHARSET_UNICODE;
        public static CHARSET_ASCII : string = "ASCII";
        public static CHARSET_UNICODE : string = "Unicode";
        public static MATH_POW_2_32:number = 4294967296;// 2^32.

        public static headerClz:any = DefaultHeader;//协议头的;类名

        private static _factory:IPacketFactory = null;

        /**
         * 初始化协议工厂
         * @param factory
         */
        public static initFactory(factory:IPacketFactory):void {
            PacketFactory._factory = factory;
        }
        public static createPacket(messageId:number, clientSide:boolean = true):Packet{
            if (PacketFactory._factory) {
                return PacketFactory._factory.createPacket(messageId, clientSide);
            } else {
                Debug.log = "@@ ---error!! packet factory not init!!--";
                return null;
            }
        }
        public static getHeader():IHeader {
            if (PacketFactory._factory) {
                return PacketFactory._factory.getHeader();
            } else {
                Debug.log = "@@ ---error!! packet factory not init!!--";
                return null;
            }
        }
        public static getHeaderLength():number {
            if (PacketFactory._factory) {
                return PacketFactory._factory.getHeaderLength();
            } else {
                Debug.log = "@@ ---error!! packet factory not init!!--";
                return 0;
            }
        }
    }
}