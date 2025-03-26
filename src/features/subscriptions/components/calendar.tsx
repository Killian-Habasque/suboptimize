"use client"

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClockIcon
} from '@heroicons/react/20/solid'
import { add, addDays, eachDayOfInterval, endOfMonth, endOfWeek, format, isEqual, isSameMonth, isToday, parse, startOfMonth, startOfToday, startOfWeek } from 'date-fns'
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react'

import { filter_Subscriptions_by_month } from "@/features/subscriptions/subscriptionService";
import { Subscription } from '@/features/types';
import { capitalizeFirstLetter, classNames } from '@/services/utils';

const locale = fr;

interface CalendarProps {
    subscriptions: Subscription[];
}

export default function Calendar({ subscriptions }: CalendarProps) {
    const today = startOfToday();
    const [selectedDay, setSelectedDay] = useState<string>(format(today, 'yyyy-MM-dd'));
    const [currentMonth, setCurrentMonth] = useState<string>(format(today, 'MMM-yyyy'));
    const [currentDate, setCurrentDate] = useState<Date>(today);
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
    const [viewMode, setViewMode] = useState<string>('month');
    const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);

    const generateDays = () => {
        if (viewMode === 'day') {
            return [format(currentDate, 'yyyy-MM-dd')];
        } else if (viewMode === 'week') {
            return eachDayOfInterval({
                start: startOfWeek(currentDate),
                end: endOfWeek(currentDate),
            }).map((day) => format(day, 'yyyy-MM-dd'));
        } else {
            return eachDayOfInterval({
                start: startOfWeek(startOfMonth(firstDayCurrentMonth)),
                end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
            }).map((day) => format(day, 'yyyy-MM-dd'));
        }
    };

    const newDays = generateDays();

    const goToPrevious = () => {
        if (viewMode === 'month') {
            setCurrentDate(add(currentDate, { months: -1 }));
            setCurrentMonth(format(add(currentDate, { months: -1 }), 'MMM-yyyy'));
        } else if (viewMode === 'week') {
            setCurrentDate(add(currentDate, { weeks: -1 }));
            setSelectedDay(format(add(currentDate, { weeks: -1 }), 'yyyy-MM-dd'));
        } else if (viewMode === 'day') {
            setCurrentDate(addDays(currentDate, -1));
            setSelectedDay(format(addDays(currentDate, -1), 'yyyy-MM-dd'));
        }
    };

    const goToNext = () => {
        if (viewMode === 'month') {
            setCurrentDate(add(currentDate, { months: 1 }));
            setCurrentMonth(format(add(currentDate, { months: 1 }), 'MMM-yyyy'));
        } else if (viewMode === 'week') {
            setCurrentDate(add(currentDate, { weeks: 1 }));
            setSelectedDay(format(add(currentDate, { weeks: 1 }), 'yyyy-MM-dd'));
        } else if (viewMode === 'day') {
            setCurrentDate(addDays(currentDate, 1));
            setSelectedDay(format(addDays(currentDate, 1), 'yyyy-MM-dd'));
        }
    };

    const goToToday = () => {
        setCurrentDate(today);
        setCurrentMonth(format(today, 'MMM-yyyy'));
        setSelectedDay(format(today, 'yyyy-MM-dd'));
    };

    useEffect(() => {
        const sortedSubscriptions = filter_Subscriptions_by_month(subscriptions, currentMonth);
        setFilteredSubscriptions(sortedSubscriptions);
    }, [subscriptions, currentMonth]);

    const weekDaysHeader = newDays.slice(0, 7).map((day) => ({
        label: format(parse(day, "yyyy-MM-dd", new Date()), "EEEE", { locale }),
        date: day,
    }));

    const renderEventList = (subscribe: Subscription) => (
        <li key={subscribe.id} className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50">
            <div className="flex-auto">
                <p className="font-semibold text-gray-900">{subscribe.title}</p>
                <time dateTime={subscribe.startDatetime} className="mt-2 flex items-center text-gray-700">
                    <ClockIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    {format(new Date(subscribe.startDatetime), 'MMM dd, yyyy')}
                </time>
            </div>
            <a
                href={''}
                className="ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 opacity-0 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:opacity-100 group-hover:opacity-100"
            >
                Edit<span className="sr-only">, {subscribe.title}</span>
            </a>
        </li>
    );

    return (
        <div className="lg:flex lg:h-full lg:flex-col">
            <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                    <time dateTime="2022-01">{capitalizeFirstLetter(format(firstDayCurrentMonth, 'MMMM yyyy', { locale }))}</time>
                </h1>
                <div className="flex items-center">
                    <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
                        <button
                            onClick={goToPrevious}
                            type="button"
                            className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50 cursor-pointer"
                        >
                            <span className="sr-only">Previous {viewMode}</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                            onClick={goToToday}
                            type="button"
                            className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block cursor-pointer"
                        >
                            Aujourd&apos;hui
                        </button>
                        <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
                        <button
                            onClick={goToNext}
                            type="button"
                            className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50 cursor-pointer"
                        >
                            <span className="sr-only">Next {viewMode}</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="hidden md:ml-4 md:flex md:items-center">
                        <Menu as="div" className="relative">
                            <MenuButton className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer">
                                {capitalizeFirstLetter(viewMode)} view
                                <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                            </MenuButton>
                            <MenuItems className="absolute right-0 mt-2 w-32 origin-top-right bg-white shadow-lg ring-1 ring-black/[5%]">
                                {['day', 'week', 'month'].map((mode) => (
                                    <MenuItem key={mode}>
                                        {({ active }) => (
                                            <button
                                                onClick={() => setViewMode(mode)}
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'w-full block px-4 py-2 text-sm cursor-pointer'
                                                )}
                                            >
                                                {capitalizeFirstLetter(mode)} view
                                            </button>
                                        )}
                                    </MenuItem>
                                ))}
                            </MenuItems>
                        </Menu>
                        <div className="ml-6 h-6 w-px bg-gray-300" />
                        <button
                            type="button"
                            className="ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Add event
                        </button>
                    </div>
                </div>
            </header>

            <div className="shadow ring-1 ring-black/[5%] lg:flex lg:flex-auto lg:flex-col">
                {viewMode !== 'day' && (
                    <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
                        {weekDaysHeader.map(({ label }) => (
                            <div key={label} className="bg-white py-2">
                                <span>
                                    {label.charAt(0)}
                                    <span className="sr-only sm:not-sr-only">
                                        {label.slice(1)}
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
                    {viewMode === 'day' ? (
                        <div className="w-full bg-white">
                            <div className="px-4 py-10 sm:px-6">
                                <div className="text-center mb-8">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {capitalizeFirstLetter(format(currentDate, 'EEEE d MMMM yyyy', { locale }))}
                                    </h2>
                                </div>
                                <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black/[5%]">
                                    {filteredSubscriptions
                                        .filter((subscribe) => String(subscribe.dueDay) === format(currentDate, 'dd'))
                                        .map(renderEventList)}
                                </ol>
                            </div>
                        </div>
                    ) : viewMode === 'week' ? (
                        <div className="w-full bg-white">
                            <div className="grid grid-cols-7 divide-x divide-gray-100 h-full">
                                {newDays.map((day) => (
                                    <div 
                                        key={day} 
                                        className={classNames(
                                            'min-h-[600px] p-4',
                                            isToday(parse(day, 'yyyy-MM-dd', new Date())) ? 'bg-blue-50' : 'bg-white'
                                        )}
                                    >
                                        <div className="text-center mb-4">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {capitalizeFirstLetter(format(parse(day, 'yyyy-MM-dd', new Date()), 'EEEE', { locale }))}
                                            </p>
                                            <time
                                                dateTime={day}
                                                className={classNames(
                                                    'inline-flex h-6 w-6 items-center justify-center rounded-full mt-1',
                                                    isToday(parse(day, 'yyyy-MM-dd', new Date())) ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                                )}
                                            >
                                                {format(parse(day, 'yyyy-MM-dd', new Date()), 'd')}
                                            </time>
                                        </div>
                                        <ol className="space-y-2">
                                            {filteredSubscriptions
                                                .filter((subscribe) => String(subscribe.dueDay) === format(parse(day, 'yyyy-MM-dd', new Date()), 'dd'))
                                                .map((subscribe) => (
                                                    <li 
                                                        key={subscribe.id}
                                                        className="group rounded-lg bg-white p-3 hover:bg-gray-50 shadow-sm ring-1 ring-gray-100"
                                                    >
                                                        <div className="flex-auto">
                                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                                {subscribe.title}
                                                            </p>
                                                            <time 
                                                                dateTime={subscribe.startDatetime} 
                                                                className="mt-1 flex items-center text-xs text-gray-500"
                                                            >
                                                                <ClockIcon className="mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                                                                {format(new Date(subscribe.startDatetime), 'MMM dd, yyyy')}
                                                            </time>
                                                        </div>
                                                    </li>
                                                ))}
                                        </ol>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
                                {newDays.map((day) => (
                                    <div
                                        onClick={() => setSelectedDay(day)}
                                        key={day.toString()}
                                        className={classNames(
                                            isSameMonth(day, today) ? 'bg-white' : 'bg-gray-50',
                                            (!isEqual(day, selectedDay) && isToday(day) ? 'text-indigo-600' : ''),
                                            (!isEqual(day, selectedDay) && isSameMonth(day, today) && !isToday(day) ? 'text-gray-900' : ''),
                                            (!isEqual(day, selectedDay) && !isSameMonth(day, today) && !isToday(day) ? 'text-gray-500' : ''),
                                            'flex flex-col px-3 py-2 hover:bg-gray-100 focus:z-10 cursor-pointer',
                                        )}
                                    >
                                        <time
                                            dateTime={format(day, 'yyyy-MM-dd')}
                                            className={classNames(
                                                'flex h-6 w-6 items-center justify-center rounded-full',
                                                (isEqual(day, selectedDay) && isToday(day) ? 'bg-indigo-600 text-white' : ''),
                                                (isEqual(day, selectedDay) && !isToday(day) ? 'bg-gray-900 text-white' : ''),
                                                'ml-auto',
                                            )}
                                        >
                                            {format(day, 'd')}
                                        </time>
                                        {filteredSubscriptions
                                            .filter((subscribe) => String(subscribe.dueDay) === format(day, 'dd'))
                                            .slice(0, 2)
                                            .map((subscribe) => (
                                                <li key={subscribe.id}>
                                                    <a href={''} className="group flex">
                                                        <p className="flex-auto truncate text-gray-900 group-hover:text-indigo-600">
                                                            {subscribe.title}
                                                        </p>
                                                        <time
                                                            dateTime={subscribe.startDatetime}
                                                            className="ml-3 hidden flex-none font-medium text-gray-500 group-hover:text-indigo-600 xl:block"
                                                        >
                                                            {format(new Date(subscribe.startDatetime), 'MMM dd, yyyy')}
                                                        </time>
                                                    </a>
                                                </li>
                                            ))}
                                        {filteredSubscriptions.filter((subscribe) => String(subscribe.dueDay) === format(day, 'dd')).length > 2 && (
                                            <li className="text-gray-500 font-normal">
                                                + {filteredSubscriptions.filter((subscribe) => String(subscribe.dueDay) === format(day, 'dd')).length - 2} more
                                            </li>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
                                {newDays.map((day) => (
                                    <button
                                        onClick={() => setSelectedDay(day)}
                                        key={day}
                                        type="button"
                                        className={classNames(
                                            isSameMonth(day, today) ? 'bg-white' : 'bg-gray-50',
                                            (!isEqual(day, selectedDay) && isToday(day) ? 'text-indigo-600' : ''),
                                            (!isEqual(day, selectedDay) && isSameMonth(day, today) && !isToday(day) ? 'text-gray-900' : ''),
                                            (!isEqual(day, selectedDay) && !isSameMonth(day, today) && !isToday(day) ? 'text-gray-500' : ''),
                                            'flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10',
                                        )}
                                    >
                                        <time
                                            dateTime={day}
                                            className={classNames(
                                                'flex h-6 w-6 items-center justify-center rounded-full',
                                                (isEqual(day, selectedDay) && isToday(day) ? 'bg-indigo-600 text-white' : ''),
                                                (isEqual(day, selectedDay) && !isToday(day) ? 'bg-gray-900 text-white' : ''),
                                                'ml-auto',
                                            )}
                                        >
                                            {format(day, 'd')}
                                        </time>
                                        <span className="sr-only">
                                            {filteredSubscriptions.filter((subscribe) => String(subscribe.dueDay) === format(day, 'dd')).length} abonnements
                                        </span>
                                        {(filteredSubscriptions.filter((subscribe) => String(subscribe.dueDay) === format(day, 'dd')).length > 0) && (
                                            <div className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                                                {filteredSubscriptions
                                                    .filter((subscribe) => String(subscribe.dueDay) === format(day, 'dd'))
                                                    .slice(0, 2)
                                                    .map((subscribe) => (
                                                        <span
                                                            key={subscribe.id}
                                                            className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-blue-400"
                                                            title={subscribe.title}
                                                        />
                                                    ))}
                                                {filteredSubscriptions.filter((subscribe) => String(subscribe.dueDay) === format(day, 'dd')).length > 2 && (
                                                    <span className="mx-0.5 text-gray-500 text-xs font-normal">
                                                        +{filteredSubscriptions.filter((subscribe) => String(subscribe.dueDay) === format(day, 'dd')).length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {viewMode !== 'day' && viewMode !== 'week' && (
                <div className="px-4 py-10 sm:px-6">
                    <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black/[5%]">
                        {filteredSubscriptions
                            .filter((subscribe) => String(subscribe.dueDay) === format(selectedDay, 'dd'))
                            .map(renderEventList)}
                    </ol>
                </div>
            )}
        </div>
    );
}