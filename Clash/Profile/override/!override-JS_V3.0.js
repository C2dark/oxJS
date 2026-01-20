module.exports.parse = async (config, profileName) => {
  // ==============================
  // 0. 通用配置模板 (对应 YAML 锚点)
  // ==============================
  const commonConfig = {
    auto: {
      type: 'url-test',
      url: 'http://www.gstatic.com/generate_204',
      interval: 600,
      tolerance: 50,
      timeout: 5000,
      lazy: true,
      expected_status: 204,
      hidden: true,
      include_all: true
    },
    fallback: {
      type: 'fallback',
      url: 'http://www.gstatic.com/generate_204',
      interval: 600,
      timeout: 3000,
      lazy: true,
      expected_status: 204,
      hidden: true,
      include_all: true
    },
    lb: {
      type: 'load-balance',
      strategy: 'consistent-hashing',
      url: 'http://www.gstatic.com/generate_204',
      interval: 600,
      timeout: 5000,
      lazy: true,
      expected_status: 204,
      hidden: true,
      include_all: true
    },
    // 规则集模板
    p_standard: { type: 'http', behavior: 'classical', format: 'yaml', interval: 86400 },
    p_ip: { type: 'http', behavior: 'ipcidr', format: 'yaml', interval: 86400 },
    p_mrs: { type: 'http', format: 'mrs', interval: 86400, behavior: 'domain' },
    p_mrsip: { type: 'http', format: 'mrs', interval: 86400, behavior: 'ipcidr' }
  };

  // ==============================
  // 1. 规则集定义 (Rule Providers)
  // ==============================
  const ruleProviders = {
    // 广告拦截
    AdBlock:      { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Advertising/Advertising_No_Resolve.yaml", path: "./ruleset/Advertising.yaml" },
    Hijacking:    { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Hijacking/Hijacking_No_Resolve.yaml", path: "./ruleset/Hijacking.yaml" },
    Privacy:      { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Privacy/Privacy_No_Resolve.yaml", path: "./ruleset/Privacy.yaml" },
    BlockHttpDNS: { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/BlockHttpDNS/BlockHttpDNS_No_Resolve.yaml", path: "./ruleset/BlockHttpDNS.yaml" },

    // 特殊直连
    PayPal:       { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/PayPal/PayPal.yaml", path: "./ruleset/PayPal.yaml" },
    AmazonCN:     { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/AmazonCN/AmazonCN.yaml", path: "./ruleset/AmazonCN.yaml" },
    Speedtest:    { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Speedtest/Speedtest.yaml", path: "./ruleset/Speedtest.yaml" },

    // 国内直连与下载
    WeChat:       { ...commonConfig.p_standard, url: "https://github.com/blackmatrix7/ios_rule_script/raw/refs/heads/master/rule/Clash/WeChat/WeChat.yaml", path: "./ruleset/WeChat.yaml" },
    BiliBili:     { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/BiliBili/BiliBili.yaml", path: "./ruleset/BiliBili.yaml" },
    Game:         { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Game/Game_No_Resolve.yaml", path: "./ruleset/Game.yaml" },
    SteamCN:      { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/SteamCN/SteamCN.yaml", path: "./ruleset/SteamCN.yaml" },
    GameDownload: { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Game/GameDownload/GameDownload.yaml", path: "./ruleset/GameDownload.yaml" },
    GameDownloadCN: { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Game/GameDownloadCN/GameDownloadCN.yaml", path: "./ruleset/GameDownloadCN.yaml" },
    PrivateTracker: { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/PrivateTracker/PrivateTracker.yaml", path: "./ruleset/PrivateTracker.yaml" },

    // 前置特殊代理
    Imgur:        { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Imgur/Imgur.yaml", path: "./ruleset/Imgur.yaml" },
    AppleDev:     { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/AppleDev/AppleDev.yaml", path: "./ruleset/AppleDev.yaml" },
    AppleProxy:   { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/AppleProxy/AppleProxy.yaml", path: "./ruleset/AppleProxy.yaml" },
    iCloudPrivateRelay: { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/iCloudPrivateRelay/iCloudPrivateRelay.yaml", path: "./ruleset/iCloudPrivateRelay.yaml" },

    // 国际媒体/社交
    Gemini:       { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Gemini/Gemini.yaml", path: "./ruleset/Gemini.yaml" },
    AI:           { ...commonConfig.p_standard, url: "https://gist.githubusercontent.com/ddgksf2013/cb4121e8b5c5d865cc949cb8120320c4/raw/Ai.yaml", path: "./ruleset/AI.yaml" },
    GitHub:       { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GitHub/GitHub.yaml", path: "./ruleset/GitHub.yaml" },
    Cloudflare:   { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Cloudflare/Cloudflare.yaml", path: "./ruleset/Cloudflare.yaml" },
    Developer:    { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Developer/Developer.yaml", path: "./ruleset/Developer.yaml" },
    Spotify:      { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Spotify/Spotify.yaml", path: "./ruleset/Spotify.yaml" },
    Twitch:       { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Twitch/Twitch.yaml", path: "./ruleset/Twitch.yaml" },
    Notion:       { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Notion/Notion.yaml", path: "./ruleset/Notion.yaml" },
    Line:         { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Line/Line.yaml", path: "./ruleset/Line.yaml" },
    Discord:      { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Discord/Discord.yaml", path: "./ruleset/Discord.yaml" },
    Whatsapp:     { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Whatsapp/Whatsapp.yaml", path: "./ruleset/Whatsapp.yaml" },
    Bing:         { ...commonConfig.p_standard, url: "https://rule.kelee.one/Clash/Bing.yaml", path: "./ruleset/Bing.yaml" },
    Twitter:      { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Twitter/Twitter.yaml", path: "./ruleset/Twitter.yaml" },
    TelegramUS:   { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/TelegramUS/TelegramUS.yaml", path: "./ruleset/TelegramUS.yaml" },
    TelegramSG:   { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/TelegramSG/TelegramSG.yaml", path: "./ruleset/TelegramSG.yaml" },
    TelegramNL:   { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/TelegramNL/TelegramNL.yaml", path: "./ruleset/TelegramNL.yaml" },
    Telegram:     { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Telegram/Telegram_No_Resolve.yaml", path: "./ruleset/Telegram.yaml" },
    YouTube:      { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/YouTube/YouTube_No_Resolve.yaml", path: "./ruleset/YouTube.yaml" },
    TikTok:       { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/TikTok/TikTok.yaml", path: "./ruleset/TikTok.yaml" },
    Netflix:      { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Netflix/Netflix.yaml", path: "./ruleset/Netflix.yaml" },

    // 国外下载
    Dropbox:      { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Dropbox/Dropbox.yaml", path: "./ruleset/Dropbox.yaml" },
    OneDrive:     { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OneDrive/OneDrive.yaml", path: "./ruleset/OneDrive.yaml" },
    GoogleDrive:  { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GoogleDrive/GoogleDrive.yaml", path: "./ruleset/GoogleDrive.yaml" },
    PikPak:       { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/PikPak/PikPak.yaml", path: "./ruleset/PikPak.yaml" },
    TeraBox:      { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/TeraBox/TeraBox.yaml", path: "./ruleset/TeraBox.yaml" },

    // 国际大厂
    Amazon:       { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Amazon/Amazon.yaml", path: "./ruleset/Amazon.yaml" },
    Apple:        { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Apple/Apple_Classical.yaml", path: "./ruleset/Apple.yaml" },
    Google:       { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Google/Google.yaml", path: "./ruleset/Google.yaml" },
    Microsoft:    { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Microsoft/Microsoft.yaml", path: "./ruleset/Microsoft.yaml" },
    Facebook:     { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Facebook/Facebook.yaml", path: "./ruleset/Facebook.yaml" },

    // 兜底
    Proxy:        { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Proxy/Proxy_No_Resolve.yaml", path: "./ruleset/Proxy.yaml" },
    Global:       { ...commonConfig.p_standard, url: "https://github.com/blackmatrix7/ios_rule_script/raw/refs/heads/master/rule/Clash/Global/Global_No_Resolve.yaml", path: "./ruleset/Global.yaml" },
    GlobalMedia:  { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GlobalMedia/GlobalMedia_No_Resolve.yaml", path: "./ruleset/GlobalMedia.yaml" },
    Download:     { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Download/Download.yaml", path: "./ruleset/Download.yaml" },
    China:        { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/China/China_No_Resolve.yaml", path: "./ruleset/China_No_Resolve.yaml" },
    ChinaMedia:   { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ChinaMedia/ChinaMedia_No_Resolve.yaml", path: "./ruleset/ChinaMedia_No_Resolve.yaml" },
    ChinaIPs:     { ...commonConfig.p_standard, url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ChinaIPs/ChinaIPs_Classical_No_Resolve.yaml", path: "./ruleset/ChinaIPs.yaml" }
  };

  // ==============================
  // 2. 代理组配置 (Proxy Groups)
  // ==============================
  const groups = [
    // --- 核心功能组 ---
    { name: "手动切换", type: "select", include_all: true, icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Static.png" },
    { name: "Global", type: "select", proxies: ["手动切换", "DIRECT", "美国策略", "香港策略", "狮城策略", "台湾策略", "日本策略", "韩国策略", "欧洲策略"], icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Global.png" },
    { name: "GlobalDL", type: "select", proxies: ["手动切换", "DIRECT", "美国策略", "香港策略", "狮城策略", "台湾策略", "日本策略", "韩国策略", "欧洲策略", "低倍率策略", "IPv6策略"], icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Global.png" },
    { name: "FINAL", type: "select", proxies: ["手动切换", "DIRECT", "美国策略", "香港策略", "狮城策略", "台湾策略", "日本策略", "韩国策略", "欧洲策略"], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Final.png" },

    // 应用分组
    { name: "AI", type: "select", proxies: ["手动切换", "美国策略", "香港策略", "狮城策略", "台湾策略", "日本策略", "韩国策略", "欧洲策略"], icon: "https://raw.githubusercontent.com/lige47/QuanX-icon-rule/main/icon/04ProxySoft/chatgpt(white1).png" },
    { name: "Telegram", type: "select", proxies: ["手动切换", "美国策略", "香港策略", "狮城策略", "台湾策略", "日本策略", "韩国策略", "欧洲策略"], icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Telegram.png" },
    { name: "YouTube", type: "select", proxies: ["手动切换", "美国策略", "香港策略", "狮城策略", "台湾策略", "日本策略", "韩国策略", "欧洲策略"], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/YouTube.png" },
    { name: "Twitter", type: "select", proxies: ["手动切换", "美国策略", "香港策略", "狮城策略", "台湾策略", "日本策略", "韩国策略", "欧洲策略"], icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Twitter.png" },
    { name: "TikTok", type: "select", proxies: ["手动切换", "美国策略", "香港策略", "狮城策略", "台湾策略", "日本策略", "韩国策略", "欧洲策略"], icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/TikTok.png" },
    { name: "Netflix", type: "select", proxies: ["手动切换", "美国策略", "香港策略", "狮城策略", "台湾策略", "日本策略", "韩国策略", "欧洲策略"], icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Netflix.png" },
    { name: "Bing", type: "select", proxies: ["手动切换", "DIRECT", "美国策略", "香港策略", "狮城策略", "台湾策略", "日本策略", "韩国策略", "欧洲策略"], icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Bing.png" },
    { name: "Apple", type: "select", proxies: ["DIRECT", "手动切换", "美国策略", "香港策略", "狮城策略", "台湾策略", "日本策略", "韩国策略", "欧洲策略"], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Apple.png" },
    { name: "Google", type: "select", proxies: ["手动切换", "美国策略", "香港策略", "狮城策略", "台湾策略", "日本策略", "韩国策略", "欧洲策略"], icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Google.png" },
    { name: "Microsoft", type: "select", proxies: ["手动切换", "DIRECT", "美国策略", "香港策略", "狮城策略", "台湾策略", "日本策略", "韩国策略", "欧洲策略"], icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Microsoft.png" },
    { name: "Facebook", type: "select", proxies: ["手动切换", "美国策略", "香港策略", "狮城策略", "台湾策略", "日本策略", "韩国策略", "欧洲策略"], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Facebook.png" },

    // 全局时延优选
    { name: "时延优选", ...commonConfig.auto, hidden: false, icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Urltest.png" },

    // --- 地区主策略 ---
    { name: "美国策略", type: "select", proxies: ["美国-时延优选", "美国-故障转移", "美国-负载均衡"], include_all: true, filter: "美|US|(?i)States|American", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/US.png" },
    { name: "香港策略", type: "select", proxies: ["香港-时延优选", "香港-故障转移", "香港-负载均衡"], include_all: true, filter: "港|HK|(?i)Hong", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/HK.png" },
    { name: "狮城策略", type: "select", proxies: ["狮城-时延优选", "狮城-故障转移", "狮城-负载均衡"], include_all: true, filter: "新|坡|SG|(?i)Singapore", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/SG.png" },
    { name: "台湾策略", type: "select", proxies: ["台湾-时延优选", "台湾-故障转移", "台湾-负载均衡"], include_all: true, filter: "台|湾|TW|(?i)Taiwan", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/TW.png" },
    { name: "日本策略", type: "select", proxies: ["日本-时延优选", "日本-故障转移", "日本-负载均衡"], include_all: true, filter: "日|东京|JP|(?i)Japan", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/JP.png" },
    { name: "韩国策略", type: "select", proxies: ["韩国-时延优选", "韩国-故障转移", "韩国-负载均衡"], include_all: true, filter: "KR|韩国|韓|首尔|(?i)Korea", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/KR.png" },
    { name: "欧洲策略", type: "select", proxies: ["欧洲-时延优选", "欧洲-故障转移", "欧洲-负载均衡"], include_all: true, filter: "🇬🇧|俄罗斯|🇷🇺|英国|法国|🇫🇷|德国|🇩🇪|瑞典|🇸🇪|西班牙|🇪🇸|伦敦|荷兰|🇳🇱|塞尔维亚|🇷🇸|挪威|丹麦|🇩🇰|🇳🇴|欧洲", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/European_Union.png" },

    // --- 特殊功能策略 ---
    { name: "IPv6策略", type: "select", include_all: true, filter: "(?i)ipv6", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Nucleus.png" },
    { name: "低倍率策略", type: "select", include_all: true, filter: "0\\.1|0\\.3|0\\.5|0\\.75", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Download.png" },

    // --- 地区子分组 (隐藏式) ---
    // 美国
    { name: "美国-时延优选", ...commonConfig.auto, filter: "美|US|(?i)States|American", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Urltest.png" },
    { name: "美国-故障转移", ...commonConfig.fallback, filter: "美|US|(?i)States|American", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Available.png" },
    { name: "美国-负载均衡", ...commonConfig.lb, filter: "美|US|(?i)States|American", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Round_Robin.png" },

    // 香港
    { name: "香港-时延优选", ...commonConfig.auto, filter: "港|HK|(?i)Hong", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Urltest.png" },
    { name: "香港-故障转移", ...commonConfig.fallback, filter: "港|HK|(?i)Hong", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Available.png" },
    { name: "香港-负载均衡", ...commonConfig.lb, filter: "港|HK|(?i)Hong", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Round_Robin.png" },

    // 狮城
    { name: "狮城-时延优选", ...commonConfig.auto, filter: "新|坡|SG|(?i)Singapore", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Urltest.png" },
    { name: "狮城-故障转移", ...commonConfig.fallback, filter: "新|坡|SG|(?i)Singapore", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Available.png" },
    { name: "狮城-负载均衡", ...commonConfig.lb, filter: "新|坡|SG|(?i)Singapore", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Round_Robin.png" },

    // 日本
    { name: "日本-时延优选", ...commonConfig.auto, filter: "日|东京|JP|(?i)Japan", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Urltest.png" },
    { name: "日本-故障转移", ...commonConfig.fallback, filter: "日|东京|JP|(?i)Japan", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Available.png" },
    { name: "日本-负载均衡", ...commonConfig.lb, filter: "日|东京|JP|(?i)Japan", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Round_Robin.png" },

    // 台湾
    { name: "台湾-时延优选", ...commonConfig.auto, filter: "台|湾|TW|(?i)Taiwan", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Urltest.png" },
    { name: "台湾-故障转移", ...commonConfig.fallback, filter: "台|湾|TW|(?i)Taiwan", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Available.png" },
    { name: "台湾-负载均衡", ...commonConfig.lb, filter: "台|湾|TW|(?i)Taiwan", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Round_Robin.png" },

    // 韩国
    { name: "韩国-时延优选", ...commonConfig.auto, filter: "KR|韩国|韓|首尔|(?i)Korea", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Urltest.png" },
    { name: "韩国-故障转移", ...commonConfig.fallback, filter: "KR|韩国|韓|首尔|(?i)Korea", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Available.png" },
    { name: "韩国-负载均衡", ...commonConfig.lb, filter: "KR|韩国|韓|首尔|(?i)Korea", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Round_Robin.png" },

    // 欧洲
    { name: "欧洲-时延优选", ...commonConfig.auto, filter: "🇬🇧|俄罗斯|🇷🇺|英国|法国|🇫🇷|德国|🇩🇪|瑞典|🇸🇪|西班牙|🇪🇸|伦敦|荷兰|🇳🇱|塞尔维亚|🇷🇸|挪威|丹麦|🇩🇰|🇳🇴|欧洲", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Urltest.png" },
    { name: "欧洲-故障转移", ...commonConfig.fallback, filter: "🇬🇧|俄罗斯|🇷🇺|英国|法国|🇫🇷|德国|🇩🇪|瑞典|🇸🇪|西班牙|🇪🇸|伦敦|荷兰|🇳🇱|塞尔维亚|🇷🇸|挪威|丹麦|🇩🇰|🇳🇴|欧洲", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Available.png" },
    { name: "欧洲-负载均衡", ...commonConfig.lb, filter: "🇬🇧|俄罗斯|🇷🇺|英国|法国|🇫🇷|德国|🇩🇪|瑞典|🇸🇪|西班牙|🇪🇸|伦敦|荷兰|🇳🇱|塞尔维亚|🇷🇸|挪威|丹麦|🇩🇰|🇳🇴|欧洲", icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Round_Robin.png" }
  ];

  // ==============================
  // 3. 分流规则 (Rules)
  // ==============================
  const rules = [
    // 1. 广告拦截
    "GEOSITE,Category-ads-all,REJECT",
    "RULE-SET,AdBlock,REJECT,no-resolve",
    "RULE-SET,Hijacking,REJECT,no-resolve",
    "RULE-SET,Privacy,REJECT,no-resolve",
    "RULE-SET,BlockHttpDNS,REJECT,no-resolve",
    // 局域网直连
    "GEOIP,lan,DIRECT,no-resolve",
    "GEOIP,private,DIRECT,no-resolve",
    "GEOSITE,private,DIRECT",
    // 2. 特殊直连
    "RULE-SET,PayPal,DIRECT",
    "RULE-SET,AmazonCN,DIRECT",
    "RULE-SET,Speedtest,DIRECT",
    // 3. 国内直连与下载
    "RULE-SET,WeChat,DIRECT",
    "RULE-SET,BiliBili,DIRECT",
    // 游戏下载
    "RULE-SET,Game,DIRECT,no-resolve",
    "RULE-SET,SteamCN,DIRECT",
    "RULE-SET,GameDownload,DIRECT",
    "RULE-SET,GameDownloadCN,DIRECT",
    "RULE-SET,PrivateTracker,DIRECT",

    // 4. 前置特殊代理
    "DOMAIN-KEYWORD,emby,手动切换",
    "RULE-SET,Imgur,香港策略",
    "RULE-SET,AppleDev,Global",
    "RULE-SET,AppleProxy,Global",
    "RULE-SET,iCloudPrivateRelay,Global",

    // 5. 国际媒体/社交
    "RULE-SET,Gemini,AI",
    "RULE-SET,AI,AI",
    "RULE-SET,GitHub,香港策略",
    "RULE-SET,Cloudflare,香港策略",
    "RULE-SET,Developer,香港策略",
    "RULE-SET,Spotify,香港策略",
    "RULE-SET,Twitch,香港策略",
    "RULE-SET,Notion,香港策略",
    "RULE-SET,Line,香港策略",
    "RULE-SET,Discord,香港策略",
    "RULE-SET,Whatsapp,香港策略",
    //
    "RULE-SET,Bing,Bing",
    "RULE-SET,Twitter,Twitter",
    "RULE-SET,Telegram,Telegram,no-resolve",
    // 流媒体
    "RULE-SET,YouTube,YouTube,no-resolve",
    "RULE-SET,TikTok,TikTok",
    "RULE-SET,Netflix,Netflix",
    // 6. 国外下载
    "RULE-SET,Dropbox,GlobalDL",
    "RULE-SET,OneDrive,GlobalDL",
    "RULE-SET,GoogleDrive,GlobalDL",
    "RULE-SET,PikPak,GlobalDL",
    "RULE-SET,TeraBox,GlobalDL",
    // 7. 国际大厂服务
    "RULE-SET,Amazon,香港策略",
    "RULE-SET,Apple,Apple",
    "RULE-SET,Google,Google",
    "RULE-SET,Microsoft,Microsoft",
    "RULE-SET,Facebook,Facebook",
    // 8. 国外兜底
    "RULE-SET,Proxy,Global,no-resolve",
    "RULE-SET,Global,Global,no-resolve",
    "RULE-SET,GlobalMedia,Global,no-resolve",

    // 9. 国内兜底
    "RULE-SET,Download,DIRECT",
    "RULE-SET,China,DIRECT,no-resolve",
    "RULE-SET,ChinaMedia,DIRECT,no-resolve",
    "GEOSITE,CN,DIRECT",
    "RULE-SET,ChinaIPs,DIRECT,no-resolve",
    "GEOIP,CN,DIRECT",
    "MATCH,FINAL"
  ];

  // ==============================
  // 4. 应用配置
  // ==============================
  
  // 覆盖原有配置
  config["rule-providers"] = ruleProviders;
  config["proxy-groups"] = groups;
  config["rules"] = rules;

  // ==============================
  // 5. 个性化配置 (Flashair's Custom)
  // ==============================
  // 你之前提到不想使用 fake-ip，希望使用 redir-host。
  // 注意：Mihomo 内核中 redir-host 已被废弃，通常使用 enhanced-mode: fake-ip。
  // 如果你确实需要类似行为，通常是将 enhanced-mode 设为 redir-host (旧兼容) 
  // 或者关闭 fake-ip (但可能影响性能)。
  
  if (!config.dns) config.dns = {};
  
  // 强制设置为 redir-host 模式（配合你的需求）
  config.dns["enhanced-mode"] = "redir-host";
  
  // 确保 fake-ip-range 不干扰（可选）
  // delete config.dns["fake-ip-range"];
  // delete config.dns["fake-ip-filter"];

  return config;
}