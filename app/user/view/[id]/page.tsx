import CustomerPage from "@/components/User/CustomerPage";

export default function Page({ params }: { params: { id: string } }) {
  return <CustomerPage id={params.id} />;
}
