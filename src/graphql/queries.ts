export const LIST_ASSETS = `
  query ListHaseebAssets($filter: String, $limit: Int, $nextToken: String) {
    listHaseebAssets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        category
        imageUrl
        imageName
        status
        createdAt
        updatedAt
        condition
        purchasePrice
        userId
      }
      nextToken
    }
  }
`;

export const GET_ASSET = `
  query FetchHaseebAsset($id: ID!) {
    fetchHaseebAsset(id: $id) {
      id
      name
      description
      category
      imageUrl
      imageName
      userId
      status
      serialNumber
      location
      purchaseDate
      purchasePrice
      condition
      notes
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_PROFILE = `
  query ListUserProfiles {
    listUserProfiles {
      items {
        id
        email
        name
        avatarUrl
        company
        department
        theme
        language
        storageUsed
        storageLimit
      }
    }
  }
`;
