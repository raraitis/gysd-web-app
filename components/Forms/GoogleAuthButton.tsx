"use client";

import { FC, useState } from "react";
import { Button } from "../Ui/Button";
import { clsxm } from "../../utils/clsxm";
import { signIn } from "next-auth/react";
import { GoogleIcon } from "../Icons/GoogleIcon";
import toast from "react-hot-toast";

interface GoogleAuthButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

const GoogleAuthButton: FC<GoogleAuthButtonProps> = ({
  className,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);

    console.log("google auth");
    try {
      await signIn("google");
    } catch (e) {
      // toast notification
      toast("There was a problem signing in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={clsxm("flex justify-center", className)}>
      <Button
        onClick={loginWithGoogle}
        isLoading={isLoading}
        size="default"
        className="w-full"
        variant={"subtle"}
      >
        {isLoading ? null : <GoogleIcon />}
        Google
      </Button>
    </div>
  );
};

export default GoogleAuthButton;
