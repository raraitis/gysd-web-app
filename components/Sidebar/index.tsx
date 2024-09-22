import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarLinkGroup from "./SidebarLinkGroup";
import Image from "next/image";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  BriefcaseIcon,
  UserGroupIcon,
  RectangleGroupIcon,
  CalendarDaysIcon,
  IdentificationIcon,
  FolderIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { RoleType } from "@/types/user";
import { useRole } from "@/utils/parseJwt";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const isAdminSuper = useRole([RoleType.SUPER, RoleType.ADMIN]);

  const pathname = usePathname();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  let storedSidebarExpanded = "true";
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/">
          <Image width={176} height={32} src={"/logo.png"} alt="Logo" />
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <Link
                  href="/"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname === "/" && "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <RectangleGroupIcon className="h-6 w-6" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/calendar"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname === "/calendar" && "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <CalendarDaysIcon className="h-6 w-6" />
                  Calendar
                </Link>
              </li>
              <SidebarLinkGroup
                activeCondition={
                  (pathname === "/job" || pathname?.includes("job")) ?? false
                }
              >
                {(handleClick, open) => {
                  return (
                    <>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === "/categories/list" ||
                            pathname?.includes("categories/")) &&
                          "bg-graydark dark:bg-meta-4"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <FolderIcon className="h-6 w-6" />
                        Categories
                        <div className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 fill-current">
                          {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </div>
                      </Link>
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/categories/list"
                              className={`first-letter:group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "categories/list" ||
                                (pathname?.includes("categories/list") &&
                                  "text-white")
                              }`}
                            >
                              Categories list
                            </Link>
                          </li>
                          {/* <li>
                            <Link
                              href="/categories/add"
                              className={`first-letter:group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "/categories/add" && "text-white"
                              }`}
                            >
                              Add category
                            </Link>
                          </li> */}
                        </ul>
                      </div>
                    </>
                  );
                }}
              </SidebarLinkGroup>
              <SidebarLinkGroup
                activeCondition={
                  (pathname === "/job" || pathname?.includes("job")) ?? false
                }
              >
                {(handleClick, open) => {
                  return (
                    <>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === "/job/list" ||
                            pathname?.includes("job/")) &&
                          "bg-graydark dark:bg-meta-4"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <BriefcaseIcon className="h-6 w-6" />
                        Jobs
                        <div className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 fill-current">
                          {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </div>
                      </Link>
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/job/jobs"
                              className={`first-letter:group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "job/jobs" ||
                                (pathname?.includes("jobs") && "text-white")
                              }`}
                            >
                              Job list
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/job/prices"
                              className={`first-letter:group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "/job/prices" && "text-white"
                              }`}
                            >
                              Job types
                            </Link>
                          </li>
                          {/* <li>
                            <Link
                              href="/job/create"
                              className={`first-letter:group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "/job/create" && "text-white"
                              }`}
                            >
                              Add new job
                            </Link>
                          </li> */}
                        </ul>
                      </div>
                    </>
                  );
                }}
              </SidebarLinkGroup>
              <SidebarLinkGroup
                activeCondition={
                  (pathname === "/quote" || pathname?.includes("quote")) ??
                  false
                }
              >
                {(handleClick, open) => {
                  return (
                    <>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === "/quotes/list" ||
                            pathname?.includes("quote/")) &&
                          "bg-graydark dark:bg-meta-4"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <DocumentIcon className="h-6 w-6" />
                        Quotes
                        <div className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 fill-current">
                          {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </div>
                      </Link>
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/quotes/quote"
                              className={`first-letter:group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "quotes/quote" ||
                                (pathname?.includes("quotes/quote") &&
                                  "text-white")
                              }`}
                            >
                              Quotes
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/quotes/create"
                              className={`first-letter:group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "quotes/create" ||
                                (pathname?.includes("quotes/create") &&
                                  "text-white")
                              }`}
                            >
                              New quote
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/quotes/requests"
                              className={`first-letter:group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "/quotes/requests" && "text-white"
                              }`}
                            >
                              Quote requests
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </>
                  );
                }}
              </SidebarLinkGroup>
              <SidebarLinkGroup activeCondition={pathname === "/client"}>
                {(handleClick, open) => (
                  <>
                    <Link
                      href="#"
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        (pathname === "/client/clients" ||
                          pathname?.includes("client/")) &&
                        "bg-graydark dark:bg-meta-4"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        sidebarExpanded
                          ? handleClick()
                          : setSidebarExpanded(true);
                      }}
                    >
                      <UserGroupIcon className="h-6 w-6" />
                      {"Customers"}
                      <div className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 fill-current">
                        {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                      </div>
                    </Link>
                    <div
                      className={`transform overflow-hidden ${
                        !open && "hidden"
                      }`}
                    >
                      <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                        <Link
                          href="/client/list"
                          className={`first-letter:group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                            pathname === "/client/list" && "text-white"
                          }`}
                        >
                          Customer list
                        </Link>
                        <li>
                          <Link
                            href="/client/create"
                            className={`first-letter:group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                              pathname === "/client/create" && "text-white"
                            }`}
                          >
                            Add new customer
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </SidebarLinkGroup>
              {/* {isAuthAndAdmin && ( */}
              <SidebarLinkGroup
                activeCondition={
                  (pathname === "/admin/user" ||
                    pathname?.includes("admin/user")) ??
                  false
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === "/admin/user" ||
                            pathname?.includes("admin/user")) &&
                          "bg-graydark dark:bg-meta-4"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <IdentificationIcon className="h-6 w-6" />
                        Employees
                        <div className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 fill-current">
                          {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </div>
                      </Link>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/super/list"
                              className={`first-letter:group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "/super/list" && "text-white"
                              }`}
                            >
                              Employee list
                            </Link>
                          </li>

                          <li>
                            <Link
                              href="/super/create"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "/super/create" && "text-white"
                              }`}
                            >
                              Add new employee
                            </Link>
                          </li>

                          {isAdminSuper && (
                            <li>
                              <Link
                                href="/super/withdrawals"
                                className={`first-letter:group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                  pathname === "/super/withdrawals" &&
                                  "text-white"
                                }`}
                              >
                                Withdrawals
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* )} */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
