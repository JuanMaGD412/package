"use client";
import React from "react";
import Image from "next/image";
import Logo from "/public/images/logos/prosecto.png";
import Link from "next/link";
const FullLogo = () => {
  return (
    <Link href={"/"}>
      {/* Dark Logo   */}
      <Image src={Logo} alt="logo" className="w-32 h-auto block dark:hidden rtl:scale-x-[-1]" />    
    </Link>
  );
};

export default FullLogo;
