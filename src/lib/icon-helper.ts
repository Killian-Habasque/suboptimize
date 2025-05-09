import * as HeroIcons from '@heroicons/react/24/solid';

export const getHeroIcon = (iconName: string | null) => {
    if (!iconName) return null;
        const iconKey = `${iconName}Icon`;
    
    if (iconKey in HeroIcons) {
        return HeroIcons[iconKey as keyof typeof HeroIcons];
    }
    
    return HeroIcons.QuestionMarkCircleIcon;
}; 