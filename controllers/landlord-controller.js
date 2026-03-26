const interestFormModel = require("../models/interestFormModel");
const listingModel = require("../models/Listing");





exports.getLandlordRequestsPage = async (req, res) => {
  try {
    const landlordId = req.session.user._id;
    const statusFilter = req.query.status;

    const searchCriteria = { landlord: landlordId };

    if (statusFilter === "Active" || statusFilter === "Closed") {
      searchCriteria.status = statusFilter;
    }

    const interests = await interestFormModel
      .findByLandlord(searchCriteria)
      .sort({ createdAt: -1 });

    const interestListingArray = [];

    for (const interest of interests) {
      const listing = await listingModel.findByListing(interest.listing);

      interestListingArray.push({
        interest: interest,
        listing: listing
      });
    }

    res.render("landlord_interestForms", {
      interestListingArray,
      selectedStatus: statusFilter || ""
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to load landlord requests");
  }
};
exports.updateInterestStatus = async (req, res) => { //to update status for landlords
  try {
    const landlordId = req.session.user._id;
    const interestId = req.body.interestId;
    const status = req.body.status;
    console.log(landlordId)
    console.log(interestId)
    

    const interest = await interestFormModel.findByInterest_and_Landlord(interestId, landlordId);
    console.log(interest)

    if (!interest) {
      return res.status(404).send("Interest form not found");
    }

    if (status !== "Active" && status !== "Closed") {
      return res.send("Invalid status");
    }

    await interestFormModel.updateStatus(interestId,landlordId,status);
      

    res.redirect("/landlord/requests");
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to update status");
  }
};
