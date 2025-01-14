const app = document.getElementById("app");


const saveToLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const getFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) || {};


let currentUser = null;


function generateRandomExpiry() {
  const now = new Date();
  const randomHours = Math.floor(Math.random() * 72) + 1; 
  now.setHours(now.getHours() + randomHours);
  return now.toLocaleString(); 
}


const renderSignUp = () => {
  app.innerHTML = `
    <div class="container mb-3 mx-auto">
      <header>
        <h1>Sign Up</h1>
      </header>
      <form id="signUpForm" >
        <input type="text" id="username" placeholder="Enter Username" required class="form-control"/><br>
        <input type="password" id="password" placeholder="Enter Password" required class="form-control"/><br>
        <button type="submit" style="border-radius: 5px;">Sign Up</button>
      </form><br>
      <button onclick="renderLogin()" style="border-radius: 5px;">Already have an account? Log In</button>
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


    users[username] = { password };
    saveToLocalStorage("users", users);

    alert("Sign Up successful!");
    renderLogin();
  });
};

const renderLogin = () => {
  app.innerHTML = `
  
    <div class="container mb-3 mx-auto">
      <header>
        <h1>Login</h1>
      </header>
      <form id="loginForm">
        <input type="text" id="username" placeholder="Enter Username" required class="form-control"/><br>
        <input type="password" id="password" placeholder="Enter Password" required class="form-control"/><br>
        <button type="submit" style="border-radius: 5px;">Login</button><br>
      </form><br>
      <button onclick="renderSignUp()" style="border-radius: 5px;">Don't have an account? Sign Up</button>
    </div>
  `;

  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const users = getFromLocalStorage("users");

    
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
        <p>Book your bus tickets with ease and convenience. EasyBus provides an efficient and user-friendly way to travel. Cutting The Hassle Of Queing To Book Ticket.</p>
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
        <button onclick="renderAbout()" style="border-radius: 5px;">Learn More</button>
        <button onclick="renderBookBus()" style="border-radius: 5px;">Book a Bus</button>
        <button onclick="renderTickets()" style="border-radius: 5px;">My Tickets</button>
        <button onclick="logout()" style="border-radius: 5px;">Logout</button>
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
      <button onclick="renderHome()" style="border-radius: 5px;">Go Back</button>
       <button class="logout" onclick="logout()" style="border-radius: 5px;">Logout</button
    </div>
  `;
};

const renderPaymentGateway = (ticketDetails) => {
  app.innerHTML = `
    <div class="container mb-3 mx-auto">
      <header>
        <h1>Make Your Payment</h1>
      </header>
      <p>You Are Just A Few Clicks Away<p/>
      <p>Please enter your payment details to confirm your booking:</p>
      <form id="paymentForm">
        <input type="text" id="cardNumber" placeholder="Card Number (16 digits)" maxlength="16" required class="form-control"/><br>
        <input type="text" id="cardHolder" placeholder="Card Holder Name" required class="form-control"/><br>
        <input type="month" id="expiryDate" placeholder="Expiry Date" required class="form-control"/><br>
        <input type="text" id="cvv" placeholder="CVV (3 digits)" maxlength="3" required class="form-control"/><br>
        <button type="submit" style="border-radius: 5px;">Pay Now</button><br>
      </form><br>
      <button onclick="renderHome()" style="border-radius: 5px;">Cancel Payment</button>
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
    <div class="container mb-3 mx-auto">
      <header>
        <h1>Book A Bus</h1>
      </header>
      <form id="bookBusForm">
        <input type="text"  placeholder="Enter Your location" required class="form-control"/><br>
        <input type="text" id="destination" placeholder="Enter Destination" required class="form-control"/><br>
        <input type="date" id="date" required class="form-control"/><br>
        <select id="busType" class="form-control">
          <option value="Regular">Regular</option>
          <option value="Luxury">Luxury</option>
        </select><br>
        <button type="submit" style="border-radius: 5px;">Proceed to Payment</button><br>
      </form><br>
      <button onclick="renderHome()" style="border-radius: 5px;">Go Back</button>
    </div>
  `;

  document.getElementById("bookBusForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const destination = document.getElementById("destination").value;
    const date = document.getElementById("date").value;
    const busType = document.getElementById("busType").value;

    const ticketNumber = Math.floor(Math.random() * 100000);
    const expiryDate = generateRandomExpiry();

    const ticketDetails = {
      destination,
      date,
      busType,
      ticketNumber,
      expiry: expiryDate,
    };

   
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
            <h3>Ticket No.${index + 1}</h3>
            <p><strong>Destination:</strong> ${ticket.destination}</p>
            <p><strong>Date:</strong> ${ticket.date}</p>
            <p><strong>Bus Type:</strong> ${ticket.busType}</p>
            <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
            <p><strong>Expiry Date:</strong> ${ticket.expiry}</p> <!-- Show expiry date -->
          </div>
        `).join('')}
      </div>
      <button onclick="renderHome()" style="border-radius: 5px;">Go Back</button>
    </div>
  `;
};


if (!getFromLocalStorage("users")) {
  saveToLocalStorage("users", {});
}
if (!getFromLocalStorage("bookings")) {
  saveToLocalStorage("bookings", {});
}


if (getFromLocalStorage("users")) {
  renderLogin();
} else {
  renderSignUp();
}
const logout = () => {
    currentUser = null; 
    alert("You have been logged out.");
    renderLogin();
  };
  