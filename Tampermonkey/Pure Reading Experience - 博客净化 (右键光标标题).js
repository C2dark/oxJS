// ==UserScript==
// @name         Pure Reading Experience - 博客净化 (右键/光标/标题)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽部分博客的各种流氓行为：1. 强制恢复默认光标 2. 强制开启右键和选择文本 3. 屏蔽切换标签页时的标题闪烁/欺诈
// @author       Gemini
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================
    // 1. 强制恢复默认鼠标光标样式
    // ============================================================
    // 使用 CSS !important 暴力覆盖，将光标重置为系统默认
    // 针对 body, html 和常见链接/按钮进行分别设置，避免全部强制为箭头导致无法分辨链接
    const css = `
        html, body, div, span, p, h1, h2, h3, h4, h5, h6 {
            cursor: auto !important;
        }
        a, a *, button, button *, .pointer, [role="button"] {
            cursor: pointer !important; /* 保持链接的手型光标 */
        }
        input, textarea {
            cursor: text !important; /* 保持输入框的文本光标 */
        }
        /* 强制开启文本选择 (通常伴随禁止右键出现) */
        * {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }
    `;
    GM_addStyle(css);

    // ============================================================
    // 2. 彻底屏蔽“失去焦点改标题”行为 (如："快回来"、"404 Not Found")
    // ============================================================
    // 许多博客监听 visibilitychange 或 blur 事件来修改标题
    // 我们在捕获阶段(capture phase)就阻止事件传播，让网页脚本接收不到这个事件

    const blockEvents = ['visibilitychange', 'webkitvisibilitychange', 'mozvisibilitychange', 'blur'];

    blockEvents.forEach(eventName => {
        window.addEventListener(eventName, function(event) {
            // 阻止事件向内传播
            event.stopImmediatePropagation();
            // 阻止默认行为（虽然这通常不是必须的，但为了保险）
            // event.preventDefault();
        }, true); // true 表示在捕获阶段拦截，这非常重要！

        document.addEventListener(eventName, function(event) {
            event.stopImmediatePropagation();
        }, true);
    });

    // ============================================================
    // 3. 强制开启右键菜单 (Context Menu)
    // ============================================================
    function enableContextMenu(e) {
        e.stopPropagation();
        return true;
    }

    // 拦截 contextmenu 事件
    window.addEventListener('contextmenu', function(e) {
        e.stopPropagation(); // 停止冒泡
        e.stopImmediatePropagation(); // 停止当前层级的其他监听器
        return true;
    }, true); // 同样在捕获阶段拦截

    // 清理可能直接写在标签上的 oncontextmenu="return false"
    // 比如 <body oncontextmenu="return false">
    const cleaner = setInterval(() => {
        if (document.body) {
            document.body.oncontextmenu = null;
            document.body.onselectstart = null;
            document.body.ondragstart = null;
            clearInterval(cleaner);
        }
    }, 100);

})();