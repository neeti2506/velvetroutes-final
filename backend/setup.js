#!/usr/bin/env node

// Quick Setup Script for Velvet Routes
// This script helps set up the application quickly

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 Velvet Routes - Quick Setup Script');
console.log('=====================================\n');

// Check if Node.js is installed
try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Node.js version: ${nodeVersion}`);
} catch (error) {
    console.error('❌ Node.js is not installed. Please install Node.js first.');
    process.exit(1);
}

// Check if npm is installed
try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`✅ npm version: ${npmVersion}`);
} catch (error) {
    console.error('❌ npm is not installed. Please install npm first.');
    process.exit(1);
}

// Check if MongoDB is running
console.log('\n🔍 Checking MongoDB connection...');
try {
    execSync('mongosh --eval "db.runCommand({ping: 1})" --quiet', { encoding: 'utf8' });
    console.log('✅ MongoDB is running');
} catch (error) {
    console.log('⚠️  MongoDB is not running. Please start MongoDB first.');
    console.log('   Windows: net start MongoDB');
    console.log('   macOS/Linux: sudo systemctl start mongod');
}

// Check if .env file exists
console.log('\n🔍 Checking environment configuration...');
if (fs.existsSync('.env')) {
    console.log('✅ .env file exists');
} else {
    console.log('⚠️  .env file not found. Creating from template...');
    if (fs.existsSync('env.example')) {
        fs.copyFileSync('env.example', '.env');
        console.log('✅ .env file created from template');
        console.log('📝 Please edit .env file with your configuration');
    } else {
        console.log('❌ env.example file not found');
    }
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
} catch (error) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
}

// Check if server.js exists
console.log('\n🔍 Checking server files...');
if (fs.existsSync('server.js')) {
    console.log('✅ server.js exists');
} else {
    console.log('❌ server.js not found');
}

// Check if package.json exists
if (fs.existsSync('package.json')) {
    console.log('✅ package.json exists');
} else {
    console.log('❌ package.json not found');
}

console.log('\n🎉 Setup Complete!');
console.log('==================');
console.log('\nNext steps:');
console.log('1. Edit .env file with your configuration');
console.log('2. Start MongoDB (if not already running)');
console.log('3. Run: npm run server');
console.log('4. Open: http://localhost:3000');
console.log('\nFor detailed instructions, see: COMPLETE_SETUP_GUIDE.md');

// Generate a random JWT secret
console.log('\n🔐 Security Note:');
console.log('Make sure to set a strong JWT_SECRET in your .env file');
console.log('Here\'s a random secret you can use:');
console.log(require('crypto').randomBytes(64).toString('hex'));
