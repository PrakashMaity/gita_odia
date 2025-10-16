#!/bin/bash

# Production Build Script for Gita Odia App
# This script builds a production-ready APK/AAB for upload to Play Store

set -e  # Exit on error

echo "🔥 Building Gita Odia - Production Build"
echo "========================================"
echo ""

# Get language argument (default to 'or' for Odia)
LANG=${1:-or}

echo "📱 Building for language: $LANG"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo -e "${RED}❌ EAS CLI not found${NC}"
    echo "Installing EAS CLI..."
    npm install -g eas-cli
fi

# Check if logged into EAS
echo "Checking EAS authentication..."
if ! eas whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged into EAS${NC}"
    echo "Please login:"
    eas login
fi

echo ""
echo -e "${GREEN}✅ Prerequisites checked${NC}"
echo ""

# Ask user what type of build
echo "Select build type:"
echo "  1) AAB (for Play Store - Recommended)"
echo "  2) APK (for testing/distribution)"
echo ""
read -p "Enter choice [1]: " BUILD_TYPE
BUILD_TYPE=${BUILD_TYPE:-1}

if [ "$BUILD_TYPE" = "1" ]; then
    BUILD_PROFILE="production"
    echo -e "${GREEN}Building AAB for Play Store...${NC}"
elif [ "$BUILD_TYPE" = "2" ]; then
    BUILD_PROFILE="production-apk"
    echo -e "${GREEN}Building APK...${NC}"
else
    echo -e "${RED}Invalid choice${NC}"
    exit 1
fi

echo ""
echo "🔨 Starting build with EAS..."
echo "Language: $LANG"
echo "Profile: $BUILD_PROFILE"
echo ""

# Run the build
APP_LANG=$LANG eas build --platform android --profile production

echo ""
echo -e "${GREEN}✅ Build submitted successfully!${NC}"
echo ""
echo "📝 Next steps:"
echo "  1. Wait for build to complete (check: eas build:list)"
echo "  2. Download the build (check EAS dashboard)"
echo "  3. Test on a physical device"
echo "  4. Upload to Play Store"
echo ""
echo "💡 Tips:"
echo "  - Test the build thoroughly before uploading"
echo "  - Check crash-free rate in Play Console after release"
echo "  - Monitor user feedback for first 24 hours"
echo ""

