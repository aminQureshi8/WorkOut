import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import WorkoutProgram from "@/modules/subscription/WorkoutProgram";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const cookieStore = await cookies();

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/workout/full`, {
    headers: { cookie: cookieStore.toString() },
  });

  const result = await res.json();

  console.log(result);

  return <WorkoutProgram plan={result.plan} days={result.days} />;
}
