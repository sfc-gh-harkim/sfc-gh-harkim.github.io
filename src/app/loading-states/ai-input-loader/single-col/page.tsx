'use client';

import { BaseAIInputLoader } from '../BaseAIInputLoader';
import styles from '../staged/snowflake.module.css';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

type ExpandedItems = {
    [key: string]: boolean;
};

export default function SingleColPage() {
    const searchParams = useSearchParams();
    const variant = searchParams.get('variant') as 'looping' | 'shimmer' || 'looping';
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [shouldReset, setShouldReset] = useState(false);
    const [expandedItems, setExpandedItems] = useState<ExpandedItems>({
        HAROLD: true,
        FAKE_DATA: true,
    });
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    const handleClose = () => {
        setIsModalVisible(false);
        setShouldReset(true);
        // Reset the shouldReset flag after a brief delay
        setTimeout(() => {
            setShouldReset(false);
        }, 100);
    };

    const handleGenerateClick = () => {
        setIsModalVisible(true);
    };

    const toggleExpand = (item: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    const renderDescription = (description: string | null, index: number) => {
        if (description) {
            return description;
        }
        if (hoveredRow === index) {
            return (
                <span className={styles.descriptionPlaceholder}>
                    Write a description or{' '}
                    <button className={styles.generateLink} onClick={handleGenerateClick}>
                        Generate with Cortex
                    </button>
                </span>
            );
        }
        return <span className={styles.descriptionPlaceholder}>&nbsp;</span>;
    };

    return (
        <>
            <div className={styles.snowflakeContainer}>
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
                            FABS
                        </div>
                        <div className={styles.sidebarItem} onClick={() => toggleExpand('FEC')}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            FEC
                        </div>
                        <div className={styles.sidebarItem} onClick={() => toggleExpand('PEDICEBERG')}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            PEDICEBERG
                        </div>
                        <div className={styles.sidebarItem} onClick={() => toggleExpand('FINANCIAL_ECONOMIC_ESSENTIALS')}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            FINANCIAL_ECONOMIC_ESSENTIALS
                        </div>
                        <div className={styles.sidebarItem} onClick={() => toggleExpand('HAROLD')}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            HAROLD
                        </div>
                        {expandedItems.HAROLD && (
                            <div className={styles.sidebarSubGroup}>
                                <div className={styles.sidebarItem} onClick={() => toggleExpand('FAKE_DATA')}>
                                    <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
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
                            HEALTHCARETEST
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            HEALTHCARE_HIQI_SAMPLE
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            HEIM_DB
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            HELLOWORLD_TEST
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            HLEVEL
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            INDUSTRY_SFC_MEDIA_CAMPAIGNS_S...
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            JAMEEL_TEST
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            JAMES_DB
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            JAN_TEST10
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            JAN_TEST11
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            JAN_TEST7
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            JAN_TEST8
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            JAN_TEST9
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            JEELIX_SANBOX
                        </div>
                        <div className={styles.sidebarItem}>
                            <svg className={styles.sidebarIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            JPARK_TEST
                        </div>
                    </div>
                </div>
                <div className={styles.mainContent}>
                    <div className={styles.header}>
                        HAROLD <span className={styles.divider}>/</span> FAKE_DATA <span className={styles.divider}>/</span> LITWAKS_ARCADE
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
                        <div className={styles.tab}>Table Details</div>
                        <div className={`${styles.tab} ${styles.active}`}>Columns</div>
                        <div className={styles.tab}>Data Preview</div>
                        <div className={styles.tab}>Copy History</div>
                        <div className={styles.tab}>Lineage</div>
                    </div>
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
                            <button className={styles.actionButton}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                Generate descriptions
                            </button>
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
                                { name: 'C1', type: 'Varchar', description: null, hasTag: true, hasPolicy: true, ordinal: 1 },
                                { name: 'C2', type: 'Varchar', description: null, hasTag: false, hasPolicy: false, ordinal: 2 },
                                { name: 'C3', type: 'Varchar', description: null, hasTag: false, hasPolicy: false, ordinal: 3 },
                                { name: 'C4', type: 'Varchar', description: 'Email addresses.', hasTag: false, hasPolicy: false, ordinal: 4 },
                                { name: 'C5', type: 'Varchar', description: null, hasTag: false, hasPolicy: false, ordinal: 5 },
                                { name: 'C6', type: 'Varchar', description: null, hasTag: false, hasPolicy: false, ordinal: 6 },
                            ].map((row, index) => (
                                <tr 
                                    key={row.name}
                                    onMouseEnter={() => setHoveredRow(index)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                >
                                    <td>
                                        <div className={styles.nameCell}>
                                            <svg className={styles.rowIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M2 3h12M2 8h12M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                            </svg>
                                            {row.name}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.typeCell}>
                                            <svg className={styles.typeIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M13 3H3l5 10 5-10z" stroke="currentColor" strokeWidth="1.5"/>
                                            </svg>
                                            {row.type}
                                        </div>
                                    </td>
                                    <td>{renderDescription(row.description, index)}</td>
                                    <td>
                                        {row.hasTag ? (
                                            <button className={styles.addButton}>
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                </svg>
                                                Tag
                                            </button>
                                        ) : (
                                            <button className={styles.addButton}>
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                </svg>
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        {row.hasPolicy ? (
                                            <button className={styles.addButton}>
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                </svg>
                                                Policy
                                            </button>
                                        ) : (
                                            <button className={styles.addButton}>
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                </svg>
                                            </button>
                                        )}
                                    </td>
                                    <td>{row.ordinal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={`${styles.modal} ${isModalVisible ? styles.visible : ''}`}>
                <div className={styles.modalContent}>
                    <BaseAIInputLoader
                        variant={variant}
                        hideButton={true}
                        isTriggered={true}
                        startDelay={500}
                        shouldReset={shouldReset}
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
        </>
    );
} 