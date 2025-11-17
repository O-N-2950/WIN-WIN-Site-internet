import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { getUserByOpenId, upsertUser } from '../db';

// Configuration OAuth Google
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL || 'http://localhost:3000'}/api/auth/google/callback`,
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const openId = `google_${profile.id}`;
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName;

          await upsertUser({
            openId,
            email: email || null,
            name: name || null,
            loginMethod: 'google',
            lastSignedIn: new Date(),
          });

          const user = await getUserByOpenId(openId);
          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

// Configuration OAuth GitHub
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL || 'http://localhost:3000'}/api/auth/github/callback`,
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const openId = `github_${profile.id}`;
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName || profile.username;

          await upsertUser({
            openId,
            email: email || null,
            name: name || null,
            loginMethod: 'github',
            lastSignedIn: new Date(),
          });

          const user = await getUserByOpenId(openId);
          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

// Sérialisation utilisateur
passport.serializeUser((user: any, done: any) => {
  done(null, user.openId);
});

passport.deserializeUser(async (openId: string, done: any) => {
  try {
    const user = await getUserByOpenId(openId);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
