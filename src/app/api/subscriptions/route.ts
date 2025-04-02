import { NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"
import { baseAuth } from "@/lib/auth"



export async function GET(request: Request) {
    try {
        const session = await baseAuth()
        if (!session?.user?.id) {
            return new NextResponse("Non autorisé", { status: 401 })
        }

        const subscriptions = await prisma.subscription.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                categories: true,
                companies: true
            }
        })

        return NextResponse.json(subscriptions)
    } catch (error) {
        console.error("Erreur lors de la récupération des abonnements:", error)
        return new NextResponse(
            `Erreur lors de la récupération des abonnements: ${error.message}`,
            { status: 500 }
        )
    }
}

// ... votre POST existant ...
export async function POST(request: Request) {
    try {
        const session = await baseAuth()
        
        if (!session?.user?.id) {
            console.error(!session?.user?.id)
            return new NextResponse("Non autorisé - Utilisateur non connecté", { status: 401 })
        }

        const {
            title,
            dueDate,
            endDate,
            price,
            categoryIds,
            companyIds,
        } = await request.json()

        const subscription = await prisma.subscription.create({
            data: {
                title,
                slug: title.toLowerCase().replace(/ /g, '-'),
                price,
                dueType: "monthly",
                dueDay: new Date(dueDate).getDate(),
                startDatetime: new Date(dueDate),
                endDatetime: endDate ? new Date(endDate) : null,
                user: {
                    connect: { id: session.user.id }
                },
                categories: {
                    connect: categoryIds?.map(id => ({ id })) || []
                },
                companies: {
                    connect: companyIds?.map(id => ({ id })) || []
                }
            },
        })

        return NextResponse.json(subscription)
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'abonnement:", error)
        return new NextResponse(
            `Erreur lors de l'ajout de l'abonnement: ${error.message}`,
            { status: 500 }
        )
    }
}