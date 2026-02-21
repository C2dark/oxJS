// ==UserScript==
// @name         English Bionic Reading V2 (强力版)
// @namespace    <a href='http://tampermonkey.net' target='_blank'>http://tampermonkey.net</a>/
// @version      2.0
// @description  强制将网页英文单词前半部分加粗。包含右下角手动触发按钮。
// @author       Gemini
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // 1. 注入强制 CSS，确保加粗可见，防止被原站样式覆盖
    const style = document.createElement('style');
    style.innerHTML = `
        b.bionic-highlight {
            font-weight: 800 !important;
            color: inherit !important;
        }
        /* 避免处理过的文本显得突兀 */
        span.bionic-processed {
            display: inline;
        }
        /* 右下角手动触发按钮样式 */
        #bionic-trigger-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: #333;
            color: #fff;
            border-radius: 50%;
            text-align: center;
            line-height: 40px;
            cursor: pointer;
            opacity: 0.3;
            z-index: 999999;
            font-size: 20px;
            user-select: none;
            transition: opacity 0.3s;
        }
        #bionic-trigger-btn:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // 2. 配置排除列表
    const EXCLUDE_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'SVG', 'IMG', 'VIDEO', 'AUDIO', 'CANVAS', 'IFRAME', 'BUTTON', 'SELECT']);

    function processText(text) {
        // 正则：匹配长度大于1的英文单词
        return text.replace(/\b([a-zA-Z]{2,})\b/g, (match) => {
            let boldLength = 1;
            if (match.length === 3) boldLength = 2;
            else if (match.length > 3) boldLength = Math.ceil(match.length * 0.4);

            const boldPart = match.substring(0, boldLength);
            const normalPart = match.substring(boldLength);

            // 使用带 class 的 b 标签
            return `<b class="bionic-highlight">${boldPart}</b>${normalPart}`;
        });
    }

    function processNode(node) {
        // 检查父节点
        const parent = node.parentNode;
        if (!parent || EXCLUDE_TAGS.has(parent.tagName) || parent.isContentEditable || parent.classList.contains('bionic-highlight')) {
            return;
        }

        // 检查是否已经是处理过的节点 (防止无限递归)
        if (parent.dataset.bionicProcessed) return;

        const text = node.nodeValue;
        if (!text || !/[a-zA-Z]{2,}/.test(text)) return;

        // 创建新容器替换文本节点
        const span = document.createElement('span');
        span.className = 'bionic-processed';
        span.dataset.bionicProcessed = "true"; // 标记防止重复
        span.innerHTML = processText(text);

        parent.replaceChild(span, node);
    }

    function runBionicReading(root = document.body) {
        console.log('Bionic Reading: Running...');
        const treeWalker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const nodes = [];
        while (treeWalker.nextNode()) {
            nodes.push(treeWalker.currentNode);
        }

        // 仅处理大部分正文内容 (P, DIV, SPAN, LI, TD, H1-H6)
        // 过滤掉极其细碎的节点以提高性能
        nodes.forEach(node => {
            if(node.nodeValue.trim().length > 1) {
                processNode(node);
            }
        });
    }

    // 3. 添加手动按钮
    const btn = document.createElement('div');
    btn.id = 'bionic-trigger-btn';
    btn.textContent = '⚡';
    btn.title = '强制刷新仿生阅读';
    btn.onclick = () => runBionicReading(document.body);
    document.body.appendChild(btn);

    // 4. 初始运行
    setTimeout(() => runBionicReading(), 1000); // 延迟1秒等待页面稳定

    // 5. 监听动态变化 (防抖)
    let timeout;
    const observer = new MutationObserver((mutations) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            runBionicReading(); // 简单粗暴：有变化就重新扫描全文(性能妥协以换取兼容性)
        }, 1500);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();