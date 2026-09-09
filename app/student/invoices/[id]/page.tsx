import { InvoiceDetailView } from "@/components/student/StudentViews";
export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InvoiceDetailView id={id} />;
}
