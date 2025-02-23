import { useEffect, useState } from 'react';

interface AlertProps {
  text: string;
  variant: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void; // Agregamos prop para callback
}

const variantStyles = {
  success: 'bg-green-400 text-white',
  error: 'bg-red-400 text-white',
  warning: 'bg-yellow-400 text-black',
  info: 'bg-blue-400 text-white',
};

export default function Alert({ text, variant, onClose }: AlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.(); // Llamamos al callback cuando se oculta el Alert
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className={`fixed top-4 left-8 right-8 p-4 rounded-md ${variantStyles[variant]} z-50`}>
      <div className="container mx-auto">
        {text}
      </div>
    </div>
  );
}