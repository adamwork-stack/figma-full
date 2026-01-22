# App Store Submission Guide - Detailed Steps

## Overview

Complete guide for submitting Fastivalle to iOS App Store and Google Play Store.

## Part 1: iOS App Store Submission

### Step 1: Apple Developer Account Setup

#### 1.1 Enroll in Apple Developer Program

1. Go to https://developer.apple.com/programs/
2. Click "Enroll"
3. Sign in with Apple ID
4. Complete enrollment ($99/year)
5. Wait for approval (usually instant, can take up to 48 hours)

#### 1.2 Access App Store Connect

1. Go to https://appstoreconnect.apple.com/
2. Sign in with your Apple Developer account
3. Accept terms and conditions

### Step 2: Create App in App Store Connect

#### 2.1 Create New App

1. Click "My Apps" → "+" → "New App"
2. Fill in:
   - **Platform**: iOS
   - **Name**: Fastivalle (30 characters max)
   - **Primary Language**: English
   - **Bundle ID**: Select or create `com.fastivalle.app`
   - **SKU**: fastivalle-ios-001 (unique identifier)
   - **User Access**: Full Access

#### 2.2 Configure App Information

1. **App Information Tab**:
   - Category: Primary: Entertainment, Secondary: Events
   - Content Rights: You have rights to use all content

2. **Pricing and Availability**:
   - Price: Free
   - Availability: All countries (or select specific)

### Step 3: Prepare App Assets

#### 3.1 App Icon

**Requirements:**
- Size: 1024x1024px
- Format: PNG or JPEG
- No transparency
- No rounded corners (Apple adds them)
- No alpha channel

**Create App Icon:**

```bash
# Use design tool (Figma, Photoshop, etc.)
# Export as 1024x1024px PNG
# Save as: mobile/ios/AppIcon.png
```

#### 3.2 Screenshots

**Required Sizes:**

1. **iPhone 6.7" Display (iPhone 14 Pro Max)**
   - Size: 1290 x 2796 pixels
   - Required: At least 3 screenshots

2. **iPhone 6.5" Display (iPhone 11 Pro Max)**
   - Size: 1242 x 2688 pixels
   - Required: At least 3 screenshots

3. **iPhone 5.5" Display (iPhone 8 Plus)**
   - Size: 1242 x 2208 pixels
   - Optional but recommended

**How to Create Screenshots:**

1. **Using Simulator:**
   ```bash
   # Run app in simulator
   npm run ios
   
   # Take screenshots:
   # - Login screen
   # - Event list
   # - Event detail
   # - Ticket list
   # - Profile screen
   ```

2. **Using Design Tool:**
   - Create mockups in Figma
   - Export at required sizes
   - Ensure high quality

#### 3.3 App Preview Video (Optional)

- Duration: 15-30 seconds
- Format: MP4 or MOV
- Show key features
- No sound or with sound

### Step 4: Configure App Store Listing

#### 4.1 App Description

**Name:** Fastivalle (30 characters)

**Subtitle:** Discover amazing events (30 characters)

**Description:**
```
Fastivalle is your ultimate event discovery and ticket purchasing platform. Browse through thousands of events, from concerts and festivals to conferences and workshops.

KEY FEATURES:
• Discover events near you
• Easy ticket purchasing with secure payments
• Digital ticket management with QR codes
• Event reminders and notifications
• Save your favorite events
• Share events with friends

SECURE & RELIABLE:
• Secure payment processing via Stripe
• Your data is protected
• Easy ticket access with QR codes

Download Fastivalle today and never miss an amazing event!
```

**Keywords:** events,tickets,festival,concert,booking,discovery (100 characters max, comma-separated)

**Promotional Text:** Can be updated without app review (170 characters)

#### 4.2 Support URL

Create support page or use:
- URL: https://fastivalle.com/support
- Must be accessible without login

#### 4.3 Marketing URL (Optional)

- URL: https://fastivalle.com

#### 4.4 Privacy Policy URL

- URL: https://fastivalle.com/privacy-policy
- Must be publicly accessible
- See PRIVACY_POLICY.md for content

### Step 5: App Privacy Details

#### 5.1 Data Collection Disclosure

Answer questions about data collection:

