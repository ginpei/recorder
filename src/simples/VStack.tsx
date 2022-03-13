export interface VStackProps {
  children: React.ReactNode;
}

const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
}

export function VStack({ children }: VStackProps): JSX.Element {
  return (
    <div className="VStack" style={style}>
      {children}
    </div>
  );
}
