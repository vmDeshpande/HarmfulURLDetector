toggleAuthLinks();//running the toggleAuthLinkns function when starting the website
async function toggleAuthLinks() { //function to hide specific links 
    const loginLink = document.getElementById("loginLink");
    const registerLink = document.getElementById("registerLink");
    const logoutButton = document.getElementById("logoutButton");
  
    console.log("waiting for login...");
    if (await isUser()) {
      console.log("logged in as user");
      loginLink.style.display = "none";
      registerLink.style.display = "none";
      logoutButton.style.display = "inline";
    } else {
      console.log("no one logged in");
      loginLink.style.display = "inline";
      registerLink.style.display = "inline";
      logoutButton.style.display = "none";
    }
  }

  async function isUser() { //checking auth status from session
    try {
      const response = await fetch("/check-auth-status");
      const data = await response.json();
  
      return data.isUser || false;
    } catch (error) {
      console.error("Error checking company status:", error);
      return false;
    }
  }

  const logoutButton = document.getElementById("logoutButton");
  if(logoutButton){  //logout function
  logoutButton.addEventListener('click', () => {
    fetch('/logout')
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            window.location.href = '/login.html';
        })
        .catch(error => console.error('Error:', error));
});
}

async function checkURL() { //checkURL function
    if(await isUser()) {

    var url = document.getElementById('urlInput').value;
    
    fetch('/check_url', { // Send the URL to the server for analysis
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
    })
        .then(response => response.json())
        .then(resultObject => {
            console.log(resultObject);

            if(resultObject.status === "potentially harmful" || resultObject.status === "safe"){  //checking if the status is in perfect format     

            // Display the relevant information in the 'resultContainer' div
            const resultContainer = document.getElementById('resultContainer');

            if (!resultObject || !resultObject.result || !resultObject.status) {
                console.error('Error: Invalid response format - missing status field');
                resultContainer.innerHTML = '<p class="text-danger">Error: Invalid response format - missing status field</p>';
                return;
            }

            // Process the status field
            resultContainer.innerHTML = `<p class="fw-bold">Status: ${resultObject.status}</p>`;

            if (!resultObject.result.scans) {
                console.error('Error: Resource does not exist in the dataset');
                resultContainer.innerHTML += '<p class="text-danger">Error: Resource does not exist in the dataset</p>';
            } else {
                // Process only the specified scans
                const importantScans = [
                    "Criminal IP",
                    "Google Safebrowsing",
                    "MalwareURL",
                    "Malwared",
                    "MalwarePatrol",
                    "Phishing Database",
                    "PhishLabs",
                    "PhishFort",
                    "SafeToOpen",
                    "ThreatHive",
                ];

                resultContainer.innerHTML += '<p class="fw-bold">Important Scans:</p>';

                // Iterate through scans and display relevant information for specified scans
                for (const scanName of importantScans) {
                    const scanResult = resultObject.result.scans[scanName];
                    if (scanResult) {
                        const icon = scanResult.detected
                            ? '<i class="fas fa-times-circle text-danger"></i>'
                            : '<i class="fas fa-check-circle text-success"></i>';
                        resultContainer.innerHTML += `<p class="text-success">${icon} ${scanName}: ${scanResult.result}</p>`;
                    } else {
                        // Handle the case where the scan is not present in the response
                        resultContainer.innerHTML += `<p class="text-warning">${scanName}: Scan not available</p>`;
                    }
                }
            }

            // Update the color based on the result
            if (resultObject.status === "potentially harmful") {
                resultContainer.classList.add("text-danger");
            } else {
                resultContainer.classList.add("text-success");
            }
        } else {
            resultContainer.innerHTML = `<p class="fw-bold">Status: ${resultObject.status}</p>`;
        }
        })
        .catch(error => {
            console.error('Error:', error);
            // Display an error message to the user
            const resultContainer = document.getElementById('resultContainer');
            resultContainer.innerHTML = '<p class="text-danger">An error occurred. Please try again later.</p>';
        });
    } else {
        alert("You need to login first! in order to check url")
        window.location.href = 'login.html';
    }
}


document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => { //adding event listner on register form
      e.preventDefault();
      const username = document.getElementById("registerUsername").value;
      const password = document.getElementById("registerPassword").value;
      const email = document.getElementById("registerEmail").value;

      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      const result = await response.json();
      console.log(result);
      if (result.message === "User registered successfully") {
        window.location.href = "login.html";
        alert("User registered successfully");
      } else {
        alert(result.message);
      }
    });
  }
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => { //adding event listner on login form
      e.preventDefault();
      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;

      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      console.log(result);
      if (result.message === "Login successful") {
        window.location.href = "index.html";
        alert("Login successful");
      } else {
        alert(result.message);
      }
    });
  }
});