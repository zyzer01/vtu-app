import Header from "@/components/shared/header";
import React from "react";

const GeneralLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default GeneralLayout;
