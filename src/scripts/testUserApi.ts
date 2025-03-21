import { API_CONFIG } from '../config/api.config';

const testUserApi = async (auth0Id: string) => {
  try {
    console.log('Testing user API...');
    
    // Test direct auth0Id endpoint
    const auth0Response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}/test/${auth0Id}`
    );
    
    console.log('\nAuth0 ID Test:');
    console.log('Status:', auth0Response.status);
    
    const auth0Data = await auth0Response.json();
    console.log('Response:', auth0Data);

    // Test health endpoint
    const healthResponse = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`
    );
    
    console.log('\nHealth Check:');
    console.log('Status:', healthResponse.status);
    
    const healthData = await healthResponse.json();
    console.log('Response:', healthData);

  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Get auth0Id from command line argument
const auth0Id = process.argv[2];

if (!auth0Id) {
  console.error('Please provide an auth0Id as an argument');
  process.exit(1);
}

testUserApi(auth0Id);