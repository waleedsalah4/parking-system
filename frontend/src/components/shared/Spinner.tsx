interface SpinnerProps {
  size?: number;
  className?: string;
}

export const Spinner = ({ size = 24, className }: SpinnerProps) => {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${className}`}
      style={{
        width: size,
        height: size,
      }}
      role="status"
    />
  );
};
