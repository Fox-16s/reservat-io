import { format } from 'date-fns';
import { Property } from '@/types/types';
import { UserInfo } from '@/types/userInfo';

interface CardHeaderProps {
  property: Property | undefined;
  startDate: Date;
  endDate: Date;
  userInfo?: UserInfo;
}

const CardHeader = ({ property, startDate, endDate, userInfo }: CardHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-3">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${property?.color}`} />
          <span className="font-medium text-sm dark:text-gray-200">
            {property?.name}
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {format(startDate, 'dd MMM yy')} - {format(endDate, 'dd MMM yy')}
        </div>
      </div>
    </div>
  );
};

export default CardHeader;