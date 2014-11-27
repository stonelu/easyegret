/**
 * Copyright (c) 2012 www.2ren.cn
 */
module easy {

	export interface IEncoder {
        encoder(packet:Packet):ByteArray;
    }
}