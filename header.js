/* =================================================================
   GH HEADER SYSTEM V3.0 (GLOBAL INIT COMPATIBLE)
   - Notifications Hub (Real-time Alerting)
   - Expanded Theme Engine
   - Maintenance Mode Enforcer
================================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    const headerEl = document.getElementById("header");
    if (!headerEl) return;

    // 1. INJECT HEADER HTML & CSS
    headerEl.innerHTML = `
        <div class="gh-header-inner">
            <div class="gh-left">
                <div class="gh-menu-btn" onclick="toggleDrawer()">☰</div>
                <a href="gh_dashboard.html" class="gh-logo">
                    <span class="gh-logo-icon">👾</span>
                    <span class="gh-logo-text">GAMERS HANGOUT</span>
                </a>
            </div>
            
            <div class="gh-right">
                <div class="gh-notif-wrap" id="notifWrapper" style="display:none;">
                    <div class="gh-bell-btn" onclick="toggleNotifDropdown()">
                        🔔
                        <div id="notifBadge" class="gh-notif-badge" style="display:none">0</div>
                    </div>
                    <div id="notifDropdown" class="gh-notif-dropdown">
                        <div class="notif-header">System Logs</div>
                        <div id="notifList" class="notif-list">
                            <div style="padding:15px; color:#666; text-align:center;">Scanning...</div>
                        </div>
                    </div>
                </div>

                <div class="gh-profile-pill" id="headerProfile" onclick="handleProfileClick()">
                    <img src="assets/GH_Hero.png" id="headerAvatar">
                    <span id="headerName">Loading...</span>
                </div>
            </div>
        </div>

        <div id="maintenanceOverlay" style="display:none; position:fixed; inset:0; background:#000; z-index:99999; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
            <h1 style="color:var(--gh-red); font-size:40px; margin-bottom:10px; font-family:sans-serif;">SYSTEM LOCKED</h1>
            <p style="color:#fff; font-size:18px; font-family:sans-serif;">Maintenance in progress. Stand by.</p>
        </div>

        <style>
            /* HEADER LAYOUT */
            .gh-header-inner {
                display: flex; justify-content: space-between; align-items: center;
                height: 70px; padding: 0 25px; background: rgba(0,0,0,0.9);
                backdrop-filter: blur(10px); border-bottom: 2px solid var(--gh-blue);
                position: relative; z-index: 1000; transition: border-color 0.5s;
            }
            .gh-left, .gh-right { display: flex; align-items: center; gap: 20px; }
            .gh-menu-btn { font-size: 24px; cursor: pointer; color: var(--gh-yellow); transition: 0.2s; }
            .gh-menu-btn:hover { transform: scale(1.1); color: #fff; }
            
            .gh-logo { text-decoration: none; display: flex; align-items: center; gap: 10px; }
            .gh-logo-icon { font-size: 28px; animation: glitch 3s infinite; }
            .gh-logo-text { font-weight: 900; font-size: 20px; color: #fff; letter-spacing: 1px; font-family: 'Segoe UI', sans-serif; }
            
            /* NOTIFICATIONS */
            .gh-notif-wrap { position: relative; }
            .gh-bell-btn { font-size: 22px; cursor: pointer; position: relative; transition: 0.2s; filter: grayscale(1); }
            .gh-bell-btn:hover { filter: grayscale(0); transform: scale(1.1); }
            .gh-bell-btn.has-new { animation: bellShake 1s ease infinite; filter: grayscale(0); }
            
            .gh-notif-badge {
                position: absolute; top: -5px; right: -5px; background: var(--gh-red); color: white;
                font-size: 10px; font-weight: bold; width: 16px; height: 16px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center; box-shadow: 0 0 5px var(--gh-red);
            }

            .gh-notif-dropdown {
                display: none; position: absolute; top: 40px; right: -60px; width: 300px;
                background: #111; border: 1px solid var(--gh-blue); border-radius: 8px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.8); overflow: hidden;
            }
            .gh-notif-dropdown.show { display: block; animation: slideDown 0.2s ease-out; }
            .notif-header { background: rgba(0, 234, 255, 0.1); padding: 10px; font-size: 11px; font-weight: bold; color: var(--gh-blue); text-transform: uppercase; border-bottom: 1px solid #333; }
            .notif-list { max-height: 300px; overflow-y: auto; }
            
            .notif-item { padding: 12px; border-bottom: 1px solid #222; cursor: pointer; transition: 0.2s; display: flex; gap: 10px; align-items: flex-start; }
            .notif-item:hover { background: #1a1a1a; }
            .notif-item.unread { background: rgba(0, 234, 255, 0.05); border-left: 3px solid var(--gh-blue); }
            .n-icon { font-size: 16px; }
            .n-content { display: flex; flex-direction: column; }
            .n-title { font-size: 13px; font-weight: bold; color: #fff; margin-bottom: 2px; }
            .n-msg { font-size: 11px; color: #888; line-height: 1.3; }
            .n-time { font-size: 9px; color: #555; margin-top: 4px; }

            /* PROFILE PILL */
            .gh-profile-pill { 
                display: flex; align-items: center; gap: 10px; background: #222; 
                padding: 5px 15px 5px 5px; border-radius: 30px; cursor: pointer; 
                border: 1px solid #333; transition: 0.3s; 
            }
            .gh-profile-pill:hover { border-color: var(--gh-blue); box-shadow: 0 0 15px rgba(0,234,255,0.2); }
            #headerAvatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 2px solid var(--gh-yellow); }
            #headerName { font-weight: bold; font-size: 13px; color: #fff; max-width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family:sans-serif; }
            
            @keyframes glitch { 0% { transform: skew(0deg); } 20% { transform: skew(-10deg); } 40% { transform: skew(10deg); } 100% { transform: skew(0deg); } }
            @keyframes bellShake { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(-15deg); } 75% { transform: rotate(15deg); } }
            @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            
            @media (max-width: 768px) {
                .gh-logo-text { display: none; }
                .gh-header-inner { padding: 0 15px; }
                .gh-notif-dropdown { right: -50px; width: 280px; }
            }
        </style>
    `;

    // 2. INITIALIZE LOGIC
    initHeaderLogic();
});

function initHeaderLogic() {
    // Wait for the global 'db' variable from firebase-init.js to be ready
    if (typeof db === 'undefined' || typeof auth === 'undefined') {
        setTimeout(initHeaderLogic, 100); 
        return;
    }

    // A. AUTH LISTENER
    auth.onAuthStateChanged(async user => {
        if (user) {
            // Setup User UI
            document.getElementById("headerName").innerText = user.displayName || "Agent";
            if(user.photoURL) document.getElementById("headerAvatar").src = user.photoURL;
            document.getElementById("notifWrapper").style.display = "block"; // Show Bell

            // Sync Database Name
            const doc = await db.collection("users").doc(user.uid).get();
            if(doc.exists) {
                const d = doc.data();
                if(d.name) document.getElementById("headerName").innerText = d.name;
            }
            
            checkMaintenance(user);
            initNotifications(user); // START LISTENER
        } else {
            // Logout State
            document.getElementById("headerName").innerText = "Login";
            document.getElementById("headerAvatar").src = "assets/GH_Hero.png";
            document.getElementById("notifWrapper").style.display = "none"; // Hide Bell
            checkMaintenance(null);
        }
    });

    // B. THEME LISTENER
    db.collection("site_config").doc("theme").onSnapshot(doc => {
        if(doc.exists) applyTheme(doc.data().mode);
    });

    // C. MAINTENANCE LISTENER
    db.collection("site_config").doc("maintenance").onSnapshot(doc => {
        window.siteMaintenance = doc.exists ? doc.data().enabled : false;
        checkMaintenance(auth.currentUser);
    });
}

/* =========================================
   NOTIFICATION SYSTEM
========================================= */
function initNotifications(user) {
    // Use global 'db' (do not re-declare)
    
    // Listen to notifications for this user
    db.collection('notifications')
        .where('uid', '==', user.uid)
        .orderBy('timestamp', 'desc')
        .limit(10)
        .onSnapshot(snapshot => {
            const listEl = document.getElementById("notifList");
            const badgeEl = document.getElementById("notifBadge");
            const bellBtn = document.querySelector(".gh-bell-btn");
            
            let unreadCount = 0;
            let html = "";

            if (snapshot.empty) {
                listEl.innerHTML = "<div style='padding:20px; text-align:center; color:#666; font-size:12px;'>System Clear. No Logs.</div>";
                badgeEl.style.display = "none";
                return;
            }

            snapshot.forEach(doc => {
                const n = doc.data();
                if(!n.read) unreadCount++;
                
                // Icon Logic
                let icon = "📩";
                if(n.type === "success") icon = "✅";
                if(n.type === "warning") icon = "⚠️";
                if(n.type === "squad") icon = "🛡️";

                // Time Logic
                let timeStr = "Just now";
                if(n.timestamp) {
                    const date = n.timestamp.toDate();
                    timeStr = date.toLocaleDateString() + " " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                }

                html += `
                    <div class="notif-item ${n.read ? '' : 'unread'}" onclick="handleNotifClick('${doc.id}', '${n.link || '#'}')">
                        <div class="n-icon">${icon}</div>
                        <div class="n-content">
                            <span class="n-title">${n.title || "Notification"}</span>
                            <span class="n-msg">${n.message}</span>
                            <span class="n-time">${timeStr}</span>
                        </div>
                    </div>
                `;
            });

            listEl.innerHTML = html;

            // Badge Update
            if (unreadCount > 0) {
                badgeEl.innerText = unreadCount;
                badgeEl.style.display = "flex";
                bellBtn.classList.add("has-new");
            } else {
                badgeEl.style.display = "none";
                bellBtn.classList.remove("has-new");
            }
        }, error => {
            console.log("Notification Index missing or permission error", error);
        });
}

function toggleNotifDropdown() {
    const d = document.getElementById("notifDropdown");
    d.classList.toggle("show");
}

async function handleNotifClick(docId, link) {
    try {
        await db.collection('notifications').doc(docId).update({ read: true });
    } catch(e) { console.log("Read err", e); }

    if(link && link !== "#") window.location.href = link;
}

// Close Dropdown when clicking outside
document.addEventListener("click", (e) => {
    const wrap = document.getElementById("notifWrapper");
    const drop = document.getElementById("notifDropdown");
    if (wrap && drop && !wrap.contains(e.target)) {
        drop.classList.remove("show");
    }
});

/* =========================================
   HELPER FUNCTIONS
========================================= */

function handleProfileClick() {
    const txt = document.getElementById("headerName").innerText;
    if (txt === "Login") window.location.href = "login.html";
    else window.location.href = "profile.html"; 
}

function toggleDrawer() {
    const d = document.getElementById("drawer");
    const b = document.querySelector(".drawer-backdrop");
    if (d) {
        d.classList.toggle("open");
        if(b) b.classList.toggle("active");
    }
}

async function checkMaintenance(user) {
    const overlay = document.getElementById("maintenanceOverlay");
    if(!overlay) return;
    
    if (!window.siteMaintenance) { overlay.style.display = "none"; return; }

    if (user) {
        try {
            const token = await user.getIdTokenResult();
            if (token.claims.admin) { overlay.style.display = "none"; return; }
            
            const doc = await db.collection("users").doc(user.uid).get();
            if (doc.exists && doc.data().role === 'admin') { overlay.style.display = "none"; return; }
        } catch (e) {}
    }
    overlay.style.display = "flex";
}

function applyTheme(mode) {
    const root = document.documentElement.style;
    
    let y = '#fdff55'; let b = '#00eaff'; let r = '#ff4444'; 

    switch (mode) {
        case 'retro':    y='#ff00ff'; b='#00ffff'; r='#aa00ff'; break; 
        case 'cyber':    y='#fcee0a'; b='#ff003c'; r='#00f0ff'; break; 
        case 'midnight': y='#7986cb'; b='#9fa8da'; r='#ef5350'; break; 
        case 'spring': y='#ffb7b2'; b='#b5ead7'; r='#ff9aa2'; break; 
        case 'summer': y='#f9d423'; b='#4cb8c4'; r='#ff6f61'; break; 
        case 'autumn': y='#f0a500'; b='#cf7500'; r='#8a1c0e'; break; 
        case 'winter': y='#a2d9ff'; b='#ffffff'; r='#006994'; break; 
        case 'val':     y='#ffc1cc'; b='#ff006e'; r='#800f2f'; break; 
        case 'patrick': y='#ffbd00'; b='#009150'; r='#ff8800'; break; 
        case 'patriot': y='#ffffff'; b='#002868'; r='#bf0a30'; break; 
        case 'halloween': y='#ff7b00'; b='#9d4edd'; r='#52b788'; break; 
        case 'xmas':    y='#d4af37'; b='#165b33'; r='#bb2528'; break; 
        case 'newyear': y='#ffd700'; b='#c0c0c0'; r='#ffffff'; break; 
    }

    root.setProperty('--gh-yellow', y);
    root.setProperty('--gh-blue', b);
    root.setProperty('--gh-red', r);
    root.setProperty('--gh-blue-glow', b + '44');
}