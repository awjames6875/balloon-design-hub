import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface NavigationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  accentColor?: string;
  imageSrc?: string;
}

const NavigationCard = ({ 
  title, 
  description, 
  icon: Icon, 
  to, 
  accentColor = 'gray',
  imageSrc
}: NavigationCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={() => navigate(to)}
    >
      {imageSrc && (
        <div className="absolute inset-0 z-0">
          <img 
            src={imageSrc} 
            alt={title}
            className="w-full h-full object-cover opacity-10"
          />
        </div>
      )}
      <CardContent className="relative z-10 p-6 bg-gradient-to-br from-white/80 to-transparent">
        <div className={`flex items-center gap-4 mb-4 text-${accentColor}-500`}>
          <Icon className="h-8 w-8" />
          <h2 className="text-h2 font-semibold">{title}</h2>
        </div>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default NavigationCard;