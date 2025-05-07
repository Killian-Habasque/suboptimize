import { BookmarkIcon, ChatBubbleOvalLeftIcon, MinusIcon, PlusIcon, PhoneIcon } from "@heroicons/react/24/solid";
import CategoryBadge from '@/components/ui/category-badge';
import DueTypeBadge from "@/components/ui/duetype-badge";
import BrandBubble from '@/components/ui/brand-bubble';
import { Category, Company } from "@prisma/client";
import Link from "next/link";

interface OfferListItemProps {
    slug?: string;
    rankingScore?: number;
    price?: number;
    normalPrice?: number;
    title?: string;
    description?: string;
    category?: Category;
    company?: Company;
    dueType?: 'mensuel' | 'annuel';
    onClick?: () => void;
    preview?: boolean;
}

const OfferListItem: React.FC<OfferListItemProps> = ({
    slug,
    rankingScore,
    price,
    normalPrice,
    title,
    company,
    description,
    category,
    dueType,
    onClick,
    preview = true
}) => {
    return (
        <Link href={slug ? `/offres/${slug}` : "#"} className="relative flex justify-center items-center w-full py-4 px-8 gap-8 hover:opacity-[0.75]" onClick={() => onClick && onClick()}>
            <BrandBubble image={company?.imageLink ? company.imageLink : null} brandName={company?.name || undefined} altText={title || ''} variant="large" />

            <div className="w-full flex flex-col gap-1">

                {!preview && (
                    <div className="flex justify-between">
                        <div className="size-fit bg-secondary rounded-full px-1 py-1 text-sm font-medium text-white flex gap-2">
                            <MinusIcon className="w-5 h-5 bg-white rounded-full text-secondary cursor-pointer" />
                            {rankingScore || 0}
                            <PlusIcon className="w-5 h-5 bg-white rounded-full text-secondary cursor-pointer" />
                        </div>
                        <p className="text-sm text-primary">Posté il y a 3 jours</p>
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

                {price && (
                    <div className="flex items-center gap-2">
                        {normalPrice && (
                            <span className="text-gray-400 line-through text-md">
                                {normalPrice} €
                            </span>
                        )}
                        <span className="text-lg font-semibold">
                            {price} €
                        </span>
                    </div>
                )}

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
