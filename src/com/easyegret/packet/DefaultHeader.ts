/**
 * Copyright (c) 2012 www.2ren.cn
 */
module easy {

	export class DefaultHeader implements IHeader{
        public static HEADER_LENGTH:number = 6;//头长度
        public length:number = 0;//包体长度,不包含协议头
        public messageId:number = 0;//协议号
        public code:number = 0;//校验位
        private token:string = null;//软件唯一标示符
    }
}