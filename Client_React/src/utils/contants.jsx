import path from "./path";
import { BsShieldShaded, BsNewspaper } from "react-icons/bs";
import { TfiTruck } from "react-icons/tfi";
import { AiOutlineGift, AiFillDashboard } from "react-icons/ai";
import { TiArrowBackOutline } from "react-icons/ti";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FaProductHunt } from "react-icons/fa";
import { RiBillLine } from "react-icons/ri";
export const navi = [
  {
    id: 1,
    value: "HOME",
    path: `/${path.HOME}`,
  },
  {
    id: 2,
    value: "PRODUCTS",
    path: `/${path.PRODUCTS}`,
  },
  {
    id: 3,
    value: "BLOGS",
    path: `/${path.BLOGS}`,
  },
  {
    id: 4,
    value: "OUR SERVICES",
    path: `/${path.OUR_SERVICES}`,
  },
  {
    id: 5,
    value: "FAQs",
    path: `/${path.FAQ}`,
  },
];
export const quality = [
  {
    id: 1,
    title: "Guarantee",
    sub: "Quality Checked",
    icon: <BsShieldShaded />,
  },
  {
    id: 2,
    title: "Free Shipping",
    sub: "Free On All Products",
    icon: <TfiTruck />,
  },
  {
    id: 3,
    title: "Special Gift Cards",
    sub: "Special Gift Cards",
    icon: <AiOutlineGift />,
  },
  {
    id: 4,
    title: "Free Return",
    sub: "Within 7 Days",
    icon: <TiArrowBackOutline />,
  },
  {
    id: 5,
    title: "Consultancy",
    sub: "Lifetime 24/7/356",
    icon: <BsNewspaper />,
  },
];
export const productInfomation = [
  {
    id: 1,
    name: "DISCRIPTION",
    content: `Technology: GSM / HSPA / LTE
    Dimensions: 153.8 x 75.5 x 7.6 mm
    Weight: 154 g
    Display: IPS LCD 5.5 inches
    Resolution: 720 x 1280
    OS: Android OS, v6.0 (Marshmallow)
    Chipset: Octa-core
    CPU: Octa-core
    Internal: 32 GB, 4 GB RAM
    Camera: 13MB - 20 MP`,
  },
  {
    id: 2,
    name: "WARRANTY",
    content: `WARRANTY INFORMATION
    LIMITED WARRANTIES
    Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:
    
    Frames Used In Upholstered and Leather Products
    Limited Lifetime Warranty
    A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers. Ashley Furniture Industries,Inc. warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.`,
  },
  {
    id: 3,
    name: "DELIVERY",
    content: `PURCHASING & DELIVERY
    Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
    Picking up at the store
    Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
    Delivery
    Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
    In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`,
  },
  {
    id: 4,
    name: "PAYMENT",
    content: `PURCHASING & DELIVERY
    Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
    Picking up at the store
    Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.`,
  },
];

export const colors = [
  "red",
  "pink",
  "green",
  "gray",
  "yellow",
  "white",
  "orange",
  "black",
  "brown",
  "blue",
];
export const sortBy = [
  {
    id: 1,
    value: "-sold",
    text: "Best selling",
  },
  {
    id: 2,
    value: "title",
    text: "Alphabetically, A-Z",
  },
  {
    id: 3,
    value: "-title",
    text: "Alphabetically, Z-A",
  },
  {
    id: 4,
    value: "price",
    text: "Price, low to high",
  },
  {
    id: 5,
    value: "-price",
    text: "Price, high to low",
  },
  {
    id: 6,
    value: "createdAt",
    text: "Date, old to new",
  },
  {
    id: 7,
    value: "-createdAt",
    text: "Date, new to old",
  },
];
export const voteOption = [
  {
    id: 1,
    text: "Terrible",
  },
  {
    id: 2,
    text: "Bad",
  },
  {
    id: 3,
    text: "Normal",
  },
  {
    id: 4,
    text: "Good",
  },
  {
    id: 5,
    text: "Very Good",
  },
];
export const adminSideBar = [
  {
    id: 1,
    type: "SINGLE",
    text: "Dashboard",
    path: `/${path.ADMIN}/${path.DASHBOARD}`,
    icon: <AiFillDashboard />,
  },
  {
    id: 2,
    type: "SINGLE",
    text: "Manage User",
    path: `/${path.ADMIN}/${path.MANAGE_USER}`,
    icon: <HiOutlineUserGroup />,
  },
  {
    id: 3,
    type: "PARENT",
    text: "Manage Products",
    icon: <FaProductHunt />,
    subMenu: [
      {
        text: "Create products",
        path: `/${path.ADMIN}/${path.CREATE_PRODUCTS}`,
      },
      {
        text: "Manage products",
        path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
      },
    ],
  },
  {
    id: 4,
    type: "SINGLE",
    text: "Manage Order",
    path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
    icon: <RiBillLine />,
  },
];
export const memberSideBar = [
  {
    id: 1,
    type: "SINGLE",
    text: "Personal",
    path: `/${path.MEMBER}/${path.PERSONAL}`,
    icon: <AiFillDashboard />,
  },
  {
    id: 2,
    type: "SINGLE",
    text: "My Cart",
    path: `/${path.MEMBER}/${path.CART}`,
    icon: <HiOutlineUserGroup />,
  },
  {
    id: 3,
    type: "SINGLE",
    text: "Buy history",
    path: `/${path.MEMBER}/${path.HISTORY}`,
    icon: <FaProductHunt />,
  },
  {
    id: 4,
    type: "SINGLE",
    text: "Wishlist",
    path: `/${path.MEMBER}/${path.WISHLIST}`,
    icon: <RiBillLine />,
  },
];

export const Roles = [
  {
    code: "0",
    value: "User",
  },
  {
    code: "1",
    value: "Administrator",
  },
];

export const StatusUser = [
  {
    code: true,
    value: "Blocked",
  },
  {
    code: false,
    value: "Actived",
  },
];

export const optionsChoose = [
  {
    label: "Cancelled",
    value: "Cancelled",
  },
  {
    label: "Successed",
    value: "Successed",
  },
];
export const API_URL = "https://e-commerce-server-dqbg.onrender.com/api";
