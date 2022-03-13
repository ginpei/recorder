export interface ContainerProps {
  children: React.ReactNode;
}

const style: React.CSSProperties = {
  boxSizing: 'border-box',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  width: 'min(100%, 800px)',
};

export function Container({ children }: ContainerProps): JSX.Element {
  return (
    <div className="Container" style={style}>
      {children}
    </div>
  );
}
