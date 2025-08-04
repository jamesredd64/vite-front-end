exports.onExecutePostLogin = async (event, api) => {
    // Only run this logic if user is verified
    if (!event.user.email_verified) return;
  
    // Get Auth0 Management API token
    const res = await fetch(`https://${event.secrets.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: event.secrets.MGMT_API_CLIENT_ID,
        client_secret: event.secrets.MGMT_API_CLIENT_SECRET,
        audience: `https://${event.secrets.AUTH0_DOMAIN}/api/v2/`,
        grant_type: 'client_credentials'
      })
    });
  
    const { access_token } = await res.json();
  
    // Get roles for the user
    const rolesRes = await fetch(`https://${event.secrets.AUTH0_DOMAIN}/api/v2/users/${event.user.user_id}/roles`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
  
    const roles = await rolesRes.json();
  
    // Add roles to ID token
    const roleNames = roles.map(role => role.name);
    api.idToken.setCustomClaim('https://yourdomain.com/roles', roleNames);
  };
  