import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { OrderSucces } from "../../components/OrderSucces/OrderSucces";
import { OrderData } from "../../store/slices/orderSlice";
import axios from "axios";
import { API_URL_BASE, consumerKey, consumerSecret } from "../../constants/api";

export const OrderSuccessPage = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [params] = useSearchParams();
  const orderId = params.get("order_id");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order ID is missing");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL_BASE}wc/v3/orders/${orderId}`, {
          auth: {
            username: consumerKey,
            password: consumerSecret,
          },
        });

        setOrderData(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return;
  if (error || !orderData) return <div>{error || "Order not found"}</div>;

  return (
    <OrderSucces usedBonuses={orderData.meta_data[0].value} data={orderData} />
  );
};

export default OrderSuccessPage;
