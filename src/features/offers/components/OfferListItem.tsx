import { EllipsisVerticalIcon, PhoneIcon } from "@heroicons/react/24/solid";
import CategoryBadge from '@/components/ui/CategoryBadge';
import DueTypeBadge from "@/components/ui/DueTypeBadge";
import BrandBubble from '@/components/ui/BrandBubble';
import { Category, Company } from "@prisma/client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface OfferListItemProps {
    price?: number;
    title?: string;
    description?: string;
    category?: Category;
    company?: Company;
    dueType?: 'mensuel' | 'annuel';
    onClick?: () => void;
}

const OfferListItem: React.FC<OfferListItemProps> = ({
    price,
    title,
    company,
    description,
    category,
    dueType,
    onClick
}) => {
    return (
        <div className='relative flex justify-center items-center w-full p-4 gap-4' onClick={() => onClick && onClick()}>
            {company && company.imageLink && <BrandBubble image={company.imageLink} altText={title} />}
            <div className='w-full'>
                {title && <h3 className='text-xl font-semibold'>{title}</h3>}
                <div className='flex gap-2 items-center flex-wrap'>
                    {company && <div className='text-sm flex gap-2 text-gray-500 items-center font-normal'>{company.name}</div>}
                    {category && <CategoryBadge icon={<PhoneIcon className="w-4" />} label={category.name} />}
                    {dueType && <DueTypeBadge type={dueType} />}
                </div>
                <div className='flex gap-2 items-center flex-wrap'>
                    {description && <p className="text-xs text-gray-500 font-normal">{description}</p>}
                </div>
                {price && <span className='text-lg font-semibold'>{price} €</span>}
            </div>
            <div className='flex items-center'>
                <Menu as="div" className="relative ml-4 shrink-0">
                    <div>
                        <MenuButton className="relative flex rounded-full bg-white text-sm ring-2 ring-white/25 focus:outline-none focus:ring-gray/100 cursor-pointer">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <div className='w-8 h-8 rounded-full bg-blue-50 cursor-pointer'>
                                <EllipsisVerticalIcon className='w-full h-full text-gray-400' />
                            </div>
                        </MenuButton>
                    </div>
                    <MenuItems
                        transition
                        className="absolute -right-2 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/[5%] focus:outline-none data-[closed]:data-[leave]:scale-95 data-[closed]:data-[leave]:transform data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-75 data-[leave]:ease-in"
                    >

                        <MenuItem key={"edit"}>
                            <a
                                href={"test"}
                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                // onClick={""}
                            >
                                Modifier
                            </a>
                        </MenuItem>
                        <MenuItem key={"delete"}>
                            <a
                                href={"test"}
                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                // onClick={""}
                            >
                                Supprimer
                            </a>
                        </MenuItem>
                    </MenuItems>
                </Menu>
            </div>
        </div>
    );
};

export default OfferListItem;