'use client';

import { useState } from 'react';
import initialProducts from '../../components/products';
import WalletBar from "@/components/WalletBar";
import ProductGrid from "@/components/ProductGrid";
import Cart from "@/components/Cart";
import { connectWallet, payETH } from "@/lib/ethWallet";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};


const zoomImgStyle = `
  .zoom-img-wrapper:hover .zoom-img {
    transform: scale(1.15);
  }
`;


export default function Home() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<Product[]>([]);
  const [wallet, setWallet] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  const ethPrice = 0.000001;

  const sellerAddress = "0xfA9e1739bb352528f20DE775F73b6B3Ce7ef3eb9";

  const handleConnect = async () => {
    const account = await connectWallet();
    if (account) setWallet(account);
  };

  const handleDisconnect = () => {
    setWallet(null);
  };

  const handleBuy = (product: Product) => setCart((prev) => [...prev, product]);

  const handlePay = async () => {
    if (!wallet) {
      alert("Please connect your wallet first.");
      return;
    }
    setPaying(true);
    const amount = (cart.length * ethPrice).toString();
    const tx = await payETH(sellerAddress, amount);
    setPaying(false);
    if (tx) {
      const purchasedIds = cart.map((item) => item.id);
      setProducts(products.filter((product) => !purchasedIds.includes(product.id)));
      setCart([]);
      alert("Payment successful! Transaction hash: " + tx);
    }
  };

  const total = cart.length * ethPrice;

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-center flex-1">Picture Store</h1>
          <div className="ml-4">
            <WalletBar wallet={wallet} onConnect={handleConnect} onDisconnect={handleDisconnect} />
          </div>
        </div>
        <div className="flex flex-wrap gap-8 items-start justify-center">
          <div className="flex-2 min-w-[320px] w-full md:w-2/3">
            <ProductGrid products={products} onBuy={handleBuy} ethPrice={ethPrice} />
            {products.length === 0 && (
              <div className="text-center mt-10 text-muted-foreground">
                <p>No products left. Come back soon!</p>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-[320px] w-full md:w-1/3">
            <Cart cart={cart} total={total} onPay={handlePay} paying={paying} wallet={wallet} />
          </div>
        </div>
      </div>
      <style>{zoomImgStyle}</style>
    </div>
  );
}
