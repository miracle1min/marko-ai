import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  subtitle?: string;
}

export default function PageContainer({
  children,
  className,
  containerClassName,
  breadcrumbs,
  title,
  subtitle
}: PageContainerProps) {
  return (
    <div className={cn("container px-4 mx-auto", containerClassName)}>
      {/* Breadcrumbs if provided */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {crumb.current ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href || "#"}>{crumb.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Title and subtitle if provided */}
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
      )}

      {/* Main content */}
      <div className={cn("", className)}>
        {children}
      </div>
    </div>
  );
}