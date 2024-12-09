export const testPostControllers = (req, res) => {
  const { name } = req.body;
  res.status(200).send(`YOUR name is ${name}`);
};
