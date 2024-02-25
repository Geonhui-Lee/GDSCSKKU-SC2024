import { ReactNode } from 'react';
import './CommonContainer.css';

interface ContainerProps {
    children: ReactNode;
    [key: string]: any;
    //innerComponent: ReactElement<any, any> | React.FC;
}

const CommonContainer: React.FC<ContainerProps> = ({ children, ...props }) => {
    return (
        <div className="container" {...props}>
            {children}
        </div>
    );
};

export default CommonContainer;