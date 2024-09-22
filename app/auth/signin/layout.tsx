"use client";
import "../../globals.css";
import "../../data-tables-css.css";
import "../../satoshi.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="my-auto flex h-full justify-center dark:bg-boxdark-2 dark:text-bodydark ">
          <div className="flex h-screen overflow-hidden">
            {/* <!-- ===== Content Area Start ===== --> */}
            <div className="relative flex flex-1 flex-col justify-center overflow-y-auto overflow-x-hidden">
              {/* <!-- ===== Main Content Start ===== --> */}
              <main>
                <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                  {children}
                </div>
              </main>
              {/* <!-- ===== Main Content End ===== --> */}
            </div>
            {/* <!-- ===== Content Area End ===== --> */}
          </div>
        </div>
      </body>
    </html>
  );
}
