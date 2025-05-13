import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import CategoryBadge from '@/components/ui/category-badge';
import { Subscription, Category } from '@/lib/types';
import { getHeroIcon } from '@/lib/icon-helper';
import { filter_Subscriptions_by_month, get_visible_days } from '@/features/subscriptions/subscription-service';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

const COLORS = [
  '#A3B8D8', 
  '#E5E9F2', 
  '#B5A8C5', 
  '#D1C1E0',
  '#F5D6BA', 
  '#F7CAC9',
  '#92A8D1', 
];

const RADIAN = Math.PI / 180;

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  index: number;
}

interface CategoryDataItem {
  category: Category;
  value: number;
}

function renderCustomizedLabel({ cx, cy, midAngle, innerRadius, outerRadius, index }: LabelProps, data: CategoryDataItem[]) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const cat = data[index]?.category;
  const Icon = getHeroIcon(cat?.icon);

  return (
    <g>
      <foreignObject x={x - 12} y={y - 12} width={24} height={24} style={{ pointerEvents: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}>
          {Icon ? <Icon className="w-5 h-5 text-primary" /> : null}
        </div>
      </foreignObject>
    </g>
  );
}

const SummaryCard: React.FC<{ subscriptions: Subscription[] }> = ({ subscriptions }) => {
  const visibleDays = get_visible_days();

  const monthSubscriptions = useMemo(() => {
    return filter_Subscriptions_by_month(subscriptions, visibleDays);
  }, [subscriptions, visibleDays]);

  const { categoryData, total, count, uniqueCategories } = useMemo(() => {
    const categoryMap: Record<string, { category: Category; value: number }> = {};
    let total = 0;
    let count = 0;
    monthSubscriptions.forEach(sub => {
      if (sub.categories && sub.categories.length > 0) {
        sub.categories.forEach(cat => {
          if (!categoryMap[cat.id]) {
            categoryMap[cat.id] = { category: cat, value: 0 };
          }
          categoryMap[cat.id].value += sub.price || 0;
        });
      } else {
        if (!categoryMap['other']) {
          categoryMap['other'] = { category: { id: 'other', name: 'Autre', icon: null } as Category, value: 0 };
        }
        categoryMap['other'].value += sub.price || 0;
      }
      total += sub.price || 0;
      count++;
    });
    return {
      categoryData: Object.values(categoryMap),
      total,
      count,
      uniqueCategories: Object.values(categoryMap).map(c => c.category),
    };
  }, [monthSubscriptions]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 w-full">
      <div className="w-full md:w-1/3 h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={props => renderCustomizedLabel(props, categoryData)}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${entry.category.id}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 flex flex-col gap-4 items-center md:items-start">
        <div className="flex items-center">
          <CalendarDaysIcon className="h-5 w-5 text-secondary mr-2" />
          <h2 className="text-lg font-medium text-gray-700">Mois en cours</h2>
        </div>
        <div className="flex gap-8 w-full justify-center md:justify-start">
          <div className="flex flex-col items-center w-full ring-1 ring-black/[5%] py-4 rounded-sm">
            <span className="text-gray-500 text-sm">Total du mois</span>
            <span className="text-2xl font-bold">{total.toFixed(2)}€</span>
          </div>
          <div className="flex flex-col items-center w-full ring-1 ring-black/[5%] py-4 rounded-sm">
            <span className="text-gray-500 text-sm">Nombre d&apos;abonnements</span>
            <span className="text-2xl font-bold">{count}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {uniqueCategories.map((cat) => {
            const Icon = getHeroIcon(cat.icon);
            return (
              <CategoryBadge
                key={cat.id}
                icon={Icon ? <Icon className="w-4" /> : null}
                label={cat.name}
                variant="secondary"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;