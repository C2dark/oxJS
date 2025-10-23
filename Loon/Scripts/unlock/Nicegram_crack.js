/*
脚本作者：chxm1023
脚本日期：2022-08-10
引用地址：https://raw.githubusercontent.com/chxm1023/Rewrite/main/nicegram.js
*/
const isQX = typeof $task != "undefined";
const chxm1023 = {"data":{"premiumAccess": true}};
console.log('已操作成功🎉\n叮当猫の分享频道: https://t.me/chxm1023');
$done({status: isQX ? "HTTP/1.1 200 OK" : 200, headers: $response.headers, body: JSON.stringify(chxm1023)});