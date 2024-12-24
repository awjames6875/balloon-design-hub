import { Balloon, PackageSearch, ClipboardList, LogOut } from 'lucide-react';
import NavigationCard from '../components/NavigationCard';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-5 py-8 md:py-16">
        <div className="grid grid-cols-1 gap-8 mb-16">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Balloon Design Manager
              </h1>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Create, manage, and track your balloon designs and inventory with ease
              </p>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 whitespace-nowrap"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <NavigationCard
            title="New Design"
            description="Create and customize new balloon arrangements"
            icon={Balloon}
            to="/new-design"
            accentColor="pink"
            imageSrc="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=400&auto=format&fit=crop"
          />
          <NavigationCard
            title="Inventory"
            description="Manage your balloon and supplies inventory"
            icon={PackageSearch}
            to="/inventory"
            accentColor="blue"
            imageSrc="https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=400&auto=format&fit=crop"
          />
          <NavigationCard
            title="Production Forms"
            description="Track and manage production orders"
            icon={ClipboardList}
            to="/production-forms"
            imageSrc="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=400&auto=format&fit=crop"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;