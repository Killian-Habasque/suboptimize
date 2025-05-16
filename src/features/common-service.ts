import { Category, Company } from "@prisma/client";

export interface CommonData {
    categories: Category[];
    companies: Company[];
}

export async function fetchCommonData(): Promise<CommonData> {
    try {
        const [categoriesRes, companiesRes] = await Promise.all([
            fetch("/api/categories"),
            fetch("/api/companies"),
        ]);

        if (!categoriesRes.ok || !companiesRes.ok) {
            throw new Error("Erreur lors du chargement des données");
        }

        const [categories, companies] = await Promise.all([
            categoriesRes.json(),
            companiesRes.json(),
        ]);

        return {
            categories,
            companies,
        };
    } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        throw error;
    }
} 