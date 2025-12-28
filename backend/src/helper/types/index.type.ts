
export enum roleType {
    admin = 'admin',
    superAdmin = 'superAdmin',
    customer = 'customer',
    staff = 'staff'
}

export enum enrollStatus {
    approved = "approved",
    pending = "pending",
    reject = "reject"
}

export enum tableStatus {
    occupied = 'occupied',
    available = 'available'
}


export enum orderStatus {
    pending = 'pending',
    accepted = 'accepted',
    completed = "completed",
    partiallyDelivered = "partiallyDelivered",
    cancelled = "cancelled"
}

export enum orderItemStatus {
    pending = 'pending',
    accepted = 'accepted',
    completed = "completed",
    delivered = "delivered",
    canceled = "canceled"

}

export enum orderType {
    table = 'table',
    // quick='quick',
    receptionist = 'receptionist'
}


export enum callType {
    incoming = 'incoming',
    outgoing = 'outgoing'
}

export enum documentType {
    citizenship = "citizenship",
    pan = "pan",
    drivingLicense = "drivingLicense",
    passport = "passport"
}

export enum paymentMethod {
    online = "online",
    cash = "cash",
    esewa = "esewa",
    khalti = "khalti",
    bankTransfer = "bankTransfer"
}

export enum priorityType {
    low = "low",
    medium = "medium",
    high = "high",
    critical = "critical"
}

export enum requestType {
    technicalGlitches = "technicalGlitches",
    participantManagement = "participantManagement"
}

export enum billingStatus {
    paid = "paid",
    partiallyPaid = "partiallyPaid",
    unpaid = "unpaid"
}

export enum paymentStatus {
    approved = "approved",
    pending = "pending",
    reject = "reject"
}

export enum genderType {
    male = "male",
    female = "female",
    others = "others"
}

export type JwtPayload = {
    sub: string;
    role: string;
    permissions?: string[];
    rId?: string;
};

export interface clientEventId {
    clientId: string,
    eventId: string,
}

export enum otpRequestType {
    register = "register",
    forgotPassword = 'forgotPassword'
}
export enum RestaurantStatus {
    active = "active",
    inactive = "inactive"
}

export enum CategoryStatus {
    available = "available",
    unavailabe = "unavailable"
}

export enum ProductStatus {
    available = "available",
    unavailabe = "unavailable"
}

export enum JobNames {
    PROCESS_ORDER = 'process-order',
    SEND_NOTIFICATION = 'send-notification',
};

export type DateRangeType = 'day' | 'week' | 'month';

export enum dateType {
    day = 'day',
    week = 'week',
    month = 'month'
}
export enum adPage {
    home = "home",
}

export enum adType{
home='home',
history='history',
cart='cart'
}

export enum adActiveStatus{
    true='true',
    false='false'
}

export enum PermissionType {
    CREATE_CATEGORY = 'Create Category',
    VIEW_CATEGORY = 'View Category',
    UPDATE_CATEGORY = 'Update Category',
    DELETE_CATEGORY = 'Delete Category',
    CREATE_TAKEAWAYORDER = 'Create Takeaway Order',
    VIEW_TAKEAWAYORDER = 'View Takeaway Order',
    UPDATE_TAKEAWAYORDER = 'Update Takeaway Order',
    DELETE_TAKEAWAYORDER = 'Delete Takeaway Order',
    CREATE_RECEPTIONORDER = 'Create Reception Order',
    VIEW_RECEPTIONORDER = 'View Reception Order',
    UPDATE_RECEPTIONORDER = 'Update Reception Order',
    DELETE_RECEPTIONORDER = 'Delete Reception Order',
    CREATE_TABLEORDER = 'Create Table Order',
    VIEW_TABLEORDER = 'View Table Order',
    UPDATE_TABLEORDER = 'Update Table Order',
    DELETE_TABLEORDER = 'Delete Table Order',
    CREATE_TABLE = 'Create Table',
    VIEW_TABLE = 'View Table',
    UPDATE_TABLE = 'Update Table',
    DELETE_TABLE = 'Delete Table',
    CREATE_PRODUCT = 'Create Product',
    VIEW_PRODUCT = 'View Product',
    UPDATE_PRODUCT = 'Update Product',
    DELETE_PRODUCT = 'Delete Product',
    CREATE_STAFF = 'Create Staff',
    VIEW_STAFF = 'View Staff',
    UPDATE_STAFF = 'Update Staff',
    DELETE_STAFF = 'Delete Staff',
    CREATE_ROLE = 'Create Role',
    VIEW_ROLE = 'View Role',
    UPDATE_ROLE = 'Update Role',
    DELETE_ROLE = 'Delete Role',
    VIEW_STATISTICS = 'View Statistics'
}

export enum BusinessType{
        hotel='hotel',
        restaurant='restaurant',
        cafe='cafe',
        others='others'
}

export enum leadStatus{
   recent='recent',
   active='active',
   inactive='inactive'
}