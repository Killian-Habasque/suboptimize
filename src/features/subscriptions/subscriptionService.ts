import prisma from "@/../prisma/prisma";
import { Subscription, Category, Company } from "@prisma/client";
import { parse } from 'date-fns';

export const get_all_user_Subscriptions = async (): Promise<Subscription[]> => {
  try {
      const response = await fetch('/api/subscriptions', {
          credentials: 'include'
      });

      if (!response.ok) {
          throw new Error('Erreur lors de la récupération des abonnements');
      }

      return response.json();
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
      }),
  })

  if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout de l\'abonnement')
  }

  return response.json()
}

export const filter_Subscriptions_by_month = (
    subscriptions: Subscription[],
    targetMonthYear: string 
) => {
    const targetDate = parse(targetMonthYear, 'MMM-yyyy', new Date());
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    return subscriptions.filter((sub) => {
        const startDate = new Date(sub.startDatetime);
        const endDate = sub.endDatetime ? new Date(sub.endDatetime) : null;
        const billingDate = new Date(targetYear, targetMonth, sub.dueDay);
        
        return (
            billingDate >= startDate &&
            (!endDate || billingDate <= endDate) &&
            billingDate.getMonth() === targetMonth &&
            billingDate.getFullYear() === targetYear
        );
    });
};