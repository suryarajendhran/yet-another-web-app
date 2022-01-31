const superagent = require("superagent");
let apiURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

export const fetchItems = async () => {
  try {
    const res = await superagent.get(`${apiURL}`);
    return res.body;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const updateItems = async (updatedItems) => {
    try {
        const res = await superagent.post(`${apiURL}`).send(updatedItems);
        console.log(res);
        return res.statusCode === 200;
    } catch (err) {
        console.error(err);
        return err;
    }
}
