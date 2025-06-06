import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Subscription } from "@/lib/types";

export const get_all_user_Subscriptions = async (): Promise<Subscription[]> => {
  try {
    const response = await fetch('/api/subscriptions', {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des abonnements');
    }

    const data = await response.json();
    return data.subscriptions;
  } catch (error) {
    console.error("Erreur lors de la récupération des abonnements:", error);
    throw error;
  }
};

export const add_Subscription = async (
  // userId: string,
  title: string,
  dueDate: Date,
  endDate: Date | null,
  price: number,
  categoryIds: string[],
  companyIds: string[],
  customCompany: string | null,
  dueType: "monthly" | "yearly"
) => {
  const response = await fetch('/api/subscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      title,
      dueDate,
      endDate,
      price,
      categoryIds,
      companyIds,
      customCompany,
      dueType
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erreur lors de l'ajout de l'offre");
  }

  return response.json();
}


export const update_Subscription = async (
  id: string,
  title: string,
  dueDate: Date,
  endDate: Date | null,
  price: number,
  categoryIds: string[],
  companyIds: string[],
  customCompany: string | null,
  dueType: "monthly" | "yearly"
) => {
  const response = await fetch(`/api/subscriptions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      title,
      dueDate,
      endDate,
      price,
      categoryIds,
      companyIds,
      customCompany,
      dueType
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erreur lors de la modification de l'abonnement");
  }

  return response.json();
}

export const delete_Subscription = async (id: string) => {
  const response = await fetch(`/api/subscriptions/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erreur lors de la suppression de l'abonnement");
  }

  return true;
}


export const filter_Subscriptions_by_month = (
  subscriptions: Subscription[],
  visibleDays: string[]
) => {
  return subscriptions.filter((sub) => {
    const startDate = new Date(sub.startDatetime);
    startDate.setHours(0, 0, 0, 0);
    const endDate = sub.endDatetime ? new Date(sub.endDatetime) : null;
    if (endDate) endDate.setHours(23, 59, 59, 999);

    return visibleDays.some(dayString => {
      const day = parse(dayString, 'yyyy-MM-dd', new Date());
      const billingDate = new Date(day);
      billingDate.setHours(0, 0, 0, 0);

      if (sub.dueType === "yearly") {
        const startMonth = startDate.getMonth();
        const currentMonth = billingDate.getMonth();
        return (
          billingDate >= startDate &&
          (endDate ? billingDate <= endDate : true) &&
          String(sub.dueDay) === format(billingDate, 'd') &&
          startMonth === currentMonth
        );
      }

      return (
        billingDate >= startDate &&
        (endDate ? billingDate <= endDate : true) &&
        String(sub.dueDay) === format(billingDate, 'd')
      );
    });
  });
};

export const get_visible_days = () => {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  return eachDayOfInterval({ start, end }).map(day => format(day, 'yyyy-MM-dd'));
};