/*
脚本作者：chxm1023
脚本日期：2023-11-08
引用地址：https://raw.githubusercontent.com/chxm1023/Rewrite/main/slidebox.js
*/
var chxm1023 = JSON.parse($response.body);

chxm1023 = {
  "data" : {
    "env" : {
      "projectId" : "slidebox-ios-prod",
      "region" : "asia-east2",
      "function" : "api_v1",
      "realm" : "prod"
    },
    "appStoreRecord" : {
      "purchases" : [
        {
          "productId" : "co.slidebox.iap.apple.fullversion"
        }
      ],
      "subscriptions" : [

      ],
      "validatedTimestampMs" : "1699365288625",
      "bundleId" : "co.slidebox.Slidebox"
    }
  }
};

$done({body : JSON.stringify(chxm1023)});