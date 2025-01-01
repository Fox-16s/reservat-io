import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  userEmail: string | null;
  onLogout: () => void;
}

const Header = ({ userEmail, onLogout }: HeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/7ed1ad8a-5c46-4f15-92ad-6ce56d9b16e7.png" 
              alt="Reservat.io" 
              className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto rounded-lg"
            />
            {userEmail && !isMobile && (
              <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{userEmail}</span>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            onClick={onLogout}
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {!isMobile && "Logout"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;