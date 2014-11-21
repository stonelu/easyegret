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
    export class StringUtil{
        public static dump(array:egret.ByteArray):string{
            var s:string = "";
            var a:string = "";
            for(var i:number = 0; i < array.length; i ++) {
                if(i%16 == 0) s += ("0000" + i.toString(16)).substring(-4, 4) +  " "
                if (i%8 == 0) s += " ";
                var v:number = array[i];
                s += ("0" + v.toString(16)).substring(-2, 2) + " ";
                //a += (v < 32 || v > 126)?".":string.fromCharCode(v);
                if (((i +1)%16) == 0 || i == (array.length -1)){
                    s += " |" + a + "|\n";
                    a = "";
                }
            }
            return s;
        }
        //是否有效
        public static isUsage(value:string):boolean {
            if (value == null || StringUtil.trim(value) == "") {
                return false;
            }
            return true;
        }
        //去收尾空格
        public static trim(str:string):string{
            if(str==null){
                return null;
            }
            return str.trim()
        }
        //
        public static randomRange(start:number, end:number = 0) : number{
            return Math.floor(start +(Math.random() * (end - start)));
        }
        /**
         * 格式化字符串(金钱，如：100,000,000)
         * @param value
         * @param hasSign 是否带符号
         * @return "xx,xxx"
         *
         */
        public static changToMoney(value:string ,hasSign:boolean = false):string{
            var i:number = 0;
            var count:number = 0;
            var str:string = "";
            if(hasSign){
                if(value.charCodeAt(0) >= 48 && value.charCodeAt(0) <= 57){
                    value = "+" + value;
                }
            }
            for(i = value.length - 1; i >= 0; i--){
                str = value.charAt(i) + str;
                if(value.charCodeAt(i) >= 48 && value.charCodeAt(i) <= 57){
                    if(value.charCodeAt(i-1) >= 48 && value.charCodeAt(i-1) <= 57){
                        count ++;
                        if(count == 3){
                            str = "," + str;
                            count = 0;
                        }
                    }
                }else {
                    count = 0;
                }
            }
            return str;
        }
        /**
         * 统计子串在字符串中得数目
         * @param subString 字串
         * @param source 源字符串
         * @return
         *
         */
        public static getMatchesCount(subString:string, source:string):number{
            var count:number = 0;
            var lastIndex:number = source.lastIndexOf(subString);
            var currentIndex:number = source.indexOf(subString);
            if(currentIndex == lastIndex && lastIndex >= 0){
                return 1;
            }else if(currentIndex != lastIndex && lastIndex >= 0){
                ++count;
                while(currentIndex != lastIndex){
                    currentIndex = source.indexOf(subString, currentIndex + subString.length - 1);
                    if(currentIndex != -1){
                        ++count;
                    }
                }
            }
            return count;
        }

        /**
         * 当数字超过10000时，转化为“万”的描述
         * @param value 数据
         * @return 目标字符串
         *
         */
        public static changeIntToText(value:number = 0):string{
            var str:string="";
            if(value>=10000){
                str+=Math.ceil(value/10000).toFixed(0)+"万";
            }else if(value<0){
                str+="0";
            }else{
                str+=value.toFixed(0);
            }
            return str;
        }

        /**
         * 将16进制颜色值转换为html类型(即html类型的)
         * 16进制类型的颜色值
         * @return 返回html类型的颜色值
         */
        public static convertColor2Html(color:number = 0):string{
            var colorHtml:string = "#000000";
            var colorTemp:string = "";
            try{
                colorTemp = color.toString(16);
                while(colorTemp.length<6){
                    colorTemp = "0"+colorTemp;
                }
                colorHtml = "#"+colorTemp;
            }catch(err){
            }
            return colorHtml;


//            var result:Boolean = false;
//            //支持十进制、十六进制
//            if(value.indexOf("0x")==0 && ("0x" + ToString(parseInt(value).toString(16), value.length - 2, "0")) == value.toLowerCase()){
//                result = true;
//            }
//            else if(ToString(parseInt(value).toString(), value.length, "0") == value){
//                result = true;
//            }else{
//                result = false;
//            }
//            return result;
//            

        }

        /**
         *对字符串中的特殊字符进行转义
         * @param value 包含特殊字符的串
         * @return 转义后的新字符串
         *
         */
        public static htmlESC(value:string):string{
            if (value == null || StringUtil.trim(value) == ""){
                return null;
            }else{
                var ampPattern:RegExp = /&/g;
                var ltPattern:RegExp = /</g;
                var gtPattern:RegExp = />/g;

                value = value.replace(ampPattern, "&amp;");//该条必须在第一行
                value = value.replace(ltPattern, "&lt;");
                value = value.replace(gtPattern, "&gt;");

                return value;
            }
        }
        /**
         *关键词过滤 将关键字替换成***
         * @param value 需要进行关键词过滤的字符串
         * @return  关键词替换成***后的新字符串
         *
         */
        public static keywordFiltration(value:string):string{
            if (value == null || StringUtil.trim(value) == ""){
                return null;
            }else{
                value = value.replace("你大爷", "***");
                value = value.replace("尻", "***");
                value = value.replace("二胡", "***");
                return value;
            }
        }

        /**
         * 把数字替换成数组
         * @param value 待替换成字符数组的数值
         * @return 数字字符数组
         */
        public static replaceNumberToArray(value:number):Array<string>{
            var numVector:Array<string> = new Array<string>();
            var str:string = value.toString();
            var len:number = str.length;
            for (var i:number = 0; i < len; i++) {
                numVector.push(str.charAt(i));
            }

            return numVector;
        }
        /**
         * 字符串替换
         * @param content
         * @param src
         * @param target
         * @return
         *
         */
        public static replace(content:string, src:string, target:string):string {
            if (!StringUtil.isUsage(content)) return "";
            while(content.indexOf(src)>=0) content = content.replace(src, target);
            return content;
        }

        public static spliteStrArr(str:string, split:string):Array<any> {
            var result:Array<any> = [];
            if (StringUtil.isUsage(str)){
                var sd:Array<any> = str.split(split);
                for (var i:number = 0; i < sd.length; i++)  {
                    if (StringUtil.isUsage(sd[i])){
                        result.push(sd[i]);
                    }
                }
            }
            return result;
        }
    }
}