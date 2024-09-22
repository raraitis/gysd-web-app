import CategoryPage from "@/components/Categories/CategoryPage";

export default function Page({ params }: { params: { category: string } }) {
  return <CategoryPage category={params.category} />;
}