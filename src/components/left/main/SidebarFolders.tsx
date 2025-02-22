import type { FC } from '../../../lib/teact/teact'
import React, { memo, useMemo } from '../../../lib/teact/teact'

import { ALL_FOLDER_ID } from '../../../config';
import { getActions, getGlobal, withGlobal } from '../../../global';
import { selectCurrentLimit } from '../../../global/selectors/limits';
import { selectCanShareFolder, selectTabState } from '../../../global/selectors';

import { ApiChatFolder, ApiChatlistExportedInvite } from '../../../api/types';

import useLang from '../../../hooks/useLang';
import useLastCallback from '../../../hooks/useLastCallback';
import { useFolderManagerForUnreadCounters } from '../../../hooks/useFolderManager';

import { MEMO_EMPTY_ARRAY } from '../../../util/memo';

import { renderTextWithEntities } from '../../common/helpers/renderTextWithEntities';

import { MenuItemContextAction } from '../../ui/ListItem';
import SidebarFoldersItem, { SidebarFolderWithProperties } from './SidebarFoldersItem';

import './SidebarFolders.scss'

type StateProps = {
    chatFoldersById: Record<number, ApiChatFolder>;
    folderInvitesById: Record<number, ApiChatlistExportedInvite[]>;
    orderedFolderIds?: number[];
    activeChatFolder: number;
    maxFolders: number;
    maxChatLists: number;
    maxFolderInvites: number;
};

const SidebarFolders: FC<StateProps> = ({
    chatFoldersById,
    orderedFolderIds,
    activeChatFolder,
    maxFolders,
    maxChatLists,
    folderInvitesById,
    maxFolderInvites,
}) => {
    const {
        setActiveChatFolder,
        openShareChatFolderModal,
        openDeleteChatFolderModal,
        openEditChatFolder,
        openLimitReachedModal,
    } = getActions();

    const lang = useLang();
    const folderCountersById = useFolderManagerForUnreadCounters();

    const allChatsFolder: ApiChatFolder = useMemo(() => {
        return {
          id: ALL_FOLDER_ID,
          title: { text: orderedFolderIds?.[0] === ALL_FOLDER_ID ? lang('FilterAllChatsShort') : lang('FilterAllChats') },
          includedChatIds: MEMO_EMPTY_ARRAY,
          excludedChatIds: MEMO_EMPTY_ARRAY,
        } satisfies ApiChatFolder;
    }, [orderedFolderIds, lang]);

    const displayedFolders = useMemo(() => {
        return orderedFolderIds
          ? orderedFolderIds.map((id) => {
            if (id === ALL_FOLDER_ID) {
              return allChatsFolder;
            }
    
            return chatFoldersById[id] || {};
          }).filter(Boolean)
          : undefined;
    }, [chatFoldersById, allChatsFolder, orderedFolderIds]);

    const folders = useMemo(() => {
      if (!displayedFolders || !displayedFolders.length) {
        return undefined;
      }

      return displayedFolders.map((folder, i) => {
        const { id, title } = folder;
        const isBlocked = id !== ALL_FOLDER_ID && i > maxFolders - 1;
        const canShareFolder = selectCanShareFolder(getGlobal(), id);
        const contextActions: MenuItemContextAction[] = [];
        const titleWithEntities = renderTextWithEntities({
          text: title.text,
          entities: title.entities,
          noCustomEmojiPlayback: folder.noTitleAnimations,
        });

        // Extract the first emoji from the title
        let emoji = {
          src: "./img-apple-64/1f4c1.png",
          alt: "📁",
          draggable: false,
        };
        const filteredTitleWithEntities = titleWithEntities.filter((item: any) => {
          if (typeof item === 'object' && item !== null && item.props?.src) {
            emoji = item.props;
            return false;
          }
          return true;
        });

        if (canShareFolder) {
          contextActions.push({
            title: lang('FilterShare'),
            icon: 'link',
            handler: () => {
              const chatListCount = Object.values(chatFoldersById).reduce((acc, el) => acc + (el.isChatList ? 1 : 0), 0);
              if (chatListCount >= maxChatLists && !folder.isChatList) {
                openLimitReachedModal({
                  limit: 'chatlistJoined',
                });
                return;
              }

              // Greater amount can be after premium downgrade
              if (folderInvitesById[id]?.length >= maxFolderInvites) {
                openLimitReachedModal({
                  limit: 'chatlistInvites',
                });
                return;
              }

              openShareChatFolderModal({
                folderId: id,
              });
            },
          });
        }

        if (id !== ALL_FOLDER_ID) {
          contextActions.push({
            title: lang('FilterEdit'),
            icon: 'edit',
            handler: () => {
              openEditChatFolder({ folderId: id });
            },
          });

          contextActions.push({
            title: lang('FilterDelete'),
            icon: 'delete',
            destructive: true,
            handler: () => {
              openDeleteChatFolderModal({ folderId: id });
            },
          });
        }

        return {
          id,
          title: filteredTitleWithEntities,
          emoji,
          badgeCount: folderCountersById[id]?.chatsCount,
          isBadgeActive: Boolean(folderCountersById[id]?.notificationsCount),
          isBlocked,
          contextActions: contextActions?.length ? contextActions : undefined,
        } satisfies SidebarFolderWithProperties;
      });
    }, [
      displayedFolders, maxFolders, folderCountersById, lang, chatFoldersById, maxChatLists, folderInvitesById,
      maxFolderInvites,
    ]);
    
    const handleSwitchTab = useLastCallback((index: number) => {
        setActiveChatFolder({ activeChatFolder: index }, { forceOnHeavyAnimation: true });
    });

    return <div id="SidebarFolders">
      {folders?.map((folder, index) => (
        <SidebarFoldersItem 
          key={folder.id}
          index={index}
          folder={folder}
          isActive={index === activeChatFolder}
          onSwitchFolder={handleSwitchTab}
        />
      ))}
    </div>
}

export default memo(withGlobal(
    (global): StateProps => {
      const {
        chatFolders: {
          byId: chatFoldersById,
          orderedIds: orderedFolderIds,
          invites: folderInvitesById,
        },
      } = global;
  
      const { activeChatFolder } = selectTabState(global);
  
      return {
        chatFoldersById,
        folderInvitesById,
        orderedFolderIds,
        activeChatFolder,
        maxFolders: selectCurrentLimit(global, 'dialogFilters'),
        maxFolderInvites: selectCurrentLimit(global, 'chatlistInvites'),
        maxChatLists: selectCurrentLimit(global, 'chatlistJoined'),
      };
    },
)(SidebarFolders));