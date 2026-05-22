"use client"
import { useEffect, useState } from "react";

export default function LivePrice({ productName, basePrice }: { productName: string; basePrice: string }) {
  const [price, setPrice] = useState(basePrice);
  
  useEffect(() => {
    fetch("/api/product-overrides")
      .then(r => r.json())
      .then(d => {
        const override = (d.overrides || []).find((o: any) => o.product_name === productName);
        if (override?.price) {
          setPrice("₹" + override.price.toLocaleString("en-IN"));
        }
      })
      .catch(() => {});
  }, [productName, basePrice]);
  
  return <>{price}</>;
}
