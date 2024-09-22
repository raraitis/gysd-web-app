"use client";
import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import { useState, useEffect } from "react";
import Loader from "@/components/common/Loader";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SessionProvider, useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { LoadScript } from "@react-google-maps/api";
import useSWR, { SWRConfig } from "swr";

const Toaster = dynamic(
  () => import("react-hot-toast").then((c) => c.Toaster),
  {
    ssr: false,
  }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
          <LoadScript
            googleMapsApiKey={"AIzaSyAu34ySpxPw9VO2AU9Lmk91gdKeKv0uvBY"}
          />
          <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {loading ? (
              <Loader />
            ) : (
              <div className="flex h-screen overflow-hidden">
                {/* <!-- ===== Sidebar Start ===== --> */}
                <Sidebar
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
                {/* <!-- ===== Sidebar End ===== --> */}

                {/* <!-- ===== Content Area Start ===== --> */}
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                  {/* <!-- ===== Header Start ===== --> */}
                  <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                  {/* <!-- ===== Header End ===== --> */}
                  {/* <!-- ===== Main Content Start ===== --> */}
                  <main>
                    <SWRConfig value={{ provider: () => new Map() }}>
                      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                        {children}
                      </div>
                    </SWRConfig>
                  </main>
                  {/* <!-- ===== Main Content End ===== --> */}
                </div>
                {/* <!-- ===== Content Area End ===== --> */}
              </div>
            )}
          </div>
          <AuthListener />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}

export const AuthListener = () => {
  const { data: session, status, update } = useSession();
  const pathname = usePathname();

  // redirect to signin if there is no session.
  if (
    (status === "unauthenticated" ||
      (session && session.user && !!!session.user.accessToken)) &&
    pathname !== "/auth/signin"
  ) {
    redirect("/auth/signin");
  }

  useEffect(() => {
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return true;
};
