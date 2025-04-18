import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Popover,
    PopoverBackdrop,
    PopoverButton,
    PopoverPanel,
} from '@headlessui/react'
import { Bars3Icon, BellIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { classNames } from '@/services/utils'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import Button from '../ui/Button'


const defaultUser = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
    { name: 'Calendrier des abonnements', href: '/template', current: true },
    { name: 'Offres', href: '/offres', current: false },
    { name: 'Tendances', href: '/offres', current: false },
    { name: 'Mes alertes', href: '/offres', current: false },
]
const userNavigation = [
    { name: 'Your Profile', href: '/profil' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
]



const Header = () => {
    const { data: session } = useSession()

    const handleSignOut = async () => {
        await signOut({ redirect: true, callbackUrl: '/' })
    }
    console.log(session?.user?.image)
    return (
        <Popover as="header" className="bg-primary pb-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-custom lg:px-8">
                <div className="relative flex items-center justify-center py-5 lg:justify-between">
                    {/* Logo */}
                    <div className="absolute left-0 shrink-0 lg:static">
                        <a href="#">
                            <span className="sr-only">Your Company</span>
                            <Image
                                alt="Sub'optimize"
                                src="/logo_suboptimize.svg"
                                className="h-8 w-auto hidden lg:block"
                                width={32}
                                height={32}
                            />
                            <Image
                                alt="Sub'optimize"
                                src="/logo_icon.svg"
                                className="h-8 w-auto lg:hidden"
                                width={32}
                                height={32}
                            />
                        </a>
                    </div>

                    {/* Right section on desktop */}
                    <div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">

                        <Button className="bg-secondary text-white py-1 hover:text-primary !py-1">
                            <PlusIcon aria-hidden="true" className="h-4 w-4" />
                            Poster
                        </Button>
                        <button
                            type="button"
                            className="relative shrink-0 ml-4 rounded-full p-1 text-indigo-200 hover:bg-white/[0] hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">View notifications</span>
                            <BellIcon aria-hidden="true" className="h-6 w-6" />
                        </button>

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-4 shrink-0">
                            <div>
                                <MenuButton className="relative flex rounded-full bg-white text-sm ring-2 ring-white/25 focus:outline-none focus:ring-white/100">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">Open user menu</span>
                                    {session?.user?.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt="user avatar"
                                            width={20}
                                            height={20}
                                            className="h-8 w-8 rounded-full"
                                        />
                                    ) : (
                                        <Image 
                                            alt="default user" 
                                            src={defaultUser.imageUrl} 
                                            className="h-8 w-8 rounded-full" 
                                            width={32}
                                            height={32}
                                        />
                                    )
                                    }

                                </MenuButton>
                            </div>
                            <MenuItems
                                transition
                                className="absolute -right-2 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/[5%] focus:outline-none data-[closed]:data-[leave]:scale-95 data-[closed]:data-[leave]:transform data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-75 data-[leave]:ease-in"
                            >
                                {userNavigation.map((item) => (
                                    <MenuItem key={item.name}>
                                        <a
                                            href={item.href}
                                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                            onClick={item.name === 'Sign out' ? handleSignOut : undefined}
                                        >
                                            {item.name}
                                        </a>
                                    </MenuItem>
                                ))}
                            </MenuItems>
                        </Menu>
                    </div>

                    {/* Search */}
                    <div className="min-w-0 flex-1 px-12 lg:hidden">
                        <div className="mx-auto w-full max-w-xs">
                            <label htmlFor="desktop-search" className="sr-only">
                                Search
                            </label>
                            <div className="relative text-white focus-within:text-gray-600">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MagnifyingGlassIcon aria-hidden="true" className="h-5 w-5" />
                                </div>
                                <input
                                    id="desktop-search"
                                    name="search"
                                    type="search"
                                    placeholder="Search"
                                    className="block w-full rounded-md border-0 bg-white/20 py-1.5 pl-10 pr-3 text-white placeholder:text-white focus:bg-white focus:text-gray-900 focus:ring-0 focus:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Menu button */}
                    <div className="absolute right-0 shrink-0 lg:hidden">
                        {/* Mobile menu button */}
                        <PopoverButton className="group relative inline-flex items-center justify-center rounded-md bg-transparent p-2 text-indigo-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                        </PopoverButton>
                    </div>
                </div>
                <div className="hidden border-t border-white/25 py-5 lg:block">
                    <div className="grid grid-cols-3 items-center gap-8">
                        <div className="col-span-2">
                            <nav className="flex space-x-4">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        aria-current={item.current ? 'page' : undefined}
                                        className={classNames(
                                            item.current ? 'text-white' : 'text-indigo-100',
                                            'rounded-md bg-white/0 px-3 py-2 text-sm font-medium hover:bg-white/25',
                                        )}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </nav>
                        </div>
                        <div>
                            <div className="mx-auto w-full max-w-md">
                                <label htmlFor="mobile-search" className="sr-only">
                                    Search
                                </label>
                                <div className="relative text-white focus-within:text-gray-600">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <MagnifyingGlassIcon aria-hidden="true" className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="mobile-search"
                                        name="search"
                                        type="search"
                                        placeholder="Search"
                                        className="block w-full rounded-md border-0 bg-white/20 py-1.5 pl-10 pr-3 text-white placeholder:text-white focus:bg-white focus:text-gray-900 focus:ring-0 focus:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:hidden">
                <PopoverBackdrop
                    transition
                    className="fixed inset-0 z-20 bg-black/25 duration-150 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in"
                />

                <PopoverPanel
                    focus
                    transition
                    className="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl origin-top transform p-2 transition duration-150 data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in"
                >
                    <div className="divide-y divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black/[5%]">
                        <div className="pb-2 pt-3">
                            <div className="flex items-center justify-between px-4">
                                <div>
                                    <Image
                                        alt="Sub'optimize"
                                        src="/logo_suboptimize_dark.svg"
                                        className="h-8 w-auto"
                                        width={32}
                                        height={32}
                                    />
                                </div>
                                <div className="-mr-2">
                                    <PopoverButton className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">Close menu</span>
                                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                                    </PopoverButton>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1 px-2">
                                <a
                                    href="#"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                                >
                                    Home
                                </a>
                                <a
                                    href="#"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                                >
                                    Profile
                                </a>
                                <a
                                    href="#"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                                >
                                    Resources
                                </a>
                                <a
                                    href="#"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                                >
                                    Company Directory
                                </a>
                                <a
                                    href="#"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                                >
                                    Openings
                                </a>
                            </div>
                        </div>
                        <div className="pb-2 pt-4">
                            {session?.user ? (
                                <div className="flex items-center px-5">
                                    <div className="shrink-0">
                                        <Image 
                                            alt="user avatar" 
                                            src={session.user.image || defaultUser.imageUrl} 
                                            className="h-10 w-10 rounded-full" 
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div className="ml-3 min-w-0 flex-1">
                                        <div className="truncate text-base font-medium text-gray-800"> {session.user.name}</div>
                                        <div className="truncate text-sm font-medium text-gray-500">     {session.user.email}</div>
                                    </div>
                                    <button
                                        type="button"
                                        className="relative ml-auto shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon aria-hidden="true" className="h-6 w-6" />
                                    </button>
                                </div>
                            ) : ''}
                            <div className="mt-3 space-y-1 px-2">
                                {userNavigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                                        onClick={item.name === 'Sign out' ? handleSignOut : undefined}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </PopoverPanel>
            </div>
        </Popover>
    )
}

export default Header