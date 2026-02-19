import { SignIn } from "@clerk/nextjs";
import React from "react";
const Page = () => {
    return <SignIn
        path="/sign-in"
        routing="path"
        forceRedirectUrl="/dashboard"
        signUpUrl="/sign-up"
    />;
}


export default Page;