const canvas = document.getElementById('canvas');
const startButton = document.getElementById('start-button');
const targetButton = document.getElementById('target-decide-button');
const startDecideButton = document.getElementById('start-decide-button');

const ctx = canvas.getContext('2d');
const ws = new WebSocket('ws://localhost:8080');

canvas.style.visibility = 'hidden'; //最初キャンバスは非表示

let baseLatitude = null;
let baseLongitude = null;
let targetLatitude = null; // 的の緯度
let targetLongitude = null; // 的の経度

let isTargetMode = false; // ターゲット指定モードかどうか
let isStartMode = false; // スタート位置指定モードかどうか
let isPlaying = false; // ゲーム中かどうか

let scaling = 5000; // スケーリング係数
let threshold = 200; // 停止判定を行う閾値

let markerX = 400;
let markerY = 750;

// Decide Target Positionボタンを押して的の位置を指定
targetButton.addEventListener('click', () => {
    isTargetMode = true;
});

// Decide Start Positionボタンを押して投げる位置を指定
startDecideButton.addEventListener('click', () => {
    isStartMode = true;
});

// スタートボタンを押してゲーム開始（キャンバス表示）
startButton.addEventListener('click', () => {
    isPlaying = true;
    canvas.style.visibility = 'visible'; // キャンバスを表示
});

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const longitude = data.longitude;
    const latitude = data.latitude;

    // 的の位置指定
    if(isTargetMode) {
        if(targetLatitude === null || targetLongitude === null) {
            targetLatitude = latitude;
            targetLongitude = longitude;
            console.log(`${targetLatitude}:${targetLongitude}`);
        }
        isTargetMode = false;
    }

    // スタートの位置指定
    if(isStartMode) {
        if(baseLatitude === null || baseLongitude === null) {
            baseLatitude = latitude;
            baseLongitude = longitude;
            console.log(`${baseLatitude}:${baseLongitude}`);
        }
        isStartMode = false;
    }

    
    // ゲーム開始
    if (isPlaying && baseLatitude !== null && baseLongitude !== null){
    
    }
};

// 現在の位置マーカーを描画
function drawMarker(x, y) {

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2, false); // マーカー
    ctx.fillStyle = 'blue';
    ctx.fill();
}

// 的を描画
function drawTarget(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2, false); // マーカー
    ctx.fillStyle = 'red';
    ctx.fill();
}

/*
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const ws = new WebSocket('ws://localhost:8080');

let baseLatitude = null;
let baseLongitude = null;
let scaleFactorLat = 1000000;  // 緯度のスケール調整
let scaleFactorLon = 1000000;  // 経度のスケール調整（緯度ごとに補正）
let smoothFactor = 0.2; // 移動平均フィルタの影響度（0.1〜0.5で調整）

// 軌跡用の座標リスト
let path = [];

// 直前の描画座標を記録
let smoothedX = 0;
let smoothedY = 0;

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const latitude = data.latitude;
    const longitude = data.longitude;

    if (latitude === 0 || longitude === 0) return;  // 無効なデータを無視

    // 最初の緯度経度を基準点に設定
    if (baseLatitude === null || baseLongitude === null) {
        baseLatitude = latitude;
        baseLongitude = longitude;
        scaleFactorLon = scaleFactorLat * Math.cos(baseLatitude * (Math.PI / 180)); // 経度スケール補正
    }

    // 緯度・経度の相対変化量を求め、スケーリング
    const rawX = (longitude - baseLongitude) * scaleFactorLon;
    const rawY = (latitude - baseLatitude) * scaleFactorLat;

    // 移動平均フィルタでスムージング
    smoothedX = smoothedX * (1 - smoothFactor) + rawX * smoothFactor;
    smoothedY = smoothedY * (1 - smoothFactor) + rawY * smoothFactor;

    // 軌跡を記録
    path.push({ x: smoothedX, y: smoothedY });

    // 描画
    drawPath();
    drawMarker(smoothedX, smoothedY);
};

// 軌跡を描画
function drawPath() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 初期化せずに上書き描画
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    for (let i = 0; i < path.length - 1; i++) {
        ctx.moveTo(canvas.width / 2 + path[i].x, canvas.height / 2 - path[i].y);
        ctx.lineTo(canvas.width / 2 + path[i + 1].x, canvas.height / 2 - path[i + 1].y);
    }
    ctx.stroke();
}

// 現在の位置マーカーを描画
function drawMarker(x, y) {
    ctx.beginPath();
    ctx.arc(canvas.width / 2 + x, canvas.height / 2 - y, 10, 0, Math.PI * 2, false);
    ctx.fillStyle = 'red';
    ctx.fill();
}*/

