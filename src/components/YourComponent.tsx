import { getImageUrl } from '../config/images.config';

function YourComponent() {
  return (
    <img 
      src={getImageUrl('logo/logo-dark.svg')} 
      alt="Logo" 
    />
  );
}