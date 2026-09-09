import { SessionDetailView } from "@/components/student/StudentViews";
export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SessionDetailView id={id} />;
}
