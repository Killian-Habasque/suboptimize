import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { baseAuth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await baseAuth();

    if (!session?.user?.id) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        categories: true,
        companies: true,
      },
    });

    if (!subscription) {
      return new NextResponse("Abonnement non trouvé", { status: 404 });
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'abonnement:", error);
    return new NextResponse(
      "Erreur lors de la récupération de l'abonnement",
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await baseAuth();

    if (!session?.user?.id) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingSubscription) {
      return new NextResponse("Abonnement non trouvé", { status: 404 });
    }

    const {
      title,
      dueDate,
      endDate,
      price,
      categoryIds,
      companyIds,
      customCompany,
    } = await request.json();

    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        slug: title.toLowerCase().replace(/ /g, '-'),
        price,
        dueType: "monthly", 
        dueDay: new Date(dueDate).getDate(),
        startDatetime: new Date(dueDate),
        endDatetime: endDate ? new Date(endDate) : null,
        categories: {
          set: [],
          connect: categoryIds?.map((id: string) => ({ id })) || [],
        },
        companies: {
          set: [], 
          connect: companyIds?.map((id: string) => ({ id })) || [],
        },
        customCompany: customCompany ?? null,
      },
      include: {
        categories: true,
        companies: true,
      },
    });

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'abonnement:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "Un abonnement avec ce nom existe déjà." },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'abonnement" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await baseAuth();

    if (!session?.user?.id) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingSubscription) {
      return new NextResponse("Abonnement non trouvé", { status: 404 });
    }

    await prisma.subscription.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'abonnement:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'abonnement" },
      { status: 500 }
    );
  }
}