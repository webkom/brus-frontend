import React, { useReducer, useRef, useState, useEffect } from "react";
import mqtt, { MqttClient } from "mqtt";
import { useRouter } from "next/router";

type Choice = {
  title: string;
  value: string;
};
const choices: Choice[] = [
  { title: "Dahls flaske", value: "beer" },
  { title: "Boksbrus", value: "can" },
  { title: "Brus", value: "bottle" }
];
//
// one component does all the things!
const BrusGuiAsASingleFunction = () => {
  const router = useRouter();
  // use mqttServer query to set mqtt url
  const mqttServer = router.query.mqttServer as string;
  const [data, setData] = useState<[Choice, number][]>(() =>
    choices.map((value: Choice) => [value, 0])
  );
  const [, sendShoppingCart] = useMqttTopic(mqttServer, "fridge/shopping_cart");
  const [brusSuccess] = useMqttTopic(mqttServer, "notification/brus_success");
  const [brusError] = useMqttTopic(mqttServer, "notification/brus_error");

  useEffect(() => {
    sendShoppingCart(
      JSON.stringify(
        data
          .filter(([, count]) => count)
          .map(([choice, count]) => ({ type: choice.value, count }))
      )
    );
  }, [data]);

  const [lastMsgObj, setLastMessage] = useState<[string, any] | null>(null);

  useEffect(() => {
    if (!brusSuccess.length) return;
    setData(choices.map((value: Choice) => [value, 0]));
    setLastMessage(old => {
      // @ts-ignore
      if (old) clearTimeout(old.timeoutId);
      return [
        brusSuccess[brusSuccess.length - 1] as string,
        setTimeout(() => setLastMessage(null), 4000)
      ];
    });
  }, [brusSuccess]);

  useEffect(() => {
    if (!brusError.length) return;
    setLastMessage(old => {
      // @ts-ignore
      if (old) clearTimeout(old.timeoutId);
      return [
        ("Error:" + brusError[brusError.length - 1]) as string,
        setTimeout(() => setLastMessage(null), 4000)
      ];
    });
  }, [brusError]);

  return (
    <>
      <div> Handleliste </div>
      {lastMsgObj ? (
        <h1>{lastMsgObj[0]}</h1>
      ) : (
        data.map(([choice, count]) => (
          <div key={choice.value}>
            {" "}
            {count}
            <button
              onClick={() => {
                setData(data =>
                  data.map(([c, count]) =>
                    c === choice ? [c, count + 1] : [c, count]
                  )
                );
              }}
            >
              {" "}
              +
            </button>
            <button
              onClick={() => {
                setData(data =>
                  data.map(([c, count]) =>
                    c === choice ? [c, (count || 1) - 1] : [c, count]
                  )
                );
              }}
            >
              {" "}
              -
            </button>
            - {choice.title}
          </div>
        ))
      )}
    </>
  );
};

BrusGuiAsASingleFunction.getInitialProps = async () => ({});

const reducer = (messages: string[], newMessage: string) => [
  ...messages,
  newMessage
];

const useMqttTopic = (
  url: string,
  topic: string
): [string[], (payload: string) => void] => {
  const client = useRef<MqttClient | null>(null);
  const [messages, addMessage] = useReducer(reducer, []);

  useEffect(() => {
    if (client.current) {
      return;
    }
    client.current = mqtt.connect(url);
    client.current.on("connect", () => {
      console.log(`Connected to ${url}`);
      client.current.subscribe(topic, (err: any) => {
        if (err) return console.error(err);
        console.log(`Subscribed to bard: "${topic}"`);
      });
    });

    client.current.on("message", (_topic: string, rawMessage: Buffer) => {
      const message = rawMessage.toString();
      addMessage(message);
    });
  });

  const sendMessage = (message: string) => {
    if (client.current) client.current.publish(topic, message);
  };

  return [messages, sendMessage];
};

export default BrusGuiAsASingleFunction;
