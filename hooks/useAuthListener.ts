import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export const useAuthListener = () => {
  const { status } = useSession();

  if (status === "unauthenticated") {
    return false;
  }

  return true;
};
