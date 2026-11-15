import urllib.request
import re
import csv

url = "https://vapedeliverybangalore.com/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'})

print("🔍 Fetching data from vapedeliverybangalore.com ...")

try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
    
    # This finds the product names and prices based on the site's HTML pattern
    matches = re.findall(r'\*\*([^\*]+)\*\*.*?₹([\d,]+).*?₹([\d,]+)', html, re.DOTALL)
    
    with open('vape_prices.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Product Name', 'Discounted Price', 'Original Price'])
        
        for name, price1, price2 in matches:
            clean_name = " ".join(name.split())
            writer.writerow([clean_name, f"₹{price1}", f"₹{price2}"])
            
    print(f"✅ Success! Extracted {len(matches)} products.")
    print("💾 Saved to: vape_prices.csv")
    
except Exception as e:
    print(f"❌ Error fetching data: {e}")
