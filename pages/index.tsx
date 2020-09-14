import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import mqtt, { MqttClient } from 'mqtt/dist/mqtt';
import { useRouter } from 'next/router';
import Head from 'next/head';
import 'isomorphic-fetch';

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

interface PurchaseSummary {
  soda: number;
  beer: number;
}

interface ProductsBought {
  key: string;
  name: string;
  bottle_type: string;
  product_type: string;
  image: string;
  current_price: number;
  price_history: number[];
  count: number;
}

interface BrusEntry {
  name: string;
  balance: number;
  purchase_summary: PurchaseSummary;
  products_bought: ProductsBought[];
}

const getBrusListe = async () => {
  const res = await fetch('https://brus.abakus.no/api/liste/');
  const products: BrusEntry[] = await res.json();
  return products;
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
  const onlyShow = useMemo(
    () => ((router.query.onlyShow as string) || '').split(',').filter(Boolean),
    [router.query.onlyShow]
  );
  const folks = useMemo(
    () =>
      JSON.parse(
        Buffer.from(
          (router.query.folks as string) || 'W10K',
          'base64'
        ).toString()
      ) as Array<Person>,
    [router.query.folks]
  );

  const [selectedFolks, setSelectedFolks] = useState<Array<Person>>([]);

  const client = useRef<MqttClient>();
  const sendMessage = useCallback(
    (topic, message, retain = false) => {
      console.log('Sending msg on topic', topic, message);
      client.current.publish(topic, message, { qos: 1, retain });
    },
    [client.current]
  );

  const [error, setError] = useState<Array<String>>([]);
  const [success, setSuccess] = useState<Array<String>>([]);

  const [products, setProducts] = useState<Product[]>([]);
  const [brusEntries, setBrusEntries] = useState<BrusEntry[]>([]);
  // Fetch products from brus API
  useEffect(() => {
    (async () => {
      const entries = await getBrusListe();
      setBrusEntries(entries);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (success.length != 0) {
        const entries = await getBrusListe();
        setBrusEntries(entries);
      }
    })();
  }, [success.length]);

  useEffect(() => {
    (async () => {
      const products = await getProducts();
      setProducts(products.reverse());
    })();
  }, []);

  const [cart, setCart] = useState<Cart>({});
  // Change cart and publish to MQTT
  const changeCart = useCallback(
    (key: string, count: number) => {
      const newCart = {
        ...cart,
        [key]: count
      };
      setCart(newCart);
    },
    [cart]
  );
  const resetCart = useCallback(() => {
    setCart({});
    sendMessage('fridge/shopping_cart', '[]', false);
  }, []);

  // MQTT subscriptions and message handlers
  const subscriptions = [
    {
      topic: 'notification/brus_success',
      handler: useCallback(msg => {
        setSuccess(old => old.filter(item => !(item === msg)).concat(msg));
        console.log('Got msg', msg);
        setTimeout(
          () => setSuccess(old => old.filter(item => !(item === msg))),
          4000
        );
      }, [])
    },
    {
      topic: 'notification/brus_error',
      handler: useCallback(msg => {
        setError(old => old.filter(item => !(item === msg)).concat(msg));
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

  const cartCount = Object.keys(cart).reduce((acc, val) => acc + cart[val], 0);

  // Is true if the buy/fill button should be disabled
  const cantBuy = selectedFolks.length === 0 || cartCount === 0;

  // Is true if the brew button should be disabled
  const cantBrew = selectedFolks.length !== 1 || cartCount > 0;

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
          font-size: 26px;
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
          width: 60px;
          height: 60px;
          margin: 10px;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
      `}</style>
      {error.map(err => (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            fontSize: 45,
            justifyContent: 'center'
          }}
        >
          {err}
        </div>
      ))}
      {success.map(success => (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            fontSize: 45,
            justifyContent: 'center'
          }}
        >
          {success}
        </div>
      ))}
      {!error.length && !success.length && (
        <>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            {' '}
            {folks.map(per => {
              const isSelected = selectedFolks.find(it => per.name === it.name);
              return (
                <img
                  style={{
                    opacity: isSelected ? 1 : 0.8,
                    border: isSelected ? '2px solid green' : '2px solid white'
                  }}
                  onClick={() => {
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <button
              disabled={cantBrew}
              style={{
                fontSize: 70,
                width: 100,
                height: 100,
                opacity: cantBrew ? 0.4 : 1
              }}
              onClick={() => {
                sendMessage(
                  'kaffe_register/read_card',
                  JSON.stringify({ uid: selectedFolks[0].uids[0] })
                );

                sendMessage(
                  'notification/brus_success',
                  `${selectedFolks[0].name} lager kaffe!!☕☕`
                );
                setSelectedFolks([]);
              }}
            >
              ☕
            </button>
          </div>
        </>
      )}
      {!error.length && !success.length && (
        <>
          <table>
            <tbody>
              {products
                .filter(product =>
                  onlyShow.length > 0 ? onlyShow.includes(product.key) : true
                )
                .map(product => {
                  const count = cart[product.key] || 0;
                  const setCount = (count: number) =>
                    changeCart(product.key, count);
                  return (
                    <tr key={product.key}>
                      <td>
                        {product.name}
                        <div className="price">{product.current_price},-</div>
                      </td>
                      <td>
                        {count}
                        <span style={{ fontSize: 14 }}> per pers</span>
                      </td>
                      <td className="buttons">
                        <button
                          onClick={() => setCount(Math.max(count - 1, 0))}
                        >
                          -
                        </button>
                        <button
                          onClick={() => setCount(count < 30 ? count + 1 : 30)}
                        >
                          +
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </>
      )}
      {!error.length && !success.length && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          <button
            disabled={cantBuy}
            style={{
              width: 100,
              fontSize: 70,
              height: 100,
              opacity: cantBuy ? 0.4 : 1
            }}
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
            🍺
          </button>
          <button
            disabled={cantBuy}
            style={{
              width: 100,
              fontSize: 70,
              height: 100,
              opacity: cantBuy ? 0.4 : 1
            }}
            onClick={() => {
              if (
                !confirm(
                  'Er du sikker på at du skal fylle på med drikke og ikke kjøpe?'
                )
              ) {
                return;
              }
              const savedCart = cart;
              selectedFolks.forEach(person => {
                sendMessage(
                  'brus_register/read_card',
                  JSON.stringify({
                    datetime: new Date(),
                    shopping_cart: JSON.stringify(
                      Object.entries(savedCart)
                        .filter(([, count]) => count)
                        .map(([key, count]) => ({
                          product_name: key,
                          count: -count
                        }))
                    ),
                    uid: person.uids[0]
                  })
                );
              });
              resetCart();
              setSelectedFolks([]);
            }}
          >
            📦
          </button>
        </div>
      )}

      {!error.length && !success.length && (
        <div style={{ fontSize: 14, textAlign: 'center' }}>
          <hr />
          Total saldo:{' '}
          {brusEntries
            .map(entry => entry.balance)
            .reduce((a, b) => a + b, 0)
            .toFixed(2)}
          ,-
          <br />
          Estimert ølmengde:{' '}
          {(
            brusEntries.map(entry => entry.balance).reduce((a, b) => a + b, 0) /
            (
              products.find(product => product.key === 'beer_dahls_bottle') || {
                current_price: 22
              }
            ).current_price
          ).toFixed(0)}
          <br />
          <hr />
          {brusEntries
            .slice()
            .sort((a, b) => a.balance - b.balance)
            .filter(entry => entry.balance)
            .map(entry => (
              <>
                {entry.name}:{' '}
                <span style={{ color: entry.balance > 0 ? 'green' : 'red' }}>
                  {entry.balance}
                </span>
                ,{' '}
              </>
            ))}
        </div>
      )}
    </>
  );
};

BrusGuiAsASingleFunction.getInitialProps = async () => ({});

export default BrusGuiAsASingleFunction;
