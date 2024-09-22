"use client";

import { Option, Price } from "@/types/types";
import { clsxm } from "@/utils/clsxm";
import { PlusIcon } from "@heroicons/react/24/outline";
import useModal from "../common/modal/modal";
import { FC, useState } from "react";
import JobsPriceFormNew from "../Forms/JobsPriceFormNew";
import PaginationRow from "../Pagination/PaginationRow";
import { remove } from "@/lib/api/common";
import axios from "axios";
import { config } from "@/lib/api/config";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import TableJobTypesAndPricesRow from "./TableJobTypesAndPricesRow";

type Props = {
  prices: Price[];
  count: number;
  onPageChange: (page: number) => void;
  currentPage: number;
  mutate: () => void;
};
export enum ModalActions {
  CREATE = "Create",
  EDIT = "Edit",
  DELETE = "Delete",
  NONE = "None",
}

function EditJobTypeAndPriceModalForm(mutate: () => void, price?: Price) {
  return price ? (
    <JobsPriceFormNew price={price} mutate={mutate} />
  ) : (
    <JobsPriceFormNew mutate={mutate} />
  );
}

function DeleteJobTypeAndPriceModalForm(mutate: () => void) {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-black dark:text-white">
        Are you sure you want to delete this job type and price?
      </p>
    </div>
  );
}

export default function TableJobTypesAndPrices({
  prices,
  mutate,
  count,
  onPageChange,
  currentPage,
}: Readonly<Props>) {
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);
  const [modalAction, setModalAction] = useState<ModalActions>(
    ModalActions.NONE
  );
  const { openModal, closeModal, ModalWrapper } = useModal();

  const totalPages = Math.ceil(count / 10);

  const nextPage = () => {
    if (!prices) {
      return;
    }

    const totalPageCount = totalPages;

    if (currentPage + 1 >= totalPageCount + 1) {
      return;
    }

    onPageChange(currentPage + 1);
  };

  const prevPage = () => {
    if (!prices) {
      return;
    }

    if (currentPage - 1 <= 0) {
      return;
    }

    onPageChange(currentPage - 1);
  };

  const onPage = (page: number) => {
    if (currentPage === page) {
      return;
    }

    onPageChange(page);
  };

  async function handleDelete(id: string) {
    await remove({
      client: axios,
      url: config.adminJobPriceDelete,
      config: {
        data: {
          id,
        },
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onResponse: ({ data, status }) => {
        toast.success("Job deleted successfully");
        mutate();
      },
    });
  }

  function sortPrices(prices: Price[]) {
    return prices.sort((a, b) =>
      dayjs(a.created_at).isBefore(dayjs(b.created_at)) ? -1 : 1
    );

    // return prices;
  }

  return (
    <div
      className={clsxm(
        "rounded-sm",
        "bg-white",
        "px-5",
        "pb-2.5",
        "pt-6",
        "shadow-default",
        "dark:border-strokedark",
        "dark:bg-boxdark",
        "sm:px-7.5",
        "xl:pb-1",
        "overflow-x-auto",
        "no-scrollbar",
        "h-[100%]"
      )}
    >
      <div className="mb-4 flex w-full justify-end">
        <div
          className="flex w-10 cursor-pointer"
          onClick={() => {
            setModalAction(ModalActions.CREATE);
            openModal();
          }}
        >
          <PlusIcon width={30} />
        </div>
      </div>

      <div
        className={`no-scrollbar items-startflex max-w-full flex-col justify-center overflow-x-auto`}
      >
        <table className="no-scrollbar w-full table-auto ">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[120px] max-w-full px-4 py-4 font-medium text-black dark:text-white">
                Name
              </th>
              <th className="min-w-[120px] max-w-full px-4 py-4 font-medium text-black dark:text-white">
                Category
              </th>
              <th className="min-w-[120px] max-w-full px-4 py-4 font-medium text-black dark:text-white">
                Origin
              </th>
              <th className="max-w-full px-4 py-4 text-right font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {prices &&
              prices.length !== 0 &&
              sortPrices(prices).map((price: any) => (
                <TableJobTypesAndPricesRow
                  key={price.id}
                  price={price}
                  onDelete={() => {
                    setSelectedPrice(price);
                    setModalAction(ModalActions.DELETE);
                    openModal();
                  }}
                  onEdit={() => {
                    setSelectedPrice(price);
                    setModalAction(ModalActions.EDIT);
                    openModal();
                  }}
                />
              ))}
          </tbody>
          {selectedPrice && modalAction === ModalActions.EDIT && (
            <ModalWrapper
              title={`Edit job type for ${selectedPrice?.job}`}
              content={EditJobTypeAndPriceModalForm(mutate, selectedPrice)}
              onClose={() => {
                closeModal();
                setModalAction(ModalActions.NONE);
                setSelectedPrice(null);
              }}
            />
          )}

          {modalAction === ModalActions.CREATE && !selectedPrice && (
            <ModalWrapper
              title={`Create new job type and price`}
              content={EditJobTypeAndPriceModalForm(mutate)}
              onClose={() => {
                closeModal();
                setModalAction(ModalActions.NONE);
              }}
            />
          )}
          {modalAction === ModalActions.DELETE && selectedPrice && (
            <ModalWrapper
              title={`Delete Job ${selectedPrice.job}?`}
              content={DeleteJobTypeAndPriceModalForm(mutate)}
              onOk={() => {
                handleDelete(selectedPrice.id);
                closeModal();
                setModalAction(ModalActions.NONE);
              }}
              onClose={() => {
                closeModal();
                setSelectedPrice(null);
                setModalAction(ModalActions.NONE);
              }}
            />
          )}
        </table>
      </div>
      <PaginationRow
        page={currentPage - 1}
        perPage={10}
        pagination={{ totalEntries: count, totalPages: totalPages }}
        onClickNext={nextPage}
        onClickPrevious={prevPage}
        onClickPage={onPage}
      />
    </div>
  );
}
