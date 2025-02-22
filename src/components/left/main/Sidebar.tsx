import type { FC } from '../../../lib/teact/teact';
import React, { memo, useMemo } from '../../../lib/teact/teact';

import { LeftColumnContent } from '../../../types';
import { APP_NAME, DEBUG, IS_BETA } from '../../../config';

import useOldLang from '../../../hooks/useOldLang';
import useAppLayout from '../../../hooks/useAppLayout';
import useLastCallback from '../../../hooks/useLastCallback';
import { useFullscreenStatus } from '../../../hooks/window/useFullscreen';

import buildClassName from '../../../util/buildClassName';
import { IS_ELECTRON, IS_MAC_OS } from '../../../util/windowEnvironment';

import Button from '../../ui/Button';
import SidebarFolders from './SidebarFolders';
import DropdownMenu from '../../ui/DropdownMenu';
import LeftSideMenuItems from './LeftSideMenuItems';

import './Sidebar.scss';

type OwnProps = {
    onContentChange: (content: LeftColumnContent) => void;
    shouldSkipTransition?: boolean;
};

const Sidebar: FC<OwnProps> = ({ shouldSkipTransition, onContentChange }) => {
    const oldLang = useOldLang();
    const { isMobile } = useAppLayout();
    const isFullscreen = useFullscreenStatus();

    // Dropdown Menu
    const versionString = IS_BETA ? `${APP_VERSION} Beta (${APP_REVISION})` : (DEBUG ? APP_REVISION : APP_VERSION);
    
    const MainButton: FC<{ onTrigger: () => void; isOpen?: boolean }> = useMemo(() => {
        return ({ onTrigger, isOpen }) => (
          <Button
            round
            ripple={!isMobile}
            size="smaller"
            color="translucent"
            className={isOpen ? 'active' : ''}
            onClick={onTrigger}
            ariaLabel={!isMobile ? oldLang('AccDescrOpenMenu2') : 'Return'}
          >
            <div className={buildClassName(
                'animated-menu-icon',
                shouldSkipTransition && 'no-animation',
                )}
            />
          </Button>
        );
    }, [isMobile, oldLang, shouldSkipTransition]);

    const handleSelectSettings = useLastCallback(() => {
        onContentChange(LeftColumnContent.Settings);
    });

    const handleSelectContacts = useLastCallback(() => {
        onContentChange(LeftColumnContent.Contacts);
    });

    const handleSelectArchived = useLastCallback(() => {
        onContentChange(LeftColumnContent.Archived);
    });

    return (
        <div id="Sidebar">
            <DropdownMenu
                trigger={MainButton}
                footer={`${APP_NAME} ${versionString}`}
                className={buildClassName(
                    'main-menu',
                    oldLang.isRtl && 'rtl right-aligned disable-transition',
                )}
                positionX={oldLang.isRtl ? 'right' : 'left'}
                transformOriginX={IS_ELECTRON && IS_MAC_OS && !isFullscreen ? 90 : undefined}
            >
                <LeftSideMenuItems
                    onSelectArchived={handleSelectArchived}
                    onSelectContacts={handleSelectContacts}
                    onSelectSettings={handleSelectSettings}
                    onBotMenuOpened={() => {}}
                    onBotMenuClosed={() => {}}
                />
            </DropdownMenu>
            <SidebarFolders />
        </div>
    );
};

export default memo(Sidebar);