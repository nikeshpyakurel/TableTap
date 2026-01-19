# System Diagrams

Here are the Mermaid diagrams for the TableTap system, based on the codebase analysis.

## 1. User Interface Diagram (UI Map)
This diagram shows the hierarchy of screens and routing structure for both the Client (Diner) and Admin/Staff sides.

```mermaid
graph TD
    %% Main Entry Points
    Entry((Entry Point)) --> Public[Client / Public Access]
    Entry --> Private[Admin / Staff Dashboard]

    %% Public Routes (OpenRoutes.tsx)
    subgraph Client Section
        Public --> Start[/Login & Register/]
        Public --> MenuPage[Menu Page / Landing]
        
        MenuPage --> MenuDetails[Menu Details]
        MenuPage --> ItemDetails[Item Details]
        MenuPage --> Cart[Cart]
        
        Cart --> OrderSuccess[Order Success]
        
        MenuPage --> ClientOrders[My Orders]
        ClientOrders --> ClientOrderDetails[Order Details]
    end

    %% Private Routes (AuthRoute.tsx)
    subgraph Admin Dashboard
        Private --> Dashboard[Dashboard Home]
        
        %% Product Management
        Dashboard --> ProductMgmt{Product Mgmt}
        ProductMgmt --> ViewProducts[View Products]
        ProductMgmt --> AddProducts[Add Product]
        ProductMgmt --> ImageLib[Image Library]

        %% Category Management
        Dashboard --> CatMgmt{Category Mgmt}
        CatMgmt --> ViewCat[View Categories]
        CatMgmt --> AddCat[Add Category]
        CatMgmt --> IconLib[Icon Library]

        %% Order Management
        Dashboard --> OrderMgmt{Order Mgmt}
        OrderMgmt --> ViewOrders[All Orders]
        OrderMgmt --> OrderDet[Order Details]
        OrderMgmt --> OrderHist[Order History]
        OrderMgmt --> Billing[Billing]

        %% Quick Order (POS-like)
        Dashboard --> QuickOrder[Quick Food Order]
        QuickOrder --> QuickCheckout[Quick Checkout]
        QuickOrder --> QuickOrderList[View Quick Orders]

        %% Reception / Table Mgmt
        Dashboard --> Reception{Reception & Tables}
        Reception --> TableView[Table View]
        Reception --> BookTable[Book Table]
        Reception --> TableOrder[Table Order]
        Reception --> ReceptionBill[Reception Billing]

        %% Admin / Staff Settings
        Dashboard --> AdminSettings{Settings & Staff}
        AdminSettings --> StaffMgmt[Staff Management]
        AdminSettings --> RoleMgmt[Role & Permissions]
        AdminSettings --> Settings[General Settings]
        AdminSettings --> Profile[My Profile]
    end

    %% Styling
    classDef main fill:#f9f,stroke:#333,stroke-width:2px;
    classDef public fill:#e1f5fe,stroke:#0277bd,stroke-width:2px;
    classDef private fill:#fff3e0,stroke:#ef6c00,stroke-width:2px;
    
    class MenuPage,Dashboard main;
    class Start,ItemDetails,Cart,OrderSuccess public;
    class ViewProducts,ViewOrders,QuickOrder,TableView private;
```

## 2. User Flow Diagram (Ordering Process)
This diagram illustrates the flow of data and user actions from the moment a diner initiates an order to the backend processing.

```mermaid
sequenceDiagram
    participant Diner as 👤 Diner (Frontend)
    participant UI as 📱 UI Components
    participant API as 🌐 Backend API (NestJS)
    participant DB as 🗄️ Database
    participant Kitchen as 👨‍🍳 Kitchen/Staff

    Note over Diner, UI: Client Side Interaction

    Diner->>UI: Scans QR / Opens Menu
    UI->>API: GET /product/product/:restaurantId
    API->>DB: Query Products
    DB-->>API: Return Product List
    API-->>UI: Display Menu & Categories

    Diner->>UI: Selects Item -> Add to Cart
    UI->>UI: Update Local Cart Context

    Diner->>UI: Clicks "Checkout" / "Place Order"
    UI->>API: POST /order/create (or similar)
    
    Note over API, DB: Backend Processing
    
    activate API
    API->>API: Validate Order Data
    API->>DB: Save Order & OrderItems
    API->>DB: Update Inventory (optional)
    DB-->>API: Order Saved
    deactivate API

    API-->>UI: Return Success (Order ID)
    UI-->>Diner: Show "Order Success" Screen

    par Notify Staff
        API->>Kitchen: Real-time Alert (Socket/Polling)
        Kitchen->>API: GET /order/pending
        API-->>Kitchen: Show New Order
    end
```
