import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InstanceLayoutProps {
  children: React.ReactNode;
}

const InstanceLayout = ({ children }: InstanceLayoutProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4 sticky top-0 z-10 bg-background p-4">
        <button
          onClick={handleBack}
          className="flex gap-2 items-center p-3 pt-0 pb-0 rounded-sm text-muted-foreground hover:cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>
      <div className="p-8 pt-0 pb-0">{children}</div>
    </div>
  );
};

export default InstanceLayout;