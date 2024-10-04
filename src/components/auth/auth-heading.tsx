import React from "react";


interface AuthHeadingProps {
    heading: string;
    subheading: string;
}

const AuthHeading: React.FC<AuthHeadingProps> = ({heading, subheading}) => {
  return (
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        {heading}
      </h1>
      <p className="text-sm text-muted-foreground">
        {subheading}
      </p>
    </div>
  )
}

export default AuthHeading
