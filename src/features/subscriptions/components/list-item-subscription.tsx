import { EllipsisVerticalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import CategoryBadge from '@/components/ui/category-badge';
import DueTypeBadge from "@/components/ui/duetype-badge";
import CompanyBubble from '@/components/ui/company-bubble';
import { Category, Company } from "@prisma/client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useState } from "react";
import { getHeroIcon } from "@/lib/icon-helper";
import Link from "next/link";
import Modal from "@/components/ui/modal";

interface SubscriptionListItemProps {
    id?: string;
    price?: number;
    title?: string;
    description?: string;
    category?: Category | null;
    customCompany?: string,
    company?: Company | null;
    dueType?: 'mensuel' | 'annuel';
    onEdit?: (id?: string) => void;
    onDelete?: (id?: string) => void;
}

const SubscriptionListItem: React.FC<SubscriptionListItemProps> = ({
    id,
    price,
    title,
    company,
    description,
    category,
    customCompany,
    dueType,
    onEdit,
    onDelete,
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const CategoryIcon = category?.icon ? getHeroIcon(category.icon) : null;

    const handleEdit = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (onEdit) {
            onEdit(id);
        }
    };

    const handleDelete = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (onDelete) {
            onDelete(id);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className={`relative flex justify-center items-center w-full gap-8`}>
            <CompanyBubble image={company?.imageLink ? company.imageLink : null} brandName={company?.name || customCompany || undefined} altText={title} />
            <div className="w-full">
                {title && <h3 className="text-md font-semibold">{title}</h3>}
                <div className="flex gap-1 items-center flex-wrap">
                    {company && <div className="text-xs flex gap-2 text-gray-500 items-center font-normal">{company.name}</div>}
                    {customCompany && <div className="text-xs flex gap-2 text-gray-500 items-center font-normal">{customCompany}</div>}
                    {category && <CategoryBadge icon={CategoryIcon ? <CategoryIcon className="w-4" /> : null} label={category.name} />}
                    {dueType && <DueTypeBadge type={dueType} />}
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                    {description && <p className="text-xs text-gray-500 font-normal">{description}</p>}
                </div>
                {price && <span className="text-md font-semibold">{price} €</span>}
            </div>

            {onEdit && onDelete ?
                <>
                    <div className="flex items-center">
                        <Link href={`/abonnements/${id}`}>                     
                            <CategoryBadge icon={<MagnifyingGlassIcon className="w-4" />} label={"Optimiser"} variant={"secondary"}/>
                        </Link>

                        <Menu as="div" className="relative ml-4 shrink-0">
                            <div>
                                <MenuButton className="relative flex rounded-full bg-white text-sm ring-2 ring-white/25 focus:outline-none focus:ring-gray/100 cursor-pointer">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">Open user menu</span>
                                    <div className="w-8 h-8 rounded-full cursor-pointer hover:bg-blue-50">
                                        <EllipsisVerticalIcon className="w-full h-full text-gray-400" />
                                    </div>
                                </MenuButton>
                            </div>
                            <MenuItems
                                transition
                                className="absolute -right-2 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/[5%] focus:outline-none data-[closed]:data-[leave]:scale-95 data-[closed]:data-[leave]:transform data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-75 data-[leave]:ease-in"
                            >
                                <MenuItem key="edit">
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                                            onClick={handleEdit}
                                        >
                                            Modifier
                                        </a>
                                    )}
                                </MenuItem>
                                <MenuItem key="delete">
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={`block px-4 py-2 text-sm text-red-600 ${active ? 'bg-gray-100' : ''}`}
                                            onClick={handleDelete}
                                        >
                                            Supprimer
                                        </a>
                                    )}
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>

                    <Modal
                        isOpen={showDeleteConfirm}
                        onClose={() => setShowDeleteConfirm(false)}
                        title="Confirmer la suppression"
                        description="Êtes-vous sûr de vouloir supprimer cet abonnement ? Cette action est irréversible."
                        size="md"
                    >
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 cursor-pointer"
                            >
                                Supprimer
                            </button>
                        </div>
                    </Modal>
                </>
                : ''}
        </div>
    );
};

export default SubscriptionListItem;