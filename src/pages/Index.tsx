import { Palette, Package, ClipboardList, LogOut } from 'lucide-react';
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
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-16">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Balloon Design Manager
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create, manage, and track your balloon designs and inventory with ease
            </p>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <NavigationCard
            title="New Design"
            description="Create and customize new balloon arrangements"
            icon={Palette}
            to="/new-design"
            accentColor="pink"
          />
          <NavigationCard
            title="Inventory"
            description="Manage your balloon and supplies inventory"
            icon={Package}
            to="/inventory"
            accentColor="blue"
          />
          <NavigationCard
            title="Production Forms"
            description="Track and manage production orders"
            icon={ClipboardList}
            to="/production-forms"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;