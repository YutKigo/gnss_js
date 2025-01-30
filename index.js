import { SerialPort } from 'serialport';
import { WebSocketServer } from 'ws';

/* WebSocket サーバー作成 */
const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
});

/* シリアルポートを使用 */
const port = new SerialPort({
    path: '/dev/tty.usbmodem101', 
    baudRate: 9600,  // Corrected to 'baudRate'
    dataBits: 8,
    stopBits: 1,
    parity: 'none'
});

/* 緯度と経度を定義 */
const latitude = 0;;
const longitude = 0;

/* シリアルを開く *//*
port.on('open', () => {  // Corrected to 'open' event
    console.log('Serial port opened!');
});*/

/* 取得したシリアルデータを受け取り続け、一定間隔で実行される関数 */
let buffer = '';
port.on('data', (data) => {
    buffer += data.toString('utf-8');

    // $GNGGA フレームが含まれている場合に処理
    const gnggaStartIndex = buffer.indexOf('$GNGGA');
    if (gnggaStartIndex !== -1) {
        const gnggaFrame = buffer.slice(gnggaStartIndex, buffer.indexOf('*', gnggaStartIndex) + 3);
        const [latitude, longitude] = parseNmeaData(gnggaFrame);
        console.log(`緯度: ${latitude}, 経度: ${longitude}`);

         // すべてのクライアントに送信
         wss.clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(JSON.stringify({ latitude, longitude }));
            }
        });

        // バッファをクリア
        buffer = '';
    }
});

wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
});

/* NMEAデータを解析して、[緯度, 経度]配列を返す */
const preData = [];
function parseNmeaData(nmeaData) {
    const dataStrings = nmeaData.toString().split(",");
    //console.log(dataStrings);
    console.log(`緯度: ${dataStrings[2]}, 経度: ${dataStrings[4]}`);
    if(dataStrings[2] === '' || dataStrings[4] === '') {
        dataStrings[2] = 0;
        dataStrings[4] = 0;
    }
    if(dataStrings[2] === undefined || dataStrings[4] === undefined) {
        return preData;
    }
    preData[0] = parseFloat(dataStrings[2])/10
    preData[1] = parseFloat(dataStrings[4])/100;
    return [parseFloat(dataStrings[2])/100, parseFloat(dataStrings[4])/100];
}






