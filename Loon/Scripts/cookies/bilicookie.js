/*
脚本作者：佚名
脚本日期：2023-11-18 19:15:01
引用地址：
*/
const config = {
	headers: {}
  };
  
  config.headers = $request.headers;
  var nessary_headers = {};
  // nessary_headers.buvid = config.headers.buvid;
  nessary_headers.Authorization = config.headers.Authorization !== undefined ? config.headers.Authorization : config.headers.authorization;
  nessary_headers['User-Agent'] = config.headers['User-Agent'] != undefined ? config.headers['User-Agent'] : config.headers['user-agent'];
  console.log(JSON.stringify(nessary_headers));
  $notification.post("BiliBili Cookie获取", "获取成功", JSON.stringify(nessary_headers));
  $done({});