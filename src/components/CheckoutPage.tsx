import { useState, useEffect } from "react";
import axios from "axios";

export const CheckoutPage = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    paymentMethod: "",
    shippingMethod: "",
  });
  const [loading, setLoading] = useState(true);

  const API_URL = "https://bilobrov.projection-learn.website/wp-json/wc/v3"; // Заміни на свій домен
  const CONSUMER_KEY = "ck_f6e14983147c7a65ff3dd554625c6ae3069dbd5b";
  const CONSUMER_SECRET = "cs_f9430f1ca298c36b0001d95521253a5b1deb2fc5";

  // Завантаження способів оплати та доставки
  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const [paymentRes, shippingRes] = await Promise.all([
          axios.get(`${API_URL}/payment_gateways`, {
            auth: {
              username: CONSUMER_KEY,
              password: CONSUMER_SECRET,
            },
          }),
          axios.get(`${API_URL}/shipping_methods`, {
            auth: {
              username: CONSUMER_KEY,
              password: CONSUMER_SECRET,
            },
          }),
        ]);

        setPaymentMethods(paymentRes.data.filter((method) => method.enabled));
        setShippingMethods(shippingRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching methods:", error);
      }
    };

    fetchMethods();
  }, []);

  // Оновлення даних форми
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Відправка замовлення
  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      payment_method: formData.paymentMethod,
      payment_method_title: paymentMethods.find(
        (method) => method.id === formData.paymentMethod
      )?.title,
      billing: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address_1: formData.address,
        city: formData.city,
        postcode: formData.postcode,
      },
      shipping: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_1: formData.address,
        city: formData.city,
        postcode: formData.postcode,
      },
      line_items: [], // Список товарів (потрібно заповнити відповідно до корзини)
    };

    try {
      const response = await axios.post(`${API_URL}/orders`, orderData, {
        auth: {
          username: CONSUMER_KEY,
          password: CONSUMER_SECRET,
        },
      });

      console.log("Order created:", response.data);
      alert("Замовлення успішно створено!");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Сталася помилка при створенні замовлення.");
    }
  };

  if (loading) {
    return <div>Завантаження...</div>;
  }

  return (
    <div>
      <h1>Оформлення замовлення</h1>
      <form onSubmit={handleSubmit}>
        {/* Поля форми */}
        <div>
          <label>Ім'я:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Прізвище:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Телефон:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Адреса:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Місто:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Поштовий індекс:</label>
          <input
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Способи доставки */}
        <div>
          <label>Спосіб доставки:</label>
          <select
            name="shippingMethod"
            value={formData.shippingMethod}
            onChange={handleInputChange}
            required
          >
            <option value="">Виберіть спосіб доставки</option>
            {shippingMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.method_title}
              </option>
            ))}
          </select>
        </div>

        {/* Способи оплати */}
        <div>
          <label>Спосіб оплати:</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            required
          >
            <option value="">Виберіть спосіб оплати</option>
            {paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.title}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Оформити замовлення</button>
      </form>
    </div>
  );
};
