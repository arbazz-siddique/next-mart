"use client";
import { PackageIcon, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs";
import axios from "axios";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const cartCount = useSelector((state) => state.cart.total);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // debounce search (500ms delay)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (search.length > 1) {
        try {
          const { data } = await axios.get(`/api/products/search?query=${search}`);
          setSuggestions(data.results);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
    setSuggestions([]);
  };

  return (
    <nav className="relative bg-white">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4">
          {/* Logo */}
          <Link href="/" className="relative text-4xl font-semibold text-slate-700">
            <span className="text-green-600">go</span>cart
            <span className="text-green-600 text-5xl">.</span>
            <Protect plan="plus">
              <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 rounded-full text-white bg-green-500">
                plus
              </p>
            </Protect> 
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-6 text-slate-600 relative">
            <Link href="/">Home</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full relative"
            >
              <Search size={18} className="text-slate-600" />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-600"
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {/* Suggestion Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-lg z-50">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                      onClick={() => {
                        router.push(`/shop?search=${item.name}`);
                        setSuggestions([]);
                        setSearch(item.name);
                      }}
                    >
                      {item.name} – ₹{item.price}
                    </div>
                  ))}
                </div>
              )}
            </form>

            {/* Cart */}
            <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
              <ShoppingCart size={18} />
              Cart
              <span className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            {/* Auth */}
            {!user ? (
              <button
                onClick={openSignIn}
                className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full"
              >
                Login
              </button>
            ) : (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    labelIcon={<PackageIcon size={16} />}
                    label="My Orders"
                    onClick={() => router.push("/orders")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            )}
          </div>
        </div>
      </div>
      <hr className="border-gray-300" />
    </nav>
  );
};

export default Navbar;
