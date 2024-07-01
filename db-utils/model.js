import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: Number,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'supervisor'],
    default: "admin"
  },
  employeeId: {
    type: String,
    required: true
  },
  customerId: {
    type: Number,
    required: true
  }
});

const productSchema = new mongoose.Schema({
  id: Number,
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  purchasePrice: {
    type: String,
    required: true
  },
  quantityOnHand: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: String,
    required: true
  },
  unitOfMeasure: {
    type: String,
    required: true
  },
  vendorName: {
    type: String,
    required: true
  },
  vendorId: {
    type: Number,
    required: true
  },
  transactionHistory: [{
    date: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['sale', 'purchase', 'restock']
    },
    quantity: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  },
  images: [String],
  customerId: {
    type: Number,
    required: true
  }
});
const vendorSchema = {
  id: Number,
  vendorName: {
    type: String,
    required: true
  },
  contactName: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  productsSupplied: [{
    productId: {
      type: String,
    },
    productName: {
      type: String,
    },
  }],
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  },
  customerId: {
    type: Number,
    required: true
  }
};

const orderSchema = new mongoose.Schema({
  id: Number,
  productId: {
    type: Number,
    required: true
  },
  vendorId: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
  },
  pricePerQuantity: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  transactionType: {
    type: String,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ["ordered", "shipped", "completed"],
    default: "ordered"
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  },
  customerId: {
    type: Number,
    required: true
  }
});

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  sequence_value: {
    type: Number,
    required: true,
  },
});

const userModel = new mongoose.model("user", userSchema, "users");
const productModel = new mongoose.model("product", productSchema, "products");
const vendorModel = new mongoose.model('vendor', vendorSchema, "vendors");
const counterModel = new mongoose.model("counter", counterSchema, "counter");
const orderModel = new mongoose.model("order", orderSchema, "orders");

export { userModel, productModel, vendorModel, counterModel, orderModel };
