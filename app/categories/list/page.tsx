import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CategoriesList from "@/components/Tables/CategoriesList";

const CategoriesListPage = async () => {
  return (
    <>
      <Breadcrumb pageName="Categories" />
      <div className="flex flex-col gap-10">
        <CategoriesList />
      </div>
    </>
  );
};

export default CategoriesListPage;
