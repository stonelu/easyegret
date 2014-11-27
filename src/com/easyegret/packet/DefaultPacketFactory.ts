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

	export class DefaultPacketFactory implements IPacketFactory{
        public static packetDefineDic:Object = {};//packet字典
        public constructor(){
            this.initData();
        }
        /**
         * 初始化协议包定义 
         */ 
        public initData():void {
        }
        public initPacketDefine(packetClass:any):void {
            var instance:Packet = new packetClass();
            EventManager.releasePacket(instance);
            this.setPacketDefine(instance.header.messageId, instance.clientSide, packetClass);
        }
        
        public setPacketDefine(messageId:number, clientSide:boolean, packetClass:any):void {
            DefaultPacketFactory.packetDefineDic[(clientSide?"c_":"s_") + messageId] = packetClass;
        }
        public createPacketByMessageId(messageId:number, clientSide:boolean):Packet{
            var classz:any = DefaultPacketFactory.packetDefineDic[(clientSide?"c_":"s_") + messageId];
            if (classz){
                var packet:Packet = new classz();
                Debug.log ="message->packet:" + classz;
                return packet;
            }
            Debug.log = "message->packet:" + "NULL";
            return null;
        }
        /**
         * 根据协议header,取得对应的pakcet对象 
         * @param header 协议header,根据serverid和messageId生成Packet对象
         * @return packet  协议packet对象
         */ 
        public createPacket(messageId:number, clientSide:boolean):Packet{
            Debug.log = "header->packet:" + messageId;
            var classz:any = DefaultPacketFactory.packetDefineDic[(clientSide?"c_":"s_") + messageId];
            if (classz){
                var packet:Packet = new classz();
                packet.header.messageId = messageId;
                Debug.log = "header->packet:" + egret.getQualifiedClassName(packet);
                return packet;
            }
            Debug.log = "header->packet:" + "NULL";
            return null;
        }
        //从packet字典中删除包定义
        private removePacketDefine(messageId:number, clientSize:boolean = true):void{
            delete DefaultPacketFactory.packetDefineDic[messageId + "_" + (clientSize?0:1)];
        }

        /**
         * 协议头
         * @returns {any}
         */
        public getHeader():IHeader{
            return new PacketFactory.headerClz();
        }

        /**
         * 协议头长度
         * @returns {any}
         */
        public getHeaderLength():number{
            return PacketFactory.headerClz["HEADER_LENGTH"];
        }
    }
}