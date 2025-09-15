import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About GoCart Plus</h1>
            <p className="text-xl leading-relaxed">
              Your trusted multi-vendor marketplace bringing you the best gadgets at prices you'll love. 
              We connect amazing sellers with smart shoppers worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded with a vision to revolutionize online shopping, GoCart Plus started as a small team 
                of tech enthusiasts who believed that everyone deserves access to quality gadgets at fair prices.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Today, we've grown into a thriving multi-vendor marketplace that connects thousands of sellers 
                with millions of customers worldwide. Our platform empowers small businesses while providing 
                customers with an incredible variety of products.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From the latest smartphones to innovative home gadgets, we carefully curate our marketplace 
                to ensure you get the best products at the most competitive prices.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-8 rounded-lg">
                <div className="text-center">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Innovation First</h3>
                  <p className="text-gray-600 mt-2">We bring you the latest tech innovations from around the world</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-green-500 mb-2">10K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-500 mb-2">500+</div>
              <div className="text-gray-600">Trusted Vendors</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-500 mb-2">50K+</div>
              <div className="text-gray-600">Products Listed</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-orange-500 mb-2">99.8%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Mission & Values</h2>
            <p className="text-xl text-gray-600">What drives us every day</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Customer First</h3>
              <p className="text-gray-600">
                Every decision we make puts our customers at the center. Your satisfaction is our success.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Quality Assured</h3>
              <p className="text-gray-600">
                We carefully vet all our vendors and products to ensure you receive only the best quality items.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Community Driven</h3>
              <p className="text-gray-600">
                We believe in building a strong community of sellers and buyers who support each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The passionate people behind GoCart Plus</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">AS</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Arbazz Siddique</h3>
              <p className="text-gray-600 mb-2">CEO & Founder</p>
              <p className="text-sm text-gray-500">Leading the vision for the future of e-commerce</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">AD</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Alice Davis</h3>
              <p className="text-gray-600 mb-2">CTO</p>
              <p className="text-sm text-gray-500">Building the technology that powers our platform</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">MJ</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Mike Johnson</h3>
              <p className="text-gray-600 mb-2">Head of Operations</p>
              <p className="text-sm text-gray-500">Ensuring smooth operations and customer satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8">Join thousands of happy customers and discover amazing deals today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Products
            </button>
            </Link>
            <Link href='/create-store'>
 <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
              Become a Vendor
            </button>
            </Link>
           
          </div>
        </div>
      </section>
    </div>
  );
}