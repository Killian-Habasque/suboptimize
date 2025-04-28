import { BookmarkIcon, ChatBubbleOvalLeftIcon, MinusIcon, PlusIcon, PhoneIcon } from "@heroicons/react/24/solid";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import CategoryBadge from '@/components/ui/CategoryBadge';
import DueTypeBadge from "@/components/ui/DueTypeBadge";
import BrandBubble from '@/components/ui/BrandBubble';
import { Category, Company } from "@prisma/client";
import Link from "next/link";

interface OfferListItemProps {
    link?: string;
    rankingScore?: number;
    price?: number;
    title?: string;
    description?: string;
    category?: Category;
    company?: Company;
    dueType?: 'mensuel' | 'annuel';
    onClick?: () => void;
    preview?: boolean; 
}

const OfferListItem: React.FC<OfferListItemProps> = ({
    link,
    rankingScore,
    price,
    title,
    company,
    description,
    category,
    dueType,
    onClick,
    preview = true 
}) => {
    return (
        <Link href={link ? `/offres/${link}` : "#"} className="relative flex justify-center items-center w-full p-4 gap-4" onClick={() => onClick && onClick()}>
            {company?.imageLink && <BrandBubble image={company.imageLink} altText={title || ''} />}
            <div className="w-full flex flex-col gap-1">
                
                {!preview && (
                    <div className="size-fit bg-secondary rounded-full px-1 py-1 text-sm font-medium text-white flex gap-2">
                        <MinusIcon className="w-5 h-5 bg-white rounded-full text-secondary cursor-pointer" />
                        {rankingScore || 0}
                        <PlusIcon className="w-5 h-5 bg-white rounded-full text-secondary cursor-pointer" />
                    </div>
                )}

                {title && <h3 className="text-xl font-semibold">{title}</h3>}

                <div className="flex gap-2 items-center flex-wrap">
                    {company?.name && (
                        <div className="text-sm flex gap-2 text-gray-500 items-center font-normal">
                            {company.name}
                        </div>
                    )}
                    {category && <CategoryBadge icon={<PhoneIcon className="w-4" />} label={category.name} />}
                    {dueType && <DueTypeBadge type={dueType} />}
                </div>

                <div className="flex gap-2 items-center flex-wrap">
                    {description && <p className="text-xs text-gray-500 font-normal">{description}</p>}
                </div>

                {price && <span className="text-lg font-semibold">{price} €</span>}

                {!preview && (
                    <div className="flex gap-2">
                        <ChatBubbleOvalLeftIcon className="w-5 h-5 bg-white rounded-full text-primary cursor-pointer" />
                        <BookmarkIcon className="w-5 h-5 bg-white rounded-full text-primary cursor-pointer" />
                    </div>
                )}
            </div>
        </Link>
    );
};

export default OfferListItem;
