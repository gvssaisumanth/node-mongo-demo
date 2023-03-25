const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const Users = require("../models/user");

router.get("/getAll", async (req, res) => {
  console.log("Users", typeof Users);
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    console.log("Error .......", err);
  }
});

router.post("/create", async (req, res) => {
  try {
    if (!nameValidations(req.body.name)) {
      return res.json("Please enter a valid name..");
    }
    if (!emailValidation(req.body.email)) {
      return res.json("Please enter valid northeastern email Id");
    }
    if (!passwordValidation(req.body.password)) {
      return res.json(
        "password didn't meet the criteria.. Minimum length of 8 with capital, small specail and numeric character must be present"
      );
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new Users({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    console.log("user...printing..", user);
    const u1 = await user.save();
    res.json(u1);

    res.status(201).send();
  } catch (err) {
    if (err) {
      if (err.code === 11000) {
        console.log("entering...");
        // Duplicate user
        return res
          .status(422)
          .send({ succes: false, message: "User already exist!" });
      }
    }
  }
});

router.put("/edit/:mail", async (req, res) => {
  try {
    if (!emailValidation(req.params.mail)) {
      return res.json("Please enter a valid mail Id");
    }
    if (!passwordValidation(req.body.password)) {
      return res.json(
        "password didn't meet the criteria..",
        "\n",
        "Minimum length of 8 with capital, small specail and numeric character must be present"
      );
    }

    if (!nameValidations(req.body.name)) {
      return res.json("Please enter a valid name..");
    }
    const user1 = await Users.findOne({ email: req.params.mail });
    console.log("got..user", user1);
    if (user1 == null) {
      msg = "User Not Found.....Please register";
      res.send(msg);
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user1.name = req.body.name;
      user1.password = hashedPassword;

      const u1 = await Users.updateOne(
        { email: req.params.mail },
        { name: user1.name, password: user1.password }
      );
      res.json("Updated Successfully");
    }
  } catch (err) {
    console.log("Error", err);
  }
});

router.delete("/delete/:mailId", async (req, res) => {
  console.log("entering...Delete", req.params);
  try {
    const user = await Users.deleteOne({ email: req.params.mailId });
    res.json("deleted");
  } catch (err) {
    res.json(err.name);
  }
});

function emailValidation(email) {
  const validpattern = /^[a-zA-Z0-9._%+-]+@northeastern+\.edu$/;

  if (email.match(validpattern)) {
    return true;
  }
  return false;
}

function passwordValidation(password) {
  const validPattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (password.match(validPattern)) return true;

  return false;
}

function nameValidations(name) {
  const validPattern = /^[a-zA-Z ]{2,30}$/;

  if (name.match(validPattern)) {
    return true;
  } else {
    return false;
  }
}
module.exports = router;
