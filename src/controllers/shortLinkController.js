const shortLinkModel = require("../models/shortLinkModel");


const createShortLink = async (req, res) => {
  try {
    let requestBody = req.body;
    const { url, shortlink, description, tags } = requestBody;
    const baseUrl = "http://localhost:3000"
    const shortCode = baseUrl + '/' + shortlink
    const data = await shortLinkModel.create({ url, shortlink: shortCode, description })

    return res.status(201).send({ message: "Success", data: data })

  } catch (err) {
    return res.status(500).send({ Error: err.message });
  }
};


//!...............................................................

const getUrl = async function (req, res) {
  try {
    const urlCode = req.params.urlCode;

    let urlDetails = await shortLinkModel.findOne({ urlCode: urlCode });

    if (!urlDetails) {
      return res.status(400).send({ status: false, message: "Url Not Found!!" })
    }
    return res.redirect(302, urlDetails.url)

  }
  catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}


module.exports = {
  createShortLink,
  getUrl
}



