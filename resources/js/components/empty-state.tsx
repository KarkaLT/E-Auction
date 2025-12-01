import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type LucideProps } from 'lucide-react';
import { type ComponentType, type ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ComponentType<LucideProps>;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  className,
  children,
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        'flex flex-col items-center justify-center border-dashed p-8 text-center',
        className,
      )}
    >
      <CardHeader className="items-center pb-2">
        {Icon && (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && (
          <CardDescription className="mt-2 max-w-sm">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
      {action && (
        <CardFooter className="pt-4">
          <Button onClick={action.onClick}>{action.label}</Button>
        </CardFooter>
      )}
    </Card>
  );
}
