import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/20/solid'
import { add, addDays, eachDayOfInterval, endOfMonth, endOfWeek, format, isEqual, isSameMonth, isToday, parse, startOfMonth, startOfToday, startOfWeek } from 'date-fns'
import { fr } from 'date-fns/locale';
import { useState } from 'react'

const locale = fr;
const subscribes = [
  { id: 4, name: 'Logoden biniou', startDatetime: '2021-12-22', endDatetime: '2026-12-22', billingDay: '22', term: 'monthly', href: '#' },
  { id: 5, name: 'Degemer mat', startDatetime: '2021-12-22', endDatetime: '2026-12-22', billingDay: '09', term: 'monthly', href: '#' },
  { id: 6, name: 'Penn ar bed', startDatetime: '2021-12-22', endDatetime: '2026-12-22', billingDay: '12', term: 'monthly', href: '#' },
  { id: 7, name: 'Plouz holl', startDatetime: '2021-12-22', endDatetime: '2026-12-22', billingDay: '12', term: 'monthly', href: '#' },
  { id: 8, name: 'Ruz sistr', startDatetime: '2021-12-22', endDatetime: '2026-12-22', billingDay: '12', term: 'monthly', href: '#' },
  { id: 9, name: 'Ruz sistr', startDatetime: '2021-12-22', endDatetime: '2026-12-22', billingDay: '12', term: 'monthly', href: '#' },
  { id: 10, name: 'Ruz sistr', startDatetime: '2021-12-22', endDatetime: '2026-12-22', billingDay: '12', term: 'monthly', href: '#' },
  { id: 11, name: 'Ruz sistr', startDatetime: '2021-12-22', endDatetime: '2026-12-22', billingDay: '12', term: 'monthly', href: '#' },

]
function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Calendar({subcriptions}) {
  let today = startOfToday()
  let [selectedDay, setSelectedDay] = useState(format(today, 'yyyy-MM-dd'))
  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())

  let days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(firstDayCurrentMonth)),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth))
  })
  let newDays = days.map((day) => format(day, 'yyyy-MM-dd'));

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }
  function previousMonth() {
    let firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayPreviousMonth, 'MMM-yyyy'))
  }
  function resetMonth() {
    setCurrentMonth(format(today, 'MMM-yyyy'))
  }

  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          <time dateTime="2022-01"> {capitalizeFirstLetter(format(firstDayCurrentMonth, 'MMMM yyyy', { locale }))}</time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <button
              onClick={previousMonth}
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={resetMonth}
              type="button"
              className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
            >
              Aujourd'hui
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              onClick={nextMonth}
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <Menu as="div" className="relative">
              <MenuButton
                type="button"
                className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Month view
                <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <div className="py-1">
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                    >
                      Day view
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                    >
                      Week view
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                    >
                      Month view
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                    >
                      Year view
                    </a>
                  </MenuItem>
                </div>
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
          <Menu as="div" className="relative ml-6 md:hidden">
            <MenuButton className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  >
                    Create event
                  </a>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  >
                    Go to today
                  </a>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  >
                    Day view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  >
                    Week view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  >
                    Month view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  >
                    Year view
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </header>
      <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
          <div className="bg-white py-2">
            L<span className="sr-only sm:not-sr-only">undi</span>
          </div>
          <div className="bg-white py-2">
            M<span className="sr-only sm:not-sr-only">ardi</span>
          </div>
          <div className="bg-white py-2">
            M<span className="sr-only sm:not-sr-only">ercredi</span>
          </div>
          <div className="bg-white py-2">
            J<span className="sr-only sm:not-sr-only">eudi</span>
          </div>
          <div className="bg-white py-2">
            V<span className="sr-only sm:not-sr-only">endredi</span>
          </div>
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">amedi</span>
          </div>
          <div className="bg-white py-2">
            D<span className="sr-only sm:not-sr-only">imanche</span>
          </div>
        </div>
        <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
            {newDays.map((day) => (
              <div
                onClick={() => setSelectedDay(day)}
                key={day.toString()}

                className={classNames(
                  isSameMonth(day, today) ? 'bg-white' : 'bg-gray-50',
                  (isEqual(day, selectedDay) || isToday(day)) && 'font-semibold',
                  !isEqual(day, selectedDay) && isToday(day) && 'text-indigo-600',
                  !isEqual(day, selectedDay) && isSameMonth(day, today) && !isToday(day) && 'text-gray-900',
                  !isEqual(day, selectedDay) && !isSameMonth(day, today) && !isToday(day) && 'text-gray-500',
                  'flex flex-col px-3 py-2 hover:bg-gray-100 focus:z-10',
                )}
              >
                <time
                  dateTime={format(day, 'yyyy-MM-dd')}
                  className={classNames(
                    'flex h-6 w-6 items-center justify-center rounded-full',
                    isEqual(day, selectedDay) && isToday(day) && 'bg-indigo-600 text-white',
                    isEqual(day, selectedDay) && !isToday(day) && 'bg-gray-900 text-white',
                    'ml-auto',
                  )}
                >
                  {format(day, 'd')}
                </time>
                {subcriptions
                  .filter((subscribe) => String(subscribe.billingDay) === format(day, 'dd'))
                  .slice(0, 2)
                  .map((subscribe) => (
                    <li key={subscribe.id}>
                      <a href={subscribe.href} className="group flex">
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
                {subcriptions.filter((subscribe) => String(subscribe.billingDay) === format(day, 'dd')).length > 2 && (
                  <li className="text-gray-500 font-normal">
                    + {subcriptions.filter((subscribe) => String(subscribe.billingDay) === format(day, 'dd')).length - 2} more
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
                  (isEqual(day, selectedDay) || isToday(day)) && 'font-semibold',
                  !isEqual(day, selectedDay) && isToday(day) && 'text-indigo-600',
                  !isEqual(day, selectedDay) && isSameMonth(day, today) && !isToday(day) && 'text-gray-900',
                  !isEqual(day, selectedDay) && !isSameMonth(day, today) && !isToday(day) && 'text-gray-500',
                  'flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10',
                )}
              >
                <time
                  dateTime={day}
                  className={classNames(
                    'flex h-6 w-6 items-center justify-center rounded-full',
                    isEqual(day, selectedDay) && isToday(day) && 'bg-indigo-600 text-white',
                    isEqual(day, selectedDay) && !isToday(day) && 'bg-gray-900 text-white',
                    'ml-auto',
                  )}
                >
                  {format(day, 'd')}
                </time>
{/* {  console.log(subcriptions.filter((subscribe) => String(subscribe.billingDay) === format(day, 'dd')))} */}
                <span className="sr-only">
                  {subcriptions.filter((subscribe) => String(subscribe.billingDay) === format(day, 'dd')).length} abonnements
                </span>
                {(subcriptions.filter((subscribe) => String(subscribe.billingDay) === format(day, 'dd')).length > 0) && (
                  <div className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                    {subcriptions
                      .filter((subscribe) => String(subscribe.billingDay) === format(day, 'dd'))
                      .slice(0, 2)
                      .map((subscribe) => (
                        <span
                          key={subscribe.id}
                          className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-blue-400"
                          title={subscribe.title}
                        />
                      ))}
                    {subscribes.filter((subscribe) => String(subscribe.billingDay) === format(day, 'dd')).length > 2 && (
                      <span className="mx-0.5 text-gray-500 text-xs font-normal">
                        +{subscribes.filter((subscribe) => String(subscribe.billingDay) === format(day, 'dd')).length - 2}
                      </span>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-10 sm:px-6">
        <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
          {subcriptions
            .filter((subscribe) => String(subscribe.billingDay) === format(selectedDay, 'dd'))
            .map((subscribe) => (
              <li key={subscribe.id} className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50">
                <div className="flex-auto">
                  <p className="font-semibold text-gray-900">{subscribe.title}</p>
                  <time dateTime={subscribe.datetime} className="mt-2 flex items-center text-gray-700">
                    <ClockIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    {subscribe.startDatetime}
                  </time>
                </div>
                <a
                  href={subscribe.href}
                  className="ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 opacity-0 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:opacity-100 group-hover:opacity-100"
                >
                  Edit<span className="sr-only">, {subscribe.title}</span>
                </a>
              </li>
            ))}
        </ol>
      </div>
    </div>
  )
}
