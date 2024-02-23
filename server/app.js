import('node-fetch').then(({ default: fetch }) => { //used to fetch data fom internet
    const express = require('express'); //used to start the server on localhost
    const bodyParser = require('body-parser'); //used to make any data is JSON format
    const mongoose = require('mongoose'); //used for database
    const path = require('path'); //used to get paths of file for the hosting
    const session = require('express-session'); //used to create a sessison on user login
    const crypto = require('crypto'); //used to make a secret key for login
    const secretKey = crypto.randomBytes(64).toString('hex'); //used to generate random numbers for secret key

    const app = express();
    app.use(session({ //creating a session on login
        secret: secretKey,
        resave: false,
        saveUninitialized: true,
    }));
    const port = 3000;

    mongoose.connect('mongodb+srv://admin:admin123@cluster0.jmry4os.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

    app.use(express.static(path.join(__dirname, '..', 'public'))); //declaring a folder for public files
    app.use(bodyParser.json());

    const urlSchema = new mongoose.Schema({ //declaring a schema for storing the URL in database
        url: String,
        isMalicious: Boolean
    });

    const Url = mongoose.model('Url', urlSchema);

    const virusTotalApiKey = '5eb00dd6d64abf153579378e048ddd7a006568e8888d0c8710c6e95babf8e035'; //api key for VirusTools

    app.post('/check_url', async (req, res) => { //function to check the url and get data from VirusTools API
        const urlToCheck = req.body.url;
    
        try {            
            const existingUrl = await Url.findOne({ url: urlToCheck }); // Check if the URL is already in the database
    
            if (existingUrl) { //if the url is already in database then show if it is Malicious or not
                return res.json({ status: `URL already checked <br>isMalicious?: ${existingUrl.isMalicious}`, result: existingUrl });
            }
    
            const apiUrl = `https://www.virustotal.com/vtapi/v2/url/report?apikey=${virusTotalApiKey}&resource=${urlToCheck}`;
            const response = await fetch(apiUrl); //fetching the data from the API
            const result = await response.json(); //converting the data in JSON format
    
            const newUrl = new Url({ //creating the new data entry in database
                url: urlToCheck,
                isMalicious: result.response_code === 0 ? true : false
            });
    
            await newUrl.save(); //saving the new data entry in database
    
            if (result.response_code === 0) {
                res.json({ status: 'potentially harmful', result: result });
            } else {
                res.json({ status: 'safe', result: result });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    const User = mongoose.model('User', { //declaring a schema for registring user
        username: String,
        email: String,
        password: String,
      });

app.post('/register', async (req, res) => { //register function
    try {
      const { username, password, email } = req.body; //getting data from html page
      const user = new User({ username, password, email }); //creating a new entry in database
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/login', async (req, res) => { //login function
    try {
      const { username, password } = req.body; //getting data from html page
      const user = await User.findOne({ username, password }); //finding the user in databse to login
      if (user) {
        req.session.user = user; //creating a session on login
        res.json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/logout', (req, res) => { //logout function
    req.session.destroy((err) => { //destroying session on logout function called
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).json({ message: 'Logout failed' });
        } else {
            res.json({ message: 'Logout successful' });
        }
    });
});

  app.get('/check-auth-status', (req, res) => { //checking auth statues
    const isAuthenticated = req.session.user;

    const isUser = req.session.user !== undefined;

    res.json({ isAuthenticated, isUser });
});

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
})
.catch(err => console.error('Error importing node-fetch:', err));