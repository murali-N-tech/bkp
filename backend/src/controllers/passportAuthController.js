// backend/src/controllers/authController.js

/**
 * Google OAuth callback
 * This is triggered after successful Google authentication
 */
export const googleCallback = (req, res) => {
  try {
    const user = req.user || {};

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      avatar:
        user.avatar ||
        user.photos?.[0]?.value ||
        user._json?.picture ||
        null,
    };

    const frontendOrigin =
      process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

    /**
     * Sends an HTML page that:
     * 1. Posts auth data to opener window (React app)
     * 2. Closes the popup automatically
     */
    return res.send(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Authentication Successful</title>
          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: #f8fafc;
            }
            .card {
              background: white;
              padding: 24px 32px;
              border-radius: 12px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              text-align: center;
            }
            button {
              margin-top: 12px;
              padding: 8px 16px;
              border-radius: 8px;
              border: none;
              background: #2563eb;
              color: white;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Login successful 🎉</h2>
            <p>You can close this window.</p>
            <button id="closeBtn">Close</button>
          </div>

          <script>
            (function () {
              try {
                const payload = ${JSON.stringify(payload)};
                const target = '*'; // tighten in production

                if (window.opener && !window.opener.closed) {
                  window.opener.postMessage(
                    { type: 'oauth', user: payload },
                    target
                  );
                }
              } catch (e) {
                console.error('OAuth postMessage error:', e);
              }

              document
                .getElementById('closeBtn')
                .addEventListener('click', function () {
                  window.close();
                });

              setTimeout(() => {
                try {
                  window.close();
                } catch (e) {}
              }, 2000);
            })();
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Google callback error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Authentication failed',
    });
  }
};

/**
 * Local login / successful authentication response
 * Used for email-password login or session-based auth
 */
export const loginSuccess = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized',
      });
    }

    const { _id, email, name, role } = req.user;

    return res.status(200).json({
      status: 'success',
      data: {
        id: _id,
        email,
        name,
        role, // "user" | "admin" | "teacher"
      },
    });
  } catch (err) {
    console.error('Login success error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Login failed',
    });
  }
};

/**
 * Logout handler
 * Clears session + Passport state
 */
export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session?.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
      });
    });
  });
};
