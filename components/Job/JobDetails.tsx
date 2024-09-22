import { FC, useEffect, useState } from "react";
import {
  Job,
  MarkerCoordinates,
  EmployeesResponseData,
  EmployeeData,
  JobStatus,
  JobReportResponseData,
  JobImagesResponseData,
} from "@/types/types";
import { useRouter } from "next/navigation";
import { Button } from "../Ui/Button";
import SmallMaps from "../User/SmallMaps";
import useSWR from "swr";
import { config } from "@/lib/api/config";
import { fetcher } from "@/lib/httpClient";
import { decodeGeoHash } from "@/utils/decodeGeo";
import JobDetailsCard from "./JobDetailsCard";
import CustomerDetailsCard from "./CustomerDetailsCard";
import EmployeeDetailsCard from "./EmployeeDetailsCard";
import { clsxm } from "@/utils/clsxm";
import LeadSourceDetailsCard from "./LeadSourceDetailsCard";
import LoadingIndicatorSmall from "../Indicators/LoadingIndicatorSmall";
import JobProgress from "./JobProgress";
import JobNotes from "./JobNotes";
import { JobReceipt } from "./JobReceipt";
import JobImageGallery from "./JobImageGallery";

type Props = {
  job: Job;
  delete: () => void;
  onAssign: () => void;
};

export const JobDetails: FC<Props> = ({ job, delete: onDelete, onAssign }) => {
  const [availableEmployeesCoordinates, setAvailableEmployeesCoordinates] =
    useState<MarkerCoordinates[]>([]);
  const router = useRouter();

  const navigation = useRouter();

  const { data: employeeData, isLoading } = useSWR<EmployeesResponseData>(
    config.employeesList + "?role=INSTALLER",
    fetcher
  );

  const {
    data: reportsData,
    error: reportError,
    isLoading: reportLoading,
  } = useSWR<JobReportResponseData>(
    job?.receipt?.job_id
      ? `${config.jobReport}?id=${job.receipt.job_id}`
      : null,
    fetcher
  );

  const {
    data: imagesData,
    error: imagesError,
    isLoading: imagesLoading,
  } = useSWR<JobImagesResponseData>(
    `${config.jobImages}?id=${job.id}`,
    fetcher
  );

  useEffect(() => {
    if (employeeData?.data?.employees) {
      const employeesCoordinates: MarkerCoordinates[] = [];
      employeeData?.data.employees.map((employee: EmployeeData) => {
        if (employee.geoHash) {
          const { latitude, longitude } = decodeGeoHash(employee.geoHash);

          employeesCoordinates.push({
            latitude: latitude,
            longitude: longitude,
            data: employee,
          });
        }
      });
      setAvailableEmployeesCoordinates(employeesCoordinates);
    }
  }, [employeeData]);

  const cardClasses = [
    "xl:col-span-2",
    "lg:col-span-3",
    "md:col-span-1",
    "sm:col-span-1",
    "w-full",
    "rounded-lg",
    "border",
    "border-gray-200",
    "p-6",
    "shadow",
    "hover:bg-gray-100",
    "hover:cursor-pointer",
    "dark:border-gray-700",
    "dark:bg-gray-800",
    "dark:hover:bg-gray-700",
  ];

  const gridClasses = [
    "grid",
    "gap-2",
    "xl:grid-cols-6",
    "lg:grid-cols-3",
    "md:grid-cols-1",
    "sm:grid-cols-1",
  ];

  return (
    <div className={clsxm("rounded-sm", "shadow-default", "dark:bg-boxdark")}>
      <div>
        <div className="flex w-full">
          {job.status === JobStatus.DONE && (
            <div>
              <JobReceipt job={job} />
            </div>
          )}
          <div className="my-4 flex w-full flex-1 justify-end gap-4">
            <Button
              variant="outline"
              className="w-[100px]"
              size="xs"
              onClick={() => router.push(`/job/edit/${job.id}`)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              className="w-[100px]"
              size="xs"
              onClick={() => onDelete()}
            >
              Delete
            </Button>
          </div>
        </div>
        <div className="flex w-full items-center justify-center">
          <JobProgress job={job} />
        </div>

        {isLoading ? (
          <LoadingIndicatorSmall />
        ) : (
          <div className={clsxm(gridClasses)}>
            <JobDetailsCard job={job} className={cardClasses} />
            {job?.customer && (
              <CustomerDetailsCard
                job={job}
                className={cardClasses}
                onClick={() => navigation.push(`/client/${job.customer.id}`)}
              />
            )}

            {employeeData?.data?.employees &&
              job?.assigned_employees?.length !== 0 &&
              job?.assigned_employees[0] !== undefined && (
                <EmployeeDetailsCard
                  job={job}
                  className={cardClasses}
                  employees={employeeData?.data?.employees}
                  onAssign={() => onAssign()}
                  onClick={() =>
                    navigation.push(
                      `/super/${job?.assigned_employees[0]?.employee?.id}`
                    )
                  }
                />
              )}
            {job?.customer?.lead_source && (
              <LeadSourceDetailsCard
                leadSource={job.customer.lead_source}
                className={cardClasses}
              />
            )}
          </div>
        )}
      </div>
      {reportsData && reportsData?.data && (
        <div className="flex w-full items-start justify-start py-4">
          <JobNotes reports={reportsData?.data.reports} />
        </div>
      )}
      {imagesData && imagesData?.data && imagesData?.data.count > 0 && (
        <div className="flex w-full py-3">
          <JobImageGallery images={imagesData?.data.images.map((f)=>({id: f.id, url: f.image_url}))} />
        </div>
      )}
      <div className="my-2 flex w-full items-center justify-center py-4">
        {job?.geoHash && (
          <SmallMaps
            markercoordinates={availableEmployeesCoordinates}
            hash={job.geoHash}
          />
        )}
      </div>
    </div>
  );
};
