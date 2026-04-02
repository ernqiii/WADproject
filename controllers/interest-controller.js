const interestFormModel = require("../models/interestFormModel");
const listingModel = require("../models/Listing");
const userModel = require("../models/User");




exports.getInterestDashboard = (req,res)=>{
    res.render("interest-dashboard");
}
exports.getProfile = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    const statusFilter = req.query.status;//at first when page first loads -> undefined

    const searchCriteria = { user: userId };

    if (statusFilter === "Active" || statusFilter === "Closed") { // when page first loads -> no actove/closed -> show any
      searchCriteria.status = statusFilter; //like { landlord: landlordId, status: statusFilter }
    }

    const interests = await interestFormModel
      .findByUser(searchCriteria)
      .sort({ createdAt: -1 });  // -1 = sort newest to oldest, 1 = sort oldest to newest

    const interestListingArray = [];

    for (const interest of interests) {
      const listing = await listingModel.findByListing(interest.listing);

      let landlordUser = null;
      if (interest.landlord) {
        landlordUser = await userModel.findByUserId(interest.landlord);
      }

      interestListingArray.push({
        interest, // one interest form
        listing, // one model listing
        landlordUser
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
  const userId = req.session?.user?.id;

  try {


    const interest = await interestFormModel.findByInterest_and_User(interestId,userId)
       //the logged in user is the only one who is able to access the interest form * clarify !

    if (!interest) {
      return res.status(404).send("Interest form not found");
    }
    
    const listing = await listingModel.findByListing(interest.listing);
    let landlordUser = null;
    if (interest.landlord) {
      landlordUser = await userModel.findByUserId(interest.landlord);
    }

    return res.render("editPage", {
      interest,
      listing,
      landlordUser,
      errors: []
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to load edit page");
  }
};

exports.updateInterest = async (req, res) => {
  const interestId = req.body.interestId;
  const userId = req.session?.user?._id || req.session?.user?.id;

  const {
    name,
    gender,
    email,
    phone,
    telegram,
    contact_method,
    message,
    consent
  } = req.body;

  const cleanName = name ? name.trim() : "";
  const cleanEmail = email ? email.trim() : "";
  const cleanPhone = phone ? phone.trim() : "";
  const cleanTelegram = telegram ? telegram.trim() : "";
  const cleanMessage = message ? message.trim() : "";

  try {
    const interest = await interestFormModel.findByInterest_and_User(interestId, userId);

    if (!interest) {
      return res.status(404).send("Interest form not found");
    }

    if (interest.status === "Closed") {
      return res.send("Closed interest forms cannot be edited");
    }

    const listing = await listingModel.findByListing(interest.listing);

    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    let landlordUser = null;
    if (interest.landlord) {
      landlordUser = await userModel.findByUserId(interest.landlord);
    }

    const errors = [];

    if (!cleanName) {
      errors.push("Please enter your name.");
    }

    if (!gender) {
      errors.push("Please select your gender.");
    }

    if (!consent) {
      errors.push("Please agree to our policy before submitting.");
    }

    if (!cleanEmail && !cleanPhone && !cleanTelegram) {
      errors.push("Please provide at least one contact method: email, phone, or Telegram.");
    }

    if (!contact_method) {
      errors.push("Please select a preferred contact method.");
    }

    if (contact_method === "email" && !cleanEmail) {
      errors.push("You selected email as the preferred contact method, so email is required.");
    }

    if (contact_method === "phone" && !cleanPhone) {
      errors.push("You selected phone as the preferred contact method, so phone is required.");
    }

    if (contact_method === "whatsapp" && !cleanPhone) {
      errors.push("You selected WhatsApp as the preferred contact method, so phone is required.");
    }

    if (contact_method === "telegram" && !cleanTelegram) {
      errors.push("You selected Telegram as the preferred contact method, so Telegram is required.");
    }
    if (contact_method === "telegram") {
      if (!cleanTelegram || cleanTelegram.toLowerCase() === "na" || cleanTelegram.toLowerCase() === "@na") {
        errors.push("Please provide a valid Telegram username.");
      }
    }


    if (errors.length > 0) {
      const updatedInterest = interest.toObject();

      updatedInterest.name = cleanName;
      updatedInterest.gender = gender;
      updatedInterest.email = cleanEmail;
      updatedInterest.phone = cleanPhone;
      updatedInterest.telegram = cleanTelegram;
      updatedInterest.preferredContactMethod = contact_method;
      updatedInterest.message = cleanMessage;

      return res.render("editPage", {
        listing,
        landlordUser,
        errors,
        interest: updatedInterest
      });
    }

    const updateItems = {
      name: cleanName,
      gender,
      email: cleanEmail,
      phone: cleanPhone,
      telegram: cleanTelegram,
      preferredContactMethod: contact_method,
      message: cleanMessage
    };

    await interestFormModel.updateInterest(interestId, userId, updateItems);

    return res.redirect("/interest/submitted");
  } catch (error) {
    console.log("UPDATE INTEREST ERROR:", error);
    console.log("Validation error details:", error.errors);
    return res.status(500).send("Failed to update interest form");
  }
};
exports.deleteInterest = async (req, res) => {
  const interestId = req.body.interestId;
  const userId = req.session?.user?.id;
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

//Landlord's side 
exports.getLandlordRequestsPage = async (req, res) => {
  try {
    const landlordId = req.session?.user?.id;
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

      let senderUser = null;
      if (interest.user) {
        senderUser = await userModel.findByUserId(interest.user);
      }

      interestListingArray.push({
        interest,
        listing,
        senderUser
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
    const landlordId = req.session?.user?.id;
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
