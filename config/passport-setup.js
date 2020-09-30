const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const pool = require('../database/db');

passport.serializeUser((user, done) => {
  console.log('serializeUser ', user);
  done(null, user.user_id);
});

// cookie back from browser
passport.deserializeUser(async (user_id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [
      user_id,
    ]);

    const user = result.rows[0];
    console.log('deserializeUser ', user);

    done(null, user); // to the next stage
  } catch (err) {
    console.error(err.message);
  }
});

passport.use(
  new GoogleStrategy(
    {
      // options for the google strategy, clientId, clientSecret
      callbackURL: '/auth/google/redirct',
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
    },
    async (accessToken, refreshToken, profile, done) => {
      // passport callback function, got call sometime durally login
      // accessToken will expire some time
      console.log(profile);
      console.log('passport callback function fired');

      try {
        // 1. destructure the profile
        const { id, displayName } = profile;
        const picture = profile._json.picture;

        // 2. check if user exist, if not then we create one
        let result = await pool.query(
          'SELECT * FROM users WHERE google_id = $1',
          [id]
        );

        console.error('inserted ' + displayName);
        if (result.rows.length === 0) {
          // enter the new user inside our database
          result = await pool.query(
            `INSERT INTO users (google_id, user_name, thumbnail)
              VALUES ($1, $2, $3) RETURNING *`,
            [id, displayName, picture]
          );
        }

        const user = result.rows[0];

        done(null, user);
      } catch (err) {
        console.error(err.message);
      }
    }
  )
);

// OAuth (Passport.js) Tutorial #14 - Progress Refresh -- how it works
// https://www.youtube.com/watch?v=RGJFAfvhQZg&list=PL4cUxeGkcC9jdm7QX143aMLAqyM-jTZ2x&index=14
