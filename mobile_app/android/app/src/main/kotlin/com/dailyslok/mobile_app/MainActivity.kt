package com.dailyslok.mobile_app

import android.app.WallpaperManager
import android.graphics.BitmapFactory
import android.os.Build
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import java.io.ByteArrayInputStream
import java.util.concurrent.Executors

class MainActivity : FlutterActivity() {
    private val CHANNEL = "com.dailyslok.sutra/wallpaper"
    private val executor = Executors.newSingleThreadExecutor()

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler { call, result ->
            if (call.method == "setWallpaper") {
                val imageBytes = call.argument<ByteArray>("imageBytes")
                val location = call.argument<String>("location") ?: "lock"

                if (imageBytes == null || imageBytes.isEmpty()) {
                    result.error("INVALID_ARGUMENT", "Image bytes cannot be null or empty", null)
                    return@setMethodCallHandler
                }

                executor.execute {
                    try {
                        val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
                        if (bitmap == null) {
                            runOnUiThread {
                                result.error("DECODE_ERROR", "Failed to decode image bytes into bitmap", null)
                            }
                            return@execute
                        }

                        val wallpaperManager = WallpaperManager.getInstance(applicationContext)

                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                            val flag = when (location) {
                                "home" -> WallpaperManager.FLAG_SYSTEM
                                "both" -> WallpaperManager.FLAG_SYSTEM or WallpaperManager.FLAG_LOCK
                                else -> WallpaperManager.FLAG_LOCK
                            }
                            wallpaperManager.setBitmap(bitmap, null, true, flag)
                        } else {
                            wallpaperManager.setBitmap(bitmap)
                        }

                        runOnUiThread {
                            result.success(true)
                        }
                    } catch (e: Exception) {
                        runOnUiThread {
                            result.error("WALLPAPER_FAILED", e.localizedMessage, e.toString())
                        }
                    }
                }
            } else {
                result.notImplemented()
            }
        }
    }
}
