"use client";

type Props = {
  productName?: string;
  basePrice?: string;
  price?: string;
  className?: string;
};

export default function LivePrice({ productName, basePrice, price, className }: Props) {
  return <span className={className}>{basePrice || price || ""}</span>;
}
