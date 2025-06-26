import {
  fetchActivePrice,
  fetchAllPrices,
  createPrice,
  togglePriceStatus,
  updatePriceAmount, 
  updatePriceDetails
} from "@/lib/api/price";
import { useState } from "react";

export const usePriceManager = () => {
  const [price, setPrice] = useState<any>(null);
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getPrice = async () => {
    setLoading(true);
    try {
      const data = await fetchActivePrice();
      setPrice(data);
    } finally {
      setLoading(false);
    }
  };

  const getAllPrices = async () => {
    setLoading(true);
    try {
      const data = await fetchAllPrices();
      setPrices(data);
    } finally {
      setLoading(false);
    }
  };

  const addPrice = async (amount: number, is_enabled: boolean, type: string) => {
  return await createPrice({ amount, is_enabled, type });
};

  const updateStatus = async (id: number, is_enabled: boolean) => {
    return await togglePriceStatus(id, is_enabled);
  };

  const editPriceDetails = async (
    id: number,
    amount: number,
    type: string
  ) => {
    return await updatePriceDetails(id, amount, type);
  };

  return {
    price,
    prices,
    loading,
    getPrice,
    getAllPrices,
    addPrice,
    updateStatus,
    editPriceDetails, 
  };
};