1. **Do you collect data?** Yes
2. **Data types collected:**
   - Name
   - Email Address
   - Phone Number (optional)
   - User ID
   - Purchase History
   - Location (if used)
   - Device ID
   - Usage Data

3. **How data is used:**
   - App Functionality
   - Analytics
   - Product Personalization
   - Advertising (if applicable)

4. **Data linked to user:** Yes
5. **Data used for tracking:** No (unless you use analytics)

### Step 6: Age Rating

Complete questionnaire:

1. **Unrestricted Web Access:** No
2. **Cartoons or Fantasy Violence:** No
3. **Realistic Violence:** No
4. **Profanity or Crude Humor:** No
5. **Sexual Content or Nudity:** No
6. **Alcohol, Tobacco, or Drugs:** No
7. **Gambling:** No
8. **Contests:** No
9. **Horror/Fear Themes:** No
10. **Mature/Suggestive Themes:** No

**Result:** 4+ (Everyone)

### Step 7: Build and Archive App

#### 7.1 Configure Xcode Project

1. Open `mobile/ios/Fastivalle.xcworkspace` in Xcode
2. Select project → General tab:
   - **Display Name**: Fastivalle
   - **Bundle Identifier**: com.fastivalle.app
   - **Version**: 1.0.0
   - **Build**: 1

3. **Signing & Capabilities**:
   - Select your Team
   - Enable "Automatically manage signing"
   - Xcode will create provisioning profile

#### 7.2 Archive App

1. **Select "Any iOS Device"** as destination
2. **Product → Archive**
3. Wait for archive to complete
4. **Organizer** window will open

#### 7.3 Validate Archive

1. In Organizer, select your archive
2. Click **"Validate App"**
3. Follow validation steps
4. Fix any issues found

#### 7.4 Distribute App

1. Click **"Distribute App"**
2. Select **"App Store Connect"**
3. Select **"Upload"**
4. Choose distribution options
5. Click **"Upload"**
6. Wait for upload to complete

### Step 8: Submit for Review

#### 8.1 Add Build to App Store Connect

1. Go to App Store Connect
2. Select your app
3. Go to **"TestFlight"** tab (build appears here first)
4. Wait for processing (can take 10-30 minutes)
5. Build will appear in **"iOS App"** tab

#### 8.2 Select Build

1. Go to **"iOS App"** tab
2. Under **"Build"** section, click **"+ Build"**
3. Select your uploaded build
4. Click **"Done"**

#### 8.3 Complete App Information

Ensure all required fields are filled:
- [x] Screenshots uploaded
- [x] Description complete
- [x] Privacy Policy URL set
- [x] Support URL set
- [x] Age rating complete
- [x] App Privacy details complete
- [x] Build selected

#### 8.4 Submit for Review

1. Click **"Submit for Review"** button
2. Answer export compliance questions:
   - **Does your app use encryption?** Yes (HTTPS)
   - **Does your app use exempt encryption?** Yes
   - **Does your app use, contain, or incorporate cryptography?** Yes
   - **Is your app exempt?** Yes (standard HTTPS)

3. Click **"Submit"**

### Step 9: Review Process

#### Timeline

- **Initial Review**: 24-48 hours
- **If Rejected**: Fix issues and resubmit
- **If Approved**: App goes live immediately (or scheduled)

#### Common Rejection Reasons

1. **Missing Privacy Policy**
   - Solution: Add privacy policy URL

2. **App Crashes**
   - Solution: Test thoroughly, fix crashes

3. **Incomplete Information**
   - Solution: Complete all required fields

4. **Guideline Violations**
   - Solution: Review App Store Guidelines

### Step 10: Post-Submission

#### Monitor Status

1. Check App Store Connect regularly
2. Respond to review feedback promptly
3. Fix any issues quickly

#### After Approval

1. App goes live automatically
2. Monitor for crashes/errors
3. Gather user feedback
4. Plan updates

## Part 2: Google Play Store Submission

### Step 1: Google Play Developer Account

#### 1.1 Create Account

1. Go to https://play.google.com/console
2. Sign in with Google account
3. Pay one-time $25 registration fee
4. Complete account setup

### Step 2: Create App in Play Console

#### 2.1 Create New App

