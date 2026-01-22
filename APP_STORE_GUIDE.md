# App Store Preparation Guide

## Overview

This guide covers the process of preparing and submitting the Fastivalle mobile application to the iOS App Store and Google Play Store.

## Prerequisites

### iOS App Store

1. **Apple Developer Account**
   - Enroll in Apple Developer Program ($99/year)
   - Access: https://developer.apple.com/programs/

2. **Required Information**
   - App name: Fastivalle
   - Bundle ID: com.fastivalle.app
   - App category: Events / Entertainment
   - Age rating: 4+ (or appropriate rating)

### Google Play Store

1. **Google Play Developer Account**
   - One-time registration fee ($25)
   - Access: https://play.google.com/console

2. **Required Information**
   - App name: Fastivalle
   - Package name: com.fastivalle.app
   - App category: Events
   - Content rating: Everyone (or appropriate rating)

## App Store Assets

### iOS App Store

1. **App Icon**
   - 1024x1024px PNG
   - No transparency
   - No rounded corners (Apple adds them)

2. **Screenshots**
   - iPhone 6.7" (iPhone 14 Pro Max): 1290x2796px
   - iPhone 6.5" (iPhone 11 Pro Max): 1242x2688px
   - iPhone 5.5" (iPhone 8 Plus): 1242x2208px
   - iPad Pro 12.9": 2048x2732px
   - Minimum 3 screenshots required

3. **App Preview Videos** (Optional)
   - 15-30 seconds
   - Show key features
   - MP4 or MOV format

4. **App Description**
   - Name: Fastivalle (30 characters max)
   - Subtitle: Discover and attend amazing events (30 characters max)
   - Description: Full app description (up to 4000 characters)
   - Keywords: Comma-separated keywords (100 characters max)
   - Promotional text: Can be updated without app review (170 characters max)

5. **Privacy Information**
   - Privacy Policy URL (required)
   - Data collection disclosure
   - App Privacy details

### Google Play Store

1. **App Icon**
   - 512x512px PNG
   - High-resolution icon

2. **Feature Graphic**
   - 1024x500px PNG
   - Displayed at top of store listing

3. **Screenshots**
   - Phone: Minimum 2, maximum 8
   - Tablet: Minimum 2, maximum 8
   - 16:9 or 9:16 aspect ratio
   - Minimum width: 320px
   - Maximum width: 3840px

4. **App Description**
   - Short description: 80 characters max
   - Full description: 4000 characters max
   - What's new: 500 characters max

5. **Privacy Policy**
   - Privacy Policy URL (required)
   - Must be accessible without authentication

## App Store Listing Content

### App Description Template

**Short Description:**
Discover and attend amazing events. Buy tickets, manage your events, and never miss out.

**Full Description:**
Fastivalle is your ultimate event discovery and ticket purchasing platform. Browse through thousands of events, from concerts and festivals to conferences and workshops.

Features:
- Discover events near you
- Easy ticket purchasing
- Digital ticket management
- Event reminders
- Secure payment processing
- QR code tickets

Download Fastivalle today and start exploring amazing events!

### Keywords (iOS)

events, tickets, festival, concert, booking, tickets app, event discovery

## Privacy Policy

A privacy policy is required for both app stores. It should cover:

1. **Data Collection**
   - What data is collected
   - How data is used
   - Data sharing practices

2. **User Rights**
   - Right to access data
   - Right to delete data
   - Right to opt-out

3. **Security**
   - How data is protected
   - Security measures

4. **Third-Party Services**
   - Stripe (payments)
   - Firebase (notifications)
   - Analytics services

## App Store Submission Checklist

### iOS App Store

- [ ] App icon (1024x1024px)
- [ ] Screenshots for required device sizes
- [ ] App description and keywords
- [ ] Privacy Policy URL
- [ ] App Privacy details completed
- [ ] Age rating questionnaire completed
- [ ] Pricing and availability set
- [ ] App Review Information completed
- [ ] Version information
- [ ] Build uploaded via Xcode or Transporter
- [ ] App submitted for review

### Google Play Store

- [ ] App icon (512x512px)
- [ ] Feature graphic (1024x500px)
- [ ] Screenshots (minimum 2)
- [ ] App description (short and full)
- [ ] Privacy Policy URL
- [ ] Content rating questionnaire
- [ ] App bundle (AAB) uploaded
- [ ] Store listing completed
- [ ] App submitted for review

## Build Configuration

### iOS Build

1. **Update app.json/app.config.js**
   ```json
   {
     "name": "Fastivalle",
     "displayName": "Fastivalle",
     "bundleIdentifier": "com.fastivalle.app",
     "version": "1.0.0",
     "buildNumber": "1"
   }
   ```

2. **Configure in Xcode**
   - Set Bundle Identifier
   - Configure Signing & Capabilities
   - Set Version and Build numbers

3. **Archive and Upload**
   - Product → Archive
   - Distribute App
   - Upload to App Store Connect

### Android Build

1. **Update android/app/build.gradle**
   ```gradle
   android {
     defaultConfig {
       applicationId "com.fastivalle.app"
       versionCode 1
       versionName "1.0.0"
     }
   }
   ```

2. **Generate Signed Bundle**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

3. **Upload to Google Play Console**
   - Create new release
   - Upload AAB file
   - Complete release notes

## App Review Guidelines

### iOS App Review

- Follow Apple's App Store Review Guidelines
- Test on real devices
- Ensure all features work correctly
- Provide test account if needed
- Respond to review feedback promptly

### Google Play Review

- Follow Google Play Developer Policy
- Test on multiple Android devices
- Ensure app works on different screen sizes
- Complete content rating questionnaire
- Respond to review feedback promptly

## Post-Submission

### Monitoring

- Monitor app review status
- Respond to review feedback
- Address any rejection reasons
- Update app if needed

### Launch Preparation

- Prepare marketing materials
- Plan launch announcement
- Set up analytics tracking
- Monitor initial user feedback

## Resources

- [Apple App Store Connect](https://appstoreconnect.apple.com/)
- [Google Play Console](https://play.google.com/console)
- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Developer Policy](https://play.google.com/about/developer-content-policy/)
