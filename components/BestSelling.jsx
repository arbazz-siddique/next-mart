'use client'
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBestSellingProducts } from "@/lib/features/product/productSlice";
import Title from './Title'
import ProductCard from './ProductCard'

export default function BestSelling() {
  const dispatch = useDispatch();
  const { bestSelling, bestSellingLoading } = useSelector(state => state.product);

  useEffect(() => {
    dispatch(fetchBestSellingProducts());
  }, [dispatch]);

  if (bestSellingLoading) return <p className="text-center">Loading best selling...</p>;

  return (
    <div className='px-6 my-30 max-w-6xl mx-auto'>
      <Title 
        title='Best Selling' 
        description={`Showing ${bestSelling.length} of ${bestSelling.length} products`} 
        href='/shop' 
      />
      <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12'>
        {bestSelling.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
}
