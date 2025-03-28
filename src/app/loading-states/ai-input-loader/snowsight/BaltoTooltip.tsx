import { useEffect, useState } from 'react';
import styles from './snowsight.module.css';

interface BaltoTooltipProps {
    show: boolean;
    content?: string;
}

export default function BaltoTooltip({ show, content = "This can take up to 1 minute" }: BaltoTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (show) {
            timeoutId = setTimeout(() => {
                setIsVisible(true);
            }, 500);
        } else {
            setIsVisible(false);
        }
        return () => clearTimeout(timeoutId);
    }, [show]);

    return (
        <div className={`${styles.tooltipContainer} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.tooltipArrow} />
            <span className={styles.tooltipText}>{content}</span>
        </div>
    );
} 