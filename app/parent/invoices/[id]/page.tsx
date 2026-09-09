import { ParentInvoiceDetail } from "@/components/parent/ParentViews";
export default async function ParentInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ParentInvoiceDetail id={id} />;
}
