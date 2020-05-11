import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/',
  headers: {
    'Content-type': 'application/json',
  },
});

const getAll = (filter) => {
  /**
   * ერთი ვარიანტი ეს, axios გადაეცემა მეორე config პარამეტრად ობიექტი, რომელსაც ექნება params ფროფერთი
   *  და რიქვესთს გააგზავნის - http://localhost:4000/todos?visibility=[all|active|completed]
   */
  // return api.get("/todos", { params: filter });

  /**
   * მეორე ვარიანტი: axios url-შივე შეგვიძლია გადავაწოდოთ query string
   * localhost:4000/todos?min=10&max=30
   */
  const queryString = Object.keys(filter).reduce(
    (acc, key) => (acc += `${key}=${filter[key]}&`),
    '?'
  );
  return api.get(`/todos${queryString}`);
};

const create = (data) => {
  return api.post('/todos/store', data);
};

const update = (id, data) => {
  return api.put(`/todos/${id}/update`, data);
};

const remove = (id) => {
  return api.delete(`/todos/${id}/delete`);
};

export default {
  getAll,
  create,
  update,
  remove,
};
