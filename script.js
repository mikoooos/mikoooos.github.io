let videoPlayer = document.getElementById("videoPlayer");
let videoSource = document.getElementById("videoSource");
let videoListElement = document.getElementById("videoList");
let videoList = [];
let currentIndex = 0;

// 1. 加载 JSON 剧集列表
fetch("videos.json")
    .then(response => response.json())
    .then(data => {
        console.log("视频列表加载成功:", data);
        videoList = data;
        if (videoList.length > 0) {
            loadVideo(0);
        }
        renderPlaylist();
    })
    .catch(error => console.error("视频列表加载失败:", error));

// 2. 加载指定视频
function loadVideo(index) {
    if (index >= 0 && index < videoList.length) {
        currentIndex = index;
        videoSource.src = videoList[currentIndex].url;
        videoPlayer.load();
        videoPlayer.play();
        updateActiveVideo();
    }
}

// 3. 渲染剧集列表
function renderPlaylist() {
    videoListElement.innerHTML = "";
    videoList.forEach((video, index) => {
        let li = document.createElement("li");
        li.textContent = video.title;
        li.onclick = () => loadVideo(index);
        if (index === currentIndex) {
            li.classList.add("active");
        }
        videoListElement.appendChild(li);
    });
}

// 4. 更新高亮状态
function updateActiveVideo() {
    let items = document.querySelectorAll(".playlist li");
    items.forEach((item, index) => {
        item.classList.toggle("active", index === currentIndex);
    });
}

// 5. 上一集 / 下一集
function prevVideo() { if (currentIndex > 0) loadVideo(currentIndex - 1); }
function nextVideo() { if (currentIndex < videoList.length - 1) loadVideo(currentIndex + 1); }

// 6. 监听播放结束，自动播放下一集
videoPlayer.addEventListener("ended", () => nextVideo());

// 7. 全屏 & 小窗模式
function toggleFullScreen() {
    document.fullscreenElement ? document.exitFullscreen() : videoPlayer.requestFullscreen();
}
async function togglePip() {
    document.pictureInPictureElement ? document.exitPictureInPicture() : await videoPlayer.requestPictureInPicture();
}