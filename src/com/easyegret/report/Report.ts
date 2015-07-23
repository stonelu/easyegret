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
    export class Report {
        private static _loader:egret.URLLoader = null;
        private static _isInit:boolean = false;
        /**
         * channel 渠道
         * ver 版本
         * device 设备
         * time 时间
         * token 随机值
         */
        private static _baseInfo:Object = null;

        /**
         * 通用统计信息
         */
        public static send(data:any, sufixUrl:string = "", token:string = ""):void {
            if (!GlobalSetting.REPORT) {
                return;
            }
            if (!Report._isInit){
                Report.init();
                console.log("[error]:report not init!")
                return;
            }
            if (Report._baseInfo == null) {
                console.log("[error]:report not ready!")
                return;
            }
            if (Report._loader == null){
                Report._loader = new egret.URLLoader();
                Report._loader.dataFormat = egret.URLLoaderDataFormat.BINARY;
            }
            if (token && token.length > 0){
                Report._baseInfo["tk"] = Math.round(Math.random()*99999999);//随机token
            } else {
                Report._baseInfo["tk"] = token;//随机token
            }
            Report._baseInfo["ti"] = Date.now();

            var varData:egret.URLVariables = new egret.URLVariables();
            varData.variables = {};

            if(data["getReportData"]) {
                data = data.getReportData();
            }

            for (var key in data){
                //console.log(key + "=" + data[key]);
                if (key != "__class__") {
                    varData.variables[key] = data[key];
                }

            }
            for (var key in Report._baseInfo){
                //console.log(key + "==" + Report._baseInfo[key]);
                if (key != "__class__") {
                    varData.variables[key] = Report._baseInfo[key];
                }
            }

            var req:egret.URLRequest = new egret.URLRequest();
            req.data = varData;//
            req.method = egret.URLRequestMethod.POST;
            req.url = GlobalSetting.REPORT_URL + sufixUrl;
            Report._loader.load(req);
            console.log("[repor]:" + JSON.stringify(req.data));
        }

        /**
         * 初始化加载报表信息
         */
        public static init():void {
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, Report.onLoadingGroupJosnFileComplete, Report);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, Report.onLoadingGroupJosnFileError, Report);
            RES.loadGroup("group_easy_report_config");
        }

        /**
         * 加载失败
         * @param event
         */
        public static onLoadingGroupJosnFileError(event:RES.ResourceEvent):void {
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, Report.onLoadingGroupJosnFileComplete, Report);
            RES.removeEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, Report.onLoadingGroupJosnFileError, Report)
        }
        /**
         * loading配置文件的Group加载完成
         * @param event
         */
        public static onLoadingGroupJosnFileComplete(event:RES.ResourceEvent):void{
            if(event.groupName=="group_easy_report_config"){
                RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,Report.onLoadingGroupJosnFileComplete, Report);
                RES.removeEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, Report.onLoadingGroupJosnFileError, Report)
                var jsonConfig:any = RES.getRes("easy_report_config");
                if (jsonConfig) {
                    Report._isInit = true;
                    GlobalSetting.APP_VERSION = jsonConfig.version;
                    GlobalSetting.REPORT_URL = jsonConfig.url;
                    GlobalSetting.APP_NAME = jsonConfig.name;
                    GlobalSetting.APP_PRODUCT_ID = jsonConfig.productId;
                    GlobalSetting.APP_PROVIDE = jsonConfig.provide;
                    for(var i = 0; i < jsonConfig.channel.length; i++) {
                        if (GlobalSetting.APP_PROVIDE == jsonConfig.channel[i].id) {
                            GlobalSetting.APP_CHANNEL = jsonConfig.channel[i].name;
                            easy.GlobalSetting.APP_DataEyeId = jsonConfig.channel[i].dataEyeId;//Data eye 统计的id
                            easy.GlobalSetting.APP_Rate = jsonConfig.channel[i].rate;//汇率
                            easy.GlobalSetting.APP_RateName = jsonConfig.channel[i].des;//汇率的单位
                            GlobalSetting.REPORT_UI = jsonConfig.channel[i].report_ui;
                            GlobalSetting.REPORT = jsonConfig.channel[i].report;
                            GlobalSetting.APP_STORAGE =  jsonConfig.channel[i].storage;
                            break;
                        }
                    }
                    Report._baseInfo = {"pn":GlobalSetting.APP_NAME, "ch":GlobalSetting.APP_CHANNEL, "ver":GlobalSetting.APP_VERSION, "dev":GlobalSetting.APP_DEVICE, "ti":0, "tk":0};
                    //console.log("@Report config init =" + JSON.stringify(jsonConfig));
                }
                //派发一个 easy_report_config_complete
                EventManager.dispatch("easy_report_config_complete");
            }
        }
    }
}