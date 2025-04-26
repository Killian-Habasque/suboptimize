"use client"

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/20/solid'
import {
  add,
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  parse,
  startOfMonth,
  startOfToday,
  startOfWeek
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import Image from 'next/image'

import { delete_Subscription, filter_Subscriptions_by_month } from "@/features/subscriptions/subscriptionService"
import { Subscription } from '@/lib/types'
import { capitalizeFirstLetter, classNames } from '@/services/utils'
import AddSubscriptionDialog from './AddSubscriptionDialog'
import SubscriptionListItem from './SubscriptionListItem'
import { useSubscription } from '../subscriptionContext'
import EditSubscriptionDialog from './EditSubscriptionDialog'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid'

const locale = fr

// --------------------
// Header Component
// --------------------
interface CalendarHeaderProps {
  currentMonth: string
  viewMode: string
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onViewModeChange: (mode: string) => void
  onAddEvent: () => void
}

function CalendarHeader({
  currentMonth,
  viewMode,
  onPrevious,
  onNext,
  onToday,
  onViewModeChange,
  onAddEvent,
}: CalendarHeaderProps) {
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())
  return (
    <header className="flex items-center justify-between border-b border-gray-200 py-4 lg:flex-none">
      <h1 className="text-base font-semibold leading-6 text-gray-900">
        <time dateTime="2022-01">
          {capitalizeFirstLetter(format(firstDayCurrentMonth, 'MMMM yyyy', { locale }))}
        </time>
      </h1>
      <div className="flex items-center">
        <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
          <button
            onClick={onPrevious}
            type="button"
            className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50 cursor-pointer"
          >
            <span className="sr-only">Previous {viewMode}</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            onClick={onToday}
            type="button"
            className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block cursor-pointer"
          >
            Aujourd&apos;hui
          </button>
          <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
          <button
            onClick={onNext}
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
              {viewMode === 'day' ? (
                "Jour"
              ) : viewMode === 'week' ? (
                "Semaine"
              ) : (
                "Mois"
              )}
              <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
            </MenuButton>
            <MenuItems className="absolute right-0 mt-2 w-32 origin-top-right bg-white shadow-lg ring-1 ring-black/[5%]">
              {['day', 'week', 'month'].map((mode) => (
                <MenuItem key={mode}>
                  {({ active }) => (
                    <button
                      onClick={() => onViewModeChange(mode)}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'w-full block px-4 py-2 text-sm cursor-pointer'
                      )}
                    >
                      {mode === 'day' ? (
                        "Jour"
                      ) : mode === 'week' ? (
                        "Semaine"
                      ) : (
                        "Mois"
                      )}
                    </button>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
          <div className="ml-6 h-6 w-px bg-gray-300" />
          <button
            onClick={onAddEvent}
            className="cursor-pointer ml-6 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Ajouter un abonnement
          </button>
        </div>
      </div>
    </header>
  )
}

// --------------------
// Event List Item Component
// --------------------
interface EventListItemProps {
  subscribe: Subscription
}

function EventListItem({ subscribe }: EventListItemProps) {
  const { subscriptions, setSubscriptions } = useSubscription();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);


  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;

    try {
      await delete_Subscription(id);
      setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'abonnement:", error);
    }
  };
  return (
    <>
      {console.log(subscribe)}
      <SubscriptionListItem
        key={subscribe.id}
        price={subscribe.price}
        title={subscribe.title}
        description={subscribe.description}
        company={subscribe.companies ? subscribe.companies[0] : null}
        customCompany={subscribe.customCompany}
        category={subscribe.categories ? subscribe.categories[0] : null}
        onEdit={() => handleEdit()}
        onDelete={() => handleDelete(subscribe.id)}
      />
      {isEditDialogOpen && (
        <EditSubscriptionDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          subscription={subscribe}
        />
      )}
      {/* <li key={subscribe.id} className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50">
        <div className="flex-auto">
          <p className="font-semibold text-gray-900">{subscribe.title}</p>
          <time
            dateTime={subscribe.startDatetime}
            className="mt-2 flex items-center text-gray-700"
          >
            {format(new Date(subscribe.startDatetime), 'MMM dd, yyyy')}
          </time>
        </div>
        <div
          className="ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 opacity-0 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:opacity-100 group-hover:opacity-100"
        >
          Edit<span className="sr-only">, {subscribe.title}</span>
        </div>
      </li> */}
    </>

  )
}

// --------------------
// Day View Component
// --------------------
interface DayViewProps {
  currentDate: Date
  filteredSubscriptions: Subscription[]
}

function DayView({ currentDate, filteredSubscriptions }: DayViewProps) {
  return (
    <div className="w-full bg-white">
      <div className="px-4 py-10 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold text-gray-900">
            {capitalizeFirstLetter(format(currentDate, 'EEEE d MMMM yyyy', { locale }))}
          </h2>
        </div>
        <ol className="divide-y divide-gray-100 rounded-lg bg-white text-sm shadow ring-1 ring-black/[5%]">
          {filteredSubscriptions
            .filter((subscribe) => {
              const selectedDate = currentDate
              const isDay = String(subscribe.dueDay) === format(selectedDate, 'd')
              const isWithinSubscription =
                isWithinInterval(selectedDate, { start: subscribe.startDatetime, end: subscribe.endDatetime }) ||
                isSameDay(selectedDate, subscribe.startDatetime) ||
                (subscribe.endDatetime === null && selectedDate >= new Date(subscribe.startDatetime))
              return isDay && isWithinSubscription
            })
            .map((subscribe) => (
              <EventListItem key={subscribe.id} subscribe={subscribe} />
            ))}
        </ol>
      </div>
    </div>
  )
}

// --------------------
// Week View Component
// --------------------
interface WeekViewProps {
  days: string[]
  filteredSubscriptions: Subscription[]
  selectedDay: string
  onSelectDay: (day: string) => void
}

function WeekView({ days, filteredSubscriptions, selectedDay, onSelectDay }: WeekViewProps) {
  return (
    <div className="w-full bg-white">
      <div className="grid grid-cols-7 divide-x divide-gray-100 h-full">
        {days.map((day) => {
          const parsedDay = parse(day, 'yyyy-MM-dd', new Date())
          const isSelected = day === selectedDay
          return (
            <div
              key={day}
              onClick={() => onSelectDay(day)}
              className={classNames(
                'min-h-[600px] p-4 cursor-pointer',
                isToday(parsedDay) ? 'bg-blue-50' : 'bg-white',
              )}
            >
              <div className="text-center mb-4">
                <p className="text-sm font-semibold text-gray-900">
                  {capitalizeFirstLetter(format(parsedDay, 'EEEE', { locale }))}
                </p>
                <time
                  dateTime={day}
                  className={classNames(
                    'inline-flex h-6 w-6 items-center justify-center rounded-full mt-1',
                    isSelected && isToday(parsedDay)
                      ? 'bg-primary text-white'
                      : isSelected
                        ? 'bg-gray-900 text-white'
                        : isToday(parsedDay)
                          ? 'bg-secondary text-primary'
                          : 'text-gray-900'
                  )}
                >
                  {format(parsedDay, 'd')}
                </time>
              </div>
              <ol className="space-y-2">
                {filteredSubscriptions
                  .filter((subscribe) => {
                    const selectedDate = parsedDay
                    const isDay = String(subscribe.dueDay) === format(selectedDate, 'd')
                    const isWithinSubscription =
                      isWithinInterval(selectedDate, { start: subscribe.startDatetime, end: subscribe.endDatetime }) ||
                      isSameDay(selectedDate, subscribe.startDatetime) ||
                      (subscribe.endDatetime === null && selectedDate >= new Date(subscribe.startDatetime))
                    return isDay && isWithinSubscription
                  })
                  .map((subscribe) => (
                    <li key={subscribe.id}>
                      <div className="group flex gap-1 items-center">
                        <div className={`min-w-4 w-4 h-4 rounded-xs flex items-center justify-center `}>
                          {subscribe.companies && subscribe.companies[0] && subscribe.companies[0].imageLink ?
                            <Image
                              src={subscribe.companies[0].imageLink}
                              alt={subscribe.companies[0].name || "Company logo"}
                              width={40}
                              height={40}
                              className='object-contain'
                            /> :
                            <QuestionMarkCircleIcon className='w-10 h-10 text-black' />
                          }
                        </div>
                        <p className="flex-auto truncate text-gray-900 group-hover:text-primary">
                          {subscribe.title}
                        </p>
                      </div>
                    </li>
                  ))}
              </ol>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// --------------------
// Month View Component
// --------------------
interface MonthViewProps {
  days: string[]
  today: Date
  selectedDay: string
  filteredSubscriptions: Subscription[]
  onSelectDay: (day: string) => void
}

function MonthView({
  days,
  today,
  selectedDay,
  filteredSubscriptions,
  onSelectDay,
}: MonthViewProps) {
  return (
    <>
      {/* Desktop Calendar */}
      <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
        {days.map((dayStr) => {
          const day = parse(dayStr, 'yyyy-MM-dd', new Date())
          return (
            <div
              key={dayStr}
              onClick={() => onSelectDay(dayStr)}
              className={classNames(
                isSameMonth(day, today) ? '' : '!bg-gray-50',
                isToday(day) ? '!bg-blue-50' : 'bg-white',
                (!isEqual(day, parse(selectedDay, 'yyyy-MM-dd', new Date())) && isToday(day)
                  ? 'text-primary'
                  : ''),
                (!isEqual(day, parse(selectedDay, 'yyyy-MM-dd', new Date())) &&
                  isSameMonth(day, today) &&
                  !isToday(day)
                  ? 'text-gray-900'
                  : ''),
                (!isEqual(day, parse(selectedDay, 'yyyy-MM-dd', new Date())) &&
                  !isSameMonth(day, today) &&
                  !isToday(day)
                  ? 'text-gray-500'
                  : ''),
                'flex flex-col px-3 py-2 hover:bg-gray-100 focus:z-10 cursor-pointer'
              )}
            >
              <time
                dateTime={format(day, 'yyyy-MM-dd')}
                className={classNames(
                  'flex h-6 w-6 items-center justify-center rounded-full',
                  (isEqual(day, parse(selectedDay, 'yyyy-MM-dd', new Date())) && isToday(day)
                    ? 'bg-primary text-white'
                    : ''),
                  (isEqual(day, parse(selectedDay, 'yyyy-MM-dd', new Date())) && !isToday(day)
                    ? 'bg-gray-900 text-white'
                    : ''),
                  'ml-auto'
                )}
              >
                {format(day, 'd')}
              </time>
              <ul>
                {filteredSubscriptions
                  .filter((subscribe) => {
                    const selectedDate = day
                    const isDay = String(subscribe.dueDay) === format(selectedDate, 'd')
                    const isWithinSubscription =
                      isWithinInterval(selectedDate, { start: subscribe.startDatetime, end: subscribe.endDatetime }) ||
                      isSameDay(selectedDate, subscribe.startDatetime) ||
                      (subscribe.endDatetime === null && selectedDate >= new Date(subscribe.startDatetime))
                    return isDay && isWithinSubscription
                  })
                  .slice(0, 2)
                  .map((subscribe) => (
                    <li key={subscribe.id}>
                      <div className="group flex gap-1 items-center">
                        <div className={`min-w-4 w-4 h-4 rounded-2xl flex items-center justify-center `}>
                          {subscribe.companies && subscribe.companies[0] && subscribe.companies[0].imageLink ?
                            <Image
                              src={subscribe.companies[0].imageLink}
                              alt={subscribe.companies[0].name || "Company logo"}
                              width={40}
                              height={40}
                              className='object-contain'
                            /> :
                            <QuestionMarkCircleIcon className='w-10 h-10 text-black' />
                          }
                        </div>
                        <p className="flex-auto truncate text-gray-900 group-hover:text-primary">
                          {subscribe.title}
                        </p>
                      </div>
                    </li>
                  ))}
                {filteredSubscriptions.filter((subscribe) => {
                  const selectedDate = day
                  const isDay = String(subscribe.dueDay) === format(selectedDate, 'd')
                  const isWithinSubscription =
                    isWithinInterval(selectedDate, { start: subscribe.startDatetime, end: subscribe.endDatetime }) ||
                    isSameDay(selectedDate, subscribe.startDatetime) ||
                    (subscribe.endDatetime === null && selectedDate >= new Date(subscribe.startDatetime))
                  return isDay && isWithinSubscription
                }).length > 2 && (
                    <li className="text-gray-500 font-normal">
                      + {filteredSubscriptions.filter((subscribe) => {
                        const selectedDate = day
                        const isDay = String(subscribe.dueDay) === format(selectedDate, 'd')
                        const isWithinSubscription =
                          isWithinInterval(selectedDate, { start: subscribe.startDatetime, end: subscribe.endDatetime }) ||
                          isSameDay(selectedDate, subscribe.startDatetime) ||
                          (subscribe.endDatetime === null && selectedDate >= new Date(subscribe.startDatetime))
                        return isDay && isWithinSubscription
                      }).length - 2} en plus
                    </li>
                  )}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Mobile Calendar */}
      <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
        {days.map((dayStr) => {
          const day = parse(dayStr, 'yyyy-MM-dd', new Date())
          return (
            <button
              key={dayStr}
              onClick={() => onSelectDay(dayStr)}
              type="button"
              className={classNames(
                isSameMonth(day, today) ? 'bg-white' : 'bg-gray-50',
                (!isEqual(day, parse(selectedDay, 'yyyy-MM-dd', new Date())) && isToday(day)
                  ? 'text-primary'
                  : ''),
                (!isEqual(day, parse(selectedDay, 'yyyy-MM-dd', new Date())) &&
                  isSameMonth(day, today) &&
                  !isToday(day)
                  ? 'text-gray-900'
                  : ''),
                (!isEqual(day, parse(selectedDay, 'yyyy-MM-dd', new Date())) &&
                  !isSameMonth(day, today) &&
                  !isToday(day)
                  ? 'text-gray-500'
                  : ''),
                'flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10'
              )}
            >
              <time
                dateTime={dayStr}
                className={classNames(
                  'flex h-6 w-6 items-center justify-center rounded-full',
                  (isEqual(day, parse(selectedDay, 'yyyy-MM-dd', new Date())) && isToday(day)
                    ? 'bg-primary text-white'
                    : ''),
                  (isEqual(day, parse(selectedDay, 'yyyy-MM-dd', new Date())) && !isToday(day)
                    ? 'bg-gray-900 text-white'
                    : ''),
                  'ml-auto'
                )}
              >
                {format(day, 'd')}
              </time>
              <span className="sr-only">
                {filteredSubscriptions.filter((subscribe) => String(subscribe.dueDay) === format(day, 'd')).length} abonnements
              </span>
              {filteredSubscriptions.filter((subscribe) => String(subscribe.dueDay) === format(day, 'd')).length > 0 && (
                <div className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                  {filteredSubscriptions
                    .filter((subscribe) => {
                      const selectedDate = day
                      const isDay = String(subscribe.dueDay) === format(selectedDate, 'd')
                      const isWithinSubscription =
                        isWithinInterval(selectedDate, { start: subscribe.startDatetime, end: subscribe.endDatetime }) ||
                        isSameDay(selectedDate, subscribe.startDatetime) ||
                        (subscribe.endDatetime === null && selectedDate >= new Date(subscribe.startDatetime))
                      return isDay && isWithinSubscription
                    })
                    .slice(0, 2)
                    .map((subscribe) => (
                      <span
                        key={subscribe.id}
                        className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-blue-400"
                        title={subscribe.title}
                      />
                    ))}
                  {filteredSubscriptions.filter((subscribe) => {
                    const selectedDate = day
                    const isDay = String(subscribe.dueDay) === format(selectedDate, 'd')
                    const isWithinSubscription =
                      isWithinInterval(selectedDate, { start: subscribe.startDatetime, end: subscribe.endDatetime }) ||
                      isSameDay(selectedDate, subscribe.startDatetime) ||
                      (subscribe.endDatetime === null && selectedDate >= new Date(subscribe.startDatetime))
                    return isDay && isWithinSubscription
                  }).length > 2 && (
                      <span className="mx-0.5 text-gray-500 text-xs font-normal">
                        +
                        {filteredSubscriptions.filter((subscribe) => String(subscribe.dueDay) === format(day, 'd')).length - 2}
                      </span>
                    )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </>
  )
}

// --------------------
// Main Calendar Component
// --------------------
interface CalendarProps {
  subscriptions: Subscription[]
}

export default function Calendar({ subscriptions }: CalendarProps) {
  const today = startOfToday()
  const [selectedDay, setSelectedDay] = useState<string>(format(today, 'yyyy-MM-dd'))
  const [currentMonth, setCurrentMonth] = useState<string>(format(today, 'MMM-yyyy'))
  const [currentDate, setCurrentDate] = useState<Date>(today)
  const [viewMode, setViewMode] = useState<string>('month')
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const generateDays = (mode: string, date: Date): string[] => {
    if (mode === 'day') {
      return [format(date, 'yyyy-MM-dd')]
    } else if (mode === 'week') {
      return eachDayOfInterval({
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
      }).map((day) => format(day, 'yyyy-MM-dd'))
    } else {
      const monthStart = startOfMonth(date)
      return eachDayOfInterval({
        start: startOfWeek(monthStart, { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 }),
      }).map((day) => format(day, 'yyyy-MM-dd'))
    }
  }

  const newDays = generateDays(viewMode, currentDate)

  const goToPrevious = () => {
    if (viewMode === 'month') {
      const newDate = add(currentDate, { months: -1 })
      setCurrentDate(newDate)
      setCurrentMonth(format(newDate, 'MMM-yyyy'))
    } else if (viewMode === 'week') {
      const newDate = add(currentDate, { weeks: -1 })
      setCurrentDate(newDate)
      setSelectedDay(format(newDate, 'yyyy-MM-dd'))
      setCurrentMonth(format(startOfWeek(newDate), 'MMM-yyyy'))
    } else if (viewMode === 'day') {
      const newDate = addDays(currentDate, -1)
      setCurrentDate(newDate)
      setSelectedDay(format(newDate, 'yyyy-MM-dd'))
    }
  }

  const goToNext = () => {
    if (viewMode === 'month') {
      const newDate = add(currentDate, { months: 1 })
      setCurrentDate(newDate)
      setCurrentMonth(format(newDate, 'MMM-yyyy'))
    } else if (viewMode === 'week') {
      const newDate = add(currentDate, { weeks: 1 })
      setCurrentDate(newDate)
      setSelectedDay(format(newDate, 'yyyy-MM-dd'))
      setCurrentMonth(format(startOfWeek(newDate), 'MMM-yyyy'))
    } else if (viewMode === 'day') {
      const newDate = addDays(currentDate, 1)
      setCurrentDate(newDate)
      setSelectedDay(format(newDate, 'yyyy-MM-dd'))
    }
  }

  const goToToday = () => {
    setCurrentDate(today)
    setCurrentMonth(format(today, 'MMM-yyyy'))
    setSelectedDay(format(today, 'yyyy-MM-dd'))
  }

  const serializedDays = JSON.stringify(newDays)

  useEffect(() => {
    const sortedSubscriptions = filter_Subscriptions_by_month(
      subscriptions,
      newDays
    )
    setFilteredSubscriptions(sortedSubscriptions)
    console.log(sortedSubscriptions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptions, serializedDays])



  const weekDaysHeader = newDays.slice(0, 7).map((day) => ({
    label: format(parse(day, "yyyy-MM-dd", new Date()), "EEEE", { locale }),
    date: day,
  }))

  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <CalendarHeader
        currentMonth={currentMonth}
        viewMode={viewMode}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
        onViewModeChange={(mode) => setViewMode(mode)}
        onAddEvent={() => setIsDialogOpen(true)}
      />

      <div className="shadow ring-1 ring-black/[5%] lg:flex lg:flex-auto lg:flex-col">
        {viewMode !== 'day' && (
          <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
            {weekDaysHeader.map(({ label }) => (
              <div key={label} className="bg-white py-2">
                <span>
                  {label.charAt(0)}
                  <span className="sr-only sm:not-sr-only">{label.slice(1)}</span>
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
          {viewMode === 'day' ? (
            <DayView
              currentDate={currentDate}
              filteredSubscriptions={filteredSubscriptions}
            />
          ) : viewMode === 'week' ? (
            <WeekView
              days={newDays}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              filteredSubscriptions={filteredSubscriptions} />
          ) : (
            <MonthView
              days={newDays}
              today={today}
              selectedDay={selectedDay}
              filteredSubscriptions={filteredSubscriptions}
              onSelectDay={setSelectedDay}
            />
          )}
        </div>
      </div>

      {(viewMode !== 'day') && (
        <div className="px-4 py-10 sm:px-6">
          <ol className="divide-y divide-gray-100 rounded-lg bg-white text-sm shadow ring-1 ring-black/[5%]">
            {filteredSubscriptions
              .filter((subscribe) => {
                const selectedDate = parse(selectedDay, 'yyyy-MM-dd', new Date())
                const isDay = String(subscribe.dueDay) === format(selectedDate, 'd')
                const isWithinSubscription =
                  isWithinInterval(selectedDate, { start: subscribe.startDatetime, end: subscribe.endDatetime }) ||
                  isSameDay(selectedDate, subscribe.startDatetime) ||
                  (subscribe.endDatetime === null && selectedDate >= new Date(subscribe.startDatetime))
                return isDay && isWithinSubscription
              })
              .map((subscribe) => (
                <EventListItem key={subscribe.id} subscribe={subscribe} />
              ))}
          </ol>
        </div>
      )}
      <AddSubscriptionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  )
}
