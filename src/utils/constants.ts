import { ColDef } from "ag-grid-community";

export const NAV_BAR_HEIGHT = 56;
export const GRID_ROWS = 2;
export const GRID_COLS = 2;
export const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes
export const THEME_KEY = "theme";
export const DARK = "dark";
export const LIGHT = "light";
export const APP_THEME = "app-theme";
export const USERNAME = "admin";
export const PASSWORD = "1234";
export const PANEL_KEY = "panelKey";
export const DRAG_ACTIVE = "drag-active";
export const FRUITBOOK = "fruitbook";
export const FRUITVIEW = "fruitview";
export const ESCAPE = "Escape";
export const WIDTH_90 = 90;
export const WIDTH_120 = 120;
export const WIDTH_180 = 180;
export const HEIGHT_200 = 200;

export const constants = {
  fruteriaName: "Fruteria",
  emptyPanelMessage: {
    title: "No Panels Open",
    description: "Drag panels from the side navigation to open them.",
  },
  enrichmentData: {
    title: "Enrichment",
    noData: "No enrichment data available.",
  },
  loginData: {
    invalidCredentials: "Invalid credentials",
    formValidationFailed: "Form validation failed",
    username: "Username",
    password: "Password",
    usernameRequired: "Please input your username!",
    passwordRequired: "Please input your password!",
    usernamePlaceholder: "Enter your username",
    passwordPlaceholder: "Enter your password",
    loginButton: "Login",
    doYouWantToLogout: "Do you want to log out?",
    logoutButton: "Log out",
    cancelButton: "Cancel",
    themeToggleLabel: "Theme",
  },
  aboutPanelData: {
    header: "About",
    welcomeMessage: "Welcome to ",
    welcomeMessage1: "fruteria",
    welcomeMessage2: "This is a playful trading app for fruit, built with React.",
    welcomeMessage3: "Drag panels from the sidebar to explore features.",
    welcomeMessage4: "Made with 🍌 and ❤️",
  },
  fruitBookPanel: {
    header: "Fruit Book",
    labelAvailable: "Available",
    labelPending: "Pending",
  },
  fruitViewPanel: {
    header: "Fruit View",
    buyButton: "Buy",
    sellButton: "Sell",
    inventoryLabel: "Inventory",
    fruitLabel: "Fruit",
    amoutLabel: "Amount",
    boughtLabel: "Bought",
    notEnoughLabel: "Not enough",
    setBoughtMessage: (amount: string, selectedFruit: string) =>
      `Bought ${amount} ${selectedFruit}(s).`,
    setEnoughMessage: (selectedFruit: string) => `Not enough ${selectedFruit}s in inventory.`,
    setSoldMessage: (amount: string, selectedFruit: string) =>
      `Sold ${amount} ${selectedFruit}(s).`,
  },
};

export const userInfo = {
  name: "User",
  email: "user@email.com",
};

export const dimentions = {
  two: 2,
  thirtyTwo: 32,
  fourty: 40,
  ninty: 90,
  oneTwenty: 120,
  oneSixty: 160,
  oneEighty: 180,
  twoHundread: 200,
  twoTwenty: 220,
  threeTwenty: 320,
  fourHundread: 400,
  sevenHundread: 700,
  oneThousand: 1000,
  threeThousand: 3000,
};

export const columnDefs: ColDef<{ property: string; value: any }>[] = [
  {
    headerName: "Property",
    field: "property",
    flex: 1,
    cellStyle: {
      fontWeight: 700,
      color: "#333",
      fontFamily: "inherit",
    },
  },
  {
    headerName: "Value",
    field: "value",
    flex: 2,
    cellStyle: {
      color: "#333",
      fontFamily: "inherit",
    },
  },
];
