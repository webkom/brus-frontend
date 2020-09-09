import React, { useRef, useState, useEffect, useCallback } from 'react';
import mqtt, { MqttClient } from 'mqtt/dist/mqtt';
import { useRouter } from 'next/router';
import Head from 'next/head';
import 'isomorphic-fetch';

const Product: React.FC<{
  product: Product;
  count: number;
  setCount: (count: number) => void;
}> = ({ product, count, setCount }) => {
  return (
    <tr>
      <td>
        {product.name}
        <div className="price">{product.current_price},-</div>
      </td>
      <td>{count}</td>
      <td className="buttons">
        <button onClick={() => setCount(Math.max(count - 1, 0))}>-</button>
        <button onClick={() => setCount(count < 10 ? count + 1 : 10)}>+</button>
      </td>
    </tr>
  );
};

type Cart = {
  [key: string]: number;
};

type Product = {
  key: string;
  name: string;
  current_price: number;
};

type ShoppingCartUpdate = {
  product_name: string;
  count: number;
};

type Person = {
  avatar: string;
  uids: Array<string>;
  name: string;
};

const getProducts = async () => {
  const res = await fetch('https://brus.abakus.no/api/liste/products/');
  const products: Product[] = await res.json();
  return products;
};

// one component does all the things!
const BrusGuiAsASingleFunction = () => {
  const router = useRouter();
  const mqttServer = router.query.mqttServer as string;
  const folks = JSON.parse(
    Buffer.from((router.query.folks as string) || 'W10K', 'base64').toString()
  ) as Array<Person>;

  const [selectedFolks, setSelectedFolks] = useState<Array<Person>>([]);

  const client = useRef<MqttClient>();
  const sendMessage = useCallback(
    (topic, message) => {
      console.log('Sending msg on topic', topic, message);
      client.current.publish(topic, message, { qos: 1, retain: true });
    },
    [client.current]
  );

  const [products, setProducts] = useState<Product[]>([]);
  // Fetch products from brus API
  useEffect(() => {
    (async () => {
      const products = await getProducts();
      setProducts(products);
    })();
  }, []);

  const [error, setError] = useState<Array<String>>([]);
  const [success, setSuccess] = useState<Array<String>>([]);

  const [cart, setCart] = useState<Cart>({});
  // Change cart and publish to MQTT
  const changeCart = useCallback(
    async (key: string, count: number) => {
      const newCart = {
        ...cart,
        [key]: count
      };
      sendMessage(
        'fridge/shopping_cart',
        JSON.stringify(
          Object.entries(newCart)
            .filter(([, count]) => count)
            .map(([key, count]) => ({ product_name: key, count }))
        )
      );
      setCart(newCart);
    },
    [cart]
  );
  const resetCart = useCallback(() => {
    setCart({});
    sendMessage('fridge/shopping_cart', '[]');
  }, []);

  // MQTT subscriptions and message handlers
  const subscriptions = [
    {
      topic: 'notification/brus_success',
      handler: useCallback(msg => {
        setSuccess(old => old.concat(msg));
        console.log('Got msg', msg);
        resetCart();
        setTimeout(
          () => setSuccess(old => old.filter(item => !(item === msg))),
          4000
        );
      }, [])
    },
    {
      topic: 'notification/brus_error',
      handler: useCallback(msg => {
        setError(old => old.concat(msg));
        setTimeout(
          () => setError(old => old.filter(item => !(item === msg))),
          4000
        );
      }, [])
    },
    {
      topic: 'fridge/shopping_cart',
      handler: (msg: string) => {
        const updates: ShoppingCartUpdate[] = JSON.parse(msg);
        setCart(
          updates.reduce((obj, val) => {
            return {
              ...obj,
              [val.product_name]: val.count
            };
          }, {})
        );
      }
    }
  ];
  // Set up MQTT connection
  useEffect(() => {
    if (client.current) {
      return;
    }
    client.current = mqtt.connect(mqttServer);
    client.current.on('connect', () => {
      console.log(`Connected to ${mqttServer}`);

      subscriptions.forEach(({ topic, handler }) => {
        client.current.subscribe(topic, (err: any) => {
          if (err) return console.error(err);
          console.log(`Subscribed to topic: "${topic}"`);
        });
        client.current.on('message', (_topic: string, rawMessage: Buffer) => {
          if (_topic === topic) {
            const message = rawMessage.toString();
            handler(message);
          }
        });
      });

      return () => {
        client.current.end();
      };
    });
  });

  if (!mqttServer) return <h1> U drunk.</h1>;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      <style global jsx>{`
        html,
        button {
          font-family: 'Open Sans', sans-serif;
          font-size: 40px;
        }
        img {
          width: 60px;
          padding: 10px;
        }
        .price {
          font-size: 25px;
        }
        td {
          border-bottom: 1px solid black;
          border-top: 1px solid black;
          margin: 0;
          padding: 20px 0;
        }
        td.buttons {
          white-space: nowrap;
        }
        button {
          width: 100px;
          height: 100px;
          margin: 10px;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
      `}</style>
      {error
        .filter((item, index) => error.indexOf(item) !== index)
        .map(err => (
          <>
            {err}
            <br />
          </>
        ))}
      {success
        .filter((item, index) => success.indexOf(item) !== index)
        .map(err => (
          <>
            {err}
            <br />
          </>
        ))}
      {!error.length && !success.length && (
        <div>
          {' '}
          {folks.map(per => {
            const isSelected = selectedFolks.find(it => per.name === it.name);
            return (
              <img
                style={{ opacity: isSelected ? 1 : 0.4 }}
                onClick={() => {
                  console.log('clicked...', isSelected, selectedFolks);
                  setSelectedFolks(
                    isSelected
                      ? selectedFolks.filter(it => !(it.name === per.name))
                      : selectedFolks.concat([per])
                  );
                }}
                src={per.avatar}
              />
            );
          })}
        </div>
      )}
      {!error.length && !success.length && (
        <div>
          <button
            disabled={selectedFolks.length !== 1}
            onClick={() => {
              sendMessage(
                'kaffe_register/read_card',
                JSON.stringify({ uid: selectedFolks[0].uids[0] })
              );
              setSelectedFolks([]);
            }}
          >
            ☕
          </button>
          <button
            disabled={
              selectedFolks.length === 0 || Object.keys(cart).length === 0
            }
            onClick={() => {
              const savedCart = cart;
              selectedFolks.forEach(person => {
                sendMessage(
                  'brus_register/read_card',
                  JSON.stringify({
                    datetime: new Date(),
                    shopping_cart: JSON.stringify(
                      Object.entries(savedCart)
                        .filter(([, count]) => count)
                        .map(([key, count]) => ({ product_name: key, count }))
                    ),
                    uid: person.uids[0]
                  })
                );
              });
              resetCart();
              setSelectedFolks([]);
            }}
          >
            💶
          </button>
        </div>
      )}
      {!error.length && !success.length && (
        <table>
          <tbody>
            {products.map(product => (
              <Product
                key={product.key}
                product={product}
                count={cart[product.key] || 0}
                setCount={(count: number) => changeCart(product.key, count)}
              />
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

BrusGuiAsASingleFunction.getInitialProps = async () => ({});

export default BrusGuiAsASingleFunction;
