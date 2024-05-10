const User = require("../model/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const resolvers = {
  Query: {
    users: async () => {
      try {
        // Fetch all users from your data source
        const users = await User.find();
        return users;
      } catch (error) {
        // Handle errors
        throw new Error(`Failed to fetch users: ${error.message}`);
      }
    },
  },

  Mutation: {
    createUser: async (_, { name, email, password, mobile }) => {
      try {
        const exist =await User.findOne({ email})

        if (exist) {
          throw new Error('Email is already exist')
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ 
          name, 
          email, 
          password:hashedPassword, 
          mobile 
        });
        console.log("user", user);
        await user.save();
        return {
          status: 200,
          message: "Register is successfully",
          data: user,
          
        };
      } catch (error) {

        return {
          status: 500,
          message: `Failed to log in: ${error.message}`,
          data:null,
          
        };
       
      }
    },


  
  loginUser: async (_, { email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
      
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error('Incorrect password');
      }
      
      const token = jwt.sign({ userId: user._id }, "your-secret-key", {
        expiresIn: "1h",
      });
      
     
      return {
        status: 200,
        message: "User login successfully",
        data: user,
        token: token
      };
    } catch (error) {
      // Return the error message
      return {
        status: 500,
        message: `Failed to log in: ${error.message}`,
        data: null,
        token: null
      };
    }
  },
  deleteUser: async (_, { id }) => {
    try {
     console.log("id ",id );
      const deletedUser = await User.findByIdAndDelete(id);
      
      if (!deletedUser) {
        throw new Error('User not found');
      }
  
      return {
        status: 200,
        message: "User deleted successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: `Failed to delete user: ${error.message}`,
      };
    }
  },
  
  
   
  updateUser: async (_, { id, name, email, password, mobile }) => {
      try {
        const user = await User.findById(id);
        if (!user) {
          return {
            status: 400,
            message: "user not found",
            data:null,
           
          };
        }
        console.log("user",user);
        // Update user fields
        user.name = name;
        user.email = email;
        user.password = password;
        user.mobile = mobile;
        // Save updated user
        await user.save();
        return {
          status: 200,
          message: "Update user successfully",
          data: user,
         
        };
      } catch (error) {
        return {
          status: 500,
          message: `Failed to log in: ${error.message}`,
          data: null,
         
        };
      }
    },
  },
};

module.exports = resolvers;
