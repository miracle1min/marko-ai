import { Link } from "wouter";
import { toolCategoriesData, getIconComponent } from "@/lib/constants";

export default function ToolCategories() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {toolCategoriesData.map((category, index) => {
          const IconComponent = getIconComponent(category.iconType);
          
          return (
            <Link 
              key={index} 
              href={category.path}
              className="tool-card bg-white rounded-lg shadow-md p-4 flex items-center justify-center space-x-2 hover:bg-blue-50"
            >
              <span className={`${category.bgColor} text-white rounded-full w-8 h-8 flex items-center justify-center`}>
                <IconComponent className="h-4 w-4" />
              </span>
              <span className="font-medium">{category.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
