const superagent = require("superagent");
let apiURL = "http://localhost:8000";

const fetchItems = async () => {
  try {
    const res = await superagent.get(`${apiURL}`);
    return res.body;
  } catch (err) {
    console.error(err);
    return err;
  }
};

const updateItems = async (updatedItems) => {
    try {
        const res = await superagent.post(`${apiURL}`).send(updatedItems);
        console.log(res);
        return res.statusCode === 200;
    } catch (err) {
        console.error(err);
        return err;
    }
}

module.exports = { fetchItems, updateItems };
