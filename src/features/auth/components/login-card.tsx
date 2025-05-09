"use client";

import Card from "@/components/layout/card";
import GridItem from "@/components/layout/grid-item";
import Login from "./login";
import { useSession } from "next-auth/react";

interface LoginCardProps {
  label?: string; 
}

const LoginCard = ({ label }: LoginCardProps) => {
    const { data: session } = useSession();

    if (session) {
        return null;
    }

    return (
        <GridItem colSpan={3}>
          <Card>
            <div className="flex flex-col justify-center items-center m-4 gap-4">
              <h1 className="text-3xl my-3">{label || "Salut, connecte-toi !"}</h1>
              <Login />
            </div>
          </Card>
        </GridItem>
    );
};

export default LoginCard;
