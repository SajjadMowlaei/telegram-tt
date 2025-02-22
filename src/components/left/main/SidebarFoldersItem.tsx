import type { FC, TeactNode } from '../../../lib/teact/teact';
import React, { memo, useRef } from '../../../lib/teact/teact';

import useContextMenuHandlers from '../../../hooks/useContextMenuHandlers';
import useLastCallback from '../../../hooks/useLastCallback';

import buildClassName from '../../../util/buildClassName';

import Button from '../../ui/Button';
import { MenuItemContextAction } from '../../ui/ListItem';
import Menu from '../../ui/Menu';

import './SidebarFoldersItem.scss';
import MenuSeparator from '../../ui/MenuSeparator';
import MenuItem from '../../ui/MenuItem';

export type SidebarFolderWithProperties = {
    id?: number;
    title: TeactNode;
    emoji?: {
        src: string;
        alt: string;
        draggable: boolean;
    };
    badgeCount?: number;
    isBlocked?: boolean;
    isBadgeActive?: boolean;
    contextActions?: MenuItemContextAction[];
};

type OwnProps = {
    index: number;
    folder: SidebarFolderWithProperties;
    isActive: boolean;
    onSwitchFolder: (index: number) => void;
}

const SidebarFoldersItem: FC<OwnProps> = ({
    index,
    folder,
    isActive,
    onSwitchFolder,
}) => {
    const folderRef = useRef<HTMLButtonElement>(null);

    const getTriggerElement = useLastCallback(() => folderRef.current);
    const getRootElement = useLastCallback(
        () => (folderRef.current!.closest("#Sidebar")),
    );
    const getMenuElement = useLastCallback(
        () => document.querySelector('.SidebarFoldersItem'),
    );
    const getLayout = useLastCallback(() => ({ withPortal: true }));

    const {
        contextMenuAnchor, handleContextMenu, handleContextMenuClose,
        handleContextMenuHide, isContextMenuOpen,
    } = useContextMenuHandlers(folderRef, !folder.contextActions);
    
    return (
        <Button
            color='translucent'
            className={buildClassName(
                'SidebarFoldersItem',
                isActive && 'active',
            )}
            onClick={() => onSwitchFolder(index)}
            onContextMenu={handleContextMenu}
            ref={folderRef}
        >
            <img 
                src={folder.emoji?.src}
                alt={folder.emoji?.alt}
                draggable={folder.emoji?.draggable}
                className='emoji emoji-medium'
            />
            {Boolean(folder.badgeCount) && (
                <span className={buildClassName('badge', folder.isBadgeActive && 'active')}>{folder.badgeCount}</span>
            )}
            <span>
                {folder.title}
            </span>
            
            {folder.contextActions && (
                <Menu
                    isOpen={isContextMenuOpen}
                    anchor={contextMenuAnchor}
                    getTriggerElement={getTriggerElement}
                    getRootElement={getRootElement}
                    getMenuElement={getMenuElement}
                    getLayout={getLayout}
                    autoClose
                    onClose={handleContextMenuClose}
                    onCloseAnimationEnd={handleContextMenuHide}
                    withPortal
                >
                    {folder.contextActions.map((action) => (
                        ('isSeparator' in action) ? (
                            <MenuSeparator key={action.key || 'separator'} />
                        ) : (
                        <MenuItem
                            key={action.title}
                            icon={action.icon}
                            destructive={action.destructive}
                            disabled={!action.handler}
                            onClick={action.handler}
                        >
                            {action.title}
                        </MenuItem>
                        )
                    ))}
                </Menu>
            )}
        </Button>
    )
};

export default memo(SidebarFoldersItem)