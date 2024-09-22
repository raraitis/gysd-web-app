import { EmployeeData } from "@/types/types";
import { FC, useState } from "react";

type Permission = {
  permissionName: string;
  status: boolean;
};

type Props = {
  employee: EmployeeData;
  permissions?: Permission[];
  onSave: (permissions: Permission[]) => void;
};

const PermissionCard: FC<Props> = ({ permissions = [], onSave, employee }) => {
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [editedPermissions, setEditedPermissions] =
    useState<Permission[]>(permissions);
  const [initialPermissions, setInitialPermissions] = useState<Permission[]>(
    []
  );

  const toggleEdit = () => {
    if (!permissionsOpen) {
      setEditedPermissions(initialPermissions);
    }
    setPermissionsOpen(!permissionsOpen);
  };

  const handlePermissionChange = (permissionName: string) => {
    const updatedPermissions = editedPermissions.map((permission) =>
      permission.permissionName === permissionName
        ? { ...permission, status: !permission.status }
        : permission
    );
    setEditedPermissions(updatedPermissions);
  };

  const handleSave = () => {
    onSave(editedPermissions);
    toggleEdit();
  };

  console.log("EMPLOYEE ::: :: :", employee);

  // useEffect(() => {
  //   const employeePermissions = Object.entries(employee.permissions).map(
  //     ([permissionName, status]) => ({
  //       permissionName,
  //       status: Boolean(status),
  //     })
  //   );
  //   setEditedPermissions(employeePermissions);
  //   setInitialPermissions(employeePermissions);
  // }, [employee.permissions]);

  const hasChanges = !(
    JSON.stringify(editedPermissions) === JSON.stringify(initialPermissions)
  );

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold">Employee Permissions</h2>
      <div className="w-full rounded-md bg-white p-4 shadow-md">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="mb-2 text-lg font-semibold">Permissions</h2>
          <div className="flex items-center gap-2">
            {hasChanges && permissionsOpen && (
              <button
                className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-opacity-90"
                onClick={handleSave}
              >
                Save
              </button>
            )}
            <button
              className="rounded-md bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
              onClick={toggleEdit}
            >
              {permissionsOpen ? "Close" : "Edit"}
            </button>
          </div>
        </div>

        {permissionsOpen && (
          <div className="grid grid-cols-1 gap-4 border-t border-gray-300 pt-3">
            {editedPermissions.map((permission) => (
              <div
                key={permission.permissionName}
                className="flex justify-between px-6"
              >
                <div className="flex">
                  <input
                    type="checkbox"
                    checked={permission.status}
                    onChange={() =>
                      handlePermissionChange(permission.permissionName)
                    }
                    className="h-6 w-6 cursor-pointer rounded-md accent-orange-500"
                  />
                  <label className="ml-3 font-semibold">
                    {permission.permissionName.replace(/_/g, " ") + ":"}
                  </label>
                </div>
                <div className="flex items-start pr-5">
                  <label className="flex items-center">
                    <span
                      className={`ml-2 ${
                        permission.status ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {permission.status ? "Yes" : "No"}
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionCard;
