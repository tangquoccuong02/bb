/*
CHỖ DÁN LINK FORMSPREE:
1. Vào Formspree tạo form.
2. Copy link dạng: https://formspree.io/f/xxxxxxx
3. Dán vào dòng FORMSPREE_ENDPOINT bên dưới.
Ví dụ:
const FORMSPREE_ENDPOINT = "https://formspree.io/f/abcxyz";
*/
const FORMSPREE_ENDPOINT = "DAN_LINK_FORMSPREE_CUA_BAN_VAO_DAY";

const flowerData = {
    "Hoa hồng": { video: "hoahong.mp4", music: "nhachoahong.mp3", icon: "🌹", text: "Chang đã chọn hoa hồng" },
    "Hoa hướng dương": { video: "hoahuongduong.mp4", music: "nhachoahuongduong.mp3", icon: "🌻", text: "Chang đã chọn hoa hướng dương" },
    "Hoa tulip": { video: "hoatulip.mp4", music: "nhachoatulip.mp3", icon: "🌷", text: "Chang đã chọn hoa tulip" },
    "Hoa giấy": { video: "hoagiay.mp4", music: "nhachoagiay.mp3", icon: "🌺", text: "Chang đã chọn hoa giấy" }
};

const screens = {
    start: document.getElementById("startScreen"),
    loading: document.getElementById("loadingScreen"),
    chat: document.getElementById("chatScreen"),
    video: document.getElementById("videoScreen"),
    thanks: document.getElementById("thanksScreen"),
    end: document.getElementById("endScreen")
};

const envelopeBtn = document.getElementById("envelopeBtn");
const rabbitRunner = document.getElementById("rabbitRunner");
const loadingFill = document.getElementById("loadingFill");
const loadingText = document.getElementById("loadingText");
const chatBody = document.getElementById("chatBody");
const answerArea = document.getElementById("answerArea");
const flowerVideo = document.getElementById("flowerVideo");
const flowerMusic = document.getElementById("flowerMusic");
const videoIcon = document.getElementById("videoIcon");
const videoTitle = document.getElementById("videoTitle");

let selectedFlower = "";
let chatStarted = false;

function showScreen(name){
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
}

function random(min,max){ return Math.random() * (max-min) + min; }

function createFloating(){
    const layer = document.getElementById("floatingLayer");
    const icons = ["🌸","🌼","✦","♡","🌷","🌿"];
    const item = document.createElement("span");
    item.className = "float-icon";
    item.innerHTML = icons[Math.floor(Math.random()*icons.length)];
    item.style.left = Math.random()*100 + "vw";
    item.style.fontSize = random(14,28) + "px";
    item.style.animationDuration = random(7,13) + "s";
    layer.appendChild(item);
    setTimeout(()=>item.remove(),14000);
}
setInterval(createFloating,430);

function launchEnvelope(){
    screens.start.classList.add("opening");
    for(let i=0;i<8;i++){
        const h=document.createElement("div");
        h.className='mail-mini-heart';
        h.innerHTML='♡';
        h.style.setProperty('--x',(-70+Math.random()*140)+'px');
        h.style.fontSize=(15+Math.random()*16)+'px';
        envelopeBtn.appendChild(h);
        setTimeout(()=>h.remove(),1600);
    }
    setTimeout(startLoading, 1180);
}

function startLoading(){
    showScreen("loading");
    let percent = 0;
    loadingFill.style.width = "0%";
    loadingText.innerText = "0%";
    rabbitRunner.style.left = "0px";

    const timer = setInterval(()=>{
        percent += 1.1 + Math.random() * 2.3;
        if(percent >= 100){
            percent = 100;
            clearInterval(timer);
            setTimeout(()=>{
                showScreen("chat");
                startChatStory();
            },650);
        }
        loadingFill.style.width = percent + "%";
        loadingText.innerText = Math.floor(percent) + "%";
        const world = document.querySelector(".rabbit-world");
        const maxMove = world.clientWidth - rabbitRunner.clientWidth - 24;
        rabbitRunner.style.left = Math.max(0, maxMove * percent / 100) + "px";
    },72);
}

function addMessage(text, side="left", delay=0){
    setTimeout(()=>{
        const msg = document.createElement("div");
        msg.className = "bubble-msg " + side;
        msg.innerHTML = text;
        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, delay);
}

function startChatStory(){
    if(chatStarted) return;
    chatStarted = true;
    addMessage("Chào Chang 👋", "left", 250);
    addMessage("Hôm nay anh có một câu hỏi nhỏ thôi.", "left", 1050);
    addMessage("Chang thích loại hoa nào nhất trong 4 loại hoa này?", "left", 1900);
    setTimeout(()=> answerArea.classList.add("show"), 2750);
}

function openFlower(flower){
    selectedFlower = flower;
    const data = flowerData[flower];
    flowerVideo.pause();
    flowerMusic.pause();
    flowerVideo.src = data.video;
    flowerMusic.src = data.music;
    if(videoIcon) videoIcon.innerText = data.icon;
    if(videoTitle) videoTitle.innerText = data.text;
    showScreen("video");
    setTimeout(()=>{
        flowerVideo.play().catch(()=>{});
        flowerMusic.volume = .75;
        flowerMusic.play().catch(()=>{});
    },260);
}

function stopVideo(){
    flowerVideo.pause();
    flowerMusic.pause();
    flowerVideo.currentTime = 0;
    flowerMusic.currentTime = 0;
}
function backToChat(){ stopVideo(); showScreen("chat"); }
function chooseFlower(){
    stopVideo();
    sendToFormspree({ flower: selectedFlower, action: "Đã bấm chọn loại hoa" });
    showScreen("thanks");
}
function finalReply(reply){
    sendToFormspree({ flower: selectedFlower, final_reply: reply, action: "Đã trả lời phần cuối" });
    showScreen("end");
    setTimeout(()=>{
        window.close();
        document.body.innerHTML = `<div style="width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#fff6c9,#ffe2f0,#dff8ff);font-family:Arial;text-align:center;padding:25px;color:#ff6aa9;"><div><div style="font-size:62px">🌼</div><h2>Cảm ơn Chang nha</h2><p style="color:#735664">Nhớ xem nha 🌼</p></div></div>`;
    },1200);
}

function sendToFormspree(data){
    if(!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.includes("DAN_LINK_FORMSPREE")){
        console.log("Chưa dán link Formspree:", data);
        return;
    }
    fetch(FORMSPREE_ENDPOINT, {
        method:"POST",
        headers:{"Content-Type":"application/json","Accept":"application/json"},
        body:JSON.stringify({ ...data, time:new Date().toLocaleString("vi-VN") })
    }).catch(err=>console.log("Formspree lỗi:",err));
}

envelopeBtn.addEventListener("click", launchEnvelope);
envelopeBtn.addEventListener("keydown", (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); launchEnvelope(); } });
document.querySelectorAll(".flower-choice").forEach(btn=> btn.addEventListener("click",()=> openFlower(btn.dataset.flower)) );
document.getElementById("backBtn").addEventListener("click", backToChat);
document.getElementById("chooseBtn").addEventListener("click", chooseFlower);
document.querySelectorAll(".final-btn").forEach(btn=> btn.addEventListener("click",()=> finalReply(btn.dataset.reply)) );
