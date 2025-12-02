fetch("header.html")
  .then(res => {
    console.log("Header fetch status:", res.status);
    return res.text();
  })
  .then(html => {
    document.getElementById("header").innerHTML = html;
  })
  .catch(err => console.error("Header load error:", err));