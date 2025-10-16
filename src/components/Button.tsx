import {twMerge} from 'tailwind-merge';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  children: React.ReactNode;
}
// Hier order fun-pass function as a prameter- to call button from react 
export default React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({children, className, ...props},ref){
  const baseClasses ='px-3 py-1.5 text-sm rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

  // twMerge allow you to overrite the baseClasse with className prop
  const mergedClasses = twMerge(baseClasses, className);

  return (
    <button className={mergedClasses} ref={ref} {...props}>
    {children}
    </button>
  );
});


