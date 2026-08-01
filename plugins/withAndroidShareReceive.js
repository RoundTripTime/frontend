const fs = require('fs');
const path = require('path');

const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');

const PACKAGE_DIR = path.join('app', 'src', 'main', 'java', 'com', 'roundtriptime', 'roundtrip');

const SHARE_RECEIVE_ACTIVITY = `package com.roundtriptime.roundtrip

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.util.regex.Pattern

class ShareReceiveActivity : Activity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    val sharedUrl = readSharedUrl(intent)
    if (sharedUrl.isNullOrBlank()) {
      showToastAndFinish("URL을 찾지 못했어요")
      return
    }

    Thread {
      val resultMessage = submitSharedUrl(sharedUrl)
      runOnUiThread {
        showToastAndFinish(resultMessage)
      }
    }.start()
  }

  private fun readSharedUrl(intent: Intent?): String? {
    if (intent?.action != Intent.ACTION_SEND || intent.type != "text/plain") {
      return null
    }

    val sharedText = intent.getStringExtra(Intent.EXTRA_TEXT).orEmpty()
    val matcher = URL_PATTERN.matcher(sharedText)
    return if (matcher.find()) matcher.group() else null
  }

  private fun submitSharedUrl(sharedUrl: String): String {
    val accessToken = NativeSecureStoreReader(this).getItem(ACCESS_TOKEN_KEY)
      ?: return TOKEN_EXPIRED_MESSAGE

    return runCatching {
      val connection = (URL("$API_BASE_URL/source-links").openConnection() as HttpURLConnection)
      connection.requestMethod = "POST"
      connection.connectTimeout = API_TIMEOUT_MS
      connection.readTimeout = API_TIMEOUT_MS
      connection.doOutput = true
      connection.setRequestProperty("Accept", "application/json")
      connection.setRequestProperty("Content-Type", "application/json")
      connection.setRequestProperty("Authorization", "Bearer $accessToken")

      OutputStreamWriter(connection.outputStream, Charsets.UTF_8).use { writer ->
        writer.write(JSONObject().put("url", sharedUrl).toString())
      }

      when (connection.responseCode) {
        in 200..299 -> SUBMITTED_MESSAGE
        HttpURLConnection.HTTP_UNAUTHORIZED, HttpURLConnection.HTTP_FORBIDDEN -> TOKEN_EXPIRED_MESSAGE
        HttpURLConnection.HTTP_CONFLICT -> {
          val errorCode = readErrorCode(connection)
          if (errorCode == "DUPLICATE_LINK") SUBMITTED_MESSAGE else NETWORK_ERROR_MESSAGE
        }
        else -> NETWORK_ERROR_MESSAGE
      }.also {
        connection.disconnect()
      }
    }.getOrElse {
      NETWORK_ERROR_MESSAGE
    }
  }

  private fun readErrorCode(connection: HttpURLConnection): String? {
    return runCatching {
      val body = connection.errorStream?.bufferedReader()?.use { it.readText() } ?: return null
      JSONObject(body).optJSONObject("error")?.optString("code")
    }.getOrNull()
  }

  private fun showToastAndFinish(message: String) {
    Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    finish()
  }

  companion object {
    private const val API_BASE_URL = "https://roundtrip.duckdns.org"
    private const val API_TIMEOUT_MS = 3500
    private const val ACCESS_TOKEN_KEY = "roundtrip.accessToken"
    private const val SUBMITTED_MESSAGE = "제출했습니다"
    private const val TOKEN_EXPIRED_MESSAGE = "토큰이 만료되었습니다. 앱에 다시 로그인해주세요"
    private const val NETWORK_ERROR_MESSAGE = "네트워크 문제로 제출하지 못했어요"
    private val URL_PATTERN: Pattern = Pattern.compile("https?://\\\\S+")
  }
}
`;

