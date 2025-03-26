'use client';

import { BaseAIInputLoader } from '../loading-states/ai-input-loader/BaseAIInputLoader';
import { MultiAIInputLoader } from '../loading-states/multi-ai-input-loader/MultiAIInputLoader';
import styles from './page.module.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import Image from 'next/image';

function TableDetailsTab() {
    const searchParams = useSearchParams();
    const variant = searchParams.get('variant') as 'looping' | 'shimmer' || 'looping';
    const [isThinking, setIsThinking] = useState(false);

    const handleGenerateClick = () => {
        setIsThinking(true);
    };

    const sqlCode = `create or replace TABLE HAROLD.FAKE_DATA.LITWAKS_ARCADE (
    C1 ${`VARCHAR`}(16777216),
    C2 ${`VARCHAR`}(16777216),
    C3 ${`VARCHAR`}(16777216),
    C4 ${`VARCHAR`}(16777216) COMMENT 'Email addresses.',
    C5 ${`VARCHAR`}(16777216),
    C6 ${`VARCHAR`}(16777216)
);`.replace(/VARCHAR/g, '<span class="' + styles.keyword + '">VARCHAR</span>');

    return (
        <div className={styles.detailsContainer}>
            <div className={styles.detailsSection}>
                <div 
                    className={`${styles.descriptionBox} ${isThinking ? styles.expanded : ''}`}
                    onClick={handleGenerateClick}
                >
                    <div className={styles.sectionContent}>
                        <h3 className={styles.detailsTitle}>Description</h3>
                        <BaseAIInputLoader 
                            variant={variant}  
                            isTriggered={isThinking}
                            startDelay={0}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.detailsSection}>
                <div className={styles.codeBlock}>
                    <h3 className={styles.detailsTitle}>Table Definition</h3>
                    <pre>
                        <code dangerouslySetInnerHTML={{ __html: sqlCode }} />
                    </pre>
                </div>
            </div>
            <div className={styles.detailsSection}>
                <div className={styles.privilegesContainer}>
                    <h3 className={styles.detailsTitle}>Privileges</h3>
                    <div className={styles.privilegeRow}>
                        <span className={styles.roleBadge}>PUBLIC</span>
                        <span className={styles.privilegeBadge}>OWNERSHIP</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SingleColContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tab = searchParams.get('tab') || 'columns';
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [shouldReset, setShouldReset] = useState(false);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

    const handleClose = () => {
        setIsModalVisible(false);
        setShouldReset(true);
        // Reset the shouldReset flag after a brief delay
        setTimeout(() => {
            setShouldReset(false);
        }, 100);
    };

    const handleGenerateClick = () => {
        setIsReviewModalVisible(true);
    };

    const handleCheckboxChange = (columnName: string) => {
        setSelectedColumns(prev => 
            prev.includes(columnName) 
                ? prev.filter(col => col !== columnName)
                : [...prev, columnName]
        );
    };

    const renderDescription = (description: string | null, index: number) => {
        if (description) {
            return description;
        }
        if (hoveredRow === index) {
            return (
                <span className={styles.descriptionPlaceholder}>
                    <span className={styles.descriptionText}>Write a description or</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" role="presentation">
                        <path d="M11 5.99665C11.0001 6.21766 10.9124 6.42968 10.7562 6.58606C10.6 6.74244 10.3881 6.83038 10.1672 6.83054C9.28309 6.83114 8.43543 7.18288 7.81089 7.80844C7.18619 8.43398 6.83543 9.28204 6.83601 10.1661C6.83625 10.3871 6.74856 10.5991 6.59238 10.7555C6.4362 10.9119 6.22429 10.9999 6.00325 11C5.78238 11.0002 5.57026 10.9125 5.41385 10.7563C5.25743 10.6001 5.16953 10.3882 5.16947 10.1672C5.16888 9.28317 4.8171 8.43556 4.1916 7.81087C3.56593 7.18615 2.71797 6.83554 1.83389 6.83613C1.61287 6.83628 1.40085 6.74862 1.24447 6.59244C1.08809 6.43627 1.00015 6.22437 1 6.00335C0.999852 5.78234 1.08749 5.57032 1.24367 5.41394C1.39985 5.25754 1.61176 5.1696 1.83276 5.16945C2.71681 5.16886 3.56443 4.81712 4.18914 4.19157C4.81385 3.56603 5.16444 2.71794 5.16385 1.83389C5.16362 1.61288 5.25131 1.40087 5.40749 1.24447C5.56366 1.08808 5.77558 1.00015 5.99661 1C6.21765 0.999854 6.4296 1.08751 6.58602 1.24369C6.74243 1.39987 6.83034 1.61176 6.83057 1.83279C6.83116 2.71684 7.18277 3.56444 7.80844 4.18914C8.43393 4.81385 9.28207 5.16447 10.166 5.16387C10.3871 5.16373 10.599 5.25138 10.7554 5.40756C10.9119 5.56374 10.9998 5.77563 11 5.99665Z" fill="#FFFFFF"></path>
                        <path d="M15 11.998C15.0001 12.1306 14.9475 12.2578 14.8537 12.3516C14.76 12.4455 14.6329 12.4982 14.5004 12.4983C13.9699 12.4987 13.4613 12.7097 13.0866 13.0851C12.7117 13.4604 12.5013 13.9692 12.5016 14.4997C12.5018 14.6323 12.4492 14.7595 12.3555 14.8533C12.2618 14.9471 12.1346 14.9999 12.002 15C11.8695 15.0001 11.7422 14.9475 11.6483 14.8538C11.5545 14.7601 11.5017 14.6329 11.5017 14.5003C11.5014 13.9699 11.2903 13.4613 10.915 13.0865C10.5396 12.7117 10.0308 12.5013 9.50033 12.5017C9.36772 12.5018 9.24051 12.4492 9.14668 12.3555C9.05285 12.2618 9.00009 12.1346 9 12.002C8.99991 11.8694 9.0525 11.7422 9.1462 11.6484C9.23991 11.5545 9.36706 11.5018 9.49966 11.5017C10.0301 11.5013 10.5387 11.2903 10.9135 10.9149C11.2883 10.5396 11.4987 10.0308 11.4983 9.50033C11.4982 9.36773 11.5508 9.24052 11.6445 9.14668C11.7382 9.05285 11.8654 9.00009 11.998 9C12.1306 8.99991 12.2578 9.0525 12.3516 9.14621C12.4455 9.23992 12.4982 9.36706 12.4984 9.49967C12.4987 10.0301 12.7097 10.5387 13.0851 10.9135C13.4604 11.2883 13.9693 11.4987 14.4997 11.4983C14.6323 11.4982 14.7595 11.5508 14.8533 11.6445C14.9471 11.7382 14.9999 11.8654 15 11.998Z" fill="#FFFFFF"></path>
                    </svg>
                    <button className={styles.generateLink} onClick={() => setIsModalVisible(true)}>
                        Generate with Cortex
                    </button>
                </span>
            );
        }
        return <span className={styles.descriptionPlaceholder}>&nbsp;</span>;
    };

    const renderTagsOrPolicy = (type: 'tag' | 'policy', index: number) => {
        if (hoveredRow === index) {
            return (
                <span className={styles.descriptionPlaceholder}>
                    + {type === 'tag' ? 'Tag' : 'Policy'}
                </span>
            );
        }
        return <span className={styles.descriptionPlaceholder}>&nbsp;</span>;
    };

    const handleTabClick = (newTab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', newTab);
        router.push(`/snowsight?${params.toString()}`);
    };

    const columns = [
        {
            name: 'WHEEL_SIZE',
            sampleValues: ['Medium', 'Large', 'X-large'],
            description: 'Size of wheels being placed on bikes within the store inventory'
        },
        {
            name: 'COLOR',
            sampleValues: ['Cobalt Blue', 'Scarlett Red', 'Dark Grey'],
            description: 'Color of bikes within the store inventory'
        },
        {
            name: 'CATEGORY',
            sampleValues: ['Mountain', 'Road', 'Hybrid'],
            description: 'Category of bikes within the store inventory'
        },
        {
            name: 'FRAME_SIZE',
            sampleValues: ['Medium', 'Large', 'X-large'],
            description: 'Size of the bicycle frames on bikes within the store inventory'
        },
        {
            name: 'PURCHASE_DATE',
            sampleValues: ['11/23/23', '12/12/23', '1/7/24'],
            description: 'Date bike was purchased'
        },
        {
            name: 'EMAIL',
            sampleValues: ['nate@snowflake.com', 'chris@snowflake.com', 'jiaming@snowflake.com'],
            description: 'Email address of customers'
        }
    ];

    return (
        <>
            <div className={styles.snowflakeContainer}>
                <div className={styles.navImageContainer}>
                    <Image 
                        src="/assets/nav.png"
                        alt="Navigation"
                        width={41}
                        height={491}
                    />
                </div>
                <div className={styles.contentContainer}>
                    <div className={styles.tabsContainer}>
                        <button
                            className={`${styles.tab} ${tab === 'columns' ? styles.active : ''}`}
                            onClick={() => handleTabClick('columns')}
                        >
                            Columns
                        </button>
                        <button
                            className={`${styles.tab} ${tab === 'details' ? styles.active : ''}`}
                            onClick={() => handleTabClick('details')}
                        >
                            Details
                        </button>
                    </div>
                    {tab === 'columns' ? (
                        <div className={styles.columnsContainer}>
                            <div className={styles.tableHeader}>
                                <div className={styles.columnName}>Column Name</div>
                                <div className={styles.sampleValues}>Sample Values</div>
                                <div className={styles.description}>Description</div>
                                <div className={styles.tags}>Tags</div>
                                <div className={styles.policy}>Policy</div>
                            </div>
                            <div className={styles.tableBody}>
                                {columns.map((column, index) => (
                                    <div 
                                        key={column.name}
                                        className={styles.tableRow}
                                        onMouseEnter={() => setHoveredRow(index)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
                                        <div className={styles.columnName}>
                                            <input
                                                type="checkbox"
                                                checked={selectedColumns.includes(column.name)}
                                                onChange={() => handleCheckboxChange(column.name)}
                                                className={styles.checkbox}
                                            />
                                            {column.name}
                                        </div>
                                        <div className={styles.sampleValues}>
                                            {column.sampleValues.map((value, i) => (
                                                <span key={i} className={styles.sampleValue}>{value}</span>
                                            ))}
                                        </div>
                                        <div className={styles.description}>
                                            {renderDescription(column.description, index)}
                                        </div>
                                        <div className={styles.tags}>
                                            {renderTagsOrPolicy('tag', index)}
                                        </div>
                                        <div className={styles.policy} onClick={handleGenerateClick}>
                                            {renderTagsOrPolicy('policy', index)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <TableDetailsTab />
                    )}
                </div>
            </div>
            {isModalVisible && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <button className={styles.closeButton} onClick={handleClose}>×</button>
                        <div className={styles.modalContent}>
                            <MultiAIInputLoader 
                                shouldReset={shouldReset}
                                isTriggered={isModalVisible}
                                onThinkingComplete={handleClose}
                            />
                        </div>
                    </div>
                </div>
            )}
            {isReviewModalVisible && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <button className={styles.closeButton} onClick={() => setIsReviewModalVisible(false)}>×</button>
                        <div className={styles.modalContent}>
                            <div className={styles.reviewModalHeader}>
                                <h3>Review Selected Columns</h3>
                                <p>The following columns will be used to generate descriptions:</p>
                            </div>
                            <div className={styles.selectedColumns}>
                                {selectedColumns.map(columnName => (
                                    <div key={columnName} className={styles.selectedColumn}>
                                        {columnName}
                                    </div>
                                ))}
                            </div>
                            <div className={styles.modalActions}>
                                <button 
                                    className={styles.generateButton}
                                    onClick={() => {
                                        setIsReviewModalVisible(false);
                                        setIsModalVisible(true);
                                    }}
                                >
                                    Generate
                                </button>
                                <button 
                                    className={styles.cancelButton}
                                    onClick={() => setIsReviewModalVisible(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function SingleColPage() {
    return (
        <Suspense fallback={null}>
            <SingleColContent />
        </Suspense>
    );
} 