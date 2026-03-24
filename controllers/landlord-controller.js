const interestFormModel = require("../models/interestFormModel");
const listingModel = require("../models/listing-model");

const getLandlordRequests = async (req, res) => {
  const landlordId = req.session.userId;

  try {
    const requests = await interestFormModel.findByLandlord(landlordId); //the interest forms submitted to a landlord

    const requestArray = [];
    if (requests.length >0 ){
        
        for (const request of requests) {
            const listing = await listingModel.findByListing(request.listing); //listing in an interest form

            requestArray.push({
                request: request,
                listing: listing
        });
        }
        return res.render("landlordRequest", { requestArray });

    }
    else{
        return res.render("landlordRequest", { requestArray });
    }

    
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error loading landlord requests");
  }
};

module.exports = {
  getLandlordRequests
};