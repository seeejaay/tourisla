import {
  fetchActivePrice,
  fetchAllPrices,
  createPrice,
  togglePriceStatus,
  updatePriceDetails
} from "@/lib/api/price";
import { useState } from "react";

type Price = {
  id: number;
  amount: number;
  is_enabled: boolean;
  type: string;
};

export const usePriceManager = () => {
  const [price, setPrice] = useState<Price | null>(null);
  const [prices, setPrices] = useState<Price[]>([]);
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
