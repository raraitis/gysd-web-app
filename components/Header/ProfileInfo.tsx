import { FC } from "react";
import { useSession } from "next-auth/react";
import { parseJwt } from "@/utils/parseJwt";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const ProfileInfo: FC = () => {
  const session = useSession();
  const router = useRouter();

  const firstName = session.data?.user?.accessToken
    ? parseJwt(session.data?.user?.accessToken).first_name
    : null;

  const lastName = session.data?.user?.accessToken
    ? parseJwt(session.data?.user?.accessToken).last_name
    : null;

  return (
    <div
      onClick={() => router.push("/super/profile")}
      className="font-sans relative grid cursor-pointer select-none items-center whitespace-nowrap rounded-full bg-orange-500/95 px-3 py-2 text-xs font-bold uppercase text-white"
    >
      <div className="absolute left-1.5 top-2/4 h-5 w-5 -translate-y-2/4">
        <UserCircleIcon />
      </div>
      <span className="ml-[18px]">
        <p className="font-sans block text-sm font-medium capitalize leading-none text-white antialiased">
          {session && `${firstName} ${lastName}`}
        </p>
      </span>
    </div>
  );
};

export default ProfileInfo;
