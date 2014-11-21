/**
 * Copyright (c) 2014,www.easyegret.com
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
 * THIS SOFTWARE IS PROVIDED BY EASYEGRET.COM AND CONTRIBUTORS "AS IS" AND ANY
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
    /**
     * Created by Administrator on 2014/11/5.
     */
    export class GlobalSetting {
        public static DEV_MODEL:Boolean = true;//开发模式
        public static SYSTEM_DATE:Date = null;//系统时间
        public static XML_CONFIG:egret.XML = null;//配置文件
        public static XML_VERSION:egret.XML = null;//版本文件
        public static VOLUME_OPEN:boolean = true;//音量开关
        public static FRAME_RATE:number = 60;//帧频
        public static STAGE:egret.Stage = null;//舞台
        public static IOS:Boolean = false;//是否ios设备
        public static STAGE_WIDTH:number = 960;//实际舞台宽
        public static STAGE_HEIGHT:number = 640;//实际舞台高


        public static initData():void{
            GlobalSetting.STAGE = egret.MainContext.instance.stage;
            GlobalSetting.STAGE_WIDTH = GlobalSetting.STAGE.stageWidth;
            GlobalSetting.STAGE_HEIGHT = GlobalSetting.STAGE.stageHeight;
            if (GlobalSetting.DEV_MODEL) {
                Logger.log = "---- GlobalSetting init!----";
                Logger.log = "STAGE_WIDTH=" + GlobalSetting.STAGE_WIDTH + ", STAGE_HEIGHT=" + GlobalSetting.STAGE_HEIGHT;
            }
        }

        /**
         * 判断是不是微信
         * @returns {boolean}
         */
        public isWeiXin():boolean {
            var ua:string = navigator.userAgent.toString();
            var str:any = ua.match(/MicroMessenger/i);
            if (str == "MicroMessenger") {
                return true;
            } else {
                return false;
            }

        }
    }
}