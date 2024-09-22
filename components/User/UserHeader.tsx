"use client";

import { Customer } from "@/types/types";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const UserHeader = ({ user }: { user: Customer | undefined }) => {
  if (!user) {
    return null;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white p-2 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                ID
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Name
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Company
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Phone
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                <p className="text-black dark:text-white">{user.id}</p>
              </td>
              <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                <p className="text-black dark:text-white">{user.first_name}</p>
              </td>
              <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                <p className="text-black dark:text-white">{user.email}</p>
              </td>
              <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                <p className="text-black dark:text-white">{user.company}</p>
              </td>
              <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {user.mobile_number}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserHeader;
