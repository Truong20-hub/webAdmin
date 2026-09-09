import { AssignmentDetailView } from "@/components/student/StudentViews";
export default async function AssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AssignmentDetailView id={id} />;
}
