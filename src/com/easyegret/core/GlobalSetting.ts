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
     * 这里记录全局公用的一些数据和设置
     */
    export class GlobalSetting {
        /**
         * 在显示view的时候,按照设计的尺寸显示,不做view宽高的改变,采用egret自带的scale策略
         */
        public static DISPLAY_FIX:string = "fix";
        /**
         * 在显示view的时候会自动把view页面设置成当前最大显示宽高
         */
        public static DISPLAY_FULL:string = "full";
        /**
         * 显示模式设置
         * @type {string}
         */
        public static DISPLAY_MODEL:string = GlobalSetting.DISPLAY_FIX;
        /**
         * 开发模式开关
         * 打开开发模式,logger会记录打印信息到debug窗口
         * @type {boolean}
         */
        public static DEV_MODEL:Boolean = true;//开发模式
        /**
         * 游戏系统的时间校对
         * 一般登录完成后,服务器会通知一个当前的服务器时间
         * 以此时间为基准,客户端可以随时校对自己的时间
         * @type {number}
         */
        public static SYSTEM_DATE:number = 0;
        /**
         * 声音总开关
         * @type {boolean}
         */
        public static VOLUME_OPEN:boolean = true;//音量开关
        /**
         * 帧频设置
         * @type {number}
         */
        public static FRAME_RATE:number = 60;//帧频
        /**
         * 舞台
         * @type {null}
         */
        public static STAGE:egret.Stage = null;//舞台
        //public static IOS:Boolean = false;//是否ios设备
        /**
         * 舞台的宽
         * @type {number}
         */
        public static STAGE_WIDTH:number = 480;//实际舞台宽
        /**
         * 舞台的高
         * @type {number}
         */
        public static STAGE_HEIGHT:number = 800;//实际舞台高
        /**
         * 配置文件
         * 一般会记录http的访问地址,由该地址,获取服务器列表和版本信息
         * @type {null}
         */
        public static XML_CONFIG:egret.XML = null;//配置文件
        /**
         * 安装包自带的版本信息
         * @type {null}
         */
        public static XML_VERSION:egret.XML = null;//版本文件
        /**
         * 初始化全局的数据
         */
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