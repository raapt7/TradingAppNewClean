const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // Check if email is being changed and if it already exists
    if (email && email !== req.user.email) {
      const emailExists = await User.findOne({ 
        where: { 
          email,
          id: { [Op.ne]: req.user.id }
        } 
      });
      
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update user
    req.user.name = name || req.user.name;
    req.user.email = email || req.user.email;
    await req.user.save();

    res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findByPk(req.user.id);

    // Check if current password is correct
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
}; 