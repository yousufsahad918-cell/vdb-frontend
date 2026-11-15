import re

file_path = 'src/lib/products.ts'

with open(file_path, 'r') as f:
    content = f.read()

# Define the updates: Product name -> (old price, new price)
updates = {
    "Elfbar Raya D1": ("₹2,699", "₹2,799"),
    "Elfbar Raya D3": ("₹2,799", "₹3,199"),
    "Elfbar D3 Pro": ("₹3,199", "₹3,299"),
    "Elfbar Ice King": ("₹2,999", "₹3,299"),
    "ZYN Cool Mint": ("₹999", "₹1,299"),
}

for product_name, (old_price, new_price) in updates.items():
    # Find the product block by name
    pattern = rf'(name:\s*["\']{re.escape(product_name)}["\'][^}}]*?price:\s*["\']){re.escape(old_price)}(["\'])'
    
    content_new, count = re.subn(pattern, rf'\g<1>{new_price}\g<2>', content, flags=re.DOTALL)
    
    if count > 0:
        print(f"✅ Updated: {product_name} ({old_price} → {new_price})")
        content = content_new
    else:
        print(f"⚠️  Not found or already updated: {product_name}")

with open(file_path, 'w') as f:
    f.write(content)

print("\n💾 Changes saved to src/lib/products.ts")
