# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# ========== CRITICAL: React Native Core ==========
# Keep all React Native classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.uimanager.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.views.** { *; }
-keep class com.facebook.react.modules.** { *; }
-keep class com.facebook.react.common.** { *; }
-keep class com.facebook.react.devsupport.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep React Native method names
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# ========== CRITICAL: Hermes JS Engine ==========
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jsi.** { *; }

# ========== CRITICAL: React Native Reanimated ==========
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.reanimated.layoutReanimation.** { *; }
-keep class com.swmansion.common.** { *; }

# ========== CRITICAL: React Native Gesture Handler ==========
-keep class com.swmansion.gesturehandler.** { *; }
-keep class com.swmansion.gesturehandler.react.** { *; }

# ========== CRITICAL: React Native Safe Area Context ==========
-keep class com.th3rdwave.safeareacontext.** { *; }

# ========== CRITICAL: React Native Screens ==========
-keep class com.swmansion.rnscreens.** { *; }

# ========== CRITICAL: AsyncStorage ==========
-keep class com.reactnativecommunity.asyncstorage.** { *; }
-keepclassmembers class com.reactnativecommunity.asyncstorage.** { *; }

# ========== CRITICAL: Expo Modules ==========
-keep class expo.modules.** { *; }
-keep class expo.modules.core.** { *; }
-keep class expo.modules.kotlin.** { *; }
-keepclassmembers class * {
  @expo.modules.core.interfaces.ExpoProp *;
}

# Keep Expo Constants
-keep class expo.modules.constants.** { *; }

# Keep Expo Font
-keep class expo.modules.font.** { *; }

# Keep Expo Splash Screen
-keep class expo.modules.splashscreen.** { *; }

# Keep Expo Router
-keep class expo.modules.router.** { *; }

# ========== Google Mobile Ads ==========
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.android.gms.common.** { *; }

# ========== Fresco (Image Loading) ==========
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip
-keep @com.facebook.common.internal.DoNotStrip class *
-keepclassmembers class * {
  @com.facebook.common.internal.DoNotStrip *;
}

-keep class com.facebook.imagepipeline.** { *; }
-keep class com.facebook.drawee.** { *; }

# ========== OkHttp & Networking ==========
-keep class okhttp3.** { *; }
-keep class okio.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**

# ========== Annotations ==========
-dontwarn javax.annotation.**
-dontwarn org.checkerframework.**
-dontwarn com.google.errorprone.**

# ========== Preserve Source File Names & Line Numbers ==========
# This helps with crash reports by keeping stack traces readable
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ========== Keep Native Methods ==========
-keepclasseswithmembernames class * {
    native <methods>;
}

# ========== Keep Enums ==========
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# ========== Keep Parcelables ==========
-keepclassmembers class * implements android.os.Parcelable {
    public static final ** CREATOR;
}

# ========== Keep Serializable ==========
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# ========== Don't Warn About Missing Classes ==========
-dontwarn com.google.devtools.build.android.**
-dontwarn com.squareup.okhttp.**
-dontwarn javax.lang.model.**
-dontwarn org.conscrypt.**

# Add any project specific keep options here:
