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
        <button onClick={() => setCount(count + 1)}>+</button>
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

const getProducts = async () => {
  const res = await fetch('https://brus.abakus.no/api/liste/products/');
  const products: Product[] = await res.json();
  return products;
};

// one component does all the things!
const BrusGuiAsASingleFunction = () => {
  const router = useRouter();
  const mqttServer = router.query.mqttServer as string;

  const client = useRef<MqttClient>();
  const sendMessage = useCallback(
    (topic, message) => {
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

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        setSuccess(msg);
        resetCart();
        setTimeout(() => setSuccess(''), 4000);
      }, [])
    },
    {
      topic: 'notification/brus_error',
      handler: useCallback(msg => {
        setError(msg);
        setTimeout(() => setError(''), 4000);
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
          font-size: 60px;
        }
        .price {
          font-size: 30px;
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
      {error}
      {success}
      {!error && !success && (
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
