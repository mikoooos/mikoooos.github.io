let videoPlayer = document.getElementById("videoPlayer");
let videoSource = document.getElementById("videoSource");
let videoList = [];
let currentIndex = 0;

// 1. 从 JSON 文件加载视频列表
fetch("videos.json")
    .then(response => response.json())
    .then(data => {
        videoList = data;
        if (videoList.length > 0) {
            loadVideo(0); // 加载第一集
        }
    })
    .catch(error => console.error("加载视频列表失败:", error));

// 2. 加载指定索引的视频
function loadVideo(index) {
    if (index >= 0 && index < videoList.length) {
        currentIndex = index;
        videoSource.src = videoList[currentIndex].url;
        videoPlayer.load();
        videoPlayer.play();
    }
}

// 3. 上一集
function prevVideo() {
    if (currentIndex > 0) {
        loadVideo(currentIndex - 1);
    }
}

// 4. 下一集
function nextVideo() {
    if (currentIndex < videoList.length - 1) {
        loadVideo(currentIndex + 1);
    }
}

// 5. 监听视频播放完毕，自动播放下一集
videoPlayer.addEventListener("ended", function() {
    if (currentIndex < videoList.length - 1) {
        nextVideo();
    }
});

// 6. 切换全屏模式
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        videoPlayer.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// 7. 切换小窗模式（Picture-in-Picture）
async function togglePip() {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
    } else if (videoPlayer.requestPictureInPicture) {
        await videoPlayer.requestPictureInPicture();
    }
}