const NATIVE_SECURE_STORE_READER = `package com.roundtriptime.roundtrip

import android.content.Context
import android.util.Base64
import org.json.JSONObject
import java.nio.charset.StandardCharsets
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec

class NativeSecureStoreReader(private val context: Context) {
  fun getItem(key: String): String? {
    return runCatching {
      val prefs = context.getSharedPreferences(SHARED_PREFERENCES_NAME, Context.MODE_PRIVATE)
      val currentKey = "$DEFAULT_KEYSTORE_ALIAS-$key"
      val encodedItem = prefs.getString(currentKey, null) ?: prefs.getString(key, null) ?: return null
      val encryptedItem = JSONObject(encodedItem)

      if (encryptedItem.optString(SCHEME_PROPERTY) != AES_SCHEME) {
        return null
      }

      if (encryptedItem.optBoolean(REQUIRE_AUTHENTICATION_PROPERTY, false)) {
        return null
      }

      val usesKeystoreSuffix = encryptedItem.optBoolean(USES_KEYSTORE_SUFFIX_PROPERTY, false)
      val keystoreAlias = if (usesKeystoreSuffix) {
        "$AES_CIPHER:$DEFAULT_KEYSTORE_ALIAS:$UNAUTHENTICATED_KEYSTORE_SUFFIX"
      } else {
        "$AES_CIPHER:$DEFAULT_KEYSTORE_ALIAS"
      }

      val keyStore = KeyStore.getInstance(KEYSTORE_PROVIDER).apply { load(null) }
      val entry = keyStore.getEntry(keystoreAlias, null) as? KeyStore.SecretKeyEntry ?: return null
      val ciphertext = Base64.decode(encryptedItem.getString(CIPHERTEXT_PROPERTY), Base64.DEFAULT)
      val iv = Base64.decode(encryptedItem.getString(IV_PROPERTY), Base64.DEFAULT)
      val tagLength = encryptedItem.getInt(GCM_AUTHENTICATION_TAG_LENGTH_PROPERTY)
      val cipher = Cipher.getInstance(AES_CIPHER)

      cipher.init(Cipher.DECRYPT_MODE, entry.secretKey, GCMParameterSpec(tagLength, iv))
      String(cipher.doFinal(ciphertext), StandardCharsets.UTF_8)
    }.getOrNull()
  }

  companion object {
    private const val SHARED_PREFERENCES_NAME = "SecureStore"
    private const val KEYSTORE_PROVIDER = "AndroidKeyStore"
    private const val DEFAULT_KEYSTORE_ALIAS = "key_v1"
    private const val UNAUTHENTICATED_KEYSTORE_SUFFIX = "keystoreUnauthenticated"
    private const val AES_SCHEME = "aes"
    private const val AES_CIPHER = "AES/GCM/NoPadding"
    private const val SCHEME_PROPERTY = "scheme"
    private const val USES_KEYSTORE_SUFFIX_PROPERTY = "usesKeystoreSuffix"
    private const val REQUIRE_AUTHENTICATION_PROPERTY = "requireAuthentication"
    private const val CIPHERTEXT_PROPERTY = "ct"
    private const val IV_PROPERTY = "iv"
    private const val GCM_AUTHENTICATION_TAG_LENGTH_PROPERTY = "tlen"
  }
}
`;

function addShareReceiveActivity(androidManifest) {
  const application = androidManifest.manifest.application?.[0];

  if (!application) {
    return androidManifest;
  }

  application.activity = application.activity ?? [];

  const alreadyExists = application.activity.some(
    (activity) => activity.$?.['android:name'] === '.ShareReceiveActivity',
  );

  if (!alreadyExists) {
    application.activity.push({
      $: {
        'android:name': '.ShareReceiveActivity',
        'android:exported': 'true',
        'android:theme': '@android:style/Theme.Translucent.NoTitleBar',
      },
      'intent-filter': [
        {
          action: [{ $: { 'android:name': 'android.intent.action.SEND' } }],
          category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
          data: [{ $: { 'android:mimeType': 'text/plain' } }],
        },
      ],
    });
  }

  return androidManifest;
}

function withAndroidShareReceive(config) {
  config = withAndroidManifest(config, (config) => {
    config.modResults = addShareReceiveActivity(config.modResults);
    return config;
  });

  return withDangerousMod(config, [
    'android',
    (config) => {
      const javaDir = path.join(config.modRequest.platformProjectRoot, PACKAGE_DIR);
      fs.mkdirSync(javaDir, { recursive: true });
      fs.writeFileSync(path.join(javaDir, 'ShareReceiveActivity.kt'), SHARE_RECEIVE_ACTIVITY);
      fs.writeFileSync(
        path.join(javaDir, 'NativeSecureStoreReader.kt'),
        NATIVE_SECURE_STORE_READER,
      );
      return config;
    },
  ]);
}

module.exports = withAndroidShareReceive;
