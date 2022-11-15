import { useCallback, useMemo, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import JSONPretty from 'react-json-pretty';
import JSONPrettyMon from 'react-json-pretty/dist/monikai';

import './App.css';

export default function App () {
  const socketUrl = 'wss://stream.binance.com:9443/stream';

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl,
  );

  const messageHistory = useRef([]);

  messageHistory.current = useMemo(
    () => messageHistory.current.concat(lastJsonMessage ?? []),
    [lastJsonMessage],
  );

    console.log(lastJsonMessage);

  const handleClickSendMessage = useCallback(
    () =>
      sendJsonMessage({
        method: 'SUBSCRIBE',
        params: ['dogeaud@ticker'],
        id: 1,
      }),
    [sendJsonMessage],
  );

  const handleClickUnSendMessage = useCallback(
    () =>
      sendJsonMessage({
        method: 'UNSUBSCRIBE',
        params: ['dogeaud@ticker'],
        id: 1,
      }),
    [sendJsonMessage],
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div className="App">
      <h1>WebsSocket Testing</h1>
      <h2>Start editing to see some magic happen!</h2>
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Subscribe
      </button>
      <button
        onClick={handleClickUnSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Unsubscribe
      </button>
      <p>The WebSocket is currently {connectionStatus}</p>

      <h1 style={{color: connectionStatus === 'Closed' ? 'red' : 'black'}}>{connectionStatus}</h1>

      {lastJsonMessage ? (
        <h3>
          Last message:{' '}
          {JSON.stringify(lastJsonMessage.data, null, 4)}
        </h3>
      ) : null}

      {lastJsonMessage ? (
        <JSONPretty theme={JSONPrettyMon} id="json-pretty" data={JSON.stringify(lastJsonMessage.data, null, 4)}></JSONPretty>
      ) : null}



      <ul>
        {/* {messageHistory.current.map((message, idx) => (
					<span key={idx}>
						{JSON.stringify(message.data, null, 4)}
					</span>
				))} */}
      </ul>
    </div>
  );
}
