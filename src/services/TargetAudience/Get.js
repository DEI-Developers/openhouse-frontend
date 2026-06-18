import apiInstance from "@utils/instances/ApiInstance";

const getTargetAudiences = async (pageNumber, pageSize, searchedWord, filters, includeDeleted) => {
  const response = await apiInstance.get('/target-audiences', {
    params: {  
      pageNumber,
      pageSize,
      searchWord: searchedWord, 
      includeDeleted,
      ...filters,
    },
  });
  return {
    rows: response.data.data,
    nRows: response.data.nItems, 
    nPages: response.data.nPages,
  };
};

export default getTargetAudiences;