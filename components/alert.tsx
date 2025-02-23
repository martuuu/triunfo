import { useEffect, useState } from 'react';

interface AlertProps {
  text: string;
  variant: 'success' | 'error' | 'warning' | 'info';
}

const variantStyles = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-black',
  info: 'bg-blue-500 text-white',
};

export default function Alert({ text, variant }: AlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 p-4 ${variantStyles[variant]} z-50`}>
      <div className="container mx-auto">
        {text}
      </div>
    </div>
  );
}