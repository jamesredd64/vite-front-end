router.put('/users/:auth0Id', async (req, res) => {
  const { auth0Id } = req.params;
  const { section } = req.query;
  const updates = req.body;

  try {
    let updateQuery = {};

    switch (section) {
      case 'meta':
        updateQuery = {
          email: updates.email,
          firstName: updates.firstName,
          lastName: updates.lastName,
          phoneNumber: updates.phoneNumber,
          profile: updates.profile
        };
        break;
      case 'address':
        updateQuery = { address: updates.address };
        break;
      case 'marketing':
        updateQuery = { marketingBudget: updates.marketingBudget };
        break;
      default:
        // If no section specified, update all fields
        updateQuery = updates;
    }

    const updatedUser = await User.findOneAndUpdate(
      { auth0Id },
      { $set: updateQuery },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});