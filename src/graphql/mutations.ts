export const CREATE_ASSET = `
  mutation CreateHaseebAsset($input: CreateAssetInput!) {
    createHaseebAsset(input: $input) {
      id
      name
      description
      category
      imageUrl
      imageName
      userId
      status
      createdAt
    }
  }
`;

export const UPDATE_ASSET = `
  mutation UpdateHaseebAsset($input: UpdateAssetInput!) {
    updateHaseebAsset(input: $input) {
      id
      name
      description
      category
      imageUrl
      imageName
      status
      updatedAt
    }
  }
`;

export const DELETE_ASSET = `
  mutation DeleteHaseebAsset($input: DeleteAssetInput!) {
    deleteHaseebAsset(input: $input) {
      id
    }
  }
`;

export const UPDATE_USER_PROFILE = `
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      email
      name
      company
      department
      avatarUrl
      theme
      language
      lastLoginAt
    }
  }
`;

export const CREATE_USER_PROFILE = `
  mutation CreateUserProfile($input: CreateUserProfileInput!) {
    createUserProfile(input: $input) {
      id
      email
      name
      company
      department
      avatarUrl
      theme
      language
      status
    }
  }
`;

export const DELETE_USER_PROFILE = `
  mutation DeleteUserProfile($input: DeleteUserProfileInput!) {
    deleteUserProfile(input: $input) {
      id
    }
  }
`;
