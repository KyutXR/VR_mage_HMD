import { useEffect, useState, useRef } from "react";
import type {
  StageData,
  PlayerData,
  GimickData,
  DataMessage,
} from "../types/websocket";

const useWebsocket = (roomId: string) => {
  const [stage, setStage] = useState<StageData | null>(null);
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [onOff, setOnOff] = useState<boolean | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null
  );
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomId) return;

    setError(null);

    // WebSocket の URL
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    
    // デバッグログ: 環境変数の確認
    console.log("🛠️ env WS_BASE_URL:", import.meta.env.VITE_WS_BASE_URL);
    console.log("🛠️ env WS_PROTOCOL:", import.meta.env.VITE_WS_PROTOCOL);
    
    let baseUrl = import.meta.env.VITE_WS_BASE_URL || "localhost:8080";
    if (isLocalhost) {
      baseUrl = "localhost:8080";
    }
    baseUrl = baseUrl.replace(/^(https?|wss?):\/\//, "").replace(/\/$/, "");
    const protocol = isLocalhost ? "ws" : (import.meta.env.VITE_WS_PROTOCOL || "ws");
    
    const wsUrl = `${protocol}://${baseUrl}/mobile/${roomId}`;
    console.log(`🔌 Connecting to WebSocket: ${wsUrl} (isLocalhost: ${isLocalhost})`);
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    // タイムアウト設定（10秒間ステージデータが来なければエラー）
    const timeoutId = setTimeout(() => {
      setStage((prev) => {
        if (prev === null) {
          setError("取得に失敗しました（タイムアウト）");
        }
        return prev;
      });
    }, 10000);

    // 接続成功
    socket.onopen = () => {
      console.log(`✅ Connected to room: ${roomId}`);
      setIsConnected(true);
    };

    // メッセージ受信
    socket.onmessage = (event) => {
      try {
        // 複数のJSONが連結されている場合に対応するため、改行で分割
        const messages = event.data
          .split("\n")
          .filter((msg: string) => msg.trim() !== "");

        messages.forEach((messageStr: string) => {
          try {
            const data: DataMessage = JSON.parse(messageStr);
            console.log("📬 Message received:", data);
            console.log("Message type:", data.type);

            switch (data.type) {
              case "stage":
                setStage(data.content as StageData);
                console.log("📬 Stage data updated:", data.content);
                break;
              case "player":
                setPlayer(data.content as PlayerData);
                console.log("📬 Player data updated:", data.content);
                break;
              case "gimick": {
                const gimickData = data.content as GimickData;
                switch (gimickData.gimick) {
                  case "onOff":
                    setOnOff(gimickData.data);
                    console.log("📬 Gimick data updated:", gimickData);
                    break;
                }
                break;
              }
              default:
                console.warn("⚠️ Unknown message type:", data.type);
            }
          } catch (parseError) {
            console.error(
              "❌ Error parsing individual message:",
              parseError,
              "Message:",
              messageStr
            );
          }
        });
      } catch (error) {
        console.error(
          "❌ Error processing message:",
          error,
          "Message:",
          event.data
        );
      }
    };

    // エラー処理
    socket.onerror = (err) => {
      console.error("❌ WebSocket Error:", err);
      setError("取得に失敗しました（通信エラー）");
    };

    // 切断処理
    socket.onclose = (event) => {
      console.warn(`⚠️ WebSocket closed: ${event.code}, ${event.reason}`);
      setIsConnected(false);
      setStage((prev) => {
        if (prev === null) {
          setError("取得に失敗しました（切断されました）");
        }
        return prev;
      });
    };

    // クリーンアップ（コンポーネントがアンマウントされたとき）
    return () => {
      clearTimeout(timeoutId);
      console.log(`🔌 Disconnecting from room: ${roomId}`);
      socket.close();
    };
  }, [roomId]); // roomId が変更されるたびに WebSocket 接続を再作成

  // カメラ許可リクエスト
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setCameraPermission(true);
      sendCameraOnRequest();
    } catch (error) {
      console.error("❌ Camera permission denied:", error);
      setCameraPermission(false);
    }
  };

  // カメラONリクエスト送信
  const sendCameraOnRequest = () => {
    const message = JSON.stringify({
      type: "camera",
      content: { status: "on" },
      from: "mobile",
    });
    sendMessage(message);
  };

  // メッセージ送信
  const sendMessage = (message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.warn("❌ WebSocket is not open");
    }
  };

  return {
    stage,
    player,
    onOff,
    error,
    sendMessage,
    isConnected,
    cameraPermission,
    requestCameraPermission,
    sendCameraOnRequest,
  };
};

export default useWebsocket;
