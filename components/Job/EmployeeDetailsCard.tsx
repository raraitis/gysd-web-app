import { Employee, EmployeeData, Job } from "@/types/types";
import { useState } from "react";
import { Button } from "../Ui/Button";
import AssignJobModal from "../Dashboard/JobsDashboard/AssignJobModal";
import { FieldRow } from "./FieldRow";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import EmployeeStatusChip from "../Employees/EmployeeStatusChip";
import { clsxm } from "@/utils/clsxm";
import RoleChip from "../Employees/RoleChip";
import useClipboard from "../common/Buttons/CopyButton";

type EmployeeDetailsCardProps = {
  job: Job;
  className?: string[];
  employees: EmployeeData[];
  onClick?: () => void;
  onAssign: () => void;
};

export default function EmployeeDetailsCard({
  job,
  className,
  employees,
  onClick,
  onAssign,
}: Readonly<EmployeeDetailsCardProps>) {
  const [isAssignJobModalOpen, setIsAssignJobModalOpen] = useState(false);

  const toggleAssignJobModal = () => {
    setIsAssignJobModalOpen(!isAssignJobModalOpen);
  };
  const handleAssigned = () => {
    onAssign();
  };

  return (
    <div className={clsxm(className)} onClick={onClick}>
      {job?.assigned_employees?.length !== 0 &&
      job?.assigned_employees[0] &&
      employees.length !== 0 &&
      employees ? (
        employees
          .filter((em: Employee) => {
            return em.id === job.assigned_employees[0].employee_id;
          })
          .map((employee: EmployeeData) => {
            return (
              <div key={employee.id}>
                <h3 className="text-md mb-4 flex justify-between font-semibold text-gray-400">
                  Assigned Employee
                </h3>
                <div className="flex flex-col items-center justify-center">
                  <div className="h-24 w-24 rounded-3xl border-2 border-gray-200 opacity-80 shadow-2">
                    <UserIcon />
                  </div>
                  <FieldRow
                    value={`${employee.first_name} ${employee.last_name}`}
                  />

                  <div className="flex flex-row gap-3">
                    <RoleChip type={employee?.role} />
                    <EmployeeStatusChip type={employee?.status} />
                  </div>
                </div>

                <FieldRow
                  label={"Address"}
                  value={employee.address}
                  icon={<MapPinIcon height={18} />}
                />

                <FieldRow
                  label={"Email"}
                  value={employee.email}
                  icon={<EnvelopeIcon height={18} />}
                />
                <FieldRow
                  label={"Phone number"}
                  value={employee.mobile_number}
                  icon={<PhoneIcon height={18} />}
                />
              </div>
            );
          })
      ) : (
        <div className="flex flex-col gap-3">
          <h3 className="text-md mb-4 flex justify-between font-semibold text-gray-400">
            No assigned employees
          </h3>
          <Button
            className="w-[100px]"
            size="xs"
            onClick={toggleAssignJobModal}
          >
            Assign
          </Button>
        </div>
      )}
      {isAssignJobModalOpen && (
        <AssignJobModal
          assigned={() => handleAssigned()}
          job={job}
          onClose={toggleAssignJobModal}
        />
      )}
    </div>
  );
}
