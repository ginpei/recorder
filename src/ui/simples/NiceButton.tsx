export interface NiceButtonProps extends React.ComponentPropsWithRef<"button"> {
  children: React.ReactNode;
}

export function NiceButton({ children, ...buttonProps }: NiceButtonProps): JSX.Element {
  return (
    <button {...buttonProps} className="
      NiceButton
      border-2 border-current
      text-cyan-900 disabled:text-neutral-400
      px-4
    ">
      {children}
    </button>
  );
}
