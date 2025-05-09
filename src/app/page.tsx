import { redirect } from "next/navigation";
import { auth } from "@/lib/auth-helper";

export default async function Home() {
  const user = await auth();

  if (user) {
    redirect("/abonnements");
  } else {
    redirect("/connexion");
  }
}
