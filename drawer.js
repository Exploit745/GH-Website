// Load drawer HTML into page
fetch("drawer.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("drawer").innerHTML = html;
    initializeDrawerAuth();
  })
  .catch(err => console.error("Drawer load error:", err));

function initializeDrawerAuth() {
  auth.onAuthStateChanged(async user => {
    if (!user) return;

    // Get token for admin check
    const token = await user.getIdTokenResult();

    // Show admin link if admin
    if (token.claims.admin) {
      const adminLink = document.getElementById("drawerAdminLink");
      if (adminLink) adminLink.style.display = "block";
    }

    // Load name from users/{uid}
    db.collection("users").doc(user.uid).get().then(doc => {
      const name = doc.exists && doc.data().name ? doc.data().name : user.email;
      document.getElementById("drawerUserName").textContent = name;
    });

    // Logout
    const logoutButton = document.getElementById("drawerLogout");
    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        auth.signOut().then(() => {
          window.location.href = "login.html";
        });
      });
    }
  });
}