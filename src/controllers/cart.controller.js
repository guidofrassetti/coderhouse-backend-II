import { CartModel } from "../models/cart.model.js";
import { Ticket } from "../models/ticket.model.js";
import { v4 as uuidv4 } from 'uuid';
import DatabaseDao from '../models/dao.js';

const cartDAO = new DatabaseDao(CartModel);

export const completePurchase = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartDAO.getById(cid).populate('products.product');

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    let totalAmount = 0;
    const unavailableProducts = [];
    const purchasedProducts = [];

    for (const item of cart.products) {
      const product = item.product;
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
        totalAmount += product.price * item.quantity;
        purchasedProducts.push(item);
      } else {
        unavailableProducts.push(product._id);
      }
    }

    if (purchasedProducts.length > 0) {
      const ticket = await Ticket.create({
        code: uuidv4(),
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: req.user.email,
      });

      cart.products = cart.products.filter(item =>
        unavailableProducts.includes(item.product._id)
      );
      await cart.save();

      return res.status(200).json({
        message: "Purchase completed successfully",
        ticket,
        unavailableProducts,
      });
    } else {
      return res.status(400).json({
        message: "No products available for purchase",
        unavailableProducts,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error completing purchase", error });
  }
};

export const getCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartDAO.getById(cid).populate('products.product');

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json({
      message: "Cart retrieved successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving cart", error });
  }
};
