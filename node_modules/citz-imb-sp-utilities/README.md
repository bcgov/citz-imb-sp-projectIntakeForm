# SharePoint Utilities

utility methods/functions for use with SharePoint 2016. Depends on [React](https://www.npmjs.com/package/react).

# Installation

`npm install citz-imb-sp-utilities`

## PeoplePicker Usage


**import { PeoplePicker } from 'citz-imb-sp-utilities'**

**const getUserInfo = () => {_code..._}**

<PeoplePicker
        schema={{
            PrincipalAccountType: "_User | DL | SecGroup | SPGroup_",
            SearchPrincipleSource: _15_,
            ResolvePrincipalSource: _15_,
            AllowMultipleValues: _true | false_,
            MaximumEntitySuggestions: [5],
            Width: _"250px"_,
            SharePointGroupID: [null | groupNumber]
        }_}
        elementName="_elementName_"
        getUserInfo={_getUserInfo_} />

## Method Usage

**import { _MethodName_  } from 'citz-imb-sp-utilities'**

**_MethodName_(_parameters_).then(response => {_code..._})**

## Parameters

Parameters in **bold** are required.  Where an _Id_ and a _Name_ parameter are specified, usually only one is required, with _Id_ being used if both are supplied.

- **baseurl:** a string the form of _https://\<mydomain\>/sites/\<mysite\>_.  Default is the value of *_spPageContextInfo.webAbsoluteUrl* or *_spPageContextInfo.siteAbsoluteUrl*, as appropriate.
- **bcc:** an array of userAccounts in form of _i:0ǵ.t|bcgovidp|-
- **body:** a string.  May contain html tags.
- **cc:** an array of userAccounts in form of _i:0ǵ.t|bcgovidp|a32d6f859c66450ca4995b0b2bf0a###_.
a32d6f859c66450ca4995b0b2bf0a###_.
- **clear:** a boolean value.
- **copy:** a boolean value.
- **expand:** a string of comma-separated properties to expand
- **groupDescription:** a string.
- **groupId:** an integer.
- **groupName:** a string.
- **itemIds:** an array of integers.  May also be a single integer.
- **items:** a json object.
- **listGUID:** a string in the form of a _529b7384-98bd-40c6-81e6-54a797###ec5_.
- **listName:** a string.
- **loginName:** an array of userAccounts in form of _i:0ǵ.t|bcgovidp|a32d6f859c66450ca4995b0b2bf0a###_.  May also be a string with a single userAccount
- **ownerGroupId:** an integer.
- **ownerGroupName:** a string.
- **principalId:** an integer.
- **roleDefId:** an integer
- **subject:** a string.
- **to:** an array of userAccounts in form of _i:0ǵ.t|bcgovidp|
a32d6f859c66450ca4995b0b2bf0a###_.
- **userId:** an integer.
- **viewGUID:** a string in the form of a _{529b7384-98bd-40c6-81e6-54a797###ec5}_.

## Methods

### ContextInfo

- GetContextWebInformation(_baseurl_)
- GetFormDigestValue(_baseurl_)
- GetCurrentUser(_baseurl_)

### Email

- SendEmail({_baseurl_, **_to_**, _cc_, _bcc_, **_subject_**, **_body_**})

### Groups

- AddUsersToGroup({_baseurl_, **_groupId_**, **_groupName_**, **_loginName_**})
- ChangeGroupOwner({_baseurl_, **_groupId_**, **_groupName_**, **_ownerGroupId_**, **_ownerGroupName_**})
- CreateGroup({_baseurl_, **_groupName_**, _groupDescription_})
- DeleteGroup({_baseurl_, **_groupId_**, **_groupName_**})
- GetAssociatedGroups(_baseurl_)
- GetGroup({_baseurl_, **_groupId_**, **_groupName_**})
- GetGroupMembers({_baseurl_, **_groupId_**, **_groupName_**})
- RemoveUsersFromGroup({_baseurl_, **_groupId_**, **_groupName_**, **_loginName_**, **_userId_**})

### Lists
- AddItemsToList({_baseurl_, **_listName_**, **_listGUID_**, **_items_**})
- CreateList({_baseurl_, **_listName_**, _allowContentTypes_, _baseTemplate_, _contentTypesEnabled_, _description_})
- DeleteList({_baseurl_, **_listName_**, **_listGUID_**})
- GetList({_baseurl_, **_listName_**, **_listGUID_**, _expand_})
- GetListDefaultView({_baseurl_, **_listName_**, **_listGUID_**})
- GetListFields({_baseurl_, **_listName_**, **_listGUID_**})
- GetListItems({_baseurl_, **_listName_**, **_listGUID_**, _filter_, _expand_})
- GetListViews({_baseurl_, **_listName_**, **_listGUID_**, _viewGUID_})
- RemoveItemsFromList({_baseurl_, **_listName_**, **_listGUID_**, **_itemIds_**})
- UpdateListItem({_baseurl_, **_listName_**, **_listGUID_**, **_items_**})

### Permissions
- List
  - AddPermissionsToList({_baseurl_, **_listName_**, **_listGUID_**, _principalId_, _roleDefId_})
  - BreakListPermissionsInheritance({_baseurl_, **_listName_**, **_listGUID_**, _copy_, _clear_})
  - GetListPermissions({_baseurl_, **_listName_**, **_listGUID_**})
  - RemovePermissionsFromList({_baseurl_, **_listName_**, **_listGUID_**, _principalId_, _roleDefId_})
- Site
  - AddPermissionsToSite({_baseurl_, _principalId_, _roleDefId_})
  - BreakSitePermissionsInheritance({_baseurl_, _copy_, _clear_})
  - GetSitePermissions(_baseurl_)
  - RemovePermissionsFromSite({_baseurl_, _principalId_, _roleDefId_})
  - ResetSitePermissionsInheritance(_baseurl_)

### Sites
- GetSite({_baseurl_})
- GetRoleDefinitions({_baseurl_})

### Users
- GetUser({_baseurl_, **_userId_** })
- GetUserGroups({_baseurl_, **_userId_** })