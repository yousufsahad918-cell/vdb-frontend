"use client";

import Image from "next/image";
import { useState } from "react";
import { products } from "@/lib/products";
import { useCart } from "@/lib/cart";

export default function ProductGrid() {
  const { addToCart } = useCart();
  const [selectedFlavours, setSelectedFlavours] = useState<Record<string, string>>({});

  const handleAddToCart = (product: typeof products[0]) => {
    const flavour = selectedFlavours[product.name];
    if (!flavour) {
      alert("Please select a flavour first");
      return;
    }
    addToCart({
      product_id: product.name.toLowerCase().replace(/\s+/g, "-"),
      name: product.name,
      price: parseInt(product.price.replace(/[₹,]/g, "")),
      image: product.image,
      puffs: product.puffs,
      flavour,
    });
  };

  return (
    <section className="section">
      <div className="container">
        <p className="section-label">Products</p>
        <h2>Top Selling Vapes in Bangalore</h2>
        <p>Select your flavour and add to cart — delivered in 20-30 mins.</p>

        <div className="product-grid">
          {products.map((product) => (
            <div key={product.name} className="product-card">
              <div className="product-image" style={{ position: "relative", height: "200px", overflow: "hidden", background: "#111" }}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{ objectFit: "contain", padding: "8px" }}
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                <div className="product-discount">{product.discount}</div>
                <div className="product-puffs">{product.puffs}</div>
              </div>

              <div className="product-info">
                <div className="product-badge">{product.badge}</div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.description}</p>

                {/* Flavour selector */}
                <div style={{ marginBottom: 10, marginTop: 6 }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Select Flavour
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {product.flavours.map((flavour) => (
                      <button
                        key={flavour}
                        onClick={() => setSelectedFlavours((prev) => ({ ...prev, [product.name]: flavour }))}
                        style={{
                          padding: "4px 8px",
                          borderRadius: 6,
                          border: selectedFlavours[product.name] === flavour
                            ? "1.5px solid var(--orange)"
                            : "1px solid var(--border)",
                          background: selectedFlavours[product.name] === flavour
                            ? "var(--orange-glow)"
                            : "var(--bg-3)",
                          color: selectedFlavours[product.name] === flavour
                            ? "var(--orange)"
                            : "var(--muted)",
                          fontSize: "0.7rem",
                          fontFamily: "var(--font-body)",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.15s",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {flavour}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="product-pricing">
                  <span className="product-price">{product.price}</span>
                  <span className="product-original">{product.originalPrice}</span>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  style={{
                    width: "100%", padding: "10px",
                    background: selectedFlavours[product.name] ? "var(--orange)" : "var(--bg-3)",
                    border: selectedFlavours[product.name] ? "none" : "1px solid var(--border)",
                    borderRadius: 8, color: selectedFlavours[product.name] ? "#fff" : "var(--muted)",
                    fontFamily: "var(--font-display)", fontWeight: 700,
                    fontSize: "0.85rem", cursor: "pointer", marginTop: 8,
                    transition: "all 0.2s",
                  }}
                >
                  {selectedFlavours[product.name] ? "+ Add to Cart" : "Select a Flavour"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
