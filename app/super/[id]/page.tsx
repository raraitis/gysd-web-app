import EmployeePage from "@/components/User/EmployeePage";

type Props = {
  params: { id: string };
};
export default function Page({ params }: Props) {
  return (
    <div className="flex h-full w-full">
      <EmployeePage id={params.id} />
    </div>
  );
}
