export interface VStackProps {
  children: React.ReactNode;
}

export function VStack({ children }: VStackProps): JSX.Element {
  return (
    <div className="VStack flex flex-col gap-4">
      {children}
    </div>
  );
}
