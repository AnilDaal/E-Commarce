import Cart from "../models/cartModel.js";

const addCustomerCart = async (customerId) => {
  try {
    const cartData = await Cart.create({
      _id: customerId,
    });
    if (!cartData) {
      return { status: "failed", data: cartData };
    }
    return {
      status: "success",
      data: cartData,
    };
  } catch (error) {
    return { status: "failed", message: error.message };
  }
};

const getCustomerCart = async (req, res) => {
  const customerId = req.params.customerId;
  try {
    const cartData = await Cart.findById(customerId);
    // get customer cart using customer schema
    if (!cartData) {
      return res.status(401).json({ status: "failed", data: cartData });
    }
    res.status(201).json({
      status: "success",
      data: cartData,
    });
  } catch (error) {
    res.status(501).json({ status: "failed", message: error.message });
  }
};

const updateCustomerCart = async (req, res) => {
  const { customerId, productId } = req.params;
  try {
    const cartData = await Cart.findByIdAndUpdate(
      customerId,
      {
        $push: {
          product: productId,
        },
      },
      {
        new: true,
      }
    );
    // update cart schema using customer schema
    if (!cartData) {
      return res.status(401).json({ status: "failed", data: cartData });
    }
    res.status(201).json({
      status: "success",
      data: cartData,
    });
  } catch (error) {
    return res.status(401).json({ status: "failed", message: error.message });
  }
};

export { getCustomerCart, addCustomerCart, updateCustomerCart };
