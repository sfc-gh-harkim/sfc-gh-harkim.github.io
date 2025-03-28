'use client';

import { BaseAIInputLoader } from '../BaseAIInputLoader';
import { MultiAIInputLoader } from '../../multi-ai-input-loader/MultiAIInputLoader';
import styles from './snowsight.module.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense, useRef, useEffect } from 'react';
import Image from 'next/image';
import BaltoTooltip from './BaltoTooltip';

type ExpandedItems = {
    [key: string]: boolean;
};

function TableDetailsTab() {
    const searchParams = useSearchParams();
    const variant = searchParams.get('variant') as 'looping' | 'shimmer' || 'looping';
    const [isThinking, setIsThinking] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(1200);

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
        }
    }, []);

    const handleGenerateClick = () => {
        setIsThinking(true);
    };

    const sqlCode = `<span class="${styles.keyword}">create or replace</span> <span class="${styles.keyword}">TABLE</span> HAROLD.FAKE_DATA.LITWAKS_ARCADE (
    <span class="${styles.columnName}">C1</span> <span class="${styles.columnType}">VARCHAR</span>(16777216),
    <span class="${styles.columnName}">C2</span> <span class="${styles.columnType}">VARCHAR</span>(16777216),
    <span class="${styles.columnName}">C3</span> <span class="${styles.columnType}">VARCHAR</span>(16777216),
    <span class="${styles.columnName}">C4</span> <span class="${styles.columnType}">VARCHAR</span>(16777216) <span class="${styles.comment}">COMMENT 'Email addresses.'</span>,
    <span class="${styles.columnName}">C5</span> <span class="${styles.columnType}">VARCHAR</span>(16777216),
    <span class="${styles.columnName}">C6</span> <span class="${styles.columnType}">VARCHAR</span>(16777216)
);`;

    return (
        <div className={styles.detailsContainer}>
            <div className={styles.detailsSection}>
                <div 
                    className={`${styles.descriptionBox} ${isThinking ? styles.expanded : ''}`}
                    onClick={handleGenerateClick}
                >
                    <div className={styles.sectionContent} ref={containerRef}>
                        <h3 className={styles.detailsTitle}>Description</h3>
                        <BaseAIInputLoader 
                            variant={variant}  
                            width={containerWidth}
                            height={isThinking ? 120 : 80}
                            isTriggered={isThinking}
                            startDelay={0}
                            selectedDuration="P50"
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
    const variant = searchParams.get('variant') as 'looping' | 'shimmer' || 'looping';
    const tab = searchParams.get('tab') || 'columns';
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [shouldReset, setShouldReset] = useState(false);
    const [expandedItems, setExpandedItems] = useState<ExpandedItems>({
        HAROLD: true,
        FAKE_DATA: true,
    });
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [isGenerateHovered, setIsGenerateHovered] = useState(false);

    const handleClose = () => {
        setIsModalVisible(false);
        setShouldReset(true);
    };

    const handleGenerateClick = () => {
        setIsReviewModalVisible(true);
        setShouldReset(false);
    };

    const handleGenerateWithCortexClick = () => {
        setIsModalVisible(true);
        setShouldReset(false);
    };

    const toggleExpand = (item: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    const handleTabClick = (newTab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', newTab);
        router.push(`/loading-states/ai-input-loader/snowsight?${params.toString()}`);
    };

    const DatabaseIcon = () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" role="presentation">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.83183 2.46663C3.91909 2.79261 3 3.40757 3 4.5V11C3 12.272 3.82099 13.0387 4.80304 13.4596C5.76871 13.8734 6.97221 14 8 14C9.02779 14 10.2313 13.8734 11.197 13.4596C12.179 13.0387 13 12.272 13 11V4.5C13 3.38411 12.0866 2.76764 11.165 2.44551C10.2142 2.11318 9.0255 2 8 2C6.96956 2 5.78135 2.12752 4.83183 2.46663ZM5.16817 3.40837C4.33091 3.70739 4 4.09243 4 4.5C4 4.93741 4.33658 5.32094 5.16498 5.61049C5.96417 5.88983 7.0255 6 8 6C8.9745 6 10.0358 5.88983 10.835 5.61049C11.6634 5.32094 12 4.93741 12 4.5C12 4.06259 11.6634 3.67906 10.835 3.38951C10.0358 3.11017 8.9745 3 8 3C7.03044 3 5.96865 3.12248 5.16817 3.40837ZM4 11C4 11.728 4.42901 12.2113 5.19696 12.5404C5.98129 12.8766 7.02779 13 8 13C8.97221 13 10.0187 12.8766 10.803 12.5404C11.571 12.2113 12 11.728 12 11V6.15934C11.741 6.32407 11.4534 6.45369 11.165 6.55449C10.2142 6.88682 9.0255 7 8 7C6.9745 7 5.78583 6.88682 4.83502 6.55449C4.54664 6.45369 4.25905 6.32407 4 6.15934V11Z" fill="currentColor"></path>
        </svg>
    );

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
                        className={styles.navImage}
                        priority
                    />
                </div>
                <div className={styles.sidebar}>
                    <div className={styles.searchBar}>
                        <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <input className={styles.searchInput} placeholder="Search" />
                    </div>
                    <div className={styles.sidebarGroup}>
                        <div className={styles.sidebarItem} onClick={() => toggleExpand('FABS')}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            FABS
                        </div>
                        <div className={styles.sidebarItem} onClick={() => toggleExpand('FEC')}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            FEC
                        </div>
                        <div className={styles.sidebarItem} onClick={() => toggleExpand('PEDICEBERG')}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            PEDICEBERG
                        </div>
                        <div className={styles.sidebarItem} onClick={() => toggleExpand('FINANCIAL_ECONOMIC_ESSENTIALS')}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            FINANCIAL_ECONOMIC_ESSENTIALS
                        </div>
                        <div className={styles.sidebarItem} onClick={() => toggleExpand('HAROLD')}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            HAROLD
                        </div>
                        {expandedItems.HAROLD && (
                            <div className={styles.sidebarSubGroup}>
                                <div className={styles.sidebarItem} onClick={() => toggleExpand('FAKE_DATA')}>
                                    <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    <DatabaseIcon />
                                    FAKE_DATA
                                </div>
                                {expandedItems.FAKE_DATA && (
                                    <div className={styles.sidebarSubGroup}>
                                        <div className={styles.sidebarItem}>Tables</div>
                                        <div className={`${styles.sidebarItem} ${styles.active}`}>
                                            LITWAKS_ARCADE
                                        </div>
                                    </div>
                                )}
                                <div className={styles.sidebarItem}>INFORMATION_SCHEMA</div>
                                <div className={styles.sidebarItem}>PUBLIC</div>
                            </div>
                        )}
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            HEALTHCARETEST
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            HEALTHCARE_HIQI_SAMPLE
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            HEIM_DB
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            HELLOWORLD_TEST
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            HLEVEL
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            INDUSTRY_SFC_MEDIA_CAMPAIGNS_S...
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            JAMEEL_TEST
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            JAMES_DB
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            JAN_TEST10
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            JAN_TEST11
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            JAN_TEST7
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            JAN_TEST8
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            JAN_TEST9
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            JEELIX_SANBOX
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <DatabaseIcon />
                            JPARK_TEST
                        </div>
                    </div>
                </div>
                <div className={styles.mainContent}>
                    <div className={styles.topBar}>
                        <div className={styles.header}>
                            HAROLD <span className={styles.divider}>/</span> FAKE_DATA <span className={styles.divider}>/</span> LITWAKS_ARCADE
                        </div>
                        <div className={styles.actions}>
                            <button className={styles.moreButton}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 3.5a1 1 0 110-2 1 1 0 010 2zm0 5.5a1 1 0 110-2 1 1 0 010 2zm0 5.5a1 1 0 110-2 1 1 0 010 2z" fill="currentColor"/>
                                </svg>
                            </button>
                            <button className={styles.loadDataButton}>
                                Load Data
                            </button>
                        </div>
                    </div>
                    <div className={styles.tableMetadata}>
                        <div className={styles.metadataItem}>
                            <svg className={styles.metadataIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                            Table
                        </div>
                        <div className={styles.metadataBadge}>PUBLIC</div>
                        <div className={styles.metadataItem}>2 weeks ago</div>
                        <div className={styles.metadataItem}>
                            <svg className={styles.metadataIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            1.0K
                        </div>
                        <div className={styles.metadataItem}>42.5KB</div>
                    </div>
                    <div className={styles.tabBar}>
                        <div 
                            className={`${styles.tab} ${tab === 'details' ? styles.active : ''}`}
                            onClick={() => handleTabClick('details')}
                            role="button"
                            tabIndex={0}
                        >
                            Table Details
                        </div>
                        <div 
                            className={`${styles.tab} ${tab === 'columns' ? styles.active : ''}`}
                            onClick={() => handleTabClick('columns')}
                            role="button"
                            tabIndex={0}
                        >
                            Columns
                        </div>
                        <div className={styles.tab}>Data Preview</div>
                        <div className={styles.tab}>Copy History</div>
                        <div className={styles.tab}>Lineage</div>
                    </div>
                    {tab === 'details' ? (
                        <TableDetailsTab />
                    ) : (
                        <>
                            <div className={styles.tableHeader}>
                                <div className={styles.tableTitle}>
                                    <span>6 Columns</span>
                                </div>
                                <div className={styles.tableActions}>
                                    <button className={styles.actionButton}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" fill="currentColor"/>
                                        </svg>
                                        Search
                                    </button>
                                    <div style={{ position: 'relative' }}>
                                        <button 
                                            className={styles.actionButton} 
                                            onClick={handleGenerateClick}
                                            onMouseEnter={() => setIsGenerateHovered(true)}
                                            onMouseLeave={() => setIsGenerateHovered(false)}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M11 5.99665C11.0001 6.21766 10.9124 6.42968 10.7562 6.58606C10.6 6.74244 10.3881 6.83038 10.1672 6.83054C9.28309 6.83114 8.43543 7.18288 7.81089 7.80844C7.18619 8.43398 6.83543 9.28204 6.83601 10.1661C6.83625 10.3871 6.74856 10.5991 6.59238 10.7555C6.4362 10.9119 6.22429 10.9999 6.00325 11C5.78238 11.0002 5.57026 10.9125 5.41385 10.7563C5.25743 10.6001 5.16953 10.3882 5.16947 10.1672C5.16888 9.28317 4.8171 8.43556 4.1916 7.81087C3.56593 7.18615 2.71797 6.83554 1.83389 6.83613C1.61287 6.83628 1.40085 6.74862 1.24447 6.59244C1.08809 6.43627 1.00015 6.22437 1 6.00335C0.999852 5.78234 1.08749 5.57032 1.24367 5.41394C1.39985 5.25754 1.61176 5.1696 1.83276 5.16945C2.71681 5.16886 3.56443 4.81712 4.18914 4.19157C4.81385 3.56603 5.16444 2.71794 5.16385 1.83389C5.16362 1.61288 5.25131 1.40087 5.40749 1.24447C5.56366 1.08808 5.77558 1.00015 5.99661 1C6.21765 0.999854 6.4296 1.08751 6.58602 1.24369C6.74243 1.39987 6.83034 1.61176 6.83057 1.83279C6.83116 2.71684 7.18277 3.56444 7.80844 4.18914C8.43393 4.81385 9.28207 5.16447 10.166 5.16387C10.3871 5.16373 10.599 5.25138 10.7554 5.40756C10.9119 5.56374 10.9998 5.77563 11 5.99665Z" fill="currentColor"/>
                                                <path d="M15 11.998C15.0001 12.1306 14.9475 12.2578 14.8537 12.3516C14.76 12.4455 14.6329 12.4982 14.5004 12.4983C13.9699 12.4987 13.4613 12.7097 13.0866 13.0851C12.7117 13.4604 12.5013 13.9692 12.5016 14.4997C12.5018 14.6323 12.4492 14.7595 12.3555 14.8533C12.2618 14.9471 12.1346 14.9999 12.002 15C11.8695 15.0001 11.7422 14.9475 11.6483 14.8538C11.5545 14.7601 11.5017 14.6329 11.5017 14.5003C11.5014 13.9699 11.2903 13.4613 10.915 13.0865C10.5396 12.7117 10.0308 12.5013 9.50033 12.5017C9.36772 12.5018 9.24051 12.4492 9.14668 12.3555C9.05285 12.2618 9.00009 12.1346 9 12.002C8.99991 11.8694 9.0525 11.7422 9.1462 11.6484C9.23991 11.5545 9.36706 11.5018 9.49966 11.5017C10.0301 11.5013 10.5387 11.2903 10.9135 10.9149C11.2883 10.5396 11.4987 10.0308 11.4983 9.50033C11.4982 9.36773 11.5508 9.24052 11.6445 9.14668C11.7382 9.05285 11.8654 9.00009 11.998 9C12.1306 8.99991 12.2578 9.0525 12.3516 9.14621C12.4455 9.23992 12.4982 9.36706 12.4984 9.49967C12.4987 10.0301 12.7097 10.5387 13.0851 10.9135C13.4604 11.2883 13.9693 11.4987 14.4997 11.4983C14.6323 11.4982 14.7595 11.5508 14.8533 11.6445C14.9471 11.7382 14.9999 11.8654 15 11.998Z" fill="currentColor"/>
                                            </svg>
                                            Generate descriptions
                                        </button>
                                        <BaltoTooltip show={isGenerateHovered} content="This can take up to 1 minute" />
                                    </div>
                                </div>
                            </div>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>
                                            <div className={styles.columnHeader}>
                                                NAME
                                                <svg className={styles.sortIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M8 4v8M5 7l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        </th>
                                        <th>TYPE</th>
                                        <th>DESCRIPTION</th>
                                        <th>TAGS</th>
                                        <th>MASKING POLICY</th>
                                        <th>ORDINAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: 'GAME_ID', type: 'NUMBER(38,0)', description: '' },
                                        { name: 'GAME_NAME', type: 'VARCHAR(16777216)', description: '' },
                                        { name: 'SCORE', type: 'NUMBER(38,0)', description: '' },
                                        { name: 'PLAYER_NAME', type: 'VARCHAR(16777216)', description: '' },
                                        { name: 'GAME_DATE', type: 'DATE', description: '' },
                                        { name: 'GAME_TIME', type: 'TIME(9)', description: '' },
                                    ].map((row, index) => (
                                        <tr key={row.name}>
                                            <td>
                                                <div className={styles.nameCell}>
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="column-single">
                                                        <rect x="5.5" y="1.5" width="6" height="12" rx="1" stroke="currentColor" strokeLinecap="round"></rect>
                                                        <line x1="6" y1="5.5" x2="12" y2="5.5" stroke="currentColor"></line>
                                                        <line x1="6" y1="9.5" x2="12" y2="9.5" stroke="currentColor"></line>
                                                    </svg>
                                                    {row.name}
                                                </div>
                                            </td>
                                            <td>{row.type}</td>
                                            <td style={{ position: 'relative', overflow: 'visible' }}>
                                                <div className={styles.descriptionPlaceholder}>
                                                    Write a description or
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M11 5.99665C11.0001 6.21766 10.9124 6.42968 10.7562 6.58606C10.6 6.74244 10.3881 6.83038 10.1672 6.83054C9.28309 6.83114 8.43543 7.18288 7.81089 7.80844C7.18619 8.43398 6.83543 9.28204 6.83601 10.1661C6.83625 10.3871 6.74856 10.5991 6.59238 10.7555C6.4362 10.9119 6.22429 10.9999 6.00325 11C5.78238 11.0002 5.57026 10.9125 5.41385 10.7563C5.25743 10.6001 5.16953 10.3882 5.16947 10.1672C5.16888 9.28317 4.8171 8.43556 4.1916 7.81087C3.56593 7.18615 2.71797 6.83554 1.83389 6.83613C1.61287 6.83628 1.40085 6.74862 1.24447 6.59244C1.08809 6.43627 1.00015 6.22437 1 6.00335C0.999852 5.78234 1.08749 5.57032 1.24367 5.41394C1.39985 5.25754 1.61176 5.1696 1.83276 5.16945C2.71681 5.16886 3.56443 4.81712 4.18914 4.19157C4.81385 3.56603 5.16444 2.71794 5.16385 1.83389C5.16362 1.61288 5.25131 1.40087 5.40749 1.24447C5.56366 1.08808 5.77558 1.00015 5.99661 1C6.21765 0.999854 6.4296 1.08751 6.58602 1.24369C6.74243 1.39987 6.83034 1.61176 6.83057 1.83279C6.83116 2.71684 7.18277 3.56444 7.80844 4.18914C8.43393 4.81385 9.28207 5.16447 10.166 5.16387C10.3871 5.16373 10.599 5.25138 10.7554 5.40756C10.9119 5.56374 10.9998 5.77563 11 5.99665Z" fill="currentColor"/>
                                                        <path d="M15 11.998C15.0001 12.1306 14.9475 12.2578 14.8537 12.3516C14.76 12.4455 14.6329 12.4982 14.5004 12.4983C13.9699 12.4987 13.4613 12.7097 13.0866 13.0851C12.7117 13.4604 12.5013 13.9692 12.5016 14.4997C12.5018 14.6323 12.4492 14.7595 12.3555 14.8533C12.2618 14.9471 12.1346 14.9999 12.002 15C11.8695 15.0001 11.7422 14.9475 11.6483 14.8538C11.5545 14.7601 11.5017 14.6329 11.5017 14.5003C11.5014 13.9699 11.2903 13.4613 10.915 13.0865C10.5396 12.7117 10.0308 12.5013 9.50033 12.5017C9.36772 12.5018 9.24051 12.4492 9.14668 12.3555C9.05285 12.2618 9.00009 12.1346 9 12.002C8.99991 11.8694 9.0525 11.7422 9.1462 11.6484C9.23991 11.5545 9.36706 11.5018 9.49966 11.5017C10.0301 11.5013 10.5387 11.2903 10.9135 10.9149C11.2883 10.5396 11.4987 10.0308 11.4983 9.50033C11.4982 9.36773 11.5508 9.24052 11.6445 9.14668C11.7382 9.05285 11.8654 9.00009 11.998 9C12.1306 8.99991 12.2578 9.0525 12.3516 9.14621C12.4455 9.23992 12.4982 9.36706 12.4984 9.49967C12.4987 10.0301 12.7097 10.5387 13.0851 10.9135C13.4604 11.2883 13.9693 11.4987 14.4997 11.4983C14.6323 11.4982 14.7595 11.5508 14.8533 11.6445C14.9471 11.7382 14.9999 11.8654 15 11.998Z" fill="currentColor"/>
                                                    </svg>
                                                    <button 
                                                        className={styles.generateLink}
                                                        onClick={() => handleGenerateWithCortexClick()}
                                                    >
                                                        Generate with Cortex
                                                    </button>
                                                    <BaltoTooltip show={false} content="This can take up to several seconds" />
                                                </div>
                                            </td>
                                            <td>
                                                <button className={styles.addButton}>
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                    </svg>
                                                </button>
                                            </td>
                                            <td>
                                                <button className={styles.addButton}>
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                    </svg>
                                                </button>
                                            </td>
                                            <td>{index + 1}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
            {isModalVisible && (
                <div className={`${styles.modal} ${styles.visible}`}>
                    <div className={styles.modalContent}>
                        <BaseAIInputLoader
                            variant={variant}
                            isTriggered={true}
                            startDelay={0}
                            shouldReset={shouldReset}
                            selectedDuration="P50"
                        />
                        <div className={styles.buttonContainer}>
                            <button 
                                className={styles.cancelButton}
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button 
                                className={styles.saveButton}
                                onClick={handleClose}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isReviewModalVisible && (
                <div className={`${styles.modal} ${styles.visible}`}>
                    <div className={`${styles.modalContent} ${styles.reviewModal}`}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalHeaderContent}>
                                <h2 className={styles.modalTitle}>Review Cortex-generated descriptions</h2>
                            </div>
                            <p className={styles.modalSubtitle}>
                                Select descriptions that you want to save. For large tables, descriptions can only be generated for 50 columns at
                                a time. Only columns without descriptions will be included below.
                            </p>
                        </div>
                        <div className={styles.colCount}>
                            5 columns
                        </div>
                        <table className={styles.reviewTable}>
                            <thead>
                                <tr>
                                    <th style={{ width: '40px' }}>
                                        <div
                                            className={`${styles.customCheckbox} ${selectedColumns.length === columns.length ? styles.checked : ''}`}
                                            onClick={() => {
                                                if (selectedColumns.length === columns.length) {
                                                    setSelectedColumns([]);
                                                } else {
                                                    setSelectedColumns(columns.map(col => col.name));
                                                }
                                            }}
                                        />
                                    </th>
                                    <th>COLUMN</th>
                                    <th colSpan={2}>SAMPLE VALUES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {columns.map((column, index) => (
                                    <tr key={column.name}>
                                        <td>
                                            <div
                                                className={`${styles.customCheckbox} ${selectedColumns.includes(column.name) ? styles.checked : ''}`}
                                                onClick={() => {
                                                    if (selectedColumns.includes(column.name)) {
                                                        setSelectedColumns(selectedColumns.filter(name => name !== column.name));
                                                    } else {
                                                        setSelectedColumns([...selectedColumns, column.name]);
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td>{column.name}</td>
                                        <td>{column.sampleValues.join('\n')}</td>
                                        {index === 0 && (
                                            <td rowSpan={6} style={{ padding: 0 }}>
                                                <div className={styles.loaderContainer}>
                                                    {isReviewModalVisible && (
                                                        <MultiAIInputLoader
                                                            isTriggered={true}
                                                            selectedDuration="P75"
                                                        />
                                                    )}
                                                    <div className={styles.statusBadge}>Usually takes about 1 minute</div>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className={styles.modalFooter}>
                            <div className={styles.modalFooterText}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M8 11V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="8" cy="5" r="0.5" fill="currentColor"/>
                                </svg>
                                Always review content generated by AI to make sure it&apos;s accurate.
                            </div>
                            <div className={styles.buttonContainer}>
                                <button 
                                    className={styles.cancelButton}
                                    onClick={() => setIsReviewModalVisible(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className={styles.saveButton}
                                    onClick={() => setIsReviewModalVisible(false)}
                                >
                                    Save
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
        <Suspense>
            <SingleColContent />
        </Suspense>
    );
} 