1. Click **"Create app"**
2. Fill in:
   - **App name**: Fastivalle
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free
   - **Declarations**: Check all applicable boxes

3. Click **"Create app"**

### Step 3: Prepare App Assets

#### 3.1 App Icon

- Size: 512 x 512 pixels
- Format: PNG (32-bit with alpha)
- File size: Max 1 MB

#### 3.2 Feature Graphic

- Size: 1024 x 500 pixels
- Format: PNG or JPG
- No text (or minimal text)
- Displayed at top of store listing

#### 3.3 Screenshots

**Phone Screenshots:**
- Minimum: 2 screenshots
- Maximum: 8 screenshots
- Aspect ratio: 16:9 or 9:16
- Minimum width: 320px
- Maximum width: 3840px

**Tablet Screenshots (Optional):**
- Minimum: 2 screenshots
- Maximum: 8 screenshots
- 7" or 10" tablets

**Create Screenshots:**

```bash
# Using Android Emulator
npm run android

# Take screenshots of:
# - Login screen
# - Event list
# - Event detail
# - Ticket list
# - Profile screen
```

### Step 4: Complete Store Listing

#### 4.1 App Details

**Short description** (80 characters):
```
Discover and attend amazing events. Buy tickets and manage your events.
```

**Full description** (4000 characters):
```
Fastivalle is your ultimate event discovery and ticket purchasing platform. Browse through thousands of events, from concerts and festivals to conferences and workshops.

KEY FEATURES:
• Discover events near you
• Easy ticket purchasing with secure payments
• Digital ticket management with QR codes
• Event reminders and notifications
• Save your favorite events
• Share events with friends

SECURE & RELIABLE:
• Secure payment processing via Stripe
• Your data is protected
• Easy ticket access with QR codes

Download Fastivalle today and never miss an amazing event!

Whether you're looking for music concerts, sports events, conferences, or local happenings, Fastivalle makes it easy to discover and attend the events you love.
```

**App icon**: Upload 512x512px icon

**Feature graphic**: Upload 1024x500px graphic

**Screenshots**: Upload required screenshots

**Phone screenshots**: Upload 2-8 screenshots

#### 4.2 Privacy Policy

- **Privacy Policy URL**: https://fastivalle.com/privacy-policy
- Must be publicly accessible
- Must not require login

### Step 5: Content Rating

#### 5.1 Complete Questionnaire

1. Go to **"Content rating"**
2. Answer questions:
   - **Does your app access the internet?** Yes
   - **Does your app access location?** Yes (if applicable)
   - **Does your app access contacts?** No
   - **Does your app access photos/media?** Yes (for avatars)
   - **Does your app access camera?** No (unless QR scanning)
   - **Does your app contain user-generated content?** No
   - **Does your app contain violence?** No
   - **Does your app contain sexual content?** No
   - **Does your app contain profanity?** No
   - **Does your app contain alcohol/drugs?** No
   - **Does your app contain gambling?** No

3. Submit questionnaire
4. Receive rating (usually "Everyone")

### Step 6: Set Up App Access

#### 6.1 App Access

- **Is your app free?** Yes
- **Does your app require a login?** Yes (for full features)
- **Can users access your app without login?** No (or Yes if you allow browsing)

### Step 7: Build and Upload App

#### 7.1 Generate Signed Bundle

**Create Keystore:**

```bash
cd mobile/android/app

# Generate keystore
keytool -genkeypair -v -storetype PKCS12 -keystore fastivalle-release.keystore -alias fastivalle-key -keyalg RSA -keysize 2048 -validity 10000

# Enter information:
# Password: [Create strong password]
# Name: Fastivalle
# Organizational Unit: Development
# Organization: Your Company
# City: Your City
# State: Your State
# Country: US
```

**Configure Gradle:**

Edit `mobile/android/gradle.properties`:

```properties
FASTIVALLE_RELEASE_STORE_FILE=fastivalle-release.keystore
FASTIVALLE_RELEASE_KEY_ALIAS=fastivalle-key
FASTIVALLE_RELEASE_STORE_PASSWORD=your-keystore-password
FASTIVALLE_RELEASE_KEY_PASSWORD=your-key-password
```

