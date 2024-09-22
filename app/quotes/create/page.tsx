import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import QuoteAddForm from "@/components/Forms/Quotes/QuoteAddForm";

const Page = () => {
  return (
    <>
      <Breadcrumb pageName="New Quote" />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-1" />
        <div className="col-span-10">
          <QuoteAddForm />
        </div>
        <div className="col-span-1" />
      </div>
    </>
  );
};

export default Page;
