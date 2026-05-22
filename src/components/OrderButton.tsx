'use client'
import { useEffect, useState } from "react"

interface Props {
  productName: string
  basePrice: string
  flavour: string
  whatsappNumber: string
  allFlavours: string[]
}

export default function OrderButton({ productName, basePrice, flavour, whatsappNumber, allFlavours }: Props) {
  const [price, setPrice] = useState(basePrice)

  useEffect(() => {
    fetch("/api/product-overrides")
      .then(r => r.json())
      .then(d => {
        const override = (d.overrides || []).find((o: any) => o.product_name === productName)
        if (override?.price) {
          setPrice("₹" + override.price.toLocaleString("en-IN"))
        }
      })
      .catch(() => {})
  }, [productName, basePrice])

  const buildMsg = (f: string) => encodeURIComponent(
    `Hi VapeDeliveryBangalore, I want to order:\n\n*${productName}*\nFlavour: ${f}\nPrice: ${price}\n\nPlease confirm availability and delivery to my location.`
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <a href={`https://wa.me/${whatsappNumber}?text=${buildMsg(flavour)}`}
        target="_blank" rel="noopener noreferrer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 10, background: "#16a34a", color: "#fff",
          padding: "16px 24px", borderRadius: 12, fontWeight: 800,
          fontSize: "1rem", textDecoration: "none", width: "100%"
        }}>
        <span style={{ fontSize: "1.2rem" }}>💬</span>
        Order on WhatsApp — {price}
      </a>
      {allFlavours.length > 1 && (
        <div>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 8, color: "#374151" }}>
            Available Flavours — tap to order directly
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {allFlavours.map(f => (
              <a key={f} href={`https://wa.me/${whatsappNumber}?text=${buildMsg(f)}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  padding: "8px 14px", borderRadius: 100, border: "1.5px solid #16a34a",
                  color: "#16a34a", fontSize: "0.82rem", fontWeight: 600,
                  textDecoration: "none", background: "#fff"
                }}>
                {f}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
