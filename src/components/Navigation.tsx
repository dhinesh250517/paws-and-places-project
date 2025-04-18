
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { MenuIcon, XIcon, HeartHandshakeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/home", label: "Home" },
    { path: "/add", label: "Add Animal" },
    { path: "/adopted", label: "Adopted Animals" },
    { path: "/about", label: "About Us" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="paws-container flex justify-between items-center py-3">
        <Link to="/" className="font-bold text-lg flex items-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-pawsBlue mr-2"
          >
            <path
              d="M10.5 18H13.5C15.1569 18 16.5 16.6569 16.5 15C16.5 13.3431 15.1569 12 13.5 12H10.5C8.84315 12 7.5 13.3431 7.5 15C7.5 16.6569 8.84315 18 10.5 18Z"
              fill="currentColor"
            />
            <path
              d="M7 9C8.10457 9 9 8.10457 9 7C9 5.89543 8.10457 5 7 5C5.89543 5 5 5.89543 5 7C5 8.10457 5.89543 9 7 9Z"
              fill="currentColor"
            />
            <path
              d="M17 9C18.1046 9 19 8.10457 19 7C19 5.89543 18.1046 5 17 5C15.8954 5 15 5.89543 15 7C15 8.10457 15.8954 9 17 9Z"
              fill="currentColor"
            />
            <path
              d="M19 17C20.1046 17 21 16.1046 21 15C21 13.8954 20.1046 13 19 13C17.8954 13 17 13.8954 17 15C17 16.1046 17.8954 17 19 17Z"
              fill="currentColor"
            />
            <path
              d="M5 17C6.10457 17 7 16.1046 7 15C7 13.8954 6.10457 13 5 13C3.89543 13 3 13.8954 3 15C3 16.1046 3.89543 17 5 17Z"
              fill="currentColor"
            />
          </svg>
          Paws & Places
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive(item.path) ? "default" : "ghost"}
                className={cn(
                  "px-3",
                  isActive(item.path) ? "bg-pawsBlue text-white" : ""
                )}
              >
                {item.label === "Adopted Animals" && (
                  <HeartHandshakeIcon className="h-4 w-4 mr-1 text-green-500" />
                )}
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {isOpen ? <XIcon /> : <MenuIcon />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-3 mt-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                >
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive(item.path) ? "bg-pawsBlue text-white" : ""
                    )}
                  >
                    {item.label === "Adopted Animals" && (
                      <HeartHandshakeIcon className="h-4 w-4 mr-2 text-green-500" />
                    )}
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navigation;
