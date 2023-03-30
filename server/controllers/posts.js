import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath, location } = req.body;
    const user = await User.findById(userId);
    const locationObject = JSON.parse(location);

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: locationObject,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: []
    });
    await newPost.save();

    // Check if the country is already in the user's countryVisited array
    const countryIndex = user.countryVisited.findIndex(
      (country) => country.id === locationObject.id
    );

    if (countryIndex !== -1) {
      // Increment the count if the country already exists
      user.countryVisited[countryIndex].count += 1;
    } else {
      // Add the country with a count of 1 if it's not in the array
      user.countryVisited.push({ ...locationObject, count: 1 });
    }

    // Save the updated user object
    const updatedUser = await user.save();

    const posts = await Post.find().sort({ _id: -1 });
    res.status(200).json({ posts, updatedUser });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    const user = await User.findById(post.userId);

    const countryIndex = user.countryVisited.findIndex(
      (country) => country.name === post.location.name
    );

    if (countryIndex !== -1) {
      if (user.countryVisited[countryIndex].count > 1) {
        user.countryVisited[countryIndex].count -= 1;
      } else {
        user.countryVisited.splice(countryIndex, 1);
      }
      await user.save();
    }

    await Post.findByIdAndDelete(id);

    const posts = await Post.find().sort({ _id: -1 });
    res.status(200).json({ posts, user });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};



/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().sort({ _id: -1 });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }).sort({ _id: -1 });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export default { createPost, deletePost, getFeedPosts, getUserPosts, likePost };