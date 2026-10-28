/**
 * 공통 버튼
 * variant: 'default' | 'primary' / icon: 아이콘만 있는 동그란 버튼
 */
export default function Button({ variant = 'default', icon = false, className = '', children, ...rest }) {
  const classes = ['btn', variant === 'primary' && 'btn--primary', icon && 'btn--icon', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
