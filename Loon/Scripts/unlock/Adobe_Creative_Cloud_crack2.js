/*
脚本作者：Marol62926
脚本日期：2022-10-01
引用地址：https://raw.githubusercontent.com/Marol62926/MarScrpt/main/adobeScanPdf.js
脚本功能：解锁Adobe Scan, Adobe Acrobat
*/
var body = $response.body;
var obj = JSON.parse(body);

obj = {
  "subscriptions": [{
    "subscription_name": "AcrobatPlus",
    "subscription_level": "Plus",
    "subscription_state": "ACTIVE",
    "sub_ref": "",
    "biz_source": "CCC",
    "billing_term": null
  }, {
    "subscription_name": "ESign",
    "subscription_level": "Basic",
    "subscription_state": "ACTIVE",
    "sub_ref": "",
    "biz_source": "CCC",
    "billing_term": null
  }, {
    "subscription_name": "PDFPack",
    "subscription_level": "Plus",
    "subscription_state": "ACTIVE",
    "sub_ref": "",
    "biz_source": "",
    "billing_term": null
  }, {
    "subscription_name": "CreatePDF",
    "subscription_level": "Basic",
    "subscription_state": "ACTIVE",
    "sub_ref": "",
    "biz_source": "CCC",
    "billing_term": null
  }]
}
  
body = JSON.stringify(obj);
$done({body});
