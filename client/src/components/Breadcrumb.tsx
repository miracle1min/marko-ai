import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
      <div className="flex items-center hover:text-primary transition-colors cursor-pointer">
        <Link href="/">
          <Home className="h-4 w-4" />
        </Link>
      </div>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          {item.isActive ? (
            <span className="font-medium text-primary">{item.label}</span>
          ) : (
            <div className="hover:text-primary transition-colors cursor-pointer">
              <Link href={item.path}>
                {item.label}
              </Link>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}