import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CategoriesForm from "@/components/Forms/CategoriesForm";

const AddCategoryPage = () => {
  return (
    <>
      <Breadcrumb pageName="Add new category" />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-1" />
        <div className="col-span-10">
          <CategoriesForm />
        </div>
        <div className="col-span-1" />
      </div>
    </>
  );
};

export default AddCategoryPage;
