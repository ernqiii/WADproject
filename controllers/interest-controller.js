const interestFormModel = require("../models/interestFormModel");
const listingModel = require("../models/Listing");




exports.getInterestDashboard = (req,res)=>{
    res.render("interest-dashboard");
}
exports.getProfile = async (req, res) => {
  try {
    const userId = req.session.user._id; 
    const statusFilter = req.query.status; //at first when page first loads -> undefined 

    const searchCriteria = { user: userId };

    // only apply filter if status is Active or Closed
    if (statusFilter === "Active" || statusFilter === "Closed") { // when page first loads -> no actove/closed -> show any
      searchCriteria.status = statusFilter; //like { landlord: landlordId, status: statusFilter }
    }

    const interests = await interestFormModel
      .findByUser(searchCriteria)
      .sort({ createdAt: -1 }); // -1 = sort newest to oldest, 1 = sort oldest to newest

    const interestListingArray = [];

    for (const interest of interests) {
      const listing = await listingModel.findByListing(interest.listing);

      interestListingArray.push({
        interest: interest, // one interest form
        listing: listing // one model listing
      });
    }

    res.render("users_interestForms", {
      interestListingArray,
      selectedStatus: statusFilter || "" // need "" -> page first loads -> its undefined -> ensure that theres a value to it 
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to load profile");
  }
};
exports.getEditInterestPage = async (req, res) => {
  const interestId = req.body.interestId;
  const userId = req.session.user._id;
  
  try {
    

    const interest = await interestFormModel.findByInterest_and_User(interestId,userId)
       //the logged in user is the only one who is able to access the interest form * clarify !

    if (!interest) {
      return res.status(404).send("Interest form not found");
    }

    const listing = await listingModel.findByListing(interest.listing);

    res.render("editPage", {
      interest,
      listing,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to load edit page");
  }
};

exports.updateInterest = async (req, res) => {
  const interestId = req.body.interestId;
  const userId = req.session.user._id;

  const { name, email, phone, telegram, contact_method, message, consent } = req.body;

  const cleanName = name ? name.trim() : "";
  const cleanEmail = email ? email.trim() : "";
  const cleanPhone = phone ? phone.trim() : "";
  const cleanTelegram = telegram ? telegram.trim() : "";
  const cleanMessage = message ? message.trim() : "";
  let error = "";
  try {
    

    const interest = await interestFormModel.findByInterest_and_User(interestId, userId);


    if (!interest) {
      return res.status(404).send("Interest form not found");
    }

    if (interest.status === "Closed") {
      return res.send("Closed interest forms cannot be edited");
    }

    const listing = await listingModel.findByListing(interest.listing);
    if (!consent) {
      error = "Please agree to our policy before submitting.";
      return res.render("checkout", {
        listing,
        error,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        telegram: cleanTelegram,
        contact_method,
        message: cleanMessage,
      });
    }


 

    if (!cleanEmail && !cleanPhone && !cleanTelegram) {
      error = "Please provide at least one contact method.";
      const updatedInterest = interest.toObject();  //convert moongoose object to JS object 

      updatedInterest.name = cleanName;
      updatedInterest.email = cleanEmail;
      updatedInterest.phone = cleanPhone;
      updatedInterest.telegram = cleanTelegram;
      updatedInterest.preferredContactMethod = contact_method;
      updatedInterest.message = cleanMessage;
      return res.render("editInterest", {
        listing,
        error,
        interest: updatedInterest
      });
    }

    if (!contact_method) {
      error = "Please select a preferred contact method.";
      const updatedInterest = interest.toObject();  //convert moongoose object to JS object 

      updatedInterest.name = cleanName;
      updatedInterest.email = cleanEmail;
      updatedInterest.phone = cleanPhone;
      updatedInterest.telegram = cleanTelegram;
      updatedInterest.preferredContactMethod = contact_method;
      updatedInterest.message = cleanMessage;
      return res.render("editInterest", {
        listing,
        error,
        interest: updatedInterest
      });
    }

    if (contact_method === "email" && !cleanEmail) {
      error = "You selected email as preferred contact method, so email is required.";
      const updatedInterest = interest.toObject();  //convert moongoose object to JS object 

      updatedInterest.name = cleanName;
      updatedInterest.email = cleanEmail;
      updatedInterest.phone = cleanPhone;
      updatedInterest.telegram = cleanTelegram;
      updatedInterest.preferredContactMethod = contact_method;
      updatedInterest.message = cleanMessage;
      return res.render("editInterest", {
        listing,
        error,
        interest: updatedInterest
      });
    }

    if ((contact_method === "phone" || contact_method === "whatsapp") && !cleanPhone) {
      error = "You selected phone/WhatsApp as preferred contact method, so phone is required.";
      const updatedInterest = interest.toObject();  //convert moongoose object to JS object 

      updatedInterest.name = cleanName;
      updatedInterest.email = cleanEmail;
      updatedInterest.phone = cleanPhone;
      updatedInterest.telegram = cleanTelegram;
      updatedInterest.preferredContactMethod = contact_method;
      updatedInterest.message = cleanMessage;
      return res.render("editInterest", {
        listing,
        error,
        interest: updatedInterest
      });
    }

    if (contact_method === "telegram" && !cleanTelegram) {
      error = "You selected Telegram as preferred contact method, so Telegram is required.";
      const updatedInterest = interest.toObject();  //convert moongoose object to JS object 

      updatedInterest.name = cleanName;
      updatedInterest.email = cleanEmail;
      updatedInterest.phone = cleanPhone;
      updatedInterest.telegram = cleanTelegram;
      updatedInterest.preferredContactMethod = contact_method;
      updatedInterest.message = cleanMessage;
      return res.render("editInterest", {
        listing,
        error,
        interest: updatedInterest
      });
    }
    let updateItems = {
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          telegram: cleanTelegram,
          preferredContactMethod: contact_method,
          message: cleanMessage
        }
    await interestFormModel.updateInterest(interestId,userId,updateItems);

    res.redirect("/interest/submitted");//check route
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to update interest form");
  }
};
exports.deleteInterest = async (req, res) => {
  const interestId = req.body.interestId;
  const userId = req.session.user._id;
  try {
    const interest = await interestFormModel.findByInterest_and_User(interestId, userId);

    if (!interest) {
      return res.status(404).send("Interest form not found");
    }

    let deletedInterest = await interestFormModel.deleteInterest(interestId,userId);

    if(deletedInterest.deletedCount ===1){
      console.log("Successful deletion")
    }
    else{
      console.log("Interest form not found, so it can't be deleted.")
    }  
    res.redirect("/interest/submitted");//check route
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to delete interest form");
  }
};



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
      

    res.redirect("/interest/received");
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to update status");
  }
};
