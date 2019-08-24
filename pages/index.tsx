import React, {
  useReducer,
  useRef,
  useState,
  useEffect,
  useCallback
} from "react";
import mqtt, { MqttClient } from "mqtt";
import { useRouter } from "next/router";
import Head from "next/head";

type Choice = {
  title: string;
  value: string;
};

const choices: Choice[] = [
  { title: "Dahls flaske", value: "beer_dahls_bottle" },
  { title: "Boksbrus", value: "soda_can" },
  { title: "Brus", value: "soda_bottle" }
];

// one component does all the things!
const BrusGuiAsASingleFunction = () => {
  const router = useRouter();
  // use mqttServer query to set mqtt url
  const mqttServer = router.query.mqttServer as string;
  const [data, setData] = useState<[Choice, number][]>(() =>
    choices.map((value: Choice) => [value, 0])
  );
  const [shoppingCartMqtt, sendShoppingCart] = useMqttTopic(
    mqttServer,
    "fridge/shopping_cart"
  );
  const [brusSuccess] = useMqttTopic(mqttServer, "notification/brus_success");
  const [brusError] = useMqttTopic(mqttServer, "notification/brus_error");

  useEffect(() => {
    const lastObj =
      shoppingCartMqtt.length && shoppingCartMqtt[shoppingCartMqtt.length - 1];
    if (!lastObj) return;

    // @ts-ignore
    setData(data =>
      data.map(([choice]) => {
        return [
          choice,
          (
            JSON.parse(lastObj).find(o => o.product_name === choice.value) || {
              count: 0
            }
          ).count
        ];
      })
    );
  }, [shoppingCartMqtt]);

  const sendData = useCallback(
    data => {
      sendShoppingCart(
        JSON.stringify(
          data
            .filter(([, count]) => count)
            .map(([choice, count]) => ({ product_name: choice.value, count }))
        )
      );
      return data;
    },
    [sendShoppingCart]
  );

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
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      <style global jsx>{`
        html,
        button {
          font-size: 60px;
        }
        button {
          width: 100px;
          height: 100px;
          margin: 10px;
        }
        table {
          width: 100%;
        }
      `}</style>
      <table>
        {lastMsgObj
          ? lastMsgObj[0]
          : data.map(([choice, count]) => (
              <tr key={choice.value}>
                <td>{choice.title}</td>
                <td>{count}</td>
                <td>
                  <button
                    onClick={() => {
                      setData(data =>
                        sendData(
                          data.map(([c, count]) =>
                            c === choice ? [c, (count || 1) - 1] : [c, count]
                          )
                        )
                      );
                    }}
                  >
                    -
                  </button>
                  <button
                    onClick={() => {
                      setData(data =>
                        sendData(
                          data.map(([c, count]) =>
                            c === choice ? [c, count + 1] : [c, count]
                          )
                        )
                      );
                    }}
                  >
                    +
                  </button>
                </td>
              </tr>
            ))}
      </table>
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