Edit `mobile/android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            if (project.hasProperty('FASTIVALLE_RELEASE_STORE_FILE')) {
                storeFile file(FASTIVALLE_RELEASE_STORE_FILE)
                storePassword FASTIVALLE_RELEASE_STORE_PASSWORD
                keyAlias FASTIVALLE_RELEASE_KEY_ALIAS
                keyPassword FASTIVALLE_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

#### 7.2 Build App Bundle

```bash
cd mobile/android

# Build release bundle
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

#### 7.3 Upload to Play Console

1. Go to Play Console → Your App → **"Production"** (or **"Testing"**)
2. Click **"Create new release"**
3. Upload **app-release.aab** file
4. Add **Release notes**:
   ```
   Initial release of Fastivalle
   - Event discovery and browsing
   - Secure ticket purchasing
   - Digital ticket management
   - User profiles and settings
   ```
5. Click **"Save"**

### Step 8: Complete Store Listing

Ensure all required sections are complete:

- [x] App details
- [x] Graphics (icon, feature graphic, screenshots)
- [x] Categorization
- [x] Content rating
- [x] Privacy policy
- [x] Target audience
- [x] Store listing contact details

### Step 9: Submit for Review

#### 9.1 Review Checklist

Before submitting:

- [x] App bundle uploaded
- [x] All store listing fields complete
- [x] Privacy policy accessible
- [x] Content rating complete
- [x] App tested on multiple devices
- [x] No crashes or critical bugs

#### 9.2 Submit

1. Go to **"Production"** tab
2. Click **"Review release"**
3. Review all information
4. Click **"Start rollout to Production"**
5. Confirm submission

### Step 10: Review Process

#### Timeline

- **Initial Review**: 1-3 days typically
- **If Rejected**: Fix issues and resubmit
- **If Approved**: App goes live

#### Common Rejection Reasons

1. **Privacy Policy Issues**
   - Solution: Ensure policy is accessible and complete

2. **Content Rating Issues**
   - Solution: Complete questionnaire accurately

3. **App Crashes**
   - Solution: Test thoroughly before submission

4. **Policy Violations**
   - Solution: Review Google Play Policies

## Part 3: Post-Submission

### Monitor Submissions

#### iOS App Store

1. Check App Store Connect daily
2. Respond to review feedback within 24 hours
3. Monitor TestFlight beta feedback

#### Google Play Store

1. Check Play Console regularly
2. Monitor pre-launch report
3. Address any warnings

### After Approval

#### Both Platforms

1. **Monitor Analytics**
   - Track downloads
   - Monitor crashes
   - Review user ratings

2. **Gather Feedback**
   - Read user reviews
   - Monitor support requests
   - Track feature requests

3. **Plan Updates**
   - Fix bugs quickly
   - Add requested features
   - Improve based on feedback

### Update Process

#### iOS Updates

1. Make changes
2. Update version/build number
3. Archive and upload
4. Submit update for review

#### Android Updates

1. Make changes
2. Update version code/name
3. Build new bundle
4. Upload to Play Console
5. Submit update

## Checklist Summary

### iOS App Store

- [ ] Apple Developer account created
- [ ] App created in App Store Connect
- [ ] App icon (1024x1024) created
- [ ] Screenshots for required sizes
- [ ] App description written
- [ ] Privacy policy published
- [ ] Age rating completed
- [ ] App Privacy details completed
- [ ] App archived and uploaded
- [ ] Build selected
- [ ] Submitted for review

### Google Play Store

- [ ] Google Play Developer account created
- [ ] App created in Play Console
- [ ] App icon (512x512) created
- [ ] Feature graphic (1024x500) created
- [ ] Screenshots uploaded
- [ ] App description written
- [ ] Privacy policy published
- [ ] Content rating completed
- [ ] Keystore created
- [ ] App bundle built and uploaded
- [ ] Store listing completed
- [ ] Submitted for review

## Resources

- [Apple App Store Connect](https://appstoreconnect.apple.com/)
- [Google Play Console](https://play.google.com/console)
- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Developer Policy](https://play.google.com/about/developer-content-policy/)

## Support

If you encounter issues:
- iOS: Contact Apple Developer Support
- Android: Contact Google Play Developer Support
- Review rejection: Address feedback and resubmit

Good luck with your app store submissions!
