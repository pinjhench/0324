import { useState, useEffect, useRef } from 'react'
import { Carousel } from 'antd'
import 'antd/dist/reset.css' // 加入樣式
import './App.css'
import mqtt from 'mqtt';


const options = {
    protocol: 'wss',
    host: '537fa29a0f234fec89c4fdd99aa996a3.s1.eu.hivemq.cloud',
    port: 8884,
    username: 'pubnsub',
    password: 'Qup35p._',
    path: '/mqtt'
}


function App() {
  const [count, setCount] = useState(0)
  const clientRef = useRef(null); // 用來存放連線，不會觸發重新渲染
  
// initialize the MQTT client
useEffect(() => {
const connectUrl = `${options.protocol}://${options.host}:${options.port}${options.path}`
const client = mqtt.connect(connectUrl, options)
clientRef.current = client; // 存入 ref

// setup the callbacks
client.on('connect', function () {
    console.log('Connected');
    // subscribe to topic 'my/test/topic'
client.subscribe('my/test/topic');
// publish message 'Hello' to topic 'my/test/topic'
client.publish('my/test/topic', 'Hello')
    })

client.on('error', function (error) {
    console.log(error);
})

client.on('message', function (topic, message) {
    // called each time a message is received
    console.log('Received message:', topic, message.toString())
})
return () => {
      if (client) {
        console.log('🔌 Disconnecting...')
        client.end()
      }
    }
  }, [])

const handlePublish = () => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish('my/test/topic', `目前計數是：${count}`);
      console.log('訊息已送出');
    } else {
      console.log('MQTT 尚未連線')
    }
    };




const contentStyle = {
  height: '200px',
  color: '#fff',
  lineHeight: '200px',
  textAlign: 'center',
  background: '#141414',
  fontSize: '24px',
  border: '1px solid #c8a97e'
};

  return (
    <>
    
      <Carousel autoplay>
        <div><h3 style={contentStyle}>1 - 好耶有成功</h3></div>
        <div><h3 style={contentStyle}>2 - 這是用 Ant Design 做的</h3></div>
        <div><h3 style={contentStyle}>3 - 自動播放跑馬燈中</h3></div>
      </Carousel>
      
      <section id="center" style={{ padding: '50px', textAlign: 'center' }}>
        <h1>Vite + React + AntD + Mqtt</h1>
        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
        {/* 新增一個按鈕來測試手動發送訊息 */}
        <button onClick={handlePublish} style={{ backgroundColor: '#c8a97e', color: 'white' }}>
          發送目前計數到 MQTT
        </button>
      </section>
    </>
  )
}

export default App