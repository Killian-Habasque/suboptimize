"use client";

import Card from "@/components/layout/card";
import GridItem from "@/components/layout/grid-item";
import Login from "./login";
import { useSession } from "next-auth/react";

interface LoginCardProps {
  label?: string; 
}

const LoginCard = ({ label }: LoginCardProps) => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <GridItem colSpan={3}>
                <Card>
                    <div className="flex flex-col justify-center items-center m-4 gap-4">
                        <div className="animate-pulse">
                            <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
                            <div className="h-10 w-full bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </Card>
            </GridItem>
        );
    }

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
