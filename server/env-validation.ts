/**
 * Environment validation - ensures all required variables are present at startup
 */

const requiredEnvVars = [
  'OPENROUTER_API_KEY',
  'HF_API_KEY', 
  'HF_MODEL',
  'PUTER_API_KEY',
  'PUTER_SCRIPT_URL',
  'OR_MODEL_FALLBACKS',
  'FLAMINGO_SIGNATURE'
];

export function validateEnvironment(): void {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    console.error('❌ Environment validation failed!');
    console.error('Missing required environment variables:');
    missing.forEach(envVar => {
      console.error(`  - ${envVar}`);
    });
    console.error('\nPlease check your .env file and ensure all required variables are set.');
    console.error('Refer to .env.example for the complete list of required variables.');
    process.exit(1);
  }
  
  if (missing.length > 0) {
    console.warn('⚠️  Missing environment variables (development mode):');
    missing.forEach(envVar => {
      console.warn(`  - ${envVar}`);
      // Set placeholder values for development
      process.env[envVar] = 'placeholder-' + envVar.toLowerCase();
    });
    console.warn('Using placeholder values. Set real values before deployment.');
  }
  
  console.log('✅ Environment validation completed');
}