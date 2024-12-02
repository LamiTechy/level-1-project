const app = document.getElementById("app");

// Helper Functions
const saveToLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const getFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) || {};

// State
let currentUser = null;

// Function to generate a random expiry date (1-72 hours from now)
function generateRandomExpiry() {
  const now = new Date();
  const randomHours = Math.floor(Math.random() * 72) + 1; // Random number of hours (1-72)
  now.setHours(now.getHours() + randomHours);
  return now.toLocaleString(); // Return the expiry as a human-readable string
}

// Pages
const renderSignUp = () => {
  app.innerHTML = `
    <div class="container">
      <header>
        <h1>Sign Up</h1>
      </header>
      <form id="signUpForm">
        <input type="text" id="username" placeholder="Enter Username" required />
        <input type="password" id="password" placeholder="Enter Password" required />
        <button type="submit">Sign Up</button>
      </form>
      <button onclick="renderLogin()">Already have an account? Log In</button>
    </div>
  `;

  document.getElementById("signUpForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    const users = getFromLocalStorage("users");
    if (users[username]) {
      alert("User already exists!");
      return;
    }

    // Save new user to local storage
    users[username] = { password };
    saveToLocalStorage("users", users);

    alert("Sign Up successful!");
    renderLogin();
  });
};

const renderLogin = () => {
  app.innerHTML = `
    <div class="container">
      <header>
        <h1>Login</h1>
      </header>
      <form id="loginForm">
        <input type="text" id="username" placeholder="Enter Username" required />
        <input type="password" id="password" placeholder="Enter Password" required />
        <button type="submit">Login</button>
      </form>
      <button onclick="renderSignUp()">Don't have an account? Sign Up</button>
    </div>
  `;

  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const users = getFromLocalStorage("users");

    // Validate user credentials
    if (users[username] && users[username].password === password) {
      currentUser = username;
      alert(`Login successful! Welcome, ${username}`);
      renderHome();
    } else {
      alert("Invalid username or password!");
    }
  });
};

const renderHome = () => {
  app.innerHTML = `
    <div class="container">
      <header>
        <h1>Welcome to EasyBus</h1>
      </header>
      <section>
        <h2>Your journey starts here!</h2>
        <p>Book your bus tickets with ease and convenience. EasyBus provides an efficient and user-friendly way to travel.</p>
      </section>
      <section style="margin-top: 20px;">
        <h3>Why Choose EasyBus?</h3>
        <ul>
          <li>🚌 Wide range of destinations</li>
          <li>💺 Comfortable and reliable buses</li>
          <li>💳 Secure and fast payment gateway</li>
          <li>🎟️ Instant ticket generation</li>
        </ul>
      </section>
      <section style="margin-top: 20px; text-align: center;">
        <button onclick="renderAbout()">Learn More</button>
        <button onclick="renderBookBus()">Book a Bus</button>
        <button onclick="renderTickets()">My Tickets</button>
        <button onclick="logout()">Logout</button>
      </section>
    </div>
  `;
};

const renderAbout = () => {
  app.innerHTML = `
    <div class="container">
      <header>
        <h1>About EasyBus</h1>
      </header>
      <p>EasyBus is your reliable companion for hassle-free bus travel. Our platform offers a streamlined process for booking and managing your trips. Whether you're traveling for work or leisure, EasyBus ensures a comfortable and efficient journey.</p>
      <button onclick="renderHome()">Go Back</button>
       <button onclick="logout()">Logout</button
    </div>
  `;
};

const renderPaymentGateway = (ticketDetails) => {
  app.innerHTML = `
    <div class="container">
      <header>
        <h1>Payment Gateway</h1>
      </header>
      <p>Please enter your payment details to confirm your booking:</p>
      <form id="paymentForm">
        <input type="text" id="cardNumber" placeholder="Card Number (16 digits)" maxlength="16" required />
        <input type="text" id="cardHolder" placeholder="Card Holder Name" required />
        <input type="month" id="expiryDate" placeholder="Expiry Date" required />
        <input type="text" id="cvv" placeholder="CVV (3 digits)" maxlength="3" required />
        <button type="submit">Pay Now</button>
      </form>
      <button onclick="renderHome()">Cancel Payment</button>
    </div>
  `;

  document.getElementById("paymentForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const cardNumber = document.getElementById("cardNumber").value;
    const cardHolder = document.getElementById("cardHolder").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const cvv = document.getElementById("cvv").value;

    if (
      cardNumber.length === 16 &&
      cardHolder.trim() !== "" &&
      expiryDate !== "" &&
      cvv.length === 3
    ) {
      // Save ticket after payment
      const allBookings = getFromLocalStorage("bookings");
      const userBookings = allBookings[currentUser] || [];
      userBookings.push(ticketDetails);
      allBookings[currentUser] = userBookings;
      saveToLocalStorage("bookings", allBookings);

      alert("Payment Successful! Your ticket has been confirmed.");
      renderTickets();
    } else {
      alert("Invalid payment details. Please try again.");
    }
  });
};

const renderBookBus = () => {
  app.innerHTML = `
    <div class="container">
      <header>
        <h1>Book Bus</h1>
      </header>
      <form id="bookBusForm">
        <input type="text" id="destination" placeholder="Enter Destination" required />
        <input type="date" id="date" required />
        <select id="busType">
          <option value="Regular">Regular</option>
          <option value="Luxury">Luxury</option>
        </select>
        <button type="submit">Proceed to Payment</button>
      </form>
      <button onclick="renderHome()">Go Back</button>
    </div>
  `;

  document.getElementById("bookBusForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const destination = document.getElementById("destination").value;
    const date = document.getElementById("date").value;
    const busType = document.getElementById("busType").value;

    const ticketNumber = Math.floor(Math.random() * 100000); // Generate random ticket number
    const expiryDate = generateRandomExpiry(); // Generate random expiry

    const ticketDetails = {
      destination,
      date,
      busType,
      ticketNumber,
      expiry: expiryDate, // Add expiry date to ticket details
    };

    // Redirect to payment gateway with ticket details
    renderPaymentGateway(ticketDetails);
  });
};

const renderTickets = () => {
  const bookings = getFromLocalStorage("bookings")[currentUser] || [];

  if (bookings.length === 0) {
    app.innerHTML = `
      <div class="container">
        <header>
          <h1>My Tickets</h1>
        </header>
        <p>You haven't booked any tickets yet!</p>
        <button onclick="renderHome()">Go Back</button>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <div class="container">
      <header>
        <h1>My Tickets</h1>
      </header>
      <div class="tickets-list">
        ${bookings.map((ticket, index) => `
          <div class="ticket">
            <h3>Ticket #${index + 1}</h3>
            <p><strong>Destination:</strong> ${ticket.destination}</p>
            <p><strong>Date:</strong> ${ticket.date}</p>
            <p><strong>Bus Type:</strong> ${ticket.busType}</p>
            <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
            <p><strong>Expiry Date:</strong> ${ticket.expiry}</p> <!-- Show expiry date -->
          </div>
        `).join('')}
      </div>
      <button onclick="renderHome()">Go Back</button>
    </div>
  `;
};

// Initialize storage for users and bookings
if (!getFromLocalStorage("users")) {
  saveToLocalStorage("users", {});
}
if (!getFromLocalStorage("bookings")) {
  saveToLocalStorage("bookings", {});
}

// Initial Load
if (getFromLocalStorage("users")) {
  renderLogin();
} else {
  renderSignUp();
}
const logout = () => {
    currentUser = null; // Clear current user
    alert("You have been logged out.");
    renderLogin(); // Redirect to login page
  };
  