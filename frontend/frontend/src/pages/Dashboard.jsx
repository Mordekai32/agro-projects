import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import FarmerDashboardContent from './FarmerDashboardContent';
import BuyerDashboardContent from './BuyerDashboardContent';
import AdminDashboardContent from './AdminDashboardContent';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const renderContent = () => {
    switch (user.type) {
      case 'farmer':
      case 'cooperative':
        return <FarmerDashboardContent />;
      case 'buyer':
        return <BuyerDashboardContent />;
      case 'admin':
        return <AdminDashboardContent />;
      default:
        return <div>Unknown user type</div>;
    }
  };

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
}