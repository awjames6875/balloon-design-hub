import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface NavigationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  accentColor?: string;
}

const NavigationCard = ({ title, description, icon: Icon, to, accentColor = 'primary' }: NavigationCardProps) => {
  return (
    <Link to={to} className="block">
      <div className={`p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:animate-card-hover border-l-4 ${
        accentColor === 'pink' ? 'border-accent-pink' : 
        accentColor === 'blue' ? 'border-accent-blue' : 
        'border-primary'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${
            accentColor === 'pink' ? 'bg-pink-100 text-accent-pink' : 
            accentColor === 'blue' ? 'bg-blue-100 text-accent-blue' : 
            'bg-purple-100 text-primary'
          }`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NavigationCard;