"use client"

import { useState, useEffect } from 'react'
import { Subscription } from '@/lib/types'
import SubscriptionListItem from './list-item-subscription'
import {
    addDays,
    format,
    startOfToday
} from 'date-fns'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import { filter_Subscriptions_by_month, get_visible_days } from '../subscription-service'

interface UpcomingSubscriptionsProps {
    subscriptions: Subscription[]
}

export default function UpcomingSubscriptions({ subscriptions }: UpcomingSubscriptionsProps) {
    const [todaySubscriptions, setTodaySubscriptions] = useState<Subscription[]>([])
    const [tomorrowSubscriptions, setTomorrowSubscriptions] = useState<Subscription[]>([])
    const [monthSubscriptions, setMonthSubscriptions] = useState<Subscription[]>([])
    const [todayTotal, setTodayTotal] = useState(0)
    const [tomorrowTotal, setTomorrowTotal] = useState(0)
    const [monthTotal, setMonthTotal] = useState(0)

    useEffect(() => {
        if (!subscriptions || subscriptions.length === 0) return

        const today = startOfToday()
        const tomorrow = addDays(today, 1)

        const visibleDays = get_visible_days()
        const filteredSubs = filter_Subscriptions_by_month(subscriptions, visibleDays)
        const todaySubs = filteredSubs.filter(sub => {
            const todayStr = format(today, 'd')
            return String(sub.dueDay) === todayStr
        })
        const tomorrowSubs = filteredSubs.filter(sub => {
            const tomorrowStr = format(tomorrow, 'd')
            return String(sub.dueDay) === tomorrowStr
        })
        const monthSubs = filteredSubs.filter(sub => {
            const todayStr = format(today, 'd')
            const tomorrowStr = format(tomorrow, 'd')
            return String(sub.dueDay) !== todayStr && String(sub.dueDay) !== tomorrowStr
        })
        const calculateTotal = (subs: Subscription[]) => {
            return subs.reduce((total, sub) => total + (sub.price || 0), 0);
        };
        setTodayTotal(calculateTotal(todaySubs));
        setTomorrowTotal(calculateTotal(tomorrowSubs));
        setMonthTotal(calculateTotal(monthSubs));
        setTodaySubscriptions(todaySubs)
        setTomorrowSubscriptions(tomorrowSubs)
        setMonthSubscriptions(monthSubs)
    }, [subscriptions])

    return (
        <div className="space-y-6 overflow-auto max-h-[calc(100vh-240px)] pr-4">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <ClockIcon className="h-5 w-5 text-secondary mr-2" />
                        <h2 className="text-lg font-medium text-gray-700">Aujourd&apos;hui</h2>
                    </div>
                    {todaySubscriptions.length > 0 && (
                        <div className="text-base font-semibold text-gray-500 text-sm">
                            Total: {todayTotal.toFixed(2)}€
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-lg divide-y divide-gray-200">
                    {todaySubscriptions.length > 0 ? (
                        todaySubscriptions.map(subscription => (
                            <div key={subscription.id} className="p-2">
                                <SubscriptionListItem
                                    id={subscription.id}
                                    price={subscription.price}
                                    title={subscription.title}
                                    dueType={subscription.dueType === "monthly" ? "mensuel" : "annuel"}
                                    description={subscription.description}
                                    company={subscription.companies && subscription.companies.length > 0 ? subscription.companies[0] : null}
                                    customCompany={subscription.customCompany}
                                    category={subscription.categories && subscription.categories.length > 0 ? subscription.categories[0] : null}
                                />
                            </div>
                        ))
                    ) : (
                        <p className="p-4 text-sm text-gray-500">Aucun paiement prévu aujourd&apos;hui</p>
                    )}
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <ClockIcon className="h-5 w-5 text-secondary mr-2" />
                        <h2 className="text-lg font-medium text-gray-700">Demain</h2>
                    </div>
                    {tomorrowSubscriptions.length > 0 && (
                        <div className="text-base font-semibold text-gray-500 text-sm">
                            Total: {tomorrowTotal.toFixed(2)}€
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-lg divide-y divide-gray-200">
                    {tomorrowSubscriptions.length > 0 ? (
                        tomorrowSubscriptions.map(subscription => (
                            <div key={subscription.id} className="p-2">
                                <SubscriptionListItem
                                    id={subscription.id}
                                    price={subscription.price}
                                    title={subscription.title}
                                    dueType={subscription.dueType === "monthly" ? "mensuel" : "annuel"}
                                    description={subscription.description}
                                    company={subscription.companies && subscription.companies.length > 0 ? subscription.companies[0] : null}
                                    customCompany={subscription.customCompany}
                                    category={subscription.categories && subscription.categories.length > 0 ? subscription.categories[0] : null}
                                />
                            </div>
                        ))
                    ) : (
                        <p className="p-4 text-sm text-gray-500">Aucun paiement prévu demain</p>
                    )}
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <CalendarDaysIcon className="h-5 w-5 text-secondary mr-2" />
                        <h2 className="text-lg font-medium text-gray-700">Ce mois-ci</h2>
                    </div>
                    {monthSubscriptions.length > 0 && (
                        <div className="text-base font-semibold text-gray-500 text-sm">
                            Total restant: {monthTotal.toFixed(2)}€
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-lg divide-y divide-gray-200">
                    {monthSubscriptions.length > 0 ? (
                        monthSubscriptions.map(subscription => (
                            <div key={subscription.id} className="p-2">
                                <SubscriptionListItem
                                    id={subscription.id}
                                    price={subscription.price}
                                    title={subscription.title}
                                    dueType={subscription.dueType === "monthly" ? "mensuel" : "annuel"}
                                    description={subscription.description}
                                    company={subscription.companies && subscription.companies.length > 0 ? subscription.companies[0] : null}
                                    customCompany={subscription.customCompany}
                                    category={subscription.categories && subscription.categories.length > 0 ? subscription.categories[0] : null}
                                />
                            </div>
                        ))
                    ) : (
                        <p className="p-4 text-sm text-gray-500">Aucun autre paiement prévu ce mois-ci</p>
                    )}
                </div>
            </div>
        </div>
    )
}