import ProductForm from "@/components/admin/product-form";
import { getProductById } from "@/lib/actions/product.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "Update Product",
};

const AdminProductUpdatePage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  await requireAdmin();

  const { id } = await props.params;

  const product = await getProductById(id);
  if (!product) return notFound();

  const formattedProduct = {
    ...product,
    price: product.price?.toString?.() ?? "",
    rating: product.rating?.toString?.() ?? "",
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Product</h1>

      <ProductForm
        type="Update"
        product={formattedProduct}
        productId={formattedProduct.id}
      />
    </div>
  );
};

export default AdminProductUpdatePage;
