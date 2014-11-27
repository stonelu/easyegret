/**
 * Copyright (c) 2012 www.2ren.cn
 */
module easy {

	export 
    import flash.utils.ByteArray;
    
    import cn.tworen.packet.IHeader;
    import cn.tworen.packet.Packet;
    import cn.tworen.packet.PacketFactory;

    public classDefaultServerDecoder extends DefaultDecoder implements IDecoder{

		public constructor(){
			super();
		}
        public decode(bytePacket:ByteArray):Packet{
            var header:IHeader = this.decodeHeader(bytePacket);
            var packet:Packet = PacketFactory.createPacket(header, true);
            if (packet && bytePacket.bytesAvailable > 0)this.decodeBody(bytePacket, packet);
            return packet;
        }
    }
}