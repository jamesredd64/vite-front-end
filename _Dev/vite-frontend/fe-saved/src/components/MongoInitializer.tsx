import { ReactNode } from 'react';

interface MongoInitializerProps {
  children: ReactNode;
}

const MongoInitializer: React.FC<MongoInitializerProps> = ({ children }) => {
  return <>{children}</>;
};

export default MongoInitializer;