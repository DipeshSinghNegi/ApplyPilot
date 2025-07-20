chrome.storage.local.get("token", async (data) => {
  if (!data.token) return;

  try {
    const res = await fetch("http://localhost:5001/user", {
      headers: {
        Authorization: \`Bearer \${data.token}\`,
      },
    });

    const result = await res.json();
    const user = result.user;

    if (!user) return;

    console.log("Autofilling with:", user);

    // Example selectors — customize per job site
    document.querySelector('input[name="firstName"]')?.value = user.first_name;
    document.querySelector('input[name="lastName"]')?.value = user.last_name;
    document.querySelector('input[name="email"]')?.value = user.email;
    document.querySelector('input[type="file"]')?.setAttribute("data-autofill-resume", user.resume);

  } catch (err) {
    console.error("Error fetching user data:", err);
  }
});
