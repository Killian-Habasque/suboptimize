"use client";

import { useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
    const AuthenticatedComponent = (props: P) => {
        const { currentUser } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!currentUser) {
                router.push("/");
            }
        }, [currentUser, router]);

        if (!currentUser) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

    return AuthenticatedComponent;
};

export default withAuth;
