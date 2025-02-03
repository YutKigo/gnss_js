/*最初に取得した緯度経度を基準点とし、基準点からの相対変化量で位置を推定し描画する*/
const canvas = document.getElementById('canvas');
const startButton = document.getElementById('start-button');
const decideTargetButton = document.getElementById('target-decide-button');
const ctx = canvas.getContext('2d');
const ws = new WebSocket('ws://localhost:8080');

let baseLatitude = null;
let baseLongitude = null;
let targetLatitude = null;
let targetLongitude = null;

let scaleFactorLat = 1000000;  // 緯度のスケール調整
let scaleFactorLon = 1000000;  // 経度のスケール調整（緯度ごとに補正）
let smoothFactor = 0.2; // 移動平均フィルタの影響度（0.1〜0.5で調整）

let isTarget = false;

// 軌跡用の座標リスト
let path = [];

// 直前の描画座標を記録
let smoothedX = 0;
let smoothedY = 0;
let targetSmoothedX = 0;
let targetSmoothedY = 0;

startButton.addEventListener('click', () => {
    isPlaying = true;
});

decideTargetButton.addEventListener('click', () => {
    isTarget = true;
}); 

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

    // 的の設定モード
    if (isTarget && (targetLatitude === null || targetLongitude === null)) {
        targetSmoothedX = smoothedX;
        targetSmoothedY = smoothedY;
        isTarget = false;
    }

    // 描画
    drawPath();
    drawStone(smoothedX, smoothedY);
    if (!(targetSmoothedX === null || targetSmoothedY === null)) {
        drawTarget(targetSmoothedX, targetSmoothedY);
    }
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

// 現在の位置にストーンを描画
function drawStone(x, y) {
    ctx.beginPath();
    ctx.arc(canvas.width / 2 + x, canvas.height / 2 - y, 10, 0, Math.PI * 2, false);
    ctx.fillStyle = 'red';
    ctx.fill();
}
    
// 現在の位置にストーンを描画
function drawTarget(x, y) {
    ctx.beginPath();
    ctx.arc(canvas.width / 2 + x, canvas.height / 2 - y, 10, 0, Math.PI * 2, false);
    ctx.fillStyle = 'blue';
    ctx.fill();
}

/*最初に取得した緯度経度を基準点とし、基準点からの相対変化量で位置を推定し描画する*/
/*
const canvas = document.getElementById('canvas');
const decideTargetButton = document.getElementById('target-decide-button');
const ctx = canvas.getContext('2d');
const ws = new WebSocket('ws://localhost:8080');

let baseLatitude = null;
let baseLongitude = null;

let scaleFactorLat = 2000000;  // 緯度スケール調整
let scaleFactorLon = 2000000;  // 経度スケール調整（緯度による補正）

let path = [];
let targetX = null;
let targetY = null;
let isTarget = false;

let map;
let marker;

decideTargetButton.addEventListener('click', () => {
    isTarget = true;
}); 

// 地図を初期化する関数
function initMap() {
    // 地図を指定した座標で初期化
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 35.6895, lng: 139.6917 }, // 初期表示位置（東京）
      zoom: 15
    });

    // マーカーを作成（仮の位置で初期化）
    marker = new google.maps.Marker({
      position: { lat: 35.6895, lng: 139.6917 },
      map: map,
      title: "赤い点"
    });
}

// シリアルから緯度経度を受け取って地図にマーカーを移動
function updateMarker(lat, lng) {
    const position = new google.maps.LatLng(lat, lng);
    marker.setPosition(position); // マーカーの位置を更新
    map.setCenter(position); // 地図の中央を更新
}

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const latitude = data.latitude;
    const longitude = data.longitude;

    //if (latitude === 0 || longitude === 0) return;  // 無効データを無視

    // マーカーを作成（仮の位置で初期化）
    marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: "赤い点"
      });
};*/
/*
const ws = new WebSocket('ws://localhost:8080');

let map;
let marker;
let circle;

// 地図を初期化する関数
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 34.808000, lng: 135.561500 }, 
        zoom: 22
    });

    // 円を初期化
    circle = new google.maps.Circle({
        map: map,
        radius: 2, // 2mの円
        fillColor: "#0000FF",
        fillOpacity: 0.3,
        strokeColor: "#0000FF",
        strokeOpacity: 0.8,
        strokeWeight: 2
    });

    //circle.bindTo('center', marker, 'position'); // 円をマーカーに結びつける
}

// 位置情報を更新する関数
function updatePosition(lat, lng) {
    const position = new google.maps.LatLng(lat, lng);

    map.setCenter(position); // 地図の中心を更新
    circle.setCenter(position); // 円の位置を更新
}

// WebSocketから緯度経度を受信
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const latitude = data.latitude;
    const longitude = data.longitude;
    console.log(`緯度: ${latitude}, 経度: ${longitude}`);


    if (latitude !== 0 && longitude !== 0) {
        updatePosition(latitude, longitude);
    }
};

// Google Maps APIのロード後に初期化
window.initMap = initMap;





      

      // ここでシリアル通信から緯度経度を受け取ってupdateMarker関数を呼び出します
      // 以下はシリアル通信の例（既に作成済みとのことなので簡略化しています）
      // シリアル通信部分で緯度経度を取得したら、updateMarker(lat, lng)を呼び出す
      // 例:
      // updateMarker(receivedLatitude, receivedLongitude);


      /*
      // 初回データを基準点として設定
    if (baseLatitude === null || baseLongitude === null) {
        baseLatitude = latitude;
        baseLongitude = longitude;
        scaleFactorLon = scaleFactorLat * Math.cos(baseLatitude * (Math.PI / 180)); // 経度スケール補正
    }

    // 緯度経度 → キャンバス座標へ変換
    const x = (longitude - baseLongitude) * scaleFactorLon + canvas.width / 2;
    const y = canvas.height / 2 - (latitude - baseLatitude) * scaleFactorLat;

    // 座標の変化がない場合、描画をスキップ
    if (path.length > 0 && Math.abs(path[path.length - 1].x - x) < 1 && Math.abs(path[path.length - 1].y - y) < 1) {
        return;
    }

    // 軌跡を保存
    path.push({ x, y });

    // 的の設定
    if (isTarget && targetX === null && targetY === null) {
        targetX = x;
        targetY = y;
        isTarget = false;
    }

    // 描画
    drawCanvas(x, y);
    
    
// 描画処理
function drawCanvas(currentX, currentY) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 描画の更新

    // 軌跡の描画
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    for (let i = 0; i < path.length - 1; i++) {
        ctx.moveTo(path[i].x, path[i].y);
        ctx.lineTo(path[i + 1].x, path[i + 1].y);
    }
    ctx.stroke();

    // 現在の位置
    ctx.beginPath();
    ctx.arc(currentX, currentY, 10, 0, Math.PI * 2, false);
    ctx.fillStyle = 'red';
    ctx.fill();

    // 目標地点
    if (targetX !== null && targetY !== null) {
        ctx.beginPath();
        ctx.arc(targetX, targetY, 10, 0, Math.PI * 2, false);
        ctx.fillStyle = 'blue';
        ctx.fill();
    }
}
*/
