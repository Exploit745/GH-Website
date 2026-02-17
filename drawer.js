/* GH DRAWER LOADER V3.0 (GLOBAL INIT COMPATIBLE) */

fetch("drawer.html")
  .then(res => res.text())
  .then(html => {
    // 1. Inject HTML
    document.getElementById("drawer").innerHTML = html;
    
    // 2. Inject Mobile Toggle Button (Bottom Right Floating)
    createMobileButton();

    // 3. Start Logic
    initDrawerLogic();
  })
  .catch(err => console.error("Drawer load error:", err));

function createMobileButton() {
    // Check if exists
    if (document.querySelector(".mobile-menu-btn")) return;

    const btn = document.createElement("button");
    btn.className = "mobile-menu-btn";
    btn.innerHTML = "☰";
    
    // FORCE STYLES (Ensures it is visible)
    btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #00eaff;
        color: #000;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        font-weight: bold;
        box-shadow: 0 0 15px #00eaff;
        z-index: 10000;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
    `;
    
    // Hover effect
    btn.onmouseover = () => btn.style.transform = "scale(1.1)";
    btn.onmouseout = () => btn.style.transform = "scale(1)";

    btn.onclick = toggleDrawer;
    document.body.appendChild(btn);
}

function toggleDrawer() {
    const d = document.querySelector(".drawer");
    const b = document.getElementById("drawerBackdrop"); 
    const btn = document.querySelector(".mobile-menu-btn");
    
    if (d) {
        d.classList.toggle("active"); // Ensure your CSS uses .active or .open
        d.classList.toggle("open");   // Toggling both to catch whatever CSS you use
        
        // Update Icon
        if (btn) btn.innerHTML = d.classList.contains("active") || d.classList.contains("open") ? "✕" : "☰";
    }
}

function initDrawerLogic() {
  // Wait for global variables
  if (typeof db === "undefined" || typeof auth === "undefined") {
      setTimeout(initDrawerLogic, 100);
      return;
  }

  // Highlight Active Link
  const path = window.location.pathname.split("/").pop() || "index.html";
  const activeLink = document.querySelector(`.drawer-link[href="${path}"]`);
  if (activeLink) activeLink.classList.add("active");

  auth.onAuthStateChanged(async user => {
    if (!user) return;

    // Set Name
    const nameEl = document.getElementById("drawerUserName");
    if(nameEl) {
        db.collection("users").doc(user.uid).get().then(doc => {
            nameEl.innerText = (doc.exists && doc.data().name) ? doc.data().name : (user.displayName || "Member");
        });
    }

    // Admin Link
    try {
        const token = await user.getIdTokenResult();
        if (token.claims.admin) {
            const link = document.getElementById("drawerAdminLink");
            if (link) link.style.display = "block";
        }
    } catch (e) {}

    // Logout
    const logoutBtn = document.getElementById("drawerLogout");
    if (logoutBtn) {
        logoutBtn.onclick = () => auth.signOut().then(() => window.location.href = "login.html");
    }
  });
}