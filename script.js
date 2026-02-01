/**
 * 強化的影片 ID 提取邏輯
 * 支援: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID
 */
function extractVideoId(url) {
    if (!url) return false;
    url = url.trim();
    
    try {
        const urlObj = new URL(url);
        
        // 處理 youtu.be 短網址
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.substring(1).split(/[?#]/)[0];
        }
        
        // 處理 youtube.com 網址
        if (urlObj.hostname.includes('youtube.com')) {
            // 1. 標準網址包含 v= 參數 (不管參數位置)
            if (urlObj.searchParams.has('v')) {
                return urlObj.searchParams.get('v');
            }
            
            // 2. 處理路徑形式 (shorts, embed, v)
            const pathSegments = urlObj.pathname.split('/');
            const typeIndex = pathSegments.findIndex(s => ['shorts', 'embed', 'v'].includes(s));
            if (typeIndex !== -1 && pathSegments[typeIndex + 1]) {
                return pathSegments[typeIndex + 1];
            }
        }
    } catch (e) {
        // 如果 URL 構造失敗，嘗試用正則做最後補救
        const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
        if (match) return match[1];
    }
    return false;
}

function getThumbnails() {
    const urlInput = document.getElementById('videoUrl').value;
    const videoId = extractVideoId(urlInput);
    const errorMsg = document.getElementById('errorMessage');
    const results = document.getElementById('results');
    const emptyState = document.getElementById('emptyState');
    const maxResHint = document.getElementById('maxResHint');

    if (!videoId) {
        errorMsg.classList.remove('hidden');
        results.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    errorMsg.classList.add('hidden');
    emptyState.classList.add('hidden');
    results.classList.remove('hidden');
    maxResHint.innerText = "解析度: 1280 x 720 (若影片支援)";

    const images = {
        maxRes: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        sd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        def: `https://img.youtube.com/vi/${videoId}/default.jpg`
    };

    // 更新預覽圖與連結
    document.getElementById('maxResImg').src = images.maxRes;
    document.getElementById('maxResLink').href = images.maxRes;
    
    document.getElementById('sdImg').src = images.sd;
    document.getElementById('sdLink').href = images.sd;
    
    document.getElementById('hqImg').src = images.hq;
    document.getElementById('hqLink').href = images.hq;
    
    document.getElementById('mqImg').src = images.mq;
    document.getElementById('mqLink').href = images.mq;
    
    document.getElementById('defImg').src = images.def;
    document.getElementById('defLink').href = images.def;

    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // 處理 MaxRes 可能不存在的情況 (回傳 404 時)
    const maxResImg = document.getElementById('maxResImg');
    maxResImg.onerror = function() {
        this.src = images.hq; // 降級顯示
        maxResHint.innerText = "提示: 該影片不支援 1280x720 封面，已顯示 HQ 版本";
    };
}

function clearInput() {
    document.getElementById('videoUrl').value = '';
    document.getElementById('results').classList.add('hidden');
    document.getElementById('emptyState').classList.remove('hidden');
    document.getElementById('errorMessage').classList.add('hidden');
}

function copyToClipboard(imgId) {
    const imgSrc = document.getElementById(imgId).src;
    const dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.value = imgSrc;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    const toast = document.getElementById('toast');
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2000);
}

document.getElementById('videoUrl').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getThumbnails();
    }
});

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}
