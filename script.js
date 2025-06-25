const body = document.querySelector("body"),
      sidebar = body.querySelector(".sidebar"),
      toggle = body.querySelector(".toggle"),
      searchBtn = body.querySelector(".contact"),
      modeSwitch = body.querySelector(".toggle-switch"),
      modeText = body.querySelector(".mode-text");

const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// Toggle sidebar for desktop view
if (toggle) {
  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
  });
}

// Check if dark mode was previously enabled
if (localStorage.getItem("darkMode") === "enabled") {
  body.classList.add("dark");
  if (modeText) {
    modeText.innerText = "الوضع المضيء";
  }
}

// Toggle dark/light mode
if (modeSwitch && modeText) {
  modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");

    if(body.classList.contains("dark")){
      modeText.innerText = "الوضع المضيء";
      localStorage.setItem("darkMode", "enabled");
    } else {
      modeText.innerText = "الوضع المظلم";
      localStorage.setItem("darkMode", "disabled");
    }
  });
}

// Close sidebar automatically on small screens
function handleResize() {
  if (window.innerWidth <= 768) {
    sidebar.classList.add("close");
    sidebar.classList.remove("open");
    if (sidebarOverlay) {
      sidebarOverlay.style.display = 'none';
    }
  }
}

// Initial check
handleResize();

// Listen for window resize
window.addEventListener("resize", handleResize);

// Image gallery functionality
const shoes = [
  { id: 1, image: "Images/FRONT.PNG" },
  { id: 2, image: "Images/BACK.PNG" },
  { id: 3, image: "Images/SIDE.PNG" },
  { id: 4, image: "Images/CLOSE.png" }
];

const mainImage = document.querySelector('.shoe-image');
const icons = document.querySelectorAll('.SectionIcon');

function updateImage(shoeId) {
  if (!mainImage) return;
  
  const selectedShoe = shoes.find(shoe => shoe.id === shoeId);
  mainImage.src = selectedShoe.image;

  // Remove active class from all icons
  icons.forEach(icon => icon.classList.remove('active'));

  // Add active class to current icon
  const activeIcon = document.querySelector(`[data-shoe="${shoeId}"]`);
  if (activeIcon) {
    activeIcon.classList.add('active');
  }
}

if (icons.length > 0) {
  icons.forEach(icon => {
    icon.addEventListener('click', () => {
        const shoeId = parseInt(icon.getAttribute('data-shoe'));
        updateImage(shoeId);
    });
  });

  // Initial load
  updateImage(1);
}

// Improved sidebar toggle for mobile
function openSidebar() {
  sidebar.classList.add('open');
  sidebar.classList.remove('close');
  if (sidebarOverlay) {
    sidebarOverlay.style.display = 'block';
    // Add a small delay before adding the active class to ensure the transition works
    setTimeout(() => {
      sidebarOverlay.classList.add('active');
    }, 10);
  }
  document.body.style.overflow = 'hidden'; // Prevent scrolling when sidebar is open
  
  // Add a class to the body to indicate the sidebar is open
  document.body.classList.add('sidebar-open');
  
  // Add X class to hamburger button
  if (hamburgerBtn) {
    hamburgerBtn.classList.add('is-active');
  }
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebar.classList.add('close');
  if (sidebarOverlay) {
    sidebarOverlay.classList.remove('active');
    // Wait for the transition to complete before hiding
    setTimeout(() => {
      sidebarOverlay.style.display = 'none';
    }, 300);
  }
  document.body.style.overflow = ''; // Restore scrolling
  
  // Remove the class from the body
  document.body.classList.remove('sidebar-open');
  
  // Remove X class from hamburger button
  if (hamburgerBtn) {
    hamburgerBtn.classList.remove('is-active');
  }
}

if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', closeSidebar);
}

// Handle ESC key to close sidebar
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidebar.classList.contains('open')) {
    closeSidebar();
  }
});

// Ensure sidebar closes on resize to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    sidebar.classList.remove('open');
    if (sidebarOverlay) {
      sidebarOverlay.style.display = 'none';
    }
    document.body.style.overflow = ''; // Restore scrolling
  }
});