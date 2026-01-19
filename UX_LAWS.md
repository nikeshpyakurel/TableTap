# UX Laws & Heuristics for TableTap

This document evaluates TableTap against Nielsen’s ten usability heuristics and other key UX laws, providing image suggestions to visualy demonstrate compliance.

## Nielsen’s 10 Heuristic Principles

### 1. Visibility of System Status
TableTap must always tell users what is happening. The platform achieves this with real-time order status badges (e.g., Received, Preparing, Ready), toast confirmations for critical actions, and loading indicators when networks are slow. For staff, incoming orders trigger both visual and audible alerts to reduce missed orders. Improvements include explicit progress for payment processing (so users are not tempted to re-submit) and session timers to show when a session will expire and how to restore it.

> **📸 Image Suggestion:**  
> A split screenshot showing:
> 1.  A **"Toast" notification** (e.g., "Item added to cart") appearing at the bottom of the screen.
> 2.  The **Order Tracker** screen showing the current status badge (e.g., "Preparing" in orange).

### 2. Match Between System and the Real World
Terminology, categorization, and metaphors should reflect real dining concepts. TableTap uses familiar menu groupings (starters, mains, drinks), cart and tray metaphors, and icons that mirror physical affordances (bookmark as a saved item). Localization — using locally familiar terms, currency, and language — further anchors the system in users’ real-world expectations.

> **📸 Image Suggestion:**  
> A screenshot of the **Menu Categories** (Starters, Mains) or the **Cart Icon** (tray/basket metaphor) clearly visible in the navigation bar.

### 3. User Control and Freedom
Users must be able to make mistakes and recover. TableTap provides undoable steps before kitchen acceptance, confirmation dialogs for payments, and clear logout/session expiry behaviour. To strengthen control, the system should allow users to restore an expired session where possible and provide visible edit and cancel actions on recent orders.

> **📸 Image Suggestion:**  
> A screenshot showing a **"Remove"** or **"Edit"** button on an item in the cart, or a **"Cancel Order"** modal dialog asking for confirmation.

### 4. Consistency and Standards
Consistency across screens, devices, and roles reduces cognitive load. TableTap enforces consistent button placement, color semantics (e.g., green = positive action, red = destructive), and predictable iconography. Using a component library helps maintain these standards; documentation ensures new screens follow the same rules.

> **📸 Image Suggestion:**  
> A composite image showing two different screens (e.g., "Cart" and "Checkout") side-by-side, highlighting that the **Primary Action Button** (e.g., "Checkout", "Pay Now") is in the exact same position with the same color.

### 5. Error Prevention
Prevention is better than cure. TableTap includes validation checks on cart and payment screens, prevents submission when required information is missing, and uses phone-verified sessions to avoid fake QR scans. Further hardening includes pre-checks for item availability and alerting users at the point of item selection rather than at checkout.

> **📸 Image Suggestion:**  
> A screenshot of a form (like the Payment screen) showing a **grayed-out "Pay" button** because a required field is empty, or an inline validation message like "Please enter a valid phone number."

### 6. Recognition Rather Than Recall
The system should minimize memory demands. TableTap accomplishes this with persistent category labels, recent orders, visible cart, and contextual hints. Staff interfaces include table numbers and order metadata so staff don’t need to remember additional details.

> **📸 Image Suggestion:**  
> A screenshot of the **"Recent Orders"** section or a **"Previously Ordered"** tab, showing users what they ordered last time so they don't have to search for it again.

### 7. Flexibility and Efficiency of Use
Power users should have shortcuts while novices get guided paths. TableTap provides favorites, reorder shortcuts, keyboard-accessible actions for staff, and bulk-actions for the kitchen. Customizable shortcuts for managers (favorite report ranges, saved filters) increase efficiency.

> **📸 Image Suggestion:**  
> A screenshot of a **"Quick Reorder"** button on the home screen or, for the staff view, a **keyboard shortcut** helper overlay.

### 8. Aesthetic and Minimalist Design
The UI prioritizes essential functionality and removes extraneous decorations. Clear typography, adequate whitespace, and a logical hierarchy make the interface approachable and help users complete tasks with minimal distraction.

> **📸 Image Suggestion:**  
> A high-quality screenshot of the **Landing Page** or a **Single Product Page**, showcasing clean whitespace, clear fonts, and lack of clutter.

### 9. Help Users Recognize, Diagnose, and Recover from Errors
Error messages are explicit and actionable. Instead of generic “Payment failed,” messages say “Payment declined — try another card or tap Retry.” For expired sessions, the app should offer steps to re-scan and, where possible, restore the cart. Support options (chat, quick-call) help in edge cases.

> **📸 Image Suggestion:**  
> A screenshot of a specific error message, such as **"Payment Declined"**, with a clear **"Retry"** button and explaining text, rather than just "Error 404".

### 10. Help & Documentation
Lightweight, contextual help (tooltips, short FAQs) supports first-time users without cluttering the interface. Staff-facing documentation focuses on workflows and escalation paths. Onboarding hints appear only the first time users encounter a complex feature.

> **📸 Image Suggestion:**  
> A screenshot of an **Onboarding Tooltip** (e.g., "Tap here to filter by dietary preference") or a standard **"Help/FAQ"** modal.

---

## Other UX Laws

### Miller’s Law
Applied to limit visible menu options and chunk information to reduce cognitive load during ordering.
> **📸 Image Suggestion:** A menu screen showing a category (e.g., "Drinks") with a manageable list of **5-7 items**, not an overwhelming list of 50.

### Jakob’s Law
Used to align navigation and interaction patterns with familiar food-ordering and e-commerce interfaces.
> **📸 Image Suggestion:** A screenshot of the **Checkout Flow**, highlighting its resemblance to standard apps like UberEats or Doordash (e.g., Address -> Payment -> Confirm).

### Hick’s Law
Addressed by categorizing menus and reducing simultaneous choices to speed up decision-making.
> **📸 Image Suggestion:** The **Category Selection** screen showing distinct, clear choices (Burgers, Pizzas, Drinks) rather than listing every item immediately.

### Fitts’s Law
Reflected in large, well-spaced buttons for primary actions such as “Add to Cart” and “Pay Now.”
> **📸 Image Suggestion:** A close-up screenshot of the bottom of the Item Detail screen showing a **large, full-width "Add to Order" button**.

### Doherty Threshold
Enforced by providing immediate visual feedback to maintain a perception of system responsiveness.
> **📸 Image Suggestion:** A screenshot showing **Skeleton Screens** (gray loading bars) that appear immediately while the actual content loads.

### Tesler’s Law
Managed by shifting operational complexity to the system while keeping user interactions simple.
> **📸 Image Suggestion:** A screenshot of the **Cart Summary** showing tax and total automatically calculated, handling the complex math for the user.

### Pareto Principle (80/20 Rule)
Focused on optimizing the small set of features that deliver the majority of user value.
> **📸 Image Suggestion:** A screenshot highlighting the **"Popular Items"** or **"Best Sellers"** section at the top of the menu.

### Occam’s Razor
Guided the removal of unnecessary interface elements to keep interactions simple and focused.
> **📸 Image Suggestion:** A comparison (Before/After) or single shot of a **simplified interface** where secondary features are hidden behind a "More" menu.

### Goal-Gradient Effect
Leveraged by showing progress indicators during checkout and order completion.
> **📸 Image Suggestion:** A screenshot of the **Checkout Progress Bar** (e.g., "Step 2 of 3: Payment") showing the user is close to the goal.

### Zeigarnik Effect
Utilized through persistent carts and order reminders that keep unfinished tasks visible.
> **📸 Image Suggestion:** A screenshot of the **Floating Cart Button** with a red badge count, persisting as the user browses other pages.

### Law of Proximity
Used to group related menu items, add-ons, and controls for quicker visual scanning.
> **📸 Image Suggestion:** A screenshot of an **Item Card** where the Price, Title, and Add button are visually grouped closely together, separate from the next item.

### Law of Similarity
Applied through consistent button styles and icons to reinforce functional relationships.
> **📸 Image Suggestion:** A screenshot showing that all **"Add"** buttons share the exact same shape and color, while all **"Cancel"** buttons look distinctively different.

### Law of Common Region
Implemented by enclosing related controls within cards or containers to show association.
> **📸 Image Suggestion:** A screenshot of a **"Combo Deal"** where the included items are visually enclosed in a distinct box or card border.

### Law of Uniform Connectedness
Used to visually link prices, items, and actions to reinforce logical grouping.
> **📸 Image Suggestion:** A screenshot where a **line connector or background color** links a main dish with its selected side options.

### Law of Similarity
Applied through consistent button styles and icons to reinforce functional relationships.
> **📸 Image Suggestion:** A screenshot showing that all **"Add"** buttons share the exact same shape and color, while all **"Cancel"** buttons look distinctively different.

### Law of Prägnanz (Simplicity)
Reflected in clean layouts that favor clarity and minimal visual complexity.
> **📸 Image Suggestion:** A screenshot of the **Search Result** page, showing a very clean grid layout without cluttered text.

### Serial Position Effect
Considered when placing important items at the beginning and end of menus or lists.
> **📸 Image Suggestion:** A screenshot of a menu list where the **Signature Dish** is first, or the **"Checkout" button** is clearly at the very end/bottom.

### Peak-End Rule
Addressed by ensuring positive highlights during ordering and a clear, satisfying order confirmation.
> **📸 Image Suggestion:** A screenshot of the **"Order Confirmed!"** success screen, perhaps with a fun animation or clear success tick.

### Von Restorff Effect
Used to highlight critical actions or promotions through visual distinction.
> **📸 Image Suggestion:** A screenshot of a **"Special Offer"** banner that uses a different color (e.g., gold/yellow) to stand out from the rest of the menu.

### Postel’s Law
Applied by allowing flexible user input while ensuring consistent, reliable system output.
> **📸 Image Suggestion:** A screenshot of a **Search Input** where a user typed "burgr" (typo) but the system still displays results for "Burger".

### Aesthetic-Usability Effect
Leveraged by maintaining a visually pleasing interface to increase perceived usability.
> **📸 Image Suggestion:** A screenshot of the most **visually stunning** part of the app, such as a full-screen food image with elegant typography.
