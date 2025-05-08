"use client"

import { useState, useEffect } from 'react'
import { Subscription } from '@/lib/types'
import SubscriptionListItem from './list-item-subscription'
import {
    addDays,
    format,
    endOfMonth,
    startOfToday
} from 'date-fns'
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import { filter_Subscriptions_by_month } from '../subscription-service'

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
        const monthEnd = endOfMonth(today)

        const visibleDays = []
        for (let i = 1; i <= monthEnd.getDate(); i++) {
            const day = new Date(today.getFullYear(), today.getMonth(), i)
            visibleDays.push(format(day, 'yyyy-MM-dd'))
        }
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
                        <ClockIcon className="h-5 w-5 text-indigo-600 mr-2" />
                        <h2 className="text-lg font-medium text-gray-900">Aujourd&apos;hui</h2>
                    </div>
                    {todaySubscriptions.length > 0 && (
                        <div className="text-base font-semibold text-indigo-600">
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
                        <ClockIcon className="h-5 w-5 text-indigo-600 mr-2" />
                        <h2 className="text-lg font-medium text-gray-900">Demain</h2>
                    </div>
                    {tomorrowSubscriptions.length > 0 && (
                        <div className="text-base font-semibold text-indigo-600">
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
                        <CalendarDaysIcon className="h-5 w-5 text-indigo-600 mr-2" />
                        <h2 className="text-lg font-medium text-gray-900">Ce mois-ci</h2>
                    </div>
                    {monthSubscriptions.length > 0 && (
                        <div className="text-base font-semibold text-indigo-600">
                            Total: {monthTotal.toFixed(2)}€
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