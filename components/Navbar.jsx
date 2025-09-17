"use client";
import { PackageIcon, Search, ShoppingCart, Menu, Home, Store, Info, MessageCircle, User, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
    <nav className="relative bg-white border-b border-gray-200">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4">
          {/* Logo */}
          <Link href="/" className="relative text-3xl sm:text-4xl font-semibold text-slate-700">
            <span className="text-green-600">go</span>cart
            <span className="text-green-600 text-4xl sm:text-5xl">.</span>
            <Protect plan="plus">
              <p className="absolute text-[10px] font-semibold -top-1 -right-6 sm:-right-8 px-2 sm:px-3 rounded-full text-white bg-green-500">
                plus
              </p>
            </Protect>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-6 text-slate-600 relative">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-green-600 transition-colors">Shop</Link>
            <Link href="/about" className="hover:text-green-600 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-green-600 transition-colors">Contact</Link>

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
                <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-lg z-50 border">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm border-b last:border-b-0"
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
            <Link href="/cart" className="relative flex items-center gap-2 text-slate-600 hover:text-green-600 transition-colors">
              <ShoppingCart size={18} />
              Cart
              <span className="absolute -top-1 left-3 text-[8px] text-white bg-green-600 size-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            {/* Auth */}
            {!user ? (
              <Button
                onClick={openSignIn}
                className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
              >
                Login
              </Button>
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

          {/* Mobile Menu */}
          <div className="sm:hidden flex items-center gap-3">
            {/* Search (mobile) */}
            <form
              onSubmit={handleSearch}
              className="flex items-center w-[120px] text-xs gap-2 bg-slate-100 px-3 py-2 rounded-full relative"
            >
              <Search size={16} className="text-slate-600" />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-600"
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {suggestions.length > 0 && (
                <div className="absolute top-10 left-0 w-full bg-white shadow-lg rounded-lg z-50 border">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-xs border-b last:border-b-0"
                      onClick={() => {
                        router.push(`/shop?search=${item.name}`);
                        setSuggestions([]);
                        setSearch(item.name);
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </form>

            {/* shadcn Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-green-50">
                  <Menu size={20} className="text-slate-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg"
              >
                <DropdownMenuLabel className="font-semibold text-green-700 px-4 py-3">
                  Navigation
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link 
                    href="/" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors cursor-pointer"
                  >
                    <Home size={18} className="text-green-600" />
                    <span className="font-medium">Home</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link 
                    href="/shop" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors cursor-pointer"
                  >
                    <Store size={18} className="text-green-600" />
                    <span className="font-medium">Shop</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link 
                    href="/about" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors cursor-pointer"
                  >
                    <Info size={18} className="text-green-600" />
                    <span className="font-medium">About</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link 
                    href="/contact" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors cursor-pointer"
                  >
                    <MessageCircle size={18} className="text-green-600" />
                    <span className="font-medium">Contact</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link 
                    href="/cart" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors cursor-pointer relative"
                  >
                    <div className="relative">
                      <ShoppingCart size={18} className="text-green-600" />
                      <span className="absolute -top-2 -right-2 text-[10px] text-white bg-green-600 size-4 rounded-full flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    </div>
                    <span className="font-medium">Cart</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {!user ? (
                  <DropdownMenuItem 
                    onClick={openSignIn}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all cursor-pointer"
                  >
                    <LogIn size={18} className="text-blue-600" />
                    <span className="font-medium text-blue-600">Login</span>
                  </DropdownMenuItem>
                ) : (
                  <div className="px-2 py-2">
                    <UserButton>
                      <UserButton.MenuItems>
                        <UserButton.Action
                          labelIcon={<PackageIcon size={16} />}
                          label="My Orders"
                          onClick={() => router.push("/orders")}
                        />
                      </UserButton.MenuItems>
                    </UserButton>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;