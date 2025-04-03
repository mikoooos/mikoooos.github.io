let videoPlayer = document.getElementById("videoPlayer");
let videoSource = document.getElementById("videoSource");
let videoListElement = document.getElementById("videoList");
let videoList = [];
let currentIndex = 0;

// 1. 从 JSON 加载视频列表
fetch("videos.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP 错误！状态码: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("成功加载视频列表:", data);
        videoList = data;
        if (videoList.length > 0) {
            loadVideo(0);
        }
        renderPlaylist();
    })
    .catch(error => console.error("加载视频列表失败:", error));

// 2. 加载指定索引的视频
function loadVideo(index) {
    if (index >= 0 && index < videoList.length) {
        currentIndex = index;
        videoSource.src = videoList[currentIndex].url;
        videoPlayer.load();
        videoPlayer.play();
        updateActiveVideo();
    }
}

// 3. 生成剧集列表
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

// 4. 更新选中的剧集
function updateActiveVideo() {
    let items = document.querySelectorAll(".playlist li");
    items.forEach((item, index) => {
        item.classList.toggle("active", index === currentIndex);
    });
}

// 5. 上一集
function prevVideo() {
    if (currentIndex > 0) {
        loadVideo(currentIndex - 1);
    }
}

// 6. 下一集
function nextVideo() {
    if (currentIndex < videoList.length - 1) {
        loadVideo(currentIndex + 1);
    }
}

// 7. 监听视频播放完毕，自动播放下一集
videoPlayer.addEventListener("ended", function() {
    if (currentIndex < videoList.length - 1) {
        nextVideo();
    }
});

// 8. 切换全屏
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        videoPlayer.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// 9. 小窗播放
async function togglePip() {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
    } else if (videoPlayer.requestPictureInPicture) {
        await videoPlayer.requestPictureInPicture();
    }
}