export const productArray: {
  name: string;
  type: string;
  flavor: string;
  price: number;
  isSelected: boolean;
}[] = [
  {
    name: "Chicken Burger",
    type: "Burger",
    flavor: "Spicy Chicken",
    price: 150,
    isSelected: true,
  },
  {
    name: "Chicken Burger",
    type: "Burger",
    flavor: "Spicy Chicken",
    price: 150,
    isSelected: true,
  },
  {
    name: "Chicken Burger",
    type: "Burger",
    flavor: "Spicy Chicken",
    price: 150,
    isSelected: true,
  },
  {
    name: "Chicken Burger",
    type: "Burger",
    flavor: "Spicy Chicken",
    price: 150,
    isSelected: false,
  },
  {
    name: "Chicken Burger",
    type: "Burger",
    flavor: "Spicy Chicken",
    price: 150,
    isSelected: false,
  },
  {
    name: "Chicken Burger",
    type: "Burger",
    flavor: "Spicy Chicken",
    price: 150,
    isSelected: true,
  },
  {
    name: "Chicken Burger",
    type: "Burger",
    flavor: "Spicy Chicken",
    price: 150,
    isSelected: true,
  },
];

interface MenuItem {
  name: string;
  icon: string; // Assuming icon is a string representing the image path
  status: boolean;
}

export const categoryArray: MenuItem[] = [
  { name: "Burger", icon: "burger.png", status: true },
  { name: "Breakfast", icon: "breakfast.png", status: true },
  { name: "Pizza", icon: "pizza.png", status: true },
  { name: "Breakfast", icon: "breakfast2.png", status: false },
  { name: "Noodles", icon: "noodles.png", status: false },
  { name: "Coffee", icon: "coffee.png", status: true },
  { name: "Biryani", icon: "biryani.png", status: true },
];

export const staffs: {
  name: string;
  email: string;
  phone: string;
  role: string;
}[] = [
  {
    name: "Chicken Little",
    email: "little.chicken24@gmail.com",
    phone: "9801236547",
    role: "Manager",
  },
  {
    name: "Ohashi Uzuki",
    email: "demonchild666@gmail.com",
    phone: "9811245635",
    role: "Server",
  },
  {
    name: "Nobur Azami",
    email: "gunz.5azami@gmial.com",
    phone: "9808062345",
    role: "Cashier",
  },
  {
    name: "Damian Guz",
    email: "Guz.29damin@gmail.com",
    phone: "9813745620",
    role: "Bartenders",
  },
  {
    name: "Okatsu Zani",
    email: "Zanirug@gmail.com",
    phone: "9802346654",
    role: "Accountant",
  },
  {
    name: "Jai Sami",
    email: "sami.34jai@gmail.com",
    phone: "9814567774",
    role: "Assistant Manager",
  },
  {
    name: "Manish Onta",
    email: "manish.onta22@gmail.com",
    phone: "9802456672",
    role: "General Manager",
  },
];

export const roles: string[] = [
  "Manager",
  "Assistant Manager",
  "Servers",
  "Accountant",
  "Waiters",
  "Bartenders",
  "General Manager",
];
