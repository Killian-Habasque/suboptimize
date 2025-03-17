"use client";

import { useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/users/authContext";

const withGuest = <P extends object>(WrappedComponent: ComponentType<P>) => {
    const GuestComponent = (props: P) => {
        const { currentUser } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (currentUser) {
                router.push("/");
            }
        }, [currentUser, router]);

        if (currentUser) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    GuestComponent.displayName = `withGuest(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

    return GuestComponent;
};

export default withGuest;
