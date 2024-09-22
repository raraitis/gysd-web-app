"use client";

import Loader from "../common/Loader";
import { Category, JobsCategoriesResponse } from "@/types/types";
import PaginationRow from "../Pagination/PaginationRow";
import { FC, useState } from "react";
import { useDebounceNew } from "@/utils/use-debounce-new";
import {
  EyeSlashIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import useModal from "../common/modal/modal";
import { remove } from "@/lib/api/common";
import toast from "react-hot-toast";
import CategoriesTable from "./CategoriesTable";
import useSWR from "swr";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import axios from "axios";
import { ModalActions } from "./TableJobTypesAndPrices";
import CategoriesForm from "../Forms/CategoriesForm";

export const categoryActionModal = (action: any) => {
  const text = "delete";

  return (
    <div>
      <p className="text-md font-semibold">
        {`Do you really want to ${text} this category?`}
      </p>
    </div>
  );
};

const CategoriesList: FC = ({}) => {
  const [searchInput, setSearchInput] = useState<string | undefined>();
  const debouncedSearchInput = useDebounceNew(searchInput, 1000);
  const [currentPage, setCurrentPage] = useState(1);
  const { openModal, closeModal, ModalWrapper } = useModal();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [modalAction, setModalAction] = useState<ModalActions>(
    ModalActions.NONE
  );

  const pageLength = 10;

  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: isCategoriesLoading,
    mutate: categoriesMutate,
    isValidating: isCategoriesValidating,
  } = useSWR<JobsCategoriesResponse>(config.adminJobCategories, fetcher);

  if (categoriesError && !isCategoriesLoading && !isCategoriesValidating)
    return <div>Failed to load</div>;

  const totalPages = categoriesData
    ? Math.ceil(categoriesData.data.count / 10)
    : 1;

  const handlePageChange = (page: number) => {
    if (isCategoriesLoading) {
      return;
    }
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (isCategoriesLoading) {
      return;
    }

    if (!categoriesData) {
      return;
    }

    if (currentPage + 1 >= totalPages + 1) {
      return;
    }

    const newPage = currentPage + 1;
    setCurrentPage(newPage);
  };

  const prevPage = () => {
    if (isCategoriesLoading) {
      return;
    }

    if (!isCategoriesLoading) {
      return;
    }

    if (currentPage - 1 <= 0) {
      return;
    }

    const newPage = currentPage - 1;
    setCurrentPage(newPage);
  };

  const onDelete = (item: Category) => {
    setSelectedCategory(item);
    openModal();
  };

  const handleDelete = async (id: string) => {
    await remove({
      client: axios,
      url: config.deleteCategory,
      config: {
        data: {
          id: selectedCategory?.id,
        },
      },
      onError: (error) => {
        closeModal();
        toast.error(error.message);
      },
      onResponse: ({ data, status }) => {
        closeModal();
        toast.success("Category deleted successfully");
        categoriesMutate();
      },
    });
  };

  const handleClose = () => [console.log("WTF")];

  return (
    <div
      className={clsx(
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
        "no-scrollbar",
        "overflow-x-auto",
        "h-[100%]"
      )}
    >
      <div className="flex flex-wrap gap-4 pb-4">
        <div className="flex w-full justify-between">
          <div></div>
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
      </div>
      <div
        className={`flex max-w-full flex-col ${
          categoriesData?.data?.count === 0 ? "items-center" : "items-start"
        } no-scrollbar justify-center overflow-x-auto`}
      >
        <div className="relative mb-5 mt-1 w-full">
          <button className="absolute left-0 top-1/2 -translate-y-1/2">
            <MagnifyingGlassIcon width={20} height={20} />
          </button>
          <input
            type="text"
            placeholder="Type to search..."
            className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
        </div>
        <div className="flex w-full items-center justify-center">
          {(!categoriesData && !categoriesData) ||
          isCategoriesLoading ||
          isCategoriesValidating ? (
            <Loader />
          ) : (
            <CategoriesTable
              categories={categoriesData?.data?.categories ?? []}
              onDelete={(item: Category) => onDelete(item)}
              onEdit={(category) => {
                openModal();
                setSelectedCategory(category);
                setModalAction(ModalActions.EDIT);
              }}
            />
          )}
        </div>
        {categoriesData?.data?.count === 0 && (
          <div className="flex py-4 hover:cursor-pointer">
            <div className="flex items-center rounded-md border p-2">
              <EyeSlashIcon className="h-6 w-8" />
              <div className="flex px-2">NO DATA</div>
            </div>
          </div>
        )}
        {modalAction !== ModalActions.CREATE && (
          <ModalWrapper
            title={`Delete ${selectedCategory?.category}`}
            type="warning"
            content={categoryActionModal(selectedCategory?.category)}
            onOk={() => handleDelete(selectedCategory?.id ?? "")}
            onClose={() => {
              categoriesMutate;
              closeModal();
              setModalAction(ModalActions.NONE);
            }}
          />
        )}
        {modalAction === ModalActions.CREATE && (
          <ModalWrapper
            title={`Add new category`}
            content={
              <CategoriesForm
                onMutate={categoriesMutate}
                close={() => {
                  closeModal(), setModalAction(ModalActions.NONE);
                }}
              />
            }
            onClose={() => {
              categoriesMutate();
              closeModal();
              setModalAction(ModalActions.NONE);
            }}
          />
        )}
        {modalAction === ModalActions.EDIT && (
          <ModalWrapper
            title={`Edit category`}
            content={
              <CategoriesForm
                onMutate={categoriesMutate}
                category={selectedCategory}
                close={() => {
                  closeModal(), setModalAction(ModalActions.NONE);
                }}
              />
            }
            onClose={() => {
              closeModal();
              setModalAction(ModalActions.NONE);
              categoriesMutate;
            }}
          />
        )}
      </div>
      <PaginationRow
        page={currentPage - 1}
        perPage={pageLength}
        pagination={{
          totalEntries: categoriesData?.data?.count || 0,
          totalPages: totalPages,
        }}
        onClickNext={nextPage}
        onClickPrevious={prevPage}
        onClickPage={handlePageChange}
      />
    </div>
  );
};

export default CategoriesList;
