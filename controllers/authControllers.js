import userModals from "../models/userModals.js";
//create user
export const registerController = async(req, res, next) => {
    const { name, email, password, lastName } = req.body;
    //validate
    if (!name) {
        next("name is required");
    }
    if (!email) {
        next("email is required");
    }
    if (!password) {
        next("password is required and greater than 6 character");
    }
    const exisitingUser = await userModals.findOne({ email });
    if (exisitingUser) {
        next("Email Already Register Please Login");
    }
    const user = await userModals.create({ name, email, password, lastName });
    //token
    const token = user.createJWT();
    res.status(201).send({
        success: true,
        message: "User Created Successfully",
        user: {
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            location: user.location,
        },
        token,
    });
};

export const loginController = async(req, res, next) => {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
        next("Please Provide All Fields");
    }
    //find user by email
    const user = await userModals.findOne({ email }).select("+password");
    if (!user) {
        next("Invalid Useraname or password");
    }
    //compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        next("Invalid Useraname or password");
    }
    user.password = undefined;
    const token = user.createJWT();
    res.status(200).json({
        success: true,
        message: "Login SUccessfully",
        user,
        token,
    });
};