import axios from "axios";

export const getListRequest = async (url, param = {}) => {
  return await axios
    .get(url, param)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

export const postListRequest = async (url, param = {}) => {
  return await axios
    .post(url, param)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

export const getFileRequest = async (url) => {
  return await axios
    .get(url, { responseType: "blob" })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

export const postFileRequest = async (url, param) => {
  return await axios
    .post(url, param, { responseType: "blob" })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

export const patchListRequest = async (url, param = {}) => {
  return await axios
    .patch(url, param)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

export const deleteListRequest = async (url, param = {}) => {
  return await axios
    .delete(url, {
      data: param,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};
