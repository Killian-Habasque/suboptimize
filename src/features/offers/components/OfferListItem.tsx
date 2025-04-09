import { EllipsisVerticalIcon, PhoneIcon } from "@heroicons/react/24/solid";
import CategoryBadge from '@/components/ui/CategoryBadge';
import DueTypeBadge from "@/components/ui/DueTypeBadge";
import BrandBubble from '@/components/ui/BrandBubble';

interface OfferListItemProps {
    image?: string;
    price?: string;
    title?: string;
    brand?: string;
    category?: string;
    dueType?: 'mensuel' | 'annuel';
}

const OfferListItem: React.FC<OfferListItemProps> = ({
    image,
    price,
    title,
    brand,
    category,
    dueType,
}) => {
    return (
        <div className='relative flex justify-center items-center w-full p-4 gap-4'>
            {image && <BrandBubble image={image} altText={title} />}
            <div className='w-full'>
                {title && <h3 className='text-xl font-semibold'>{title}</h3>}
                <div className='flex gap-2 items-center flex-wrap'>
                    {brand && <div className='text-sm flex gap-2 text-gray-500 items-center font-normal'>{brand}</div>}
                    {category && <CategoryBadge icon={<PhoneIcon className="w-4" />} label={category} />}
                    {dueType && <DueTypeBadge type={dueType} />}
                </div>
                {price && <span className='text-lg font-semibold'>{price} €</span>}
            </div>
            <div className='flex items-center'>
                <div className='w-10 h-10 rounded-full bg-blue-50 cursor-pointer'>
                    <EllipsisVerticalIcon className='w-full h-full text-gray-400' />
                </div>
            </div>
        </div>
    );
};

export default OfferListItem;