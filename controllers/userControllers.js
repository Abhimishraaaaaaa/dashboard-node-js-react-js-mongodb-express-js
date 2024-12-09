import userModals from "../models/userModals.js";
//update user
export const updateUserController = async(req, res, next) => {
    const { name, email, lastName, location } = req.body;
    if (!name || !email || !lastName || !location) {
        next("Please Provide All Fields");
    }
    const user = await userModals.findOne({ _id: req.user.userId });
    user.name = name;
    user.lastName = lastName;
    user.email = email;
    user.location = location;

    await user.save();
    const token = user.createJWT();
    res.status(200).json({
        user,
        token,
    });
};
export const getUserController = async(req, res, next) => {
    try {
        const user = await userModals.findById({ _id: req.body.user.userId });
        user.password = undefined
        if (!user) {
            return res.status(200).send({
                message: "user not found",
                success: false

            });
        } else {
            return res.status(200).send({
                success: true,
                data: user,

            });

        }
    } catch (error) {
        const token = user.createJWT();
        res.status(500).send({
            message: 'auth failed',
            success: false,
            error: error.message
        });

    }


};