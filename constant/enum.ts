export type LogType =
  | 'SYSTEM'
  | 'DATABASE'
  | 'API'
  | 'DISCORD_MESSAGE'
  | 'REQUEST'
  | 'USER_LOGIN';

export type MetricType =
  | 'DAILY_LIKE'
  | 'DAILY_USER'
  | 'LOGGED_DAILY_USER'
  | 'DAILY_MOD_USER'
  | 'DAILY_WEB_USER'
  | 'DAILY_SERVER_USER';

export type UserRole = 'ADMIN' | 'USER' | 'SHAR' | 'CONTRIBUTOR';

export type AuthorityEnum =
  | 'CREATE_NOTIFICATION' //
  | 'VIEW_DASH_BOARD' //
  | 'VIEW_USER_ROLE'
  | 'EDIT_USER_ROLE' //
  | 'VIEW_USER_AUTHORITY'
  | 'EDIT_USER_AUTHORITY' //
  | 'VIEW_ROLE_AUTHORITY'
  | 'EDIT_ROLE_AUTHORITY' //
  | 'MANAGE_ROLE' //
  | 'VIEW_LOG'
  | 'DELETE_LOG' //
  | 'VIEW_ADMIN_SERVER'
  | 'EDIT_ADMIN_SERVER'
  | 'DELETE_ADMIN_SERVER'
  | 'SHUTDOWN_SERVER'
  | 'RELOAD_SERVER'
  | 'START_SERVER'
  | 'UPDATE_SERVER' //
  | 'VERIFY_SCHEMATIC'
  | 'DELETE_SCHEMATIC' //
  | 'VERIFY_MAP'
  | 'DELETE_MAP' //
  | 'VERIFY_POST'
  | 'DELETE_POST' //
  | 'VERIFY_PLUGIN'
  | 'DELETE_PLUGIN' //
  | 'VIEW_SETTING'
  | 'EDIT_SETTING' //
  | 'VIEW_TRANSLATION'
  | 'CREATE_TRANSLATION'
  | 'EDIT_TRANSLATION'
  | 'DELETE_TRANSLATION' //
  | 'VIEW_FILE'
  | 'CREATE_FILE'
  | 'EDIT_FILE'
  | 'DELETE_FILE' //
  | 'VIEW_DOCUMENT'
  | 'CREATE_DOCUMENT'
  | 'EDIT_DOCUMENT'
  | 'DELETE_DOCUMENT' //
  | 'EDIT_USER';

export type LikeAction = 'LIKE' | 'DISLIKE';